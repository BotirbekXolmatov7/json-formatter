/**
 * Namuna JSON ma'lumotlar to'plami (Ko'p tilli: uz, en, ru)
 */

const rootGlobal = typeof window !== 'undefined' ? window : global;
rootGlobal.JSONViewer = rootGlobal.JSONViewer || {};

const sampleDataByLang = {
  uz: {
    user: {
      "foydalanuvchi_id": 10482,
      "shaxsiy_malumot": {
        "ism": "Ali",
        "familiya": "Valiyev",
        "yosh": 27,
        "kasb": "Senior Dasturchi",
        "faol": true,
        "email": "ali.valiyev@example.uz"
      },
      "aloqa": {
        "telefon": "+998 90 123 45 67",
        "telegram": "@alivaliyev",
        "manzil": {
          "shahar": "Toshkent",
          "tuman": "Mirzo Ulug'bek",
          "kocha": "Mustaqillik shoh ko'chasi",
          "uy": 42
        }
      },
      "texnologiyalar": ["JavaScript", "TypeScript", "Python", "Go", "Docker", "PostgreSQL"],
      "loyihalar": [
        { "id": "PRJ-01", "nomi": "E-to'lov tizimi", "holat": "yakunlangan", "yil": 2025, "byudjet_usd": 15000 },
        { "id": "PRJ-02", "nomi": "Mobil banking ilovasi", "holat": "jarayonda", "yil": 2026, "byudjet_usd": 32000 }
      ],
      "izohlar": null
    },
    ecommerce: [
      { "id": 1, "nomi": "MacBook Pro 16\"", "brend": "Apple", "kategoriya": "Noutbuklar", "narx": 2499.99, "mavjud": true, "omborda": 14 },
      { "id": 2, "nomi": "Dell XPS 15", "brend": "Dell", "kategoriya": "Noutbuklar", "narx": 1899.50, "mavjud": true, "omborda": 8 },
      { "id": 3, "nomi": "Sony WH-1000XM5", "brend": "Sony", "kategoriya": "Quloqchinlar", "narx": 399.00, "mavjud": true, "omborda": 25 }
    ],
    nested: {
      "server": "api.domain.uz",
      "port": 8080,
      "xavfsizlik": {
        "tls": true,
        "sertifikat": { "muddati": "2027-12-31", "shifrlash": "SHA-256" }
      },
      "sozlamalar": {
        "keshlash": { "faol": true, "turi": "Redis", "vaqt_sekund": 3600 },
        "cheklovlar": { "soatiga_sorovlar": 10000, "ip_oq_royxat": ["127.0.0.1", "192.168.1.1"] }
      }
    }
  },

  en: {
    user: {
      "user_id": 10482,
      "personal_info": {
        "first_name": "Alex",
        "last_name": "Miller",
        "age": 27,
        "occupation": "Senior Developer",
        "active": true,
        "email": "alex.miller@example.com"
      },
      "contacts": {
        "phone": "+1 415 555 2671",
        "telegram": "@alexmiller",
        "address": {
          "city": "San Francisco",
          "state": "CA",
          "street": "Market Street",
          "building": 42
        }
      },
      "skills": ["JavaScript", "TypeScript", "Python", "Go", "Docker", "PostgreSQL"],
      "projects": [
        { "id": "PRJ-01", "name": "Payment Gateway", "status": "completed", "year": 2025, "budget_usd": 15000 },
        { "id": "PRJ-02", "name": "Mobile Banking App", "status": "in_progress", "year": 2026, "budget_usd": 32000 }
      ],
      "notes": null
    },
    ecommerce: [
      { "id": 1, "name": "MacBook Pro 16\"", "brand": "Apple", "category": "Laptops", "price": 2499.99, "in_stock": true, "quantity": 14 },
      { "id": 2, "name": "Dell XPS 15", "brand": "Dell", "category": "Laptops", "price": 1899.50, "in_stock": true, "quantity": 8 },
      { "id": 3, "name": "Sony WH-1000XM5", "brand": "Sony", "category": "Headphones", "price": 399.00, "in_stock": true, "quantity": 25 }
    ],
    nested: {
      "server": "api.domain.com",
      "port": 8080,
      "security": {
        "tls": true,
        "certificate": { "expires": "2027-12-31", "encryption": "SHA-256" }
      },
      "settings": {
        "caching": { "enabled": true, "provider": "Redis", "ttl_seconds": 3600 },
        "rate_limiting": { "requests_per_hour": 10000, "ip_whitelist": ["127.0.0.1", "192.168.1.1"] }
      }
    }
  },

  ru: {
    user: {
      "id_polzovatelya": 10482,
      "lichnye_dannye": {
        "imya": "Алексей",
        "familiya": "Смирнов",
        "vozrast": 27,
        "professiya": "Старший разработчик",
        "aktiven": true,
        "email": "alex.smirnov@example.ru"
      },
      "kontakty": {
        "telefon": "+7 999 123 45 67",
        "telegram": "@alexsmirnov",
        "adres": {
          "gorod": "Москва",
          "rayon": "Центральный",
          "ulitsa": "Тверская",
          "dom": 42
        }
      },
      "tekhnologii": ["JavaScript", "TypeScript", "Python", "Go", "Docker", "PostgreSQL"],
      "proekty": [
        { "id": "PRJ-01", "nazvanie": "Платежная система", "status": "zavershen", "god": 2025, "byudzhet_usd": 15000 },
        { "id": "PRJ-02", "nazvanie": "Мобильный банкинг", "status": "v_rabote", "god": 2026, "byudzhet_usd": 32000 }
      ],
      "primechaniya": null
    },
    ecommerce: [
      { "id": 1, "nazvanie": "MacBook Pro 16\"", "brend": "Apple", "kategoriya": "Ноутбуки", "tsena": 2499.99, "v_nalichii": true, "na_sklade": 14 },
      { "id": 2, "nazvanie": "Dell XPS 15", "brend": "Dell", "kategoriya": "Ноутбуки", "tsena": 1899.50, "v_nalichii": true, "na_sklade": 8 },
      { "id": 3, "nazvanie": "Sony WH-1000XM5", "brend": "Sony", "kategoriya": "Наушники", "tsena": 399.00, "v_nalichii": true, "na_sklade": 25 }
    ],
    nested: {
      "server": "api.domain.ru",
      "port": 8080,
      "bezopasnost": {
        "tls": true,
        "sertifikat": { "srok_deystviya": "2027-12-31", "shifrovanie": "SHA-256" }
      },
      "nastroyki": {
        "keshirovanie": { "aktivno": true, "tip": "Redis", "vremya_sekund": 3600 },
        "ogranicheniya": { "zaprosov_v_chas": 10000, "belyy_spisok_ip": ["127.0.0.1", "192.168.1.1"] }
      }
    }
  }
};

rootGlobal.JSONViewer.sampleDataByLang = sampleDataByLang;
rootGlobal.JSONViewer.sampleData = sampleDataByLang.en;

rootGlobal.JSONViewer.getSample = function(key, lang = 'en') {
  const data = sampleDataByLang[lang] || sampleDataByLang.en || sampleDataByLang.uz;
  return data[key] || (sampleDataByLang.en && sampleDataByLang.en[key]) || sampleDataByLang.uz[key];
};
