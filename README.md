
# متجر إلكتروني (نسخة GitHub Pages)

الموقع مهيأ ليعمل مباشرة كـ Static Site.

## طريقة الرفع الصحيحة:
1. أنشئ مستودع (Repository) جديد.
2. ارفع الملفات: `index.html`, `index.tsx`, `App.tsx`, `constants.ts`, `types.ts`, `metadata.json`.
3. اذهب إلى **Settings > Pages**.
4. في خانة **Build and deployment**، تأكد أن المصدر هو **Deploy from a branch**.
5. اختر فرع **main** والمجلد **/ (root)** واضغط **Save**.

## حل مشكلة الصفحة البيضاء:
- تم إضافة `Babel Standalone` في ملف الـ `index.html`.
- يقوم هذا المحول بقراءة ملفات الـ `.tsx` وتحويلها داخل المتصفح فوراً.
- هذا الحل مثالي للمشاريع التي لا تحتوي على نظام Build (مثل Vite أو Webpack) وتريد العمل مباشرة على GitHub.

## بيانات الدخول:
- **اسم المستخدم:** `admin`
- **كلمة المرور:** `rami`
