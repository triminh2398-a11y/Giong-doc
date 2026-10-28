# Quy trình làm video — Chuyện Đông Tây Kim Cổ

Ghi chú cho các phiên Claude sau (kể cả phiên chạy theo lịch). Repo: `triminh2398-a11y/Giong-doc`.

## Định hướng kênh (chủ kênh đã chốt)
- YouTube @chuyendongtaykimco: 2 tập/tuần, 20–30 phút, khung 16:9. Mỗi tập = MỘT truyện ma kể liền mạch, nhiều tình tiết, hồi hộp, KHÁC truyện TikTok. KHÔNG có phần giải mã bí ẩn / giải thích khoa học (chủ kênh không muốn). Chỉ kể chuyện.
- TikTok @chuyendongtaykimco: truyện ngắn 3–4 phút, khung dọc 9:16.
- Chủ đề xoay vòng: ma làng quê, điều cấm kỵ dân gian, bùa ngải / thư ếm.
- Giọng: dẫn truyện = clone MaDa mẫu 8s (`refs/mada8.wav`). MỖI NHÂN VẬT CÓ GIỌNG RIÊNG khi có thoại (chủ kênh yêu cầu, giống kênh Khuất Mặt Kỳ Truyện). Mã người nói trong script: N dẫn; K Khoa=Hải Đăng; TH thầy/ông già=Thiện Minh (nam trầm nhất); BT bà cụ=Ngọc Huyền (Ngọc Trân đọc không rõ, đừng dùng); ME mẹ/phụ nữ trung niên=Mai Anh; G/T cô gái/ma nữ=Mỹ Duyên. Truyện mới: gán nhân vật mới vào các giọng còn lại (Minh Đức, Adam bựa, Thùy Dung, Đoan Trang, Trúc Ly...) sao cho mỗi nhân vật một giọng. Nhịp bình thường, KHÔNG hạ giọng/vang/làm chậm. Chỉ kéo dài khoảng lặng.
- Hình (CHỐT CUỐI 28/10/2026 08:51 — chủ kênh gửi lại video Ma Lai và bảo "làm theo kiểu nguyên mẫu lúc đầu này"): dùng ĐÚNG nét gốc Ma Lai: `pipeline/lib/helpers.js` (person, có sửa râu: ria mép rủ hai bên + chòm râu dưới cằm, KHÔNG để tam giác trắng dưới miệng vì người xem bảo giống cái miệng) + thư viện cảnh trong `pipeline/tiktok_malai/shots.js` (woman, fhead, room, bed, house, village, lamp…). Truyện mẫu mới nhất: `pipeline/tiktok_go_cua_malai/shots_tt3.js` (ghép helpers.js + tiktok_malai/shots.js + shots mới; override subs/draw). KHÔNG dùng char2/4/5/6/7. Tư thế hợp lý (nằm thì đầu và thân cùng hướng), không hình lạ khó hiểu. Kiểm tra ảnh tĩnh MỌI cảnh trước khi render.
- RÀ SOÁT LOGIC HÌNH (bắt buộc, chủ kênh 28/10: "tìm những điểm vô lý mà tự sửa, đừng để mình nhắc"): chụp ảnh tĩnh tại đầu MỖI câu phụ đề, ghép tờ liên hoàn, đối chiếu từng câu lời kể với hình:
  * Lời kể nói gì thì hình phải làm đúng việc đó (ngủ → nằm trên giường có đầu trên gối; ngồi bật dậy → ngồi trên giường, chăn phủ chân; ngồi co ro → ngồi bệt ôm gối; nắm tay → hai tay chạm nhau; nghe điện thoại → bàn tay cầm máy áp tai, dùng person({phone:1})).
  * Tỉ lệ đúng người lớn: cửa ~1.15 lần chiều cao người, tay nắm/then cửa ngang ngực-bụng, không với lên như trẻ con.
  * Vật không chồng lên vật khác vô lý (đồng hồ đè cửa sổ, điện thoại dính vào mặt, chân xuyên qua giường).
  * Không đồ vật lơ lửng không ai cầm; không cảnh trống khi lời kể nói có người.
  Hàm sẵn trong shots_tt3.js: hungSleep (nằm ngủ), sitUp (ngồi dậy trên giường), huddle (ngồi co ro ôm điện thoại), feetSide (chân nhìn ngang), person armA/phone.
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


