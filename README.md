# Bé Vui Học

PWA học tiếng Anh và toán tư duy cho bé 4-7 tuổi. Chạy offline, lưu tiến độ ngay trên thiết bị (localStorage), không cần backend.

## Chạy

```bash
npm install
npx vite            # dev: http://localhost:5173
npm run build       # typecheck + build (dist/)
npm run preview     # thử bản build, có service worker
npm run check       # kiểm tra toàn bộ bộ sinh câu hỏi (đáp án có trong lựa chọn, không trùng, không lỗi)
```

## Nội dung

- Tiếng Anh: bảng chữ cái + 21 chủ đề (chào hỏi, động vật, trái cây, đồ ăn, màu, số 1-20, gia đình, cơ thể, quần áo, đồ dùng, đồ chơi, nghề nghiệp...). Mỗi chủ đề có học từ, nghe chọn, nhìn hình chọn chữ, đúng/sai, chọn câu, ghép chữ cái, lật thẻ.
- Toán tư duy: 14 kỹ năng, hầu hết có 3 cấp độ (đếm, so sánh, cộng trừ, số còn thiếu, quy luật, tìm hình khác, trí nhớ, hình khối, kích thước...).
- Xem và hát: video YouTube nhúng (kênh chính thức Super Simple Songs), cần mạng.
- Âm thanh: nhạc nền tự sinh bằng WebAudio (không file nhạc, không bản quyền), hiệu ứng khi bấm / đúng / sai / lật thẻ / nhận sao. Nhạc tự nhỏ lại khi có giọng đọc, và tắt ở trang video.

## Cấu trúc

- `src/data/vocab.ts`: chủ đề từ vựng và bảng chữ cái (thêm chủ đề = thêm 1 object, hệ thống tự sinh bài, câu mẫu theo `tpl`)
- `src/data/activities.ts`: danh sách bài và bộ sinh câu hỏi (`xxxQ(level)`, mỗi lượt 8 câu ngẫu nhiên)
- `src/data/videos.ts`: danh sách video (chỉ dùng video đã kiểm tra bằng YouTube oEmbed)
- `src/games/`: Quiz, Flashcards, MemoryMatch, Spell (ghép chữ), Simon (trí nhớ)
- `src/lib/store.ts`: hồ sơ bé, sao, sticker, streak, nhật ký 7 ngày, cài đặt
- `src/lib/audio.ts`: nhạc nền, hiệu ứng, đọc to (Web Speech API)
- `src/pages/Parent.tsx`: khu phụ huynh (PIN 4 số, báo cáo, cài đặt)

## Quy tắc thiết kế

- Bé chưa biết đọc: câu hỏi được đọc to, đáp án chủ yếu là hình.
- Sai không bị phạt: đáp án sai mờ đi, bé chọn lại; số lần sai chỉ ảnh hưởng số sao (3/2/1).
- Câu hỏi so sánh số lượng luôn hiển thị cùng cỡ hình (tránh bé chọn theo kích thước).
- Mỗi 6 sao mở 1 sticker; chơi lại luôn có ít nhất 1 sao.
- Thêm video mới: kiểm tra `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>` có trả về JSON (có thể nhúng) rồi mới thêm vào `videos.ts`.

## Chưa làm

- Giọng đọc chất lượng cao (hiện dùng giọng có sẵn của máy)
- Truyện, tập viết, nhận diện giọng nói (chấm phát âm)
- Đồng bộ tiến độ giữa các thiết bị (cần backend)
