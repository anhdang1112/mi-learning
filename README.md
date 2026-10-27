# Bé Vui Học

PWA học tiếng Anh và toán tư duy cho bé 4-7 tuổi. Chạy offline, lưu tiến độ ngay trên thiết bị (localStorage), không cần backend.

## Chạy

```bash
npm install
npx vite          # dev: http://localhost:5173
npm run build     # typecheck + build (dist/)
npm run preview   # thử bản build, có service worker
```

## Cấu trúc

- `src/data/vocab.ts`: chủ đề từ vựng (thêm chủ đề = thêm 1 object, hệ thống tự sinh 4 bài)
- `src/data/activities.ts`: bài tiếng Anh + bộ sinh câu hỏi toán (mỗi hàm `xxxQ()` sinh 6 câu ngẫu nhiên)
- `src/games/`: Quiz (chọn đáp án), Flashcards (học từ), MemoryMatch (lật thẻ)
- `src/lib/store.ts`: hồ sơ bé, sao, sticker, streak, nhật ký 7 ngày
- `src/lib/audio.ts`: hiệu ứng âm thanh (WebAudio) và đọc to (Web Speech API)
- `src/pages/Parent.tsx`: khu phụ huynh (PIN 4 số, báo cáo, cài đặt)

## Quy tắc thiết kế

- Bé chưa biết đọc: mọi câu hỏi đều được đọc to, đáp án chủ yếu là hình.
- Sai không bị phạt: đáp án sai mờ đi, bé chọn lại; số lần sai chỉ ảnh hưởng số sao (3/2/1).
- Câu hỏi so sánh số lượng luôn hiển thị cùng cỡ hình (tránh bé chọn theo kích thước).
- Mỗi 6 sao mở 1 sticker; chơi lại luôn có ít nhất 1 sao.

## Chưa làm

- Icon PNG (hiện dùng SVG) cho cài đặt iOS
- Giọng đọc chất lượng cao (hiện dùng giọng có sẵn của máy)
- Bài hát/truyện, bảng chữ cái, tập viết