## Watermark & phụ đề (chủ kênh 28/10/2026)
- MỌI video (TikTok, YouTube, Shorts) phải có watermark mờ `@chuyendongtaykimco` (độ mờ ~16%, chữ trắng viền đen nhẹ, nghiêng nhẹ), ĐỔI VỊ TRÍ mỗi 6 giây (4 vị trí luân phiên giữa màn hình) để khó cắt bỏ. Mẫu ffmpeg drawtext trong pipeline/tiktok_ma_tranh/watermark.sh; với video vẽ bằng canvas thì vẽ trực tiếp (hàm watermark trong pipeline/mau_25d/index.html).
- Phụ đề: GIỮ kiểu video Ma Lai (cả câu/cụm chữ, chữ đậm trắng viền đen dày, ở phần dưới màn hình; màu theo người nói: dẫn truyện trắng, ma đỏ #ff5050, nữ hồng, nam vàng). KHÔNG dùng kiểu hiện từng chữ to.
- Hướng 2.5D (nhân vật nét Ma Lai đặt trong bối cảnh 3D có đánh đèn) đang chờ chủ kênh duyệt — mẫu ở pipeline/mau_25d/.

## Âm thanh hiệu ứng THẬT (chủ kênh 28/10: "hiệu ứng nghe tít tít như game", "lấy âm thanh hiệu ứng thật")
- KHÔNG tự tổng hợp tiếng (sin/noise) nữa. Dùng kho `sfxlib/` (≈500 file Mixkit, Mixkit Free License: dùng được trong video kiếm tiền, không cần ghi nguồn). Tên từng file trong `sfxlib/titles.json` (id → nhóm, tên). Muốn thêm: sửa `sfxlib/job.json` (danh mục mixkit) và push → workflow `tai-am-thanh`.
- Mẫu ghép: `pipeline/tiktok_ma_tranh_25d/audio_real.py` (bed() phủ nền theo cảnh, place() đặt hiệu ứng). Jumpscare = 565 (trống) + 307/1965 (sinh vật rít). Cọp = 59/13/1957. Đêm = 2483/1227/2481/2475. Trong nhà = 1172 + 1330. Ngày làng = 1235 + 2462 (gà gáy).
- Giọng ma (mã G*): kéo chậm ~0.78x và hạ trầm (asetrate 0.92 + atempo 0.82) TRƯỚC khi áp ghostfx — xem hàm slow() trong build_tr.py.
- Bối cảnh 2.5D phải đầy đủ đồ vật (hàng rào, chum, rơm, gà, bụi chuối, cỏ; trong nhà: chum nước, bao gạo, rổ, dây phơi, mùng, nhang).
- Jumpscare phải GIẬT MÌNH: 0,7s trước đó hạ nền gần im lặng, rồi track jumpscare riêng (788 impact + 1963 monster scream + 677 glass hit + 565 drum) cộng SAU loudnorm, +5dB, alimiter 0.98 (xem audio_real.py: JT, jump_real.wav). Tiêu đề lớn phải tự co cỡ chữ cho vừa khung (đo measureText, rộng tối đa ~85% khung).

## Giọng thoại MIỀN NAM + biểu cảm (chủ kênh 28/10, thay bảng giọng cũ cho THOẠI; dẫn truyện vẫn MaDa)
- Nam trẻ (Tâm…): **Adam** (Nam·Nam·tự nhiên). Nam già/thầy/ông (ông Sáu…): **Thái Sơn** (Nam·Nam·kể chuyện). Ma nam / nam trầm: **Đức Trí** (Nam·Nam·đọc truyện). Nam trung niên khác: **Minh Triết**.
- Nữ: **Mỹ Duyên** (chủ kênh chọn) cho nhân vật nữ chính, mẹ, ma nữ. Nữ khác: **Kim Thanh**, **Thục Đoan**, **Thùy Dung** (đều miền Nam).
- Lời thoại viết theo khẩu ngữ miền Nam (tui, má, hổng, kêu, đâu có…, nè, đó). Dùng dấu "..." để ngắt nhấn, "!" khi hốt hoảng/quả quyết; có thể chèn [thở dài] / [cười] (VieNeu hiểu các thẻ này).
- Mỗi câu thoại 5 bản, kw temperature 1.1; chọn bản có ASR gần cao nhất (trong 0.06) VÀ biến thiên năng lượng lớn nhất (biểu cảm) — xem build_tr.py.
