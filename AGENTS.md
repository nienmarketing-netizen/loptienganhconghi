# Modern Soft-UI & Tactile Academic Dashboard - Design System Guidelines

Tài liệu này ghi nhớ toàn bộ quy chuẩn thiết kế, bố cục, kích thước chữ (typography), bảng màu và các đặc tính giao diện xúc giác (tactile neumorphism) của website và các component tiêu biểu.

---

## 1. Bản sắc thiết kế (Core Visual Identity)
- **Tên phong cách:** Modern Soft-UI & Tactile Academic Dashboard (Giao diện bảng điều khiển học vụ xúc giác & dập nổi hiện đại).
- **Mục tiêu:** Tạo cảm giác chạm vật lý chắc chắn, hiện đại, sang trọng và chuẩn mực sư phạm (academic precision).
- **Màu nền khung vỏ máy (Chassis):** `#e0e5ec`
- **Màu thanh công nghiệp (Industrial Header):** `#2d3436`
- **Màu điểm nhấn chính (Primary Accent):** `#ff4757` (Coral Red)
- **Màu văn bản chính (Text Primary):** `#1a1a1a` (không dùng đen tuyệt đối `#000000`)
- **Màu văn bản phụ (Text Secondary):** `#666666`

---

## 2. Hệ thống bóng & Chiều sâu 3D (Neumorphic Shadows)
- **Hộp nổi / Thẻ dập nổi (Embossed):**
  - Card chính: `soft-ui-embossed` (`--shadow-card`)
  - Card phụ / Card bài tập: `soft-ui-embossed-sm` (`--shadow-card-sm`)
  - Khung Modal nổi: `shadow-[var(--shadow-floating)]`
- **Hố dập chìm / Lõm kỹ thuật (Recessed / Debossed Well):**
  - Dùng cho vùng hiển thị điểm, thông tin metadata, vùng kéo thả file, thanh tab:
  - Lớp nền: `bg-[#d1d9e6]` hoặc `bg-[#dbe4ee]`
  - Viền: `border border-[#babecc]/60` hoặc `border-[#b0c0d2]/60`
  - Đổ bóng chìm: `shadow-[var(--shadow-recessed-sm)]` hoặc `soft-ui-debossed`
- **Nút bấm & Tag nổi (Convex):**
  - Class: `soft-ui-convex`
  - Trạng thái Active/Pressed: `active:shadow-[var(--shadow-pressed-sm)] active:translate-y-[1px]`
- **Nút hành động chính (Accent Action Button):**
  - Màu nền: `bg-[#ff4757] hover:bg-[#e03949] text-white`
  - Đổ bóng: `shadow-[var(--shadow-accent)]`
  - Viền: `border border-white/30`

---

## 3. Quy chuẩn Typography & Phân cấp Size chữ
- **Phông chữ thân bài & UI (Sans):** System Font Stack (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Phông chữ thông số & Kỹ thuật (Mono):** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.
- **Tiêu đề phân mục:**
  - `h3`: `text-sm sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] leading-snug`
  - Tiêu đề phụ/Mô tả: `text-xs text-[#666666] font-normal leading-relaxed`
- **Thẻ bài tập / Component nhỏ:**
  - Tiêu đề bài tập: `text-xs sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] leading-snug`
  - Tag thông tin (Unit, Grade): `text-xs font-semibold px-2.5 py-0.5 rounded-md soft-ui-convex text-[#1a1a1a]`
  - Nhãn kỹ thuật, hạn nộp, giờ: `text-xs text-[#666666] font-medium`

---

## 4. Chi tiết Component mẫu: Banner Điểm số & Nhận xét Giáo viên (Score Banner Recessed Well)
*Component được người dùng đánh dấu chọn ghi nhớ:*

```tsx
{/* Top Score Banner - Recessed Well */}
<div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[var(--shadow-recessed-sm)]">
  <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
    {/* Khối Điểm số Đỏ San Hô Nổi Khối */}
    <div className="relative shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)] border border-white/30">
      <span className="text-xl sm:text-2xl font-bold font-mono leading-none tracking-tight">
        9.5
      </span>
      <span className="text-xs font-medium uppercase tracking-wider opacity-90">
        / 10 điểm
      </span>
    </div>

    {/* Thông tin học sinh, Token & Nhận xét tổng quan */}
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
          Nguyễn Hoàng Gia Bảo
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 leading-tight">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          +10 Tokens
        </span>
      </div>
      <p className="text-xs sm:text-sm font-semibold text-[#ff4757] mt-0.5">
        Xuất sắc! Bóc tách cấu trúc câu rất chắc
      </p>
    </div>
  </div>

  {/* Cột thông tin phụ bên phải (Giáo viên, Ngày chấm) */}
  <div className="shrink-0 w-full sm:w-auto flex flex-col justify-center sm:items-end gap-1.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[#babecc]/50 sm:border-l sm:border-[#babecc]/50 sm:pl-4">
    <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
      <span className="text-[#666666] font-medium">Giáo viên:</span>
      <span className="font-semibold text-[#1a1a1a]">Cô Nghi</span>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
      <span className="text-[#666666] font-medium">Ngày chấm:</span>
      <span className="font-semibold text-[#1a1a1a]">16/09/2026</span>
    </div>
  </div>
</div>
```

---

## 5. Các chi tiết hoàn thiện bổ trợ (Micro-details)
1. **Đèn LED hiển thị trạng thái:** Dùng chấm tròn `w-2 h-2 rounded-full` với hiệu ứng phát sáng `led-indicator-orange animate-pulse` hoặc bóng sáng màu.
2. **Chi tiết vít góc (Screw Dots):** Điểm xuyết ở các góc modal hoặc bảng máy `screw-dot`.
3. **Khe tản nhiệt (Ventilation Grooves):** Dùng 3 vạch đứng `w-1 h-5 rounded-full bg-[#b8c6d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]` tạo chất liệu máy móc kỹ thuật.
