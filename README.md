# 🍎 Ms. Laura's 2nd Grade Class Website

A warm, cozy classroom website with an interactive word search game, announcements, worksheets, and activity links — built for GitHub Pages.

---

## 📁 File Tree

```
ms-laura-class/
├── index.html              ← Main (and only) page
├── css/
│   └── style.css           ← All the colors & styling
├── js/
│   └── wordsearch.js       ← Interactive word search game
├── worksheets/
│   └── (drop PDF files here)
└── README.md               ← You are here!
```

---

## 🚀 How to Put This on GitHub Pages

1. **Create a GitHub account** at [github.com](https://github.com) if you don't have one.
2. Click **"New repository"** and name it exactly: `ms-laura-class` (or anything you like).
3. Upload all the files — keep the folder structure the same!
4. Go to **Settings → Pages**.
5. Under **"Branch"**, select `main` and click **Save**.
6. Your site will be live at: `https://YOUR-USERNAME.github.io/ms-laura-class/`

---

## ✏️ How to Edit the Site

### Add an Announcement
Open `index.html` and find the `#announcements` section. Copy one of the `.card` blocks and change the text:
```html
<div class="card">
  <h3>🌟 Your Title Here</h3>
  <p>Your message here!</p>
  <span class="date">Month Day, Year</span>
</div>
```

### Add a PDF Worksheet
1. Drop your PDF into the `worksheets/` folder.
2. In `index.html`, find the worksheet `.card` and update the link:
```html
<a href="worksheets/YOUR-FILE-NAME.pdf" class="btn" download>⬇️ Download PDF</a>
```

### Embed a Google Slides / Doc
1. Open your file in Google Slides or Docs.
2. Click **File → Share → Publish to web**.
3. Choose **Embed** and copy the `<iframe>` link.
4. Paste it into the `src=""` of the iframe in `index.html`.

### Change the Word Search Words
Open `js/wordsearch.js` and edit the `WORD_BANK` array near the top:
```js
const WORD_BANK = [
  "APPLE", "PENCIL", "BOOK", // ← add your words here, ALL CAPS!
  ...
];
```

---

## 🎨 Colors
All colors are set at the top of `css/style.css` with CSS variables — easy to change!
```css
:root {
  --orange: #FF8C42;
  --yellow: #FFD166;
  /* etc. */
}
```

---

Made with ❤️ for Ms. Laura's 2nd Grade class!
