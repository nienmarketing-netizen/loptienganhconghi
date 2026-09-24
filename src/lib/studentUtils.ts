/**
 * Cấu trúc mã học sinh:
 * [Khối]-[Ngày][Ca]-[Số thứ tự]
 * Ví dụ: G8-T35C1-05: Học sinh khối 8, học ca 1 ngày Thứ 3-5, số thứ tự 05.
 * 
 * [Ngày]: T24 (Thứ 2-4), T35 (Thứ 3-5), T7C (Thứ 7-Chủ Nhật).
 * [Ca]: C1 (17h30), C2 (19h30), C3...
 */

export interface ParsedStudentCode {
  grade: string; // e.g. "G7", "G8"
  gradeNumber: number; // e.g. 7, 8
  days: "T24" | "T35" | "T7C" | string;
  daysLabel: string; // e.g. "Thứ 2-4", "Thứ 3-5", "Thứ 7-Chủ Nhật"
  shift: string; // e.g. "C1", "C2"
  shiftLabel: string; // e.g. "Ca 1 (17h30)", "Ca 2 (19h30)"
  sequence: string; // e.g. "01", "05"
  raw: string;
}

export const DAYS_MAPPING: Record<string, string> = {
  T24: "Thứ 2-4",
  T35: "Thứ 3-5",
  T7C: "Thứ 7-Chủ Nhật",
};

export const SHIFT_MAPPING: Record<string, string> = {
  C1: "Ca 1 (17h30 - 19h00)",
  C2: "Ca 2 (19h30 - 21h00)",
  C3: "Ca 3 (14h00 - 15h30)",
};

export function parseStudentCode(code: string): ParsedStudentCode | null {
  if (!code) return null;
  const match = code.trim().match(/^G(\d+)-(T24|T35|T7C)(C\d+)-(\d+)$/i);
  if (!match) return null;

  const [, gradeNum, daysCode, shiftCode, seq] = match;
  const upperDays = daysCode.toUpperCase();
  const upperShift = shiftCode.toUpperCase();

  return {
    grade: `G${gradeNum}`,
    gradeNumber: parseInt(gradeNum, 10),
    days: upperDays,
    daysLabel: DAYS_MAPPING[upperDays] || upperDays,
    shift: upperShift,
    shiftLabel: SHIFT_MAPPING[upperShift] || upperShift,
    sequence: seq,
    raw: code.trim(),
  };
}
