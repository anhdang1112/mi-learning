export interface Word {
  en: string;
  vi: string;
  emoji: string;
}

export interface Topic {
  id: string;
  title: string;
  emoji: string;
  color: string;
  words: Word[];
}

export const TOPICS: Topic[] = [
  {
    id: 'animals',
    title: 'Động vật',
    emoji: '🐶',
    color: '#ff8a3d',
    words: [
      { en: 'dog', vi: 'con chó', emoji: '🐶' },
      { en: 'cat', vi: 'con mèo', emoji: '🐱' },
      { en: 'duck', vi: 'con vịt', emoji: '🦆' },
      { en: 'fish', vi: 'con cá', emoji: '🐟' },
      { en: 'bird', vi: 'con chim', emoji: '🐦' },
      { en: 'rabbit', vi: 'con thỏ', emoji: '🐰' },
      { en: 'elephant', vi: 'con voi', emoji: '🐘' },
      { en: 'monkey', vi: 'con khỉ', emoji: '🐵' },
      { en: 'lion', vi: 'sư tử', emoji: '🦁' },
      { en: 'pig', vi: 'con heo', emoji: '🐷' }
    ]
  },
  {
    id: 'fruits',
    title: 'Trái cây',
    emoji: '🍎',
    color: '#ef476f',
    words: [
      { en: 'apple', vi: 'quả táo', emoji: '🍎' },
      { en: 'banana', vi: 'quả chuối', emoji: '🍌' },
      { en: 'orange', vi: 'quả cam', emoji: '🍊' },
      { en: 'grapes', vi: 'nho', emoji: '🍇' },
      { en: 'strawberry', vi: 'dâu tây', emoji: '🍓' },
      { en: 'watermelon', vi: 'dưa hấu', emoji: '🍉' },
      { en: 'pineapple', vi: 'quả dứa', emoji: '🍍' },
      { en: 'mango', vi: 'quả xoài', emoji: '🥭' }
    ]
  },
  {
    id: 'colors',
    title: 'Màu sắc',
    emoji: '🌈',
    color: '#8d5cf6',
    words: [
      { en: 'red', vi: 'màu đỏ', emoji: '🔴' },
      { en: 'blue', vi: 'màu xanh dương', emoji: '🔵' },
      { en: 'green', vi: 'màu xanh lá', emoji: '🟢' },
      { en: 'yellow', vi: 'màu vàng', emoji: '🟡' },
      { en: 'orange', vi: 'màu cam', emoji: '🟠' },
      { en: 'purple', vi: 'màu tím', emoji: '🟣' },
      { en: 'brown', vi: 'màu nâu', emoji: '🟤' },
      { en: 'black', vi: 'màu đen', emoji: '⚫' }
    ]
  },
  {
    id: 'numbers',
    title: 'Số đếm',
    emoji: '🔢',
    color: '#06b6d4',
    words: [
      { en: 'one', vi: 'một', emoji: '1️⃣' },
      { en: 'two', vi: 'hai', emoji: '2️⃣' },
      { en: 'three', vi: 'ba', emoji: '3️⃣' },
      { en: 'four', vi: 'bốn', emoji: '4️⃣' },
      { en: 'five', vi: 'năm', emoji: '5️⃣' },
      { en: 'six', vi: 'sáu', emoji: '6️⃣' },
      { en: 'seven', vi: 'bảy', emoji: '7️⃣' },
      { en: 'eight', vi: 'tám', emoji: '8️⃣' },
      { en: 'nine', vi: 'chín', emoji: '9️⃣' },
      { en: 'ten', vi: 'mười', emoji: '🔟' }
    ]
  },
  {
    id: 'vehicles',
    title: 'Phương tiện',
    emoji: '🚗',
    color: '#3b82f6',
    words: [
      { en: 'car', vi: 'ô tô', emoji: '🚗' },
      { en: 'bus', vi: 'xe buýt', emoji: '🚌' },
      { en: 'train', vi: 'tàu hỏa', emoji: '🚆' },
      { en: 'plane', vi: 'máy bay', emoji: '✈️' },
      { en: 'boat', vi: 'con thuyền', emoji: '⛵' },
      { en: 'bike', vi: 'xe đạp', emoji: '🚲' },
      { en: 'rocket', vi: 'tên lửa', emoji: '🚀' },
      { en: 'helicopter', vi: 'trực thăng', emoji: '🚁' }
    ]
  },
  {
    id: 'body',
    title: 'Cơ thể',
    emoji: '👀',
    color: '#10b981',
    words: [
      { en: 'eye', vi: 'mắt', emoji: '👁️' },
      { en: 'ear', vi: 'tai', emoji: '👂' },
      { en: 'nose', vi: 'mũi', emoji: '👃' },
      { en: 'mouth', vi: 'miệng', emoji: '👄' },
      { en: 'hand', vi: 'bàn tay', emoji: '✋' },
      { en: 'foot', vi: 'bàn chân', emoji: '🦶' },
      { en: 'leg', vi: 'cái chân', emoji: '🦵' },
      { en: 'tooth', vi: 'cái răng', emoji: '🦷' }
    ]
  }
];
