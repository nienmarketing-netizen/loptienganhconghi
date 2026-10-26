import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
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
  // Các trường tiếng Việt khớp 100% với Google Apps Script doPost()
  tenPhuHuynh: string;
  sdtZalo: string;
  hoTenCon: string;
  khoiLop: string;
  truongTHCS: string;
  tinhTrang: string;
  nhuCau: string;

  // Trường chuẩn hóa & tiếng Anh dự phòng
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

let cachedWebhookUrl = "";

/**
 * Get configured Google Apps Script Webhook URL synchronously (from memory, localStorage or env)
 */
export function getGoogleSheetWebhookUrl(): string {
  if (cachedWebhookUrl) return cachedWebhookUrl;

  try {
    const customUrl = localStorage.getItem(STORAGE_WEBHOOK_KEY);
    if (customUrl && customUrl.trim().length > 0) {
      cachedWebhookUrl = customUrl.trim();
      return cachedWebhookUrl;
    }
  } catch {
    // Ignore localStorage errors
  }
  return (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL as string) || "";
}

/**
 * Get configured Google Apps Script Webhook URL asynchronously (from Firestore if not found locally)
 */
export async function getGoogleSheetWebhookUrlAsync(): Promise<string> {
  const local = getGoogleSheetWebhookUrl();
  if (local) return local;

  try {
    const snap = await getDoc(doc(db, "settings", "google_sheet"));
    if (snap.exists()) {
      const data = snap.data();
      const url = (data?.webhookUrl as string)?.trim() || "";
      if (url) {
        cachedWebhookUrl = url;
        try {
          localStorage.setItem(STORAGE_WEBHOOK_KEY, url);
        } catch {
          // ignore
        }
        return url;
      }
    }
  } catch (err) {
    console.warn("Không thể tải webhook từ Firestore:", err);
  }

  return (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL as string) || "";
}

/**
 * Save Google Apps Script Webhook URL to both LocalStorage and Firestore
 */
export async function setGoogleSheetWebhookUrl(url: string): Promise<void> {
  const cleanUrl = url.trim();
  cachedWebhookUrl = cleanUrl;
  try {
    localStorage.setItem(STORAGE_WEBHOOK_KEY, cleanUrl);
  } catch {
    // Ignore localStorage errors
  }

  try {
    await setDoc(
      doc(db, "settings", "google_sheet"),
      {
        webhookUrl: cleanUrl,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Lưu webhook lên Firestore gặp lỗi:", err);
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

  const parentName = formData.parentName.trim();
  const phoneZalo = formData.phoneZalo.trim();
  const school = (formData.school || "").trim();
  const priorityChoice = (formData.priorityChoice || "").trim();

  const payload: FormattedLeadPayload = {
    // 1. Các trường tiếng Việt khớp 100% với Google Apps Script doPost() của bạn:
    tenPhuHuynh: parentName,
    sdtZalo: phoneZalo,
    hoTenCon: studentName,
    khoiLop: studentGrade,
    truongTHCS: school,
    tinhTrang: problemsString,
    nhuCau: priorityChoice,

    // 2. Các trường dự phòng & metadata:
    timestamp,
    parentName,
    phoneZalo,
    studentName,
    studentGrade,
    school,
    problems: problemsString,
    priorityChoice,
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
  let webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    webhookUrl = await getGoogleSheetWebhookUrlAsync();
  }

  if (webhookUrl) {
    try {
      // mode: "no-cors", keepalive: true và Content-Type: "text/plain;charset=utf-8"
      // đảm bảo không bị chặn bởi CORS preflight và không bị ngắt kết nối khi chuyển trang
      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        credentials: "omit",
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
  } else {
    console.warn("Chưa cấu hình Google Sheet Webhook URL. Dữ liệu đã được lưu an toàn tại Firebase Firestore.");
  }

  return { success: true };
}

/**
 * Đồng bộ toàn bộ leads từ Firestore sang Google Sheets
 */
export async function syncAllFirestoreLeadsToGoogleSheet(): Promise<{
  success: boolean;
  totalSynced: number;
  error?: string;
}> {
  let webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    webhookUrl = await getGoogleSheetWebhookUrlAsync();
  }
  if (!webhookUrl) {
    return {
      success: false,
      totalSynced: 0,
      error: "Chưa cấu hình Google Sheet Webhook URL. Vui lòng dán URL và nhấn Lưu URL trước khi đồng bộ.",
    };
  }

  try {
    const leadsSnap = await getDocs(collection(db, "leads"));
    if (leadsSnap.empty) {
      return { success: true, totalSynced: 0 };
    }

    let count = 0;
    for (const docSnap of leadsSnap.docs) {
      const data = docSnap.data();
      const payload: FormattedLeadPayload = {
        tenPhuHuynh: data.tenPhuHuynh || data.parentName || "",
        sdtZalo: data.sdtZalo || data.phoneZalo || "",
        hoTenCon: data.hoTenCon || data.studentName || "",
        khoiLop: data.khoiLop || data.studentGrade || "",
        truongTHCS: data.truongTHCS || data.school || "",
        tinhTrang: data.tinhTrang || data.problems || "",
        nhuCau: data.nhuCau || data.priorityChoice || "",
        timestamp: data.clientTimestamp || data.timestamp || "",
        parentName: data.parentName || "",
        phoneZalo: data.phoneZalo || "",
        studentName: data.studentName || "",
        studentGrade: data.studentGrade || "",
        school: data.school || "",
        problems: data.problems || "",
        priorityChoice: data.priorityChoice || "",
        source: data.source || "firestore_resync",
      };

      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        credentials: "omit",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      count++;
      // Chờ 250ms giữa các request để Google Sheets xử lý tuần tự không bị nghẽn
      await new Promise((r) => setTimeout(r, 250));
    }

    return { success: true, totalSynced: count };
  } catch (err: any) {
    console.error("Lỗi đồng bộ leads sang Google Sheet:", err);
    return { success: false, totalSynced: 0, error: err?.message || String(err) };
  }
}
