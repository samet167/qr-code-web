# 🚀 QR Studio - Instant QR Code Generator

កម្មវិធីបង្កើត QR Code ដ៏ទំនើប រហ័ស និងមានមុខងារសម្បូរបែប ដំណើរការដូច Native App លើទូរស័ព្ទ និងកុំព្យូទ័រ។
បង្កើតឡើងដោយប្រើប្រាស់ Pure HTML, Modern Vanilla CSS, និង JavaScript ដោយ **មិនបាច់ត្រូវការ Server** និងអាច **Deploy លើ Cloudflare Pages ឥតគិតថ្លៃ ១០០%**។

---

## ✨ លក្ខណៈពិសេស (Features)

* 📱 **Mobile-App Responsive Design:** រចនាឡើងយ៉ាងយកចិត្តទុកដាក់ មានទម្រង់បែប Glassmorphism, Tab Bar, និង Safe-area ដូចកម្មវិធីទូរស័ព្ទ (iOS / Android)។
* ⚡ **Live Instant Generation:** គ្រាន់តែវាយ ឬ Paste Link ភ្លាម QR Code បង្ហាញចេញភ្លាមៗ (Client-side 100%)។
* 🎯 **គាំទ្រច្រើនទម្រង់:**
  * 🔗 **Link (URL):** សម្រាប់គេហទំព័រ, Facebook, Telegram, YouTube, TikTok...
  * 📝 **Text:** កំណត់ចំណាំ ឬសារ
  * 📶 **Wi-Fi:** សម្រាប់ Scan ភ្ជាប់ Wi-Fi ដោយស្វ័យប្រវត្ត (SSID + Password + Security)
  * 👤 **vCard (Contact):** សម្រាប់រក្សាទុកលេខទូរស័ព្ទ និងទំនាក់ទំនង
  * ✉️ **Email:** ផ្ញើសារអ៊ីមែល
* 🎨 **Customize បានច្រើនជម្រើស:**
  * ជ្រើសរើសពណ៍ QR Code & Background តាមចិត្ត ឬប្រើ Color Presets ពេញនិយម
  * ប្តូរម៉ូតចំនុច (Dots Style) និងម៉ូតជ្រុង (Corner Eyes)
  * អាច Upload **Logo** ផ្ទាល់ខ្លួនដាក់ចំកណ្តាល QR Code
* 📥 **Export គុណភាពខ្ពស់:**
  * Download **PNG** (កម្រិត 500px, 1000px HD, ឬ 2000px 4K)
  * Download **SVG** (Vector មិនបែក)
  * 📋 Copy រូបភាពផ្ទាល់ចូល Clipboard
  * 📤 Native Mobile Share
* 🕒 **ប្រវត្តិ (History):** រក្សាទុក QR Code ដែលបានបង្កើតថ្មីៗនៅក្នុង LocalStorage ដោយស្វ័យប្រវត្តិ។
* 🌓 **Dark / Light Mode:** ប្ដូរពន្លឺបានតាមការពេញចិត្ត។

---

## 🌐 របៀប Deploy លើ Cloudflare Pages (ឥតគិតថ្លៃ ១០០%)

អ្នកអាចជ្រើសរើសវិធីណាមួយក្នុងចំណោម ២ វិធីខាងក្រោម៖

### វិធីទី ១៖ Drag & Drop Upload (លឿនបំផុត ចំណាយពេលតែ 1 នាទី មិនបាច់ប្រើ Git)

1. ចូលទៅកាន់គេហទំព័រ [Cloudflare Dashboard](https://dash.cloudflare.com/) ហើយ Login (បើមិនទាន់មាន Account អាច Register Free បាន)។
2. នៅ Menu ខាងឆ្វេង ចុចលើ **Workers & Pages** -> ចុច **Create application** -> ជ្រើសរើសផ្ទាំង **Pages** -> ចុចលើ **Upload assets**។
3. ដាក់ឈ្មោះ Project របស់អ្នក (ឧទាហរណ៍៖ `my-qr-studio`)។
4. អូសទាញ (Drag & Drop) Folder គម្រោងនេះទាំងមូល (`/Users/dev8/Desktop/Data/qrCode`) បោះចូលក្នុងប្រអប់ Upload។
5. ចុចប៊ូតុង **Deploy site**។
6. រួចរាល់ជាស្ថាពរ! អ្នកនឹងទទួលបាន Link មួយភ្លាមៗដូចជា `https://my-qr-studio.pages.dev` សម្រាប់ផ្ញើឱ្យអ្នកដទៃប្រើប្រាស់បាន ២៤/៧។

---

### វិធីទី ២៖ ភ្ជាប់តាមរយៈ GitHub (Auto Deploy រាល់ពេល Push កូដថ្មី)

1. បង្កើត Git Repository លើ GitHub របស់អ្នក ហើយ Push កូដទាំងអស់នេះឡើងទៅ GitHub។
2. ក្នុង Cloudflare Dashboard ចូល **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**។
3. ជ្រើសរើស Repository របស់អ្នក។
4. កន្លែង **Build settings**៖
   * **Framework preset:** `None`
   * **Build command:** ទុកឱ្យនៅទទេ (Leave blank)
   * **Build output directory:** `.` (ឬទុកទទេ)
5. ចុច **Save and Deploy** ជាការស្រេច!

---

## 🛠️ រចនាសម្ព័ន្ធឯកសារ (Project Structure)

```
qrCode/
├── index.html            # ទំព័រដើម Semantic HTML + Layout
├── manifest.json         # PWA Manifest សម្រាប់ Save ទុកលើទូរស័ព្ទ
├── README.md             # ឯកសារណែនាំ
├── css/
│   └── style.css         # Glassmorphism, Responsive App Layout, Theme styles
├── js/
│   ├── qr-code-styling.js # បណ្ណាល័យបង្កើត QR Code (Local bundle)
│   └── app.js            # Logic កម្មវិធី, Real-time preview, Export, History
└── assets/
    └── icon.svg          # Logo App គុណភាពខ្ពស់
```
