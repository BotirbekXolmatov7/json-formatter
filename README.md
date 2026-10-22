# 🚀 JSON Formatter & Object Viewer

JSON ma'lumotlarni chiroyli formatlash, sintaksisini tekshirish va **oddiy, tushunarli interaktiv obyekt (daraxt)** ko'rinishida ko'rsatadigan zamonaviy, yengil va modulli dastur.

Dastur ham **Veb-interfeys (Brauzer)**, ham **Terminal (CLI)** orqali to'liq ishlaydi. Zero-dependency (tashqi npm kutubxonalarisiz) arxitekturada qurilgan.

---

## 📁 Senior Darajadagi Loyiha Strukturasi

Loyiha **Clean Architecture** va **Separation of Concerns (SoC)** tamoyillari asosida modullarga ajratilgan:

```
json-formatter/
├── bin/                        # CLI kirish nuqtasi (executable)
│   └── cli.js                  # CLI buyruqlari boshqaruvchisi
├── config/                     # Konfiguratsiya fayllari
│   └── index.js                # Port, host, statik papkalar sozlamalari
├── public/                     # Frontend statik veb-aktivlari
│   ├── index.html              # Asosiy HTML interfeys
│   ├── css/                    # Modulli CSS uslublari
│   │   ├── variables.css       # Ranglar va mavzular (Dark / Light)
│   │   ├── base.css            # Tipografika, reset, scrollbar, animatsiyalar
│   │   ├── layout.css          # Karkas, panellar, header va footer
│   │   ├── components.css      # Tugmalar, selectlar, toast, xatolik qutisi
│   │   ├── tree-view.css       # Interaktiv JSON daraxt stillari
│   │   ├── table-view.css      # Jadval va kod ko'rinishi stillari
│   │   └── style.css           # Barcha stillarni birlashtiruvchi bosh fayl
│   └── js/                     # Modulli JavaScript arxitekturasi
│       ├── core/               # Yadro mantiq va utilitlar
│       │   ├── samples.js      # Namuna JSON ma'lumotlari
│       │   ├── utils.js        # Saralash, formatlash, clipboard va hisob-kitoblar
│       │   └── error-parser.js # JSON sintaksis xatolarini qator/ustunga ajratish
│       ├── views/              # UI ko'rinishlarini render qiluvchi modullar
│       │   ├── tree-view.js    # Interaktiv daraxt (Tree) renderlash va qidiruv
│       │   ├── table-view.js   # Massivlar uchun jadval renderlash
│       │   └── code-view.js    # Sintaksis bo'yalgan kod ko'rinishi
│       └── app.js              # State boshqaruvi, hodisalar va UI kontroller
├── src/                        # Backend va Server manba kodlari (Node.js)
│   ├── core/                   # Umumiy mantiq (CLI va Server uchun)
│   │   ├── colors.js           # Terminal ranglari (ANSI escape codes)
│   │   └── formatter.js        # Daraxt tuzish, saralash, syntax highlight yadrosi
│   ├── server/                 # Veb-server moduli
│   │   ├── mime-types.js       # MIME turlari xaritasi
│   │   ├── static-handler.js   # Xavfsiz statik fayl xizmati (Path Traversal himoyasi)
│   │   └── index.js            # HTTP server va avtomatik brauzer ochish
│   └── index.js                # Asosiy kutubxona eksporti
├── samples/                    # Namuna JSON fayllari
│   └── namuna.json             # Test uchun misol ma'lumot
├── scripts/                    # Skriptlar
│   └── run.sh                  # Ishga tushirish uchun bash skript
├── .editorconfig               # Kod formati qoidalari
├── .gitignore                  # Git e'tibordan chetda qoldiradigan fayllar
├── package.json                # Loyiha konfiguratsiyasi va skriptlari
├── server.js                   # Server proksi kirish nuqtasi (Backwards-compatible)
├── cli.js                      # CLI proksi kirish nuqtasi (Backwards-compatible)
└── run.sh                      # Ildizdagi qulay ishga tushiruvchi skript
```

---

## 🌟 Asosiy Imkoniyatlar

1. **🌳 Oddiy & Interaktiv Obyekt (Tree) Ko'rinishi**:
   - Har bir ichki obyekt `{}` va ro'yxat `[]` ochilishi va yopilishi (collapse/expand) mumkin.
   - Elementlar soni (`3 ta kalit`, `5 ta element`) ko'rinadi.
   - Har bir tugun ustiga borganda **Yo'lni nusxalash** (masalan, `user.aloqa.manzil.shahar`) va **Qiymatni nusxalash** tugmalari chiqadi.
   - Kalit va qiymatlar turi bo'yicha ranglarda ajratilgan.

2. **🔍 Jonli Qidiruv (Live Search & Filter)**:
   - Kalit yoki qiymat bo'yicha qidiruv, mos kelgan qismlarni yoritib ko'rsatish (Highlight).

