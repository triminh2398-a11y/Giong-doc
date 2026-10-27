# Quy trình làm video — Chuyện Đông Tây Kim Cổ

Ghi chú cho các phiên Claude sau (kể cả phiên chạy theo lịch). Repo: `triminh2398-a11y/Giong-doc`.

## Định hướng kênh (chủ kênh đã chốt)
- YouTube @chuyendongtaykimco: 2 tập/tuần, 20–30 phút, khung 16:9. Mỗi tập = một truyện kinh dị nhiều tình tiết, hồi hộp, KHÁC truyện TikTok, rồi phần giải thích tục lệ / khoa học (có nguồn thật, kiểm chứng bằng web).
- TikTok @chuyendongtaykimco: truyện ngắn 3–4 phút, khung dọc 9:16.
- Chủ đề xoay vòng: ma làng quê, điều cấm kỵ dân gian, bùa ngải / thư ếm.
- Giọng: dẫn truyện + thoại nam = clone MaDa mẫu 8s (`refs/mada8.wav`); thoại nữ = preset VieNeu "Mỹ Duyên". Nhịp bình thường, KHÔNG hạ giọng, KHÔNG vang/echo/làm chậm. Chỉ kéo dài khoảng lặng (`pace.stretch_pauses(factor=1.4, extra=0.06)`).
- Hình: nét vẽ 2D rùng rợn (hốc mắt thâm, xác tím tái, mèo mắt vàng...), nhưng KHÔNG rung hình, KHÔNG lớp lọc tối/ám màu. Hình đứng yên, sáng rõ.
- Phụ đề: chữ trắng viền đen; thoại nữ màu hồng đỏ, thoại nam màu vàng, trong ngoặc kép.

## Các bước một tập YouTube
1. Nghiên cứu (WebSearch/WebFetch) cho phần giải thích; chỉ đưa số liệu có nguồn.
2. Viết `script.txt`: mỗi dòng `shot|speaker|text` (N dẫn, M thoại nam, T thoại nữ). Mục tiêu ≥ 3.800 chữ (~22 phút; 0,33 giây/chữ + khoảng lặng). Câu ≤ 25 chữ.
3. Đọc giọng: tạo `jobs/NN_ten_mada.json` (`{"voices":["clone:refs/mada8.wav"],"lines":[mỗi câu x2],"asr":true}`) và `jobs/NN_ten_t.json` (`{"voices":["Mỹ Duyên"], ... x3}`), commit + push → workflow `tao-giong` chạy 4 máy song song, đẩy kết quả về `out/`. Chọn bản tốt nhất theo ASR; câu < 0.68 thì đọc lại (job mới) hoặc đổi chữ.
4. Vẽ: viết `shots169.js` (hàm `SH[shot](lt,D,T,ls)`), dùng thư viện `pipeline/lib/*` (person, woman, fhead, corpse, cat, hall, mansionExt...). Xem `ep01_quy_nhap_trang/` làm mẫu. `build_*.py` ghép timeline từ thời lượng giọng → `tl.json`, `*.html`, `voice.wav`.
5. Kiểm tra khung hình bằng `stills.sh` (Playwright có sẵn; `render_local.js` hỗ trợ VW/VH).
6. Âm thanh: `audio_*.py` (SR 24000, float32 để không tràn RAM).
7. Render: copy html vào `render/<ten>.html`, ghi `render/job.json` (`tag, html, frames=dur*30, w, h`) → workflow `render-video` chạy 16 máy, mỗi máy up 1 đoạn lên Release `tag`. Tải bằng REST: `gh api repos/.../releases/tags/<tag>` rồi `gh api -H "Accept: application/octet-stream" .../releases/assets/<id>`; ghép `ffmpeg -f concat -c copy`.
8. Trộn: voice + sfx (sidechain ducking, alimiter 0.84, loudnorm -14 LUFS), rồi nén `-crf 27 -tune animation` cho nhẹ (~60MB/19 phút).
9. Thumbnail 1280x720 (`thumb.html` mẫu), tiêu đề, mô tả có mốc thời gian, tag → ghi vào Doc "Ra mắt kênh YouTube Chuyện Đông Tây Kim Cổ" (https://claude.ai/artifact/8p4ttncVGNcddriEJhDTSH).
10. Cắt 2–3 Shorts dọc (< 60s) từ đoạn gay cấn nhất của tập, kèm khung "Xem bản đầy đủ trên kênh".

## Lưu ý kỹ thuật
- Container chỉ ra được GitHub; HF/pypi chặn. GraphQL bị chặn → dùng `gh api` REST.
- Không đọc được log Actions trực tiếp: workflow tự đẩy log vào `render/logs/` và `out/log_*.txt`.
- Commit kết thúc bằng 2 dòng Co-Authored-By / Claude-Session theo hướng dẫn hệ thống.
- YouTube không cho kiếm tiền "nội dung lặp lại/rập khuôn": mỗi tập phải có cốt truyện, bối cảnh, nhân vật và phần nghiên cứu riêng; tránh máu me câu view.
