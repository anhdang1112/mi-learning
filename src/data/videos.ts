export interface Video {
  id: string; // YouTube video id
  title: string;
  vi: string;
  cat: string;
}

export const VIDEO_CATS = [
  { id: 'all', label: 'Tất cả', emoji: '🎬' },
  { id: 'hello', label: 'Chào hỏi', emoji: '👋' },
  { id: 'abc', label: 'Chữ cái', emoji: '🔤' },
  { id: 'num', label: 'Số đếm', emoji: '🔢' },
  { id: 'color', label: 'Màu sắc', emoji: '🌈' },
  { id: 'animal', label: 'Động vật', emoji: '🐶' },
  { id: 'fun', label: 'Hát và vận động', emoji: '🎵' }
];

// All videos are from the official "Super Simple Songs" / "Super Simple ABCs" channels
// (ids checked against YouTube oEmbed: they exist and allow embedding).
export const VIDEOS: Video[] = [
  { id: '32ysrBC6B6k', title: 'Hello!', vi: 'Bài hát chào hỏi', cat: 'hello' },
  { id: 'i14agob4uYU', title: "If You're Happy And You Know It", vi: 'Nếu vui thì cùng vỗ tay', cat: 'hello' },
  { id: 'vD98OvvDNEs', title: 'The Alphabet Song', vi: 'Bài hát bảng chữ cái', cat: 'abc' },
  { id: 'mYOl_L58PlE', title: 'Phonics Alphabet Song (Uppercase)', vi: 'Âm của chữ cái (chữ hoa)', cat: 'abc' },
  { id: 'EVTB8xIHWU0', title: 'ABC Phonics Songs (Lowercase)', vi: 'Âm của chữ cái (chữ thường)', cat: 'abc' },
  { id: '1pCFfkqmU2A', title: 'ABC Phonics: A to I', vi: 'Ôn chữ A đến I', cat: 'abc' },
  { id: '7D4K9oi7oBM', title: 'Top 10 Counting Songs', vi: 'Các bài hát đếm số', cat: 'num' },
  { id: 'TdDypyS_5zE', title: 'Ten In The Bed', vi: 'Đếm ngược từ 10 đến 1', cat: 'num' },
  { id: 'pTLtcno5_cY', title: 'Seven Steps', vi: 'Đếm bước chân', cat: 'num' },
  { id: 'vR4pVGNisZA', title: 'Adding Up To 10', vi: 'Cộng đến 10', cat: 'num' },
  { id: 'xNw1SSz18Gg', title: 'How Many Fingers?', vi: 'Đếm ngón tay', cat: 'num' },
  { id: 'aMTIm-D1l54', title: 'Red Yellow Green Blue', vi: 'Bài hát màu sắc', cat: 'color' },
  { id: 'wceMsYSyNUQ', title: 'The Rainbow Song', vi: 'Bài hát cầu vồng', cat: 'color' },
  { id: 'jYAWf8Y91hA', title: 'I See Something Blue', vi: 'Bé thấy màu xanh', cat: 'color' },
  { id: '5oYKonYBujg', title: 'Old MacDonald Had A Farm', vi: 'Bài hát nông trại', cat: 'animal' },
  { id: 'OwRmivbNgQk', title: "Let's Go To The Zoo", vi: 'Cùng đi sở thú', cat: 'animal' },
  { id: 'HRWduGnuH-4', title: 'Walking In The Jungle', vi: 'Đi dạo trong rừng', cat: 'animal' },
  { id: 'ZanHgPprl-0', title: 'Head Shoulders Knees & Toes', vi: 'Các bộ phận cơ thể', cat: 'fun' },
  { id: 'frN3nvhIHUk', title: 'Do You Like Broccoli Ice Cream?', vi: 'Món ăn bé thích', cat: 'fun' },
  { id: 'GzrjwOQpAl0', title: 'The Wheels On The Bus', vi: 'Bánh xe xe buýt', cat: 'fun' },
  { id: 'yCjJyiqpAuU', title: 'Twinkle Twinkle Little Star', vi: 'Ngôi sao lấp lánh', cat: 'fun' }
];