3. **📊 3 xil ko'rish rejimi**:
   - **Object ko'rinishi (Daraxt)**: Interaktiv daraxt strukturasi.
   - **Formatlangan matn**: Qator raqamlari bilan chiroyli kod ko'rinishi.
   - **Jadval ko'rinishi**: Obyektlar ro'yxati (Array of Objects) bo'lsa, avtomatik ravishda chiroyli jadval shaklida chiqaradi.

4. **⚡ Formatlash & Boshqaruv**:
   - **Indentation**: 2 ta bo'shliq, 4 ta bo'shliq yoki Tab.
   - **Minify (Siqish)**: Barcha bo'shliqlarni olib tashlab, bir qatorga siqish.
   - **Saralash (Sort A-Z)**: Obyekt kalitlarini alifbo tartibida saralash.
   - **Fayl yuklash**: `.json` fayllarni sudrab tashlash (Drag & Drop) yoki fayl tanlash orqali yuklash.
   - **Yuklab olish & Nusxalash**: Formatlangan natijani bir zumda nusxalash yoki `.json` fayl qilib yuklab olish.

5. **⚠️ Xatoliklarni aniq ko'rsatish**:
   - JSON sintaksisi noto'g'ri bo'lsa, xato aynan qaysi **qator** va **ustun**da ekanligini aniq ko'rsatadi.

6. **🎨 Mavzular (Dark / Light)**:
   - Ko'zga qulay to'q (Dark) va yorug' (Light) mavzular. Sozlama `localStorage`da saqlanadi.

7. **🌐 Ko'p tillilik (i18n - UZ / EN / RU)**:
   - Dastur ham veb-interfeysda, ham CLI da 3 ta tilda to'liq ishlaydi:
     - 🇺🇿 **O'zbekcha (UZ)**
     - 🇬🇧 **English (EN)**
     - 🇷🇺 **Русский (RU)**
   - Veb interfeysda yuqori paneldagi til menyusi orqali bir zumda tilni almashtirish mumkin. Sozlama brauzerda avtomatik saqlanadi.
   - CLI buyruqlarida `-l, --lang` bayrog'i orqali (masalan: `node cli.js --lang ru --help`) kerakli tilni tanlash mumkin.

---

## 💻 1. Veb Dasturni Ishga Tushirish

### Usul 1: Node.js orqali (Tavsiya etiladi)
```bash
npm start
# yoki
node server.js
# yoki
./run.sh
```
Bu brauzeringizda avtomatik ravishda `http://localhost:3000` manzilini ochadi.

### Usul 2: To'g'ridan-to'g'ri brauzerda ochish
Hech qanday o'rnatishlarsiz `public/index.html` faylini istalgan brauzerda (Chrome, Firefox, Safari) ikki marta bosib ochishingiz mumkin.

---

## 🖥️ 2. Terminal (CLI) Orqali Ishlatish

Dasturda to'liq JavaScript (Node.js) da yozilgan CLI vositasi mavjud.

### a) Obyektni daraxt (Tree) shaklida ko'rish:
```bash
node cli.js '{"ism": "Ali", "yosh": 25, "kurslar": ["JS", "Node"]}' --tree
# yoki npm skripti orqali:
npm run cli -- samples/namuna.json --tree
```

### b) Faylni formatlash:
```bash
node cli.js samples/namuna.json
```

### c) Kalitlarni saralab formatlash:
```bash
node cli.js samples/namuna.json --sort
```

### d) JSONni siqish (Minify):
```bash
node cli.js samples/namuna.json --minify
```

### e) Pipe / Stdin orqali uzatish:
```bash
cat samples/namuna.json | node cli.js --tree
```

### f) Yordam va parametrlar ro'yxati (uz, en, ru):
```bash
node cli.js --help
# yoki inglizcha / ruscha:
node cli.js --lang en --help
node cli.js --lang ru --help
```

### g) Daraxt ko'rinishida tilni belgilash:
```bash
node cli.js samples/namuna.json --tree --lang ru
node cli.js samples/namuna.json --tree --lang en
```

---

## 🛡️ Xavfsizlik va Arxitektura Afzalliklari

- **Zero-Dependency**: Hech qanday tashqi npm kutubxonasiga bog'liq emas. Tez va xavfsiz.
- **Path Traversal Himoyasi**: Statik server `../` xurujlaridan to'liq himoyalangan (`static-handler.js`).
- **Clean Separation**: Frontend va Backend to'liq ajratilgan, mustaqil test qilish va kengaytirish oson.
- **Backwards Compatibility**: Eski skriptlar va buyruqlar (`node server.js`, `node cli.js`, `./run.sh`) to'liq o'z kuchini saqlab qolgan.

---

## 📄 Litsenziya
Ushbu loyiha [MIT](LICENSE) litsenziyasi ostida taqdim etiladi.
