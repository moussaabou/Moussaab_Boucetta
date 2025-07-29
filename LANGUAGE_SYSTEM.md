# نظام تغيير اللغة - Language Switching System

## نظرة عامة - Overview

تم تطوير نظام تغيير اللغة ليدعم ثلاث لغات:
- **الإنجليزية (EN)** - اللغة الافتراضية
- **الفرنسية (FR)** - الترجمة الفرنسية
- **العربية (AR)** - الترجمة العربية مع دعم RTL

## المكونات - Components

### 1. أزرار تغيير اللغة - Language Buttons
```html
<div class="language-switcher">
    <button class="lang-btn active" data-lang-code="en">EN</button>
    <button class="lang-btn" data-lang-code="fr">FR</button>
    <button class="lang-btn" data-lang-code="ar">AR</button>
</div>
```

### 2. عناصر HTML مع data-lang
```html
<h1 data-lang="hero-name">Moussaab Boucetta</h1>
<p data-lang="about-description">Description text...</p>
```

### 3. ملف الترجمات - Translation File
`data/languages.json` يحتوي على جميع الترجمات للثلاث لغات.

## كيفية العمل - How It Works

### 1. تهيئة النظام - System Initialization
```javascript
// في main.js
class PortfolioApp {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.languages = {};
        this.init();
    }
}
```

### 2. تحميل الترجمات - Loading Translations
```javascript
async loadLanguages() {
    const response = await fetch('data/languages.json');
    this.languages = await response.json();
}
```

### 3. تغيير اللغة - Language Switching
```javascript
setLanguage(langCode) {
    this.currentLanguage = langCode;
    
    // تحديث سمات HTML
    document.documentElement.lang = langCode;
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    
    // تحديث الأزرار النشطة
    this.updateActiveButtons();
    
    // تحديث المحتوى
    this.updateContent();
    
    // حفظ التفضيل
    localStorage.setItem('language', langCode);
}
```

### 4. تحديث المحتوى - Content Update
```javascript
updateContent() {
    const elements = document.querySelectorAll('[data-lang]');
    const currentLangData = this.languages[this.currentLanguage];
    
    elements.forEach(element => {
        const key = element.dataset.lang;
        const translation = currentLangData[key];
        
        if (translation) {
            element.textContent = translation;
        }
    });
}
```

## دعم RTL للعربية - RTL Support for Arabic

### CSS RTL
```css
/* في rtl.css */
[dir="rtl"] {
    text-align: right;
}

[dir="rtl"] .nav-container {
    flex-direction: row-reverse;
}
```

### JavaScript RTL
```javascript
// تحديث اتجاه الصفحة
html.dir = langCode === 'ar' ? 'rtl' : 'ltr';
```

## إضافة ترجمات جديدة - Adding New Translations

### 1. إضافة data-lang في HTML
```html
<h3 data-lang="new-title">New Title</h3>
<p data-lang="new-description">New description</p>
```

### 2. إضافة الترجمات في languages.json
```json
{
  "en": {
    "new-title": "New Title",
    "new-description": "New description"
  },
  "fr": {
    "new-title": "Nouveau Titre",
    "new-description": "Nouvelle description"
  },
  "ar": {
    "new-title": "عنوان جديد",
    "new-description": "وصف جديد"
  }
}
```

## اختبار النظام - Testing the System

### ملف الاختبار - Test File
تم إنشاء `test-language.html` لاختبار النظام:

1. افتح الملف في المتصفح
2. انقر على أزرار اللغة (EN, FR, AR)
3. راقب تغيير المحتوى والاتجاه

### التحقق من العمل - Verification
- ✅ تغيير النصوص
- ✅ تغيير اتجاه الصفحة للعربية
- ✅ حفظ التفضيل في localStorage
- ✅ تأثيرات بصرية عند التغيير

## الميزات - Features

### ✅ ميزات مكتملة - Completed Features
- [x] دعم ثلاث لغات
- [x] حفظ التفضيل
- [x] دعم RTL للعربية
- [x] تأثيرات بصرية
- [x] ترجمات شاملة
- [x] اختبار النظام

### 🔄 تحسينات مستقبلية - Future Improvements
- [ ] دعم لغات إضافية
- [ ] ترجمة ديناميكية
- [ ] دعم الترجمة التلقائية
- [ ] تحسين الأداء

## استكشاف الأخطاء - Troubleshooting

### مشاكل شائعة - Common Issues

1. **لا تعمل أزرار اللغة**
   - تحقق من وجود `data-lang-code` في الأزرار
   - تحقق من تحميل ملف JavaScript

2. **لا تتغير النصوص**
   - تحقق من وجود `data-lang` في العناصر
   - تحقق من وجود الترجمات في `languages.json`

3. **مشاكل في RTL**
   - تحقق من تحميل `rtl.css`
   - تحقق من تحديث `dir` attribute

### حلول - Solutions

```javascript
// للتأكد من تحميل النظام
console.log('Current language:', window.portfolioApp.currentLanguage);
console.log('Available languages:', Object.keys(window.portfolioApp.languages));
```

## الدعم - Support

للمساعدة في تطوير أو تحسين نظام تغيير اللغة، يرجى:
1. فتح issue في GitHub
2. إرسال pull request مع التحسينات
3. التواصل عبر البريد الإلكتروني

---

**ملاحظة**: هذا النظام مصمم ليكون سهل الاستخدام وقابل للتوسع ليدعم لغات إضافية في المستقبل. 