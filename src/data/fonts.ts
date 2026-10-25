export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'minimal' | 'handwriting' | 'serif';
  description: string;
  previewSample: string;
}

export interface FontPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  bodyFont: string;
  handwritingFont: string;
  displayFont: string;
  previewHeadline: string;
  previewHandwriting: string;
}

export const FONT_OPTIONS: FontOption[] = [
  // Minimalist & Clean
  {
    id: 'Prompt',
    name: 'Prompt (พร้อมพท์)',
    family: "'Prompt', sans-serif",
    category: 'minimal',
    description: 'มินิมอลยอดนิยม เรขาคณิตทันสมัย สบายตา เรียบหรู',
    previewSample: 'รักเธอในทุก ๆ วันที่มีกันและกัน',
  },
  {
    id: 'Kanit',
    name: 'Kanit (คณิต)',
    family: "'Kanit', sans-serif",
    category: 'minimal',
    description: 'โมเดิร์น คลีน สไตล์สตูดิโอ มีมิติชัดเจน',
    previewSample: 'ท่วงทำนองที่เราฟังด้วยกันเสมอ',
  },
  {
    id: 'Sarabun',
    name: 'Sarabun (สารบัญ)',
    family: "'Sarabun', sans-serif",
    category: 'minimal',
    description: 'มินิมอล เรียบง่าย สุภาพ สะอาดตา อ่านง่ายมาก',
    previewSample: 'บันทึกความทรงจำที่ไม่เคยเลือนราง',
  },
  {
    id: 'Mitr',
    name: 'Mitr (มิตร)',
    family: "'Mitr', sans-serif",
    category: 'minimal',
    description: 'มินิมอลนุ่มนวล โค้งมน เป็นมิตรและอบอุ่น',
    previewSample: 'ขอบคุณที่อยู่เคียงข้างกันตลอดมา',
  },
  {
    id: 'Bai Jamjuree',
    name: 'Bai Jamjuree (จามจุรี)',
    family: "'Bai Jamjuree', sans-serif",
    category: 'minimal',
    description: 'มินิมอลเหลี่ยมชิค สไตล์สถาปัตยกรรม นอร์ดิก',
    previewSample: 'Side A · Acoustic & Ballads',
  },
  {
    id: 'Krub',
    name: 'Krub (ครับ)',
    family: "'Krub', sans-serif",
    category: 'minimal',
    description: 'คลีน มนกลม สไตล์มินิมอลมินิใจ',
    previewSample: 'ความสุขเล็ก ๆ ในทุกวินาที',
  },
  {
    id: 'Chakra Petch',
    name: 'Chakra Petch (จักรเพชร)',
    family: "'Chakra Petch', sans-serif",
    category: 'minimal',
    description: 'มินิมอลคมชัด ทันสมัย มีเอกลักษณ์เฉพาะตัว',
    previewSample: 'Forever & Always In My Heart',
  },

  // Handwriting & Diary
  {
    id: 'Charm',
    name: 'Charm (ชาร์ม)',
    family: "'Charm', cursive",
    category: 'handwriting',
    description: 'ลายมือชดช้อย อ่อนหวาน สไตล์จดหมายรักโบราณ',
    previewSample: 'คิดถึงและรักเธอที่สุดเสมอ',
  },
  {
    id: 'Charmonman',
    name: 'Charmonman (ชาร์มนมณฑ์)',
    family: "'Charmonman', cursive",
    category: 'handwriting',
    description: 'ลายมือประดิษฐ์ คลาสสิก หรูหรา ดุจกลอนรัก',
    previewSample: 'แด่เธอ... คนที่แสนพิเศษของฉัน',
  },
  {
    id: 'Itim',
    name: 'Itim (ไอติม)',
    family: "'Itim', cursive",
    category: 'handwriting',
    description: 'ลายมือน่ารัก มินิมอล ฟีลการ์ตูนไดอารี่ นุ่มละมุน',
    previewSample: 'ยิ้มเยอะ ๆ นะ คนเก่งของฉัน',
  },
  {
    id: 'Mali',
    name: 'Mali (มะลิ)',
    family: "'Mali', cursive",
    category: 'handwriting',
    description: 'ลายมือธรรมชาติ อบอุ่น ผ่อนคลาย น่าทะนุถนอม',
    previewSample: 'วันพิเศษกับคนพิเศษที่สุด',
  },
  {
    id: 'Sriracha',
    name: 'Sriracha (ศรีราชา)',
    family: "'Sriracha', cursive",
    category: 'handwriting',
    description: 'ลายมือพู่กันเบา ๆ มีชีวิตชีวา เป็นธรรมชาติ',
    previewSample: 'ทุกเพลงนี้เปิดเพื่อเธอคนเดียว',
  },

  // Classic Serif & Literary
  {
    id: 'Noto Serif Thai',
    name: 'Noto Serif Thai',
    family: "'Noto Serif Thai', serif",
    category: 'serif',
    description: 'วรรณกรรมคลาสสิก มีเชิงงามสง่า โรแมนติกเหนือกาลเวลา',
    previewSample: 'ความทรงจำที่อบอุ่นในวันที่เงียบเหงา',
  },
  {
    id: 'Trirong',
    name: 'Trirong (ไตรรงค์)',
    family: "'Trirong', serif",
    category: 'serif',
    description: 'ฟอนต์หนังสือวรรณกรรม คลาสสิก ละเมียดละไม',
    previewSample: 'บทเพลงที่ขับกล่อมหัวใจของเรา',
  },
  {
    id: 'Pridi',
    name: 'Pridi (ปรีดี)',
    family: "'Pridi', serif",
    category: 'serif',
    description: 'วินเทจ อบอุ่น อ่านสบาย สไตล์โปสการ์ดย้อนยุค',
    previewSample: 'กาลเวลาไม่อาจเปลี่ยนใจฉันได้เลย',
  },
  {
    id: 'Taviraj',
    name: 'Taviraj (ทวิราช)',
    family: "'Taviraj', serif",
    category: 'serif',
    description: 'โรแมนติกโบราณ สไตล์นวนิยายยุคก่อน',
    previewSample: 'ดั่งดอกไม้แห้งที่ยังคงงดงาม',
  },
];

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'minimal_chic',
    name: '✨ มินิมอล ชิค (Minimal Chic)',
    category: 'Minimalist',
    description: 'ฟอนต์ Prompt คู่กับ Mitr เรียบหรู สะอาดตา ทันสมัยแบบมินิมอลแท้ ๆ',
    bodyFont: 'Prompt',
    handwritingFont: 'Charm',
    displayFont: 'Prompt',
    previewHeadline: 'Melodies of You & Me',
    previewHandwriting: 'รักเธอในทุก ๆ วัน',
  },
  {
    id: 'clean_modern',
    name: '🌿 คลีน โมเดิร์น (Clean Modern)',
    category: 'Minimalist',
    description: 'ฟอนต์ Kanit ร่วมกับ Itim สบายตา สดใส น่ารักกำลังดี สไตล์คาเฟ่',
    bodyFont: 'Kanit',
    handwritingFont: 'Itim',
    displayFont: 'Kanit',
    previewHeadline: 'Acoustic & Ballads',
    previewHandwriting: 'เธอคือรอยยิ้มของฉัน',
  },
  {
    id: 'cozy_diary',
    name: '🧸 ไดอารี่ อบอุ่น (Cozy Diary)',
    category: 'Cozy',
    description: 'ฟอนต์ Mali ลายมือคู่กับ Krub ให้ความรู้สึกเหมือนเปิดสมุดไดอารี่ลับ',
    bodyFont: 'Krub',
    handwritingFont: 'Mali',
    displayFont: 'Mali',
    previewHeadline: 'My Secret Journal',
    previewHandwriting: 'บันทึกความรู้สึกดี ๆ ที่มีให้เธอ',
  },
  {
    id: 'editorial_nordic',
    name: '📐 มินิมอล นอร์ดิก (Nordic Minimal)',
    category: 'Minimalist',
    description: 'ฟอนต์ Bai Jamjuree ทรงเหลี่ยมชิค สไตล์สแกนดิเนเวีย ทันสมัยมาก',
    bodyFont: 'Bai Jamjuree',
    handwritingFont: 'Sriracha',
    displayFont: 'Bai Jamjuree',
    previewHeadline: 'Curated Tape No. 01',
    previewHandwriting: 'เรื่องราวของเราสองคน',
  },
  {
    id: 'pure_minimal',
    name: '⚪ เพียว มินิมอล (Pure Minimal)',
    category: 'Minimalist',
    description: 'ฟอนต์ Prompt ล้วนทั้งระบบ ไร้ส่วนเกิน เรียบเกลี้ยง มินิมอล 100%',
    bodyFont: 'Prompt',
    handwritingFont: 'Prompt',
    displayFont: 'Prompt',
    previewHeadline: 'Pure Melody & Love',
    previewHandwriting: 'เรียบง่าย แต่มีความหมายที่สุด',
  },
  {
    id: 'romantic_vintage',
    name: '🌹 วินเทจ โรแมนติก (Romantic Vintage)',
    category: 'Vintage',
    description: 'ฟอนต์ Noto Serif Thai ผสาน Charm ลายมือชดช้อย ดุจจดหมายรักยุค 80s',
    bodyFont: 'Noto Serif Thai',
    handwritingFont: 'Charm',
    displayFont: 'Noto Serif Thai',
    previewHeadline: 'Vintage Love Letter',
    previewHandwriting: 'แด่เธอ... ผู้เป็นที่รักยิ่ง',
  },
  {
    id: 'sweet_letter',
    name: '💌 จดหมายหวานละมุน (Sweet Letter)',
    category: 'Romantic',
    description: 'ฟอนต์ Sarabun คู่กับ Charmonman ประณีต อ่อนหวาน หรูหราคลาสสิก',
    bodyFont: 'Sarabun',
    handwritingFont: 'Charmonman',
    displayFont: 'Sarabun',
    previewHeadline: 'Keepsake For Someone Special',
    previewHandwriting: 'รักและคิดถึงเสมอทุกลมหายใจ',
  },
  {
    id: 'classic_novel',
    name: '📖 วรรณกรรม คลาสสิก (Classic Novel)',
    category: 'Vintage',
    description: 'ฟอนต์ Trirong ร่วมกับ Pridi ดุจหนังสือบทกวีในห้องสมุดยุคก่อน',
    bodyFont: 'Trirong',
    handwritingFont: 'Charm',
    displayFont: 'Trirong',
    previewHeadline: 'Stories Told In Melodies',
    previewHandwriting: 'ดั่งบทกวีที่ไม่เคยเลือนราง',
  },
];
