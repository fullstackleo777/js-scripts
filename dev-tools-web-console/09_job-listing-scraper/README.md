# Indeed Job Listing Print to PDF

This script is a CSP-friendly version with the following features:

1. Extracts **Job Title**, **Employer** and **Location**
2. Builds your `YYYY-MM-DD_Location_Employer_Job-Title` token
3. **Sets** `document.title` to that token (the print dialog in Chrome/Edge will default the PDF filename to your `document.title + '.pdf'`)
4. Fires `window.print()` so you can choose “Save as PDF” without any external scripts

```js
(() => {
  // ─── Helpers ────────────────────────────────────────────────────────────
  const sanitize = str =>
    str
      .trim()
      .replace(/[^0-9A-Za-z\s\-]/g, '')  // remove punctuation except hyphens/spaces
      .replace(/\s+/g, '-');            // collapse spaces to hyphens
  
  const extract = () => {
    // 1) Title
    const h1 = document.querySelector('h1');
    if (!h1) throw new Error('No <h1> job title found.');
    const title = h1.innerText.trim();

    // 2) Employer ← first link to a /cmp/ company page
    const empLink = Array.from(document.querySelectorAll('a'))
      .find(a => a.href.includes('/cmp/'));
    if (!empLink) throw new Error('No employer <a> (/cmp/) found.');
    const employer = empLink.innerText.trim();

    // 3) Location ← first “City, ST”
    const locEl = Array.from(document.querySelectorAll('div, span'))
      .find(el => /^[A-Za-z].+,\s*[A-Z]{2}$/.test(el.innerText.trim()));
    if (!locEl) throw new Error('No “City, ST” location found.');
    let location = locEl.innerText.trim();

    // 4) Append “Remote” if present
    if (Array.from(document.querySelectorAll('div, span'))
             .some(el => el.innerText.trim() === 'Remote')) {
      location += ' Remote';
    }

    return { title, employer, location };
  };

  // ─── Main ────────────────────────────────────────────────────────────────
  try {
    const { title, employer, location } = extract();
    console.log('✅ Extracted:', { title, employer, location });

    const date = new Date().toISOString().slice(0, 10);
    const token = [
      date,
      sanitize(location),
      sanitize(employer),
      sanitize(title)
    ].join('_');

    console.log('🎯 Setting PDF filename token to:', token);
    // Chrome/Edge print dialog will default to document.title + ".pdf"
    document.title = token;

    // slight delay so the browser picks up the new title
    setTimeout(() => window.print(), 100);
  } catch (err) {
    console.error('❌', err.message);
  }
})();
```

## How to Use

1. Paste the snippet into your DevTools Console on any Indeed job page.
2. A print dialog appears select “Save as PDF.”
3. The **default** filename will be:

   ```
   YYYY-MM-DD_Location_Employer_Job-Title.pdf
   ```

This script avoids all CSP issues by using the browser’s built-in print-to-PDF and `document.title` instead of external libraries.

## Why this Script?

I was manually saving a PDF print of any job listing I applied to and saving the PDF in a local directory on my computer.

In my experience, sometimes I apply for the work, get an interview and when I try to access the job listing on Indeed, it has been taken down or it has changed. This way, I always have a local copy saved that I can use for interview prep and during the interview process in general.

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