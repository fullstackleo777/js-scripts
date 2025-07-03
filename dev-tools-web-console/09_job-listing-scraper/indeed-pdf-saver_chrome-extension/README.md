# Indeed PDF Saver Chrome Extension

A minimal Manifest V3 extension that injects a “💾 Save PDF” button into every Indeed job‐listing page. 

## Features

1. Extract Job Title, Employer and Location
2. Build a filename in the format

   ```
   YYYY-MM-DD_Location_Employer_Job-Title.pdf
   ```
3. Set `document.title` to that string (so Chrome’s “Save as PDF” dialog picks it up)
4. Call `window.print()` to open the Print→Save-as-PDF dialog

### 1. `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "Indeed PDF Saver",
  "version": "1.0",
  "description": "Add a Save-PDF button to Indeed job pages with a templated filename.",
  "permissions": [
    "activeTab"
  ],
  "content_scripts": [
    {
      "matches": ["*://*.indeed.com/viewjob*"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

* **`matches`** only runs on URLs like `https://www.indeed.com/viewjob?jk=…`
* **No background/service worker** is needed. Everything lives in the content script.

### 2. `content.js`

```javascript
(() => {
  const sanitize = s =>
    s.trim()
     .replace(/[^0-9A-Za-z\s\-]/g, '')   // drop punctuation except hyphens/spaces
     .replace(/\s+/g, '-');             // collapse spaces to hyphens

  function extractJobData() {
    const h1 = document.querySelector('h1');
    if (!h1) throw new Error('Job title not found');
    const title = h1.innerText.trim();

    const empLink = Array.from(document.querySelectorAll('a'))
      .find(a => a.href.includes('/cmp/'));
    if (!empLink) throw new Error('Employer link not found');
    const employer = empLink.innerText.trim();

    const locEl = Array.from(document.querySelectorAll('div, span'))
      .find(el => /^[A-Za-z].+,\s*[A-Z]{2}$/.test(el.innerText.trim()));
    if (!locEl) throw new Error('Location not found');
    let location = locEl.innerText.trim();

    if (Array.from(document.querySelectorAll('div, span'))
             .some(el => el.innerText.trim() === 'Remote')) {
      location += ' Remote';
    }

    return { title, employer, location };
  }

  function makeButton() {
    const btn = document.createElement('button');
    btn.textContent = '💾 Save PDF';
    btn.style.cursor = 'pointer';
    btn.style.marginLeft = '12px';
    btn.style.padding = '4px 8px';
    btn.style.fontSize = '14px';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '4px';
    btn.style.background = '#fff';

    btn.addEventListener('click', () => {
      try {
        const { title, employer, location } = extractJobData();
        const date = new Date().toISOString().slice(0, 10);
        const token = [
          date,
          sanitize(location),
          sanitize(employer),
          sanitize(title)
        ].join('_');
        // Set the filename token as the document title
        document.title = token;
        // Fire print dialog (choose “Save as PDF”)
        setTimeout(() => window.print(), 100);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });

    return btn;
  }

  // Insert the button next to the <h1> title
  try {
    const h1 = document.querySelector('h1');
    if (!h1) return;
    const wrapper = h1.parentElement;
    // avoid inserting twice
    if (!wrapper.querySelector('.save-pdf-btn')) {
      const btn = makeButton();
      btn.classList.add('save-pdf-btn');
      wrapper.appendChild(btn);
    }
  } catch (e) {
    console.error('Indeed-PDF-Saver:', e);
  }
})();
```

* **`extractJobData()`** finds the first `<h1>` (job title), the first `<a>` linking to `/cmp/` (employer), and a “City, ST” node (plus “Remote” if present).
* **`makeButton()`** builds a small in-page button, wires up the click → extract → set `document.title` → `window.print()` flow.
* We append it directly into the title’s container so it feels like part of the page.

### 3. Install & Test

1. **Folder structure**

   ```
   indeed-pdf-saver/
   ├─ manifest.json
   ├─ content.js
   └─ (icons: icon16.png, icon48.png, icon128.png)
   ```
2. In Chrome go to `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select your `indeed-pdf-saver` folder.
3. Navigate to any Indeed job‐listing (URL matching `viewjob`). You should see a “💾 Save PDF” button next to the title.
4. Click it → Print dialog pops up → choose **Save as PDF** and the **default filename** will be your templated string.

This gives you a one-click, CSP-safe, repeatable way to grab any Indeed job page as a PDF with the exact filename format you want.

## Publish on Chrome Web Store

1. **Register as a developer**
   * Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and pay the one-time \$5 registration fee.

2. **Package your extension**
   * Zip up your manifest.json, content.js, icons, etc.

3. **Create a new item**

   * Upload the ZIP, fill in your listing details (name, description, screenshots, pricing/distribution).
   * Choose **Unlisted** if you only want people with the direct link to see/install it, or **Public** if you want it searchable.

4. **Publish**
   * Once published, users can click your Web Store link and install it without developer mode required.

> **Note:** You don’t strictly *have* to publish publicly. The Web Store supports **private** or **unlisted** listings so only users you share the link with can install. All installations are then CSP-compliant and auto-updated.

___