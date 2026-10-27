export interface Word {
  en: string;
  vi: string;
  emoji: string;
  pl?: boolean; // plural noun: "They're shoes."
  say?: string; // what to read aloud if different from `en`
}

/** How to build an example sentence for a word (null = no sentence games for this topic). */
export type Tpl = 'art' | 'it' | 'mine' | 'can' | 'im' | 'like' | 'job' | 'none';

export interface Topic {
  id: string;
  title: string;
  emoji: string;
  color: string;
  tpl: Tpl;
  words: Word[];
}

const w = (en: string, vi: string, emoji: string, pl = false): Word => ({ en, vi, emoji, pl });

export const TOPICS: Topic[] = [
  {
    id: 'phrases', title: 'Chào hỏi', emoji: '👋', color: '#f97316', tpl: 'none',
    words: [
      w('hello', 'xin chào', '👋'), w('goodbye', 'tạm biệt', '🖐️'), w('thank you', 'cảm ơn', '🙏'),
      w('sorry', 'xin lỗi', '😔'), w('please', 'làm ơn', '🥺'), w('yes', 'vâng', '✅'),
      w('no', 'không', '❌'), w('good morning', 'chào buổi sáng', '🌅'), w('good night', 'chúc ngủ ngon', '🌙')
    ]
  },
  {
    id: 'farm', title: 'Thú cưng & nông trại', emoji: '🐶', color: '#ff8a3d', tpl: 'art',
    words: [
      w('dog', 'con chó', '🐶'), w('cat', 'con mèo', '🐱'), w('duck', 'con vịt', '🦆'), w('pig', 'con heo', '🐷'),
      w('cow', 'con bò', '🐮'), w('horse', 'con ngựa', '🐴'), w('sheep', 'con cừu', '🐑'), w('chicken', 'con gà', '🐔'),
      w('rabbit', 'con thỏ', '🐰'), w('bird', 'con chim', '🐦')
    ]
  },
  {
    id: 'zoo', title: 'Sở thú', emoji: '🦁', color: '#e08a00', tpl: 'art',
    words: [
      w('lion', 'sư tử', '🦁'), w('elephant', 'con voi', '🐘'), w('monkey', 'con khỉ', '🐵'), w('tiger', 'con hổ', '🐯'),
      w('bear', 'con gấu', '🐻'), w('giraffe', 'hươu cao cổ', '🦒'), w('zebra', 'ngựa vằn', '🦓'), w('panda', 'gấu trúc', '🐼'),
      w('snake', 'con rắn', '🐍'), w('frog', 'con ếch', '🐸')
    ]
  },
  {
    id: 'fruits', title: 'Trái cây', emoji: '🍎', color: '#ef476f', tpl: 'art',
    words: [
      w('apple', 'quả táo', '🍎'), w('banana', 'quả chuối', '🍌'), w('orange', 'quả cam', '🍊'), w('grapes', 'nho', '🍇', true),
      w('strawberry', 'dâu tây', '🍓'), w('watermelon', 'dưa hấu', '🍉'), w('pineapple', 'quả dứa', '🍍'), w('mango', 'quả xoài', '🥭'),
      w('pear', 'quả lê', '🍐'), w('cherry', 'quả anh đào', '🍒')
    ]
  },
  {
    id: 'food', title: 'Đồ ăn & uống', emoji: '🍕', color: '#f59e0b', tpl: 'like',
    words: [
      w('bread', 'bánh mì', '🍞'), w('egg', 'quả trứng', '🥚'), w('milk', 'sữa', '🥛'), w('rice', 'cơm', '🍚'),
      w('cake', 'bánh kem', '🍰'), w('pizza', 'bánh pizza', '🍕'), w('cheese', 'phô mai', '🧀'), w('noodles', 'mì', '🍜', true),
      w('burger', 'bánh burger', '🍔'), w('juice', 'nước ép', '🧃')
    ]
  },
  {
    id: 'colors', title: 'Màu sắc', emoji: '🌈', color: '#8d5cf6', tpl: 'it',
    words: [
      w('red', 'màu đỏ', '🔴'), w('blue', 'màu xanh dương', '🔵'), w('green', 'màu xanh lá', '🟢'), w('yellow', 'màu vàng', '🟡'),
      w('orange', 'màu cam', '🟠'), w('purple', 'màu tím', '🟣'), w('brown', 'màu nâu', '🟤'), w('black', 'màu đen', '⚫'),
      w('pink', 'màu hồng', '🩷'), w('white', 'màu trắng', '⚪')
    ]
  },
  {
    id: 'numbers', title: 'Số 1 - 10', emoji: '🔢', color: '#06b6d4', tpl: 'it',
    words: [
      w('one', 'một', '1️⃣'), w('two', 'hai', '2️⃣'), w('three', 'ba', '3️⃣'), w('four', 'bốn', '4️⃣'), w('five', 'năm', '5️⃣'),
      w('six', 'sáu', '6️⃣'), w('seven', 'bảy', '7️⃣'), w('eight', 'tám', '8️⃣'), w('nine', 'chín', '9️⃣'), w('ten', 'mười', '🔟')
    ]
  },
  {
    id: 'numbers2', title: 'Số 11 - 20', emoji: '🔟', color: '#0891b2', tpl: 'it',
    words: [
      w('eleven', 'mười một', '11'), w('twelve', 'mười hai', '12'), w('thirteen', 'mười ba', '13'), w('fourteen', 'mười bốn', '14'),
      w('fifteen', 'mười lăm', '15'), w('sixteen', 'mười sáu', '16'), w('seventeen', 'mười bảy', '17'), w('eighteen', 'mười tám', '18'),
      w('nineteen', 'mười chín', '19'), w('twenty', 'hai mươi', '20')
    ]
  },
  {
    id: 'family', title: 'Gia đình', emoji: '👨‍👩‍👧', color: '#ec4899', tpl: 'mine',
    words: [
      w('mom', 'mẹ', '👩'), w('dad', 'bố', '👨'), w('baby', 'em bé', '👶'), w('grandma', 'bà', '👵'),
      w('grandpa', 'ông', '👴'), w('brother', 'anh/em trai', '👦'), w('sister', 'chị/em gái', '👧'), w('family', 'gia đình', '👨‍👩‍👧')
    ]
  },
  {
    id: 'body', title: 'Cơ thể', emoji: '👀', color: '#10b981', tpl: 'mine',
    words: [
      w('eye', 'mắt', '👁️'), w('ear', 'tai', '👂'), w('nose', 'mũi', '👃'), w('mouth', 'miệng', '👄'), w('hand', 'bàn tay', '✋'),
      w('foot', 'bàn chân', '🦶'), w('leg', 'cái chân', '🦵'), w('arm', 'cánh tay', '💪'), w('tooth', 'cái răng', '🦷'), w('tongue', 'cái lưỡi', '👅')
    ]
  },
  {
    id: 'clothes', title: 'Quần áo', emoji: '👕', color: '#3b82f6', tpl: 'art',
    words: [
      w('shirt', 'áo sơ mi', '👕'), w('pants', 'quần dài', '👖', true), w('dress', 'váy', '👗'), w('shoes', 'giày', '👟', true),
      w('hat', 'mũ', '🧢'), w('socks', 'tất', '🧦', true), w('jacket', 'áo khoác', '🧥'), w('glasses', 'kính', '👓', true),
      w('scarf', 'khăn quàng', '🧣'), w('gloves', 'găng tay', '🧤', true)
    ]
  },
  {
    id: 'school', title: 'Đồ dùng học tập', emoji: '🎒', color: '#6366f1', tpl: 'art',
    words: [
      w('book', 'quyển sách', '📖'), w('pencil', 'bút chì', '✏️'), w('bag', 'cặp sách', '🎒'), w('ruler', 'thước kẻ', '📏'),
      w('scissors', 'cái kéo', '✂️', true), w('crayon', 'bút sáp', '🖍️'), w('computer', 'máy tính', '💻'), w('clock', 'đồng hồ', '⏰'),
      w('notebook', 'quyển vở', '📓')
    ]
  },
  {
    id: 'house', title: 'Trong nhà', emoji: '🏠', color: '#14b8a6', tpl: 'art',
    words: [
      w('house', 'ngôi nhà', '🏠'), w('door', 'cửa ra vào', '🚪'), w('window', 'cửa sổ', '🪟'), w('bed', 'cái giường', '🛏️'),
      w('chair', 'cái ghế', '🪑'), w('sofa', 'ghế sofa', '🛋️'), w('bath', 'bồn tắm', '🛁'), w('key', 'chìa khóa', '🔑'),
      w('phone', 'điện thoại', '📱'), w('light', 'bóng đèn', '💡')
    ]
  },
  {
    id: 'toys', title: 'Đồ chơi', emoji: '🧸', color: '#f43f5e', tpl: 'art',
    words: [
      w('ball', 'quả bóng', '⚽'), w('doll', 'búp bê', '🪆'), w('teddy', 'gấu bông', '🧸'), w('kite', 'con diều', '🪁'),
      w('robot', 'người máy', '🤖'), w('balloon', 'bóng bay', '🎈'), w('drum', 'cái trống', '🥁'), w('guitar', 'đàn ghi-ta', '🎸'),
      w('puzzle', 'trò ghép hình', '🧩'), w('blocks', 'khối xếp hình', '🧱', true)
    ]
  },
  {
    id: 'vehicles', title: 'Phương tiện', emoji: '🚗', color: '#0ea5e9', tpl: 'art',
    words: [
      w('car', 'ô tô', '🚗'), w('bus', 'xe buýt', '🚌'), w('train', 'tàu hỏa', '🚆'), w('plane', 'máy bay', '✈️'),
      w('boat', 'con thuyền', '⛵'), w('bike', 'xe đạp', '🚲'), w('rocket', 'tên lửa', '🚀'), w('helicopter', 'trực thăng', '🚁'),
      w('taxi', 'xe taxi', '🚕'), w('truck', 'xe tải', '🚚')
    ]
  },
  {
    id: 'nature', title: 'Thiên nhiên', emoji: '🌳', color: '#22c55e', tpl: 'art',
    words: [
      w('tree', 'cái cây', '🌳'), w('flower', 'bông hoa', '🌸'), w('sun', 'mặt trời', '☀️'), w('moon', 'mặt trăng', '🌙'),
      w('star', 'ngôi sao', '⭐'), w('cloud', 'đám mây', '☁️'), w('rainbow', 'cầu vồng', '🌈'), w('mountain', 'ngọn núi', '⛰️'),
      w('sea', 'biển', '🌊'), w('fire', 'ngọn lửa', '🔥')
    ]
  },
  {
    id: 'weather', title: 'Thời tiết', emoji: '⛅', color: '#38bdf8', tpl: 'it',
    words: [
      w('sunny', 'trời nắng', '☀️'), w('rainy', 'trời mưa', '🌧️'), w('windy', 'trời gió', '💨'), w('cloudy', 'trời nhiều mây', '☁️'),
      w('snowy', 'trời tuyết', '❄️'), w('stormy', 'có bão', '⛈️'), w('hot', 'nóng', '🥵'), w('cold', 'lạnh', '🥶')
    ]
  },
  {
    id: 'actions', title: 'Hành động', emoji: '🏃', color: '#84cc16', tpl: 'can',
    words: [
      w('run', 'chạy', '🏃'), w('jump', 'nhảy', '🤸'), w('swim', 'bơi', '🏊'), w('eat', 'ăn', '🍽️'), w('drink', 'uống', '🥤'),
      w('sleep', 'ngủ', '😴'), w('read', 'đọc', '📚'), w('write', 'viết', '✍️'), w('sing', 'hát', '🎤'), w('dance', 'nhảy múa', '💃')
    ]
  },
  {
    id: 'feelings', title: 'Cảm xúc', emoji: '😀', color: '#eab308', tpl: 'im',
    words: [
      w('happy', 'vui', '😀'), w('sad', 'buồn', '😢'), w('angry', 'tức giận', '😠'), w('tired', 'mệt', '🥱'), w('scared', 'sợ hãi', '😨'),
      w('hungry', 'đói', '😋'), w('sleepy', 'buồn ngủ', '😴'), w('surprised', 'ngạc nhiên', '😮'), w('sick', 'ốm', '🤒')
    ]
  },
  {
    id: 'jobs', title: 'Nghề nghiệp', emoji: '🧑‍⚕️', color: '#a855f7', tpl: 'job',
    words: [
      w('doctor', 'bác sĩ', '🧑‍⚕️'), w('teacher', 'giáo viên', '🧑‍🏫'), w('farmer', 'nông dân', '🧑‍🌾'), w('cook', 'đầu bếp', '🧑‍🍳'),
      w('firefighter', 'lính cứu hỏa', '🧑‍🚒'), w('pilot', 'phi công', '🧑‍✈️'), w('astronaut', 'phi hành gia', '🧑‍🚀'),
      w('artist', 'họa sĩ', '🧑‍🎨'), w('singer', 'ca sĩ', '🧑‍🎤')
    ]
  }
];

