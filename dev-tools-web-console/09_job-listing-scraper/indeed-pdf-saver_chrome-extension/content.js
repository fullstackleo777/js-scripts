(() => {
  //  Utility: turn any string into a filesystem-safe token 
  const sanitize = raw =>
    raw
      .trim()
      .replace(/[^0-9A-Za-z\s\-]/g, '')  // drop punctuation except spaces & hyphens
      .replace(/\s+/g, '-');            // collapse runs of whitespace into a single hyphen

  //  Extract job data, preferring JSON-LD when available ──
  function extractJobData() {
    // 1) Look for all <script type="application/ld+json"> tags on the page
    const ldScripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );

    for (const script of ldScripts) {
      try {
        // 2) Parse the JSON content
        const data = JSON.parse(script.textContent);
        // JSON-LD might be an array or a single object
        const entries = Array.isArray(data) ? data : [data];

        for (const entry of entries) {
          // 3) Find the JobPosting object
          if (entry['@type'] === 'JobPosting') {
            // 4) Pull out the title & employer
            const title    = entry.title || entry.jobTitle || '';
            const employer = entry.hiringOrganization?.name || '';

            // 5) Build the location string
            let location = '';
            if (entry.jobLocation) {
              // jobLocation may be an array
              const jl = Array.isArray(entry.jobLocation)
                       ? entry.jobLocation[0]
                       : entry.jobLocation;
              const addr = jl.address || {};
              // city + region, e.g. "Austin, TX"
              const city   = addr.addressLocality || '';
              const region = addr.addressRegion   || '';
              location = city + (region ? `, ${region}` : '');

              // 6) Some postings mark remote work
              if (
                jl.jobLocationType === 'TELECOMMUTE'
                || jl.remote === true
                || /remote/i.test(entry.jobLocationType || '')
              ) {
                location += location ? ' Remote' : 'Remote';
              }
            }

            // 7) If we got all three, return them right away
            if (title && employer && location) {
              return { title, employer, location };
            }
          }
        }
      } catch (e) {
        // JSON parse failure: skip to next script tag
      }
    }

    //  Fallback: query the DOM if JSON-LD didn’t yield all three ──

    // A) Title: first look for Indeed’s known class, then any <h1>
    const h1 = document.querySelector('h1.jobsearch-JobInfoHeader-title')
            || document.querySelector('h1');
    if (!h1) throw new Error('Job title not found.');
    const title = h1.innerText.trim();

    // B) Subtitle container: holds employer + location
    const subtitle = document.querySelector('div.jobsearch-JobInfoHeader-subtitle')
                   || document.querySelector('.jobsearch-InlineCompanyRating'); 
    // try a secondary class if the first isn’t present
    if (!subtitle) throw new Error('Job header subtitle not found.');

    // C) Employer: first <a> inside that container
    const empLink = subtitle.querySelector('a');
    if (!empLink) throw new Error('Employer link not found.');
    const employer = empLink.innerText.trim();

    // D) Location: find the first child whose text matches “City, ST”
    const locEl = Array.from(subtitle.querySelectorAll('div, span'))
      .find(el => /^[A-Za-z].+,\s*[A-Z]{2}$/.test(el.innerText.trim()));
    if (!locEl) throw new Error('Location element not found.');
    let location = locEl.innerText.trim();

    // E) Append "Remote" if present anywhere in subtitle
    if (
      Array.from(subtitle.querySelectorAll('div, span'))
        .some(el => el.innerText.trim().toLowerCase() === 'remote')
    ) {
      location += ' Remote';
    }

    return { title, employer, location };
  }

  //  Build the “Save PDF” button and wire up its click handler 
  function makeButton() {
    const btn = document.createElement('button');
    btn.textContent = '💾 Save PDF';
    btn.className   = 'indeed-pdf-saver-btn';

    // Inline styles for a lightweight, Indeed-matching look
    Object.assign(btn.style, {
      cursor:       'pointer',
      marginLeft:   '12px',
      padding:      '4px 8px',
      fontSize:     '14px',
      border:       '1px solid #ccc',
      borderRadius: '4px',
      background:   '#fff'
    });

    btn.addEventListener('click', () => {
      try {
        // 1) Grab the data
        const { title, employer, location } = extractJobData();
        // 2) Format today's date
        const date  = new Date().toISOString().slice(0, 10); // “YYYY-MM-DD”
        // 3) Build the filename token
        const token = [date,
                       sanitize(location),
                       sanitize(employer),
                       sanitize(title)]
                        .join('_');
        // 4) Set document.title so Chrome’s Save-as-PDF dialog picks it up
        document.title = token;
        // 5) Fire the print dialog
        setTimeout(() => window.print(), 100);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });

    return btn;
  }

  //  Insert the button next to the job title, if not already present ─
  function injectButtonOnce() {
    // Find our title element again
    const h1 = document.querySelector('h1.jobsearch-JobInfoHeader-title')
            || document.querySelector('h1');
    if (!h1) return;                                // bail if no title

    const container = h1.parentElement;             // where we’ll append
    if (container.querySelector('.indeed-pdf-saver-btn')) {
      return; // already injected
    }
    container.appendChild(makeButton());
  }

  //  Run once on load 
  injectButtonOnce();

  //  Re-inject on any DOM changes (Indeed’s client-side re-renders) ──
  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.addedNodes.length) {
        injectButtonOnce();
        break;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  //  Optional: stop observing after 30 s to save resources 
  setTimeout(() => observer.disconnect(), 30_000);
})();
