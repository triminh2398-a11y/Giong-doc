# Quy trình làm video — Chuyện Đông Tây Kim Cổ

Ghi chú cho các phiên Claude sau (kể cả phiên chạy theo lịch). Repo: `triminh2398-a11y/Giong-doc`.

## Định hướng kênh (chủ kênh đã chốt)
- YouTube @chuyendongtaykimco: 2 tập/tuần, 20–30 phút, khung 16:9. Mỗi tập = MỘT truyện ma kể liền mạch, nhiều tình tiết, hồi hộp, KHÁC truyện TikTok. KHÔNG có phần giải mã bí ẩn / giải thích khoa học (chủ kênh không muốn). Chỉ kể chuyện.
- TikTok @chuyendongtaykimco: truyện ngắn 3–4 phút, khung dọc 9:16.
- Chủ đề xoay vòng: ma làng quê, điều cấm kỵ dân gian, bùa ngải / thư ếm.
- Giọng: dẫn truyện = clone MaDa mẫu 8s (`refs/mada8.wav`). MỖI NHÂN VẬT CÓ GIỌNG RIÊNG khi có thoại (chủ kênh yêu cầu, giống kênh Khuất Mặt Kỳ Truyện). Mã người nói trong script: N dẫn; K Khoa=Hải Đăng; TH thầy/ông già=Thiện Minh (nam trầm nhất); BT bà cụ=Ngọc Huyền (Ngọc Trân đọc không rõ, đừng dùng); ME mẹ/phụ nữ trung niên=Mai Anh; G/T cô gái/ma nữ=Mỹ Duyên. Truyện mới: gán nhân vật mới vào các giọng còn lại (Minh Đức, Adam bựa, Thùy Dung, Đoan Trang, Trúc Ly...) sao cho mỗi nhân vật một giọng. Nhịp bình thường, KHÔNG hạ giọng/vang/làm chậm. Chỉ kéo dài khoảng lặng.
- Hình (CHỐT 28/10/2026, chủ kênh duyệt mẫu 15s rồi bảo làm TikTok luôn): nét hoạt hình kinh dị kiểu Mỹ (tham khảo kênh Horror Shorts Party) — `pipeline/lib/char7.js` = face5/fig5 với `bug:true` (mắt to lồi, con ngươi nhỏ) và `cel:true` (đổ bóng mảng), tỉ lệ người thật, cận nửa người hai nhân vật nói chuyện, nền có chiều sâu + ánh đèn. Ma: face5 em:'grin' + ghostShade (mặt trắng, mắt đỏ quầng thâm, cười toác lộ răng, nước mắt đen). Mẫu: `pipeline/lib/char7_mau15s.html`, truyện mẫu TikTok: `pipeline/tiktok_go_cua/`. Ảnh đêm không được quá tối: ambient light() khoảng '#3a3a50'–'#4a4862'. Tư thế hợp lý (nằm thì đầu và thân cùng hướng); hình nào vẽ không rõ (vd. bàn tay) thì bỏ. Kiểm tra ảnh tĩnh MỌI cảnh trước khi render.
- Âm thanh tiếng ma / tiếng bí ẩn (chủ kênh yêu cầu): dùng `pipeline/lib/ghostfx.py` — ghost(clip,'ghost') cho ma nói gần (vang + giọng trầm chồng + thì thào), ghost(clip,'far') cho tiếng gọi vọng từ xa/ngoài cửa (vọng + dội). Mã người nói bắt đầu bằng G (vd GNA, GBC) = ma giả giọng nhân vật đó: cùng giọng VieNeu + hiệu ứng. Giọng người kể và người sống: KHÔNG vang.
- Đối thủ tham khảo: kênh Khuất Mặt Kỳ Truyện (@khuatmatkytruyen) — truyện dân gian kể dài 30–40 phút, ~3 tập/tuần. Làm cùng thể loại nhưng KHÔNG chép linh vật, chữ "kỳ truyện" hay nội dung của họ.
- Phụ đề: chữ trắng viền đen; thoại nữ màu hồng đỏ, thoại nam màu vàng, trong ngoặc kép.

## Các bước một tập YouTube
1. (Không cần phần giải thích.) Có thể tra cứu tục lệ/bối cảnh để truyện chân thực.
2. Viết `script.txt`: mỗi dòng `shot|speaker|text` (N dẫn, M thoại nam, T thoại nữ). Mục tiêu ≥ 4.000 chữ truyện (~22–25 phút; 0,33 giây/chữ + khoảng lặng), chia 3–5 chương, mỗi chương kết bằng một điểm treo. Câu ≤ 25 chữ.
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

## Các bước một truyện TikTok (mỗi ngày 1 truyện)
- Khung dọc 1080x1920, dài 3–4 phút (~600–650 chữ, 40–50 câu). Mẫu: `pipeline/tiktok_malai/` (shots.js = thư viện + SH theo số câu, build.py, audio_ml.py). Các file mẫu dùng đường dẫn `/home/claude/ml/...`: copy sang thư mục mới và sửa đường dẫn.
- 2 giây đầu phải có câu móc + hình gây tò mò; có thẻ tiêu đề; cuối có khung Follow @chuyendongtaykimco và câu hỏi gợi bình luận.
- Truyện TikTok KHÁC truyện YouTube (xem BACKLOG). Tự nghĩ truyện mới, ghi vào BACKLOG.
- Render: có thể render ngay trong container (`render_local.js` với VW=1080 VH=1920, ~20 phút) để tiết kiệm phút GitHub, hoặc workflow render-video (job.json w=1080 h=1920, tag riêng).
- Giao: video MP4 + chú thích đăng TikTok (1–2 câu móc + 5–6 hashtag). Không gửi file nặng quá ~60MB.
