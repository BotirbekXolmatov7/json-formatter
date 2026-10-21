# 🚀 JSON Formatter & Object Viewer

JSON ma'lumotlarni chiroyli formatlash, sintaksisini tekshirish va **oddiy, tushunarli interaktiv obyekt (daraxt)** ko'rinishida ko'rsatadigan zamonaviy dastur.

Dastur ham **Veb interfeys (Brauzer)**, ham **Terminal (CLI)** shaklida to'liq ishlaydi.

---

## 🌟 Asosiy Imkoniyatlar

1. **🌳 Oddiy & Interaktiv Obyekt (Tree) Ko'rinishi**:
   - Har bir ichki obyekt `{}` va ro'yxat `[]` ochilishi va yopilishi (collapse/expand) mumkin.
   - Elementlar soni (`3 ta kalit`, `5 ta element`) ko'rinadi.
   - Har bir tugun ustiga borganda tezkor **Yo'lni nusxalash** (masalan, `user.address.street`) va **Qiymatni nusxalash** tugmalari chiqadi.
   - Kalit va qiymatlar turi bo'yicha turli ranglarda ajratilgan:
     - 🔵 Kalitlar (Keys)
     - 🟢 Matnlar (Strings)
     - 🟡 Sonlar (Numbers)
     - 🟣 Mantiqiy qiymatlar (Booleans - `true`/`false`)
     - 🔴 Bo'sh qiymatlar (`null`)

2. **🔍 Jonli Qidiruv (Live Search & Filter)**:
   - Kalit yoki qiymat bo'yicha bir zumda qidirish va mos kelgan qismlarni yoritib ko'rsatish (Highlight).

3. **📊 3 xil ko'rish rejimi**:
   - **Object ko'rinishi (Daraxt)**: Interaktiv struktura.
   - **Formatlangan matn**: Qator raqamlari bilan chiroyli kod ko'rinishi.
   - **Jadval ko'rinishi**: Obyektlar ro'yxati (Array of Objects) bo'lsa, avtomatik ravishda chiroyli jadval sifatida chiqaradi.

4. **⚡ Formatlash & Boshqaruv**:
   - **Indentation**: 2 ta bo'shliq, 4 ta bo'shliq yoki Tab.
   - **Minify (Siqish)**: Barcha bo'shliqlarni olib tashlab, bir qatorga siqish.
   - **Saralash (Sort A-Z)**: Obyekt kalitlarini alifbo tartibida saralash.
   - **Fayl yuklash**: `.json` fayllarni sudrab tashlash (Drag & Drop) yoki fayl tanlash.
   - **Yuklab olish & Nusxalash**: Formatlangan natijani bir tugma bilan nusxalash yoki `.json` fayl qilib yuklab olish.

5. **⚠️ Xatoliklarni aniq ko'rsatish**:
   - JSON noto'g'ri bo'lsa (masalan, ortiqcha vergul yoki yetishmayotgan qavs), xato aynan qaysi qator va ustunda ekanligini ko'rsatadi.

6. **🎨 Mavzular (Dark / Light)**:
   - Ko'zga qulay to'q va yorug' mavzular.

---

## 💻 1. Veb Dasturni Ishga Tushirish (JavaScript / Node.js)

### Usul 1: Node.js orqali (Tavsiya etiladi)
```bash
node server.js
# yoki
npm start
# yoki
./run.sh
```
Bu brauzeringizda `http://localhost:3000` manzilini avtomatik ochadi.

### Usul 2: To'g'ridan-to'g'ri brauzerda ochish
Hech qanday o'rnatishlarsiz `index.html` faylini istalgan brauzerda (Chrome, Firefox, Edge, Safari) ikki marta bosib ochishingiz mumkin.

---

## 🖥️ 2. Terminal (CLI) Orqali Ishlatish

Dasturda to'liq JavaScript (Node.js) da yozilgan `cli.js` mavjud.

### a) Obyektni daraxt (Tree) shaklida ko'rish:
```bash
node cli.js '{"ism": "Ali", "yosh": 25, "faol": true, "kurslar": ["JS", "Node"]}' --tree
```
**Natija:**
```
{ (4 ta kalit)
├── "ism": "Ali"
├── "yosh": 25
├── "faol": true
└── "kurslar": [ (2 ta element)
    ├── "[0]": "JS"
    └── "[1]": "Node"
    ]
}
```

### b) Faylni formatlash:
```bash
node cli.js malumot.json
```

### c) Kalitlarni saralab formatlash:
```bash
node cli.js malumot.json --sort
```

### d) JSONni siqish (Minify):
```bash
node cli.js malumot.json --minify
```

### e) Pipe / Stdin orqali uzatish:
```bash
cat malumot.json | node cli.js --tree
curl -s https://jsonplaceholder.typicode.com/todos/1 | node cli.js --tree
```

---

## 📁 Fayllar Strukturasi

```
json-formatter/
├── index.html       # Asosiy veb interfeys
├── style.css        # Zamonaviy dizayn va sintaksis ranglari
├── app.js           # JSON formatlash, tahlil va interaktiv daraxt mantiqi (JavaScript)
├── cli.js           # Node.js uchun buyruqlar satri dasturi (JavaScript)
├── server.js        # Node.js mahalliy server skripti (JavaScript)
├── run.sh           # Tezkor ishga tushirish skripti
├── package.json     # Node/npm sozlamalari
└── README.md        # Qo'llanma
```
