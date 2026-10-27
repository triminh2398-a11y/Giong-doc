# Kênh "Cú Con Đố Vui" — đố kiến thức cho bé 6–10 tuổi

- 3 video/tuần, khung 16:9, mỗi video 20–25 câu đố (≥ 8 phút). Mỗi câu: đọc câu hỏi → đọc 4 đáp án A/B/C/D → đếm ngược 5 giây → "Đáp án đúng là…" → giải thích 1–2 câu.
- Người dẫn: cú mèo "Cú Bon" (hàm `owl` trong kid.js). Giọng VieNeu preset "Mai Anh" (mỗi câu 2 bản, chọn theo ASR).
- KIẾN THỨC PHẢI ĐÚNG: mỗi câu đố/giải thích kiểm tra bằng nguồn uy tín (WebSearch) trước khi đọc giọng. Tránh số liệu gây tranh cãi; dùng "khoảng".
- Nội dung an toàn cho trẻ: vui tươi, không đáng sợ, không quảng cáo, không thu thập thông tin. Khi đăng chọn "Có, nội dung dành cho trẻ em".
- Mỗi chủ đề cần vẽ thêm hình minh họa mới vào `ART` trong kid.js (phong cách: viền đậm #2b2b3a, màu tươi, mắt to). Không vẽ nhân vật có bản quyền.
- Quy trình: viết `quiz.json` (theo mẫu ep01) → job giọng `jobs/NN_kidX_maianh.json` → `build_kid.py <job>` → kiểm tra ảnh tĩnh → `audio_kid.py` → render (local `render_local.js` hoặc workflow render-video) → trộn → thumbnail (`brand/thumb.html`, đổi chữ + hình) → gửi chủ kênh kèm tiêu đề/mô tả/tag.
- Các file dùng đường dẫn tuyệt đối /home/claude/kid1, /home/claude/ep1/tts_slug.py, /home/claude/pace.py: copy pipeline/lib và pipeline/kids về đúng chỗ hoặc sửa đường dẫn.

## Chủ đề
Đã làm: Động vật (ep01).
Tiếp theo: Vũ trụ và hành tinh · Cơ thể người · Khủng long · Thế giới đại dương · Côn trùng · Đất nước Việt Nam · Thời tiết và thiên nhiên · Rau củ quả · Phương tiện giao thông · Khoa học vui quanh nhà · Các nước trên thế giới · Chim chóc · Động vật Việt Nam · Nghề nghiệp · Đố vui toán học.
