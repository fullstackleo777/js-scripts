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