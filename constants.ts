
import { Product } from './types.ts';

export const WHATSAPP_NUMBER = "+213555555555"; // Replace with your actual number

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "ساعة ذكية فاخرة",
    price: 12000,
    description: "ساعة ذكية متطورة تدعم مراقبة الصحة والرياضة، مقاومة للماء مع بطارية تدوم طويلاً.",
    images: [
      "https://picsum.photos/seed/watch1/800/600",
      "https://picsum.photos/seed/watch2/800/600",
      "https://picsum.photos/seed/watch3/800/600"
    ],
    category: "إلكترونيات"
  },
  {
    id: "2",
    name: "سماعات لاسلكية برو",
    price: 8500,
    description: "سماعات ذات جودة صوت عالية، عزل ضجيج فعال وتصميم مريح للأذن.",
    images: [
      "https://picsum.photos/seed/audio1/800/600",
      "https://picsum.photos/seed/audio2/800/600"
    ],
    category: "إلكترونيات"
  },
  {
    id: "3",
    name: "نظارات شمسية عصرية",
    price: 4500,
    description: "نظارات بتصميم حديث توفر حماية كاملة من الأشعة فوق البنفسجية.",
    images: [
      "https://picsum.photos/seed/glasses1/800/600",
      "https://picsum.photos/seed/glasses2/800/600"
    ],
    category: "إكسسوارات"
  },
  {
    id: "4",
    name: "حقيبة ظهر للسفر",
    price: 6000,
    description: "حقيبة واسعة ومقاومة للماء، مثالية للرحلات والعمل اليومي.",
    images: [
      "https://picsum.photos/seed/bag1/800/600"
    ],
    category: "حقائب"
  },
  {
    id: "5",
    name: "كاميرا احترافية D5",
    price: 95000,
    description: "كاميرا تصوير فوتوغرافي بدقة عالية، تتيح لك التقاط أجمل اللحظات باحترافية.",
    images: [
      "https://picsum.photos/seed/camera1/800/600",
      "https://picsum.photos/seed/camera2/800/600"
    ],
    category: "إلكترونيات"
  }
];
