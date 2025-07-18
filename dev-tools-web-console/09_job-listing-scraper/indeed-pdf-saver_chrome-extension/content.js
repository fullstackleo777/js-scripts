(() => {
  const sanitize = s =>
    s.trim()
     .replace(/[^0-9A-Za-z\s\-]/g, '')   // drop punctuation except hyphens/spaces
     .replace(/\s+/g, '-');   // collapse spaces to hyphens

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
    btn.className = 'indeed-pdf-saver-btn';
    Object.assign(btn.style, {
      cursor: 'pointer',
      marginLeft: '12px',
      padding: '4px 8px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#fff'
    });

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
        document.title = token;
        setTimeout(() => window.print(), 100);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });

    return btn;
  }

  function injectButtonOnce() {
    const h1 = document.querySelector('h1');
    if (!h1) return;

    // Prevent duplicate insertion
    const container = h1.parentElement;
    if (container.querySelector('.indeed-pdf-saver-btn')) return;

    const btn = makeButton();
    container.appendChild(btn);
  }

  // 1) Initial attempt
  injectButtonOnce();

  // 2) Watch for changes to the DOM so we can re-inject if Indeed re-renders
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      // if any new nodes are added under body, try injecting
      if (m.addedNodes.length) {
        injectButtonOnce();
        break;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Optional: stop observing after some time to save resources
  setTimeout(() => observer.disconnect(), 30_000);
})();
