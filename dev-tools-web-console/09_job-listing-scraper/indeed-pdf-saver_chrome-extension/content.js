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
