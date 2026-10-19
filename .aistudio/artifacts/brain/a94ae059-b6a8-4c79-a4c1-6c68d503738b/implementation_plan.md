# Kế Hoạch Xây Dựng Landing Page (Sale Page) Lớp Tiếng Anh Cô Nghi (/ldp)

Trang đích chuyển đổi cao (Direct-Response Landing Page) dành cho phụ huynh học sinh cấp 2 tại Sơn Trà, Đà Nẵng, áp dụng nhất quán ngôn ngữ thiết kế Modern Soft-UI & Tactile Academic Dashboard của hệ thống LMS Cô Nghi, được xây dựng theo lộ trình 3 giai đoạn tinh gọn.

## Quyết Định Đã Thống Nhất Cùng Phụ Huynh & Người Dùng

> [!IMPORTANT]
> - **Lộ trình chia nhỏ 3 giai đoạn**:
>   - **Giai đoạn 1 (Đợt này)**: Cấu hình Route `/ldp` + Khối 1 (Hero & VSL), Khối 2 (Nỗi đau & Thấu cảm gia đình Sơn Trà), Khối 3 (Giải pháp đột phá & Hệ thống 5 vũ khí sư phạm).
>   - **Giai đoạn 2**: Khối 4 (Chân dung Cô Nghi & Bảo chứng chuyên môn), Khối 5 (Bản đồ chuyển đổi 90 ngày & Bảng học phí/Gói lộ trình), Khối 6 (Bằng chứng xã hội & Case Studies học sinh Sơn Trà), Khối 7 (Bảo hiểm học tập 2 lớp - Rủi ro bằng 0).
>   - **Giai đoạn 3**: Khối 8 (Lead Magnet Stack 4 quà tặng), Khối 9 (FAQ xử lý từ chối), Khối 10 (Form đăng ký giữ chỗ 1-1 & Chân trang bảo mật).
> - **Đường dẫn truy cập**: Kích hoạt chuyên biệt tại URL `/ldp` (giữ nguyên không làm xáo trộn giao diện điều hướng LMS hiện tại).

---

## 1. Tổng Quan & Mục Tiêu Cốt Lõi

- **Mục tiêu**: Xây dựng trang giới thiệu & bán khóa học (Sale Page) chuyên sâu, giải tỏa nỗi lo học sinh cấp 2 mất gốc môn Tiếng Anh và bệnh "khoanh lụi" trước kỳ thi tuyển sinh vào lớp 10 công lập tại Đà Nẵng.
- **Đối tượng mục tiêu**: Phụ huynh có con học lớp 6 – 9 tại các trường THCS thuộc Quận Sơn Trà (THCS Lê Độ, Nguyễn Chí Thanh, Ngô Quyền, Phạm Ngọc Thạch, Phan Bội Châu, Lý Tự Trọng...).
- **Giá trị khác biệt**: Mô hình Giám sát Vi mô tối đa 12 học sinh/lớp, phương pháp "Bóc tách 4 bước" & "Dịch bắt buộc", game hóa 100 Tokens, bảo hiểm học tập 2 lớp và hệ thống LMS tự động gửi báo cáo Zalo lúc 20h00.

---

## 2. Trải Nghiệm Người Dùng & Ngôn Ngữ Thiết Kế (Soft-UI & Tactile)

Tuân thủ nghiêm ngặt bảng chuẩn thiết kế tại `AGENTS.md`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THIẾT KẾ & BẢNG MÀU TACTILE                     │
├────────────────────────────────┬───────────────────────────────────────┤
│ Khung vỏ máy (Chassis)         │ #e0e5ec                               │
│ Thanh công nghiệp Header       │ #2d3436                               │
│ Điểm nhấn chính (Primary)      │ #ff4757 (Coral Red)                   │
│ Chữ chính / Chữ phụ            │ #1a1a1a / #666666                     │
│ Khối lõm kỹ thuật (Recessed)   │ bg-[#d1d9e6], border-[#babecc]/60      │
│ Đổ bóng dập nổi (Embossed)     │ soft-ui-embossed, soft-ui-convex      │
└────────────────────────────────┴───────────────────────────────────────┘
```

- **Sticky Top Bar**: Thanh thông báo công nghiệp dập nổi cố định đầu trang, định vị địa bàn Sơn Trà và sĩ số giới hạn 12 học sinh.
- **Hero & VSL Player**: Khung phát VSL 3.5 phút với thiết kế gờ máy tactile, hiển thị các mốc phân đoạn thời gian (0:00 - 3:30) kèm kịch bản thuyết phục.
- **Bảng đối chiếu & Bóc tách**: Hộp lõm kỹ thuật `recessed well` hiển thị các triệu chứng học tập, so sánh trực quan giữa Lớp đại trà vs Trung tâm lớn vs Lớp Cô Nghi.
- **Nút hành động chính (Accent CTA)**: Thiết kế dạng phím cơ công nghiệp nổi khối màu đỏ san hô `#ff4757` với viền `border-white/30`, đổ bóng rực sáng và hiệu ứng phản hồi nhấn nhả chân thực.

---

## 3. Kiến Trúc Kỹ Thuật & Cấu Trúc Thành Phần

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           Router: /ldp                                    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Sticky Top Notification Bar (Sơn Trà, Đà Nẵng | Tối đa 12 em)       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Khối 1: Hero Section (Headline, Trust Badges, Interactive VSL, CTA) │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Khối 2: Problem & Agitation (4 Triệu chứng & Điểm chuẩn Sơn Trà)    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Khối 3: The Unique Mechanism (Bảng đối chiếu & 5 Vũ khí sư phạm)    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  [Tiếp nối ở Giai đoạn 2 & 3: Khối 4 -> 10]                               │
└───────────────────────────────────────────────────────────────────────────┘
```

### Chi Tiết Triển Khai Giai Đoạn 1:
1. **Tạo trang `src/pages/LandingPage.tsx`**:
   - Thiết kế mô đun hoá, hỗ trợ chia theo từng cụm khối nội dung độc lập.
   - Tích hợp khung xem video VSL tương tác với phụ đề/kịch bản bám sát copy deck.
   - Thẻ dập nổi Soft-UI, huy hiệu bảo chứng học thuật, bảng so sánh 3 cột (Đại trà vs Trung tâm vs Cô Nghi) và 5 vũ khí sư phạm độc quyền.
2. **Cập nhật routing tại `src/App.tsx`**:
   - Nhận diện đường dẫn `/ldp` để hiển thị trang Landing Page với đầy đủ phong cách thiết kế tactile.
3. **Kiểm tra giao diện & Xác minh build**:
   - Chạy kiểm tra biên dịch applet đảm bảo hoạt động trơn tru, không lỗi TypeScript hoặc xung đột CSS.
