import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface LeadFormData {
  parentName: string;
  phoneZalo: string;
  studentName: string;
  studentGrade: string;
  studentNameAndGrade?: string;
  school: string;
  problems: string[];
  priorityChoice: string;
}

export interface FormattedLeadPayload {
  timestamp: string;
  parentName: string;
  phoneZalo: string;
  studentName: string;
  studentGrade: string;
  school: string;
  problems: string;
  priorityChoice: string;
  source?: string;
}

const STORAGE_WEBHOOK_KEY = "co_nghi_google_sheet_webhook";
const STORAGE_LEADS_BACKUP_KEY = "co_nghi_leads_backup";

/**
 * Get configured Google Apps Script Webhook URL
 */
export function getGoogleSheetWebhookUrl(): string {
  try {
    const customUrl = localStorage.getItem(STORAGE_WEBHOOK_KEY);
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim();
    }
  } catch {
    // Ignore localStorage errors
  }
  return (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL as string) || "";
}

/**
 * Save Google Apps Script Webhook URL
 */
export function setGoogleSheetWebhookUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_WEBHOOK_KEY, url.trim());
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Format timestamp in Vietnam timezone (GMT+7)
 */
export function getVietnamTimestamp(): string {
  const now = new Date();
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
  } catch {
    return now.toLocaleString("vi-VN");
  }
}

/**
 * Submit lead to Google Sheets & Firebase Firestore
 */
export async function submitLead(
  formData: LeadFormData,
  source: "on_page_form" | "cta_popup_modal" = "on_page_form"
): Promise<{ success: boolean; error?: string }> {
  const timestamp = getVietnamTimestamp();
  
  // Clean student name and grade
  const studentName = (
    formData.studentName ||
    (formData.studentNameAndGrade ? formData.studentNameAndGrade.split("-")[0] : "") ||
    ""
  ).trim();

  const studentGrade = (
    formData.studentGrade ||
    (formData.studentNameAndGrade && formData.studentNameAndGrade.includes("-")
      ? formData.studentNameAndGrade.split("-")[1]
      : "") ||
    ""
  ).trim();

  const problemsString = Array.isArray(formData.problems)
    ? formData.problems.filter(Boolean).join("; ")
    : String(formData.problems || "");

  const payload: FormattedLeadPayload = {
    timestamp,
    parentName: formData.parentName.trim(),
    phoneZalo: formData.phoneZalo.trim(),
    studentName,
    studentGrade,
    school: (formData.school || "").trim(),
    problems: problemsString,
    priorityChoice: (formData.priorityChoice || "").trim(),
    source,
  };

  // 1. Lưu backup vào localStorage ngay lập tức
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_LEADS_BACKUP_KEY) || "[]");
    existing.unshift({ ...payload, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_LEADS_BACKUP_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch {
    // Ignore storage quota
  }

  // 2. Lưu vào Firebase Firestore (an toàn tuyệt đối, không lo mất lead)
  try {
    const leadsCol = collection(db, "leads");
    await addDoc(leadsCol, {
      ...payload,
      createdAt: serverTimestamp(),
      clientTimestamp: timestamp,
    });
  } catch (err) {
    console.warn("Lưu Firestore dự phòng gặp lỗi (vẫn tiếp tục gửi Google Sheet):", err);
  }

  // 3. Gửi đến Google Sheets qua Webhook (Google Apps Script)
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (webhookUrl) {
    try {
      // mode: "no-cors" và Content-Type: "text/plain;charset=utf-8"
      // đảm bảo không bị chặn bởi CORS preflight trong trình duyệt
      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      return { success: true };
    } catch (sheetError) {
      console.error("Lỗi gửi dữ liệu sang Google Sheet:", sheetError);
      return { success: true, error: "Đã lưu thông tin, đang kết nối lại Google Sheet." };
    }
  }

  return { success: true };
}