// ---------- Alphabet ----------
export interface Letter {
  up: string;
  low: string;
  word: string;
  emoji: string;
}

const L = (up: string, word: string, emoji: string): Letter => ({ up, low: up.toLowerCase(), word, emoji });

export const ALPHABET: Letter[] = [
  L('A', 'apple', '🍎'), L('B', 'ball', '⚽'), L('C', 'cat', '🐱'), L('D', 'dog', '🐶'), L('E', 'egg', '🥚'),
  L('F', 'fish', '🐟'), L('G', 'grapes', '🍇'), L('H', 'hat', '🧢'), L('I', 'ice cream', '🍦'), L('J', 'juice', '🧃'),
  L('K', 'kite', '🪁'), L('L', 'lion', '🦁'), L('M', 'moon', '🌙'), L('N', 'nose', '👃'), L('O', 'orange', '🍊'),
  L('P', 'pig', '🐷'), L('Q', 'queen', '👸'), L('R', 'rabbit', '🐰'), L('S', 'sun', '☀️'), L('T', 'tiger', '🐯'),
  L('U', 'umbrella', '☂️'), L('V', 'van', '🚐'), L('W', 'watermelon', '🍉'), L('X', 'x-ray', '🩻'),
  L('Y', 'yo-yo', '🪀'), L('Z', 'zebra', '🦓')
];
