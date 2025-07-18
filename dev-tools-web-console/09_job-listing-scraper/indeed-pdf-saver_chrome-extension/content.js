(() => {
  //  Utility: sanitize a string so it’s safe for filenames ──
  // - Trims whitespace
  // - Removes any character that isn’t alphanumeric, space or hyphen
  // - Collapses runs of whitespace into a single hyphen
  const sanitize = s =>
    s.trim()
     .replace(/[^0-9A-Za-z\s\-]/g, '')
     .replace(/\s+/g, '-');

  //  Extract job data from the page ─
  // Returns an object { title, employer, location }
  function extractJobData() {
    // 1) Get the job title element. Indeed uses this class, fallback to first <h1>.
    const h1 = document.querySelector('h1.jobsearch-JobInfoHeader-title')
            || document.querySelector('h1');
    if (!h1) throw new Error('Job title not found.');
    const title = h1.innerText.trim();

    // 2) Find Indeed’s subtitle container (holds employer + location info)
    const subtitle = document.querySelector('div.jobsearch-JobInfoHeader-subtitle');
    if (!subtitle) throw new Error('Job header subtitle not found.');

    // 3) Employer: first <a> inside the subtitle container
    const empLink = subtitle.querySelector('a');
    if (!empLink) throw new Error('Employer link not found.');
    const employer = empLink.innerText.trim();

    // 4) Location: look for the first <div> or <span> whose text matches "City, ST"
    const locDiv = Array.from(subtitle.querySelectorAll('div, span'))
      .find(el => /^[A-Za-z].+,\s*[A-Z]{2}$/.test(el.innerText.trim()));
    if (!locDiv) throw new Error('Location element not found.');
    let location = locDiv.innerText.trim();

    // 5) Check if there's an additional "Remote" label in the same container
    const isRemote = Array.from(subtitle.querySelectorAll('div, span'))
      .some(el => el.innerText.trim().toLowerCase() === 'remote');
    if (isRemote) {
      // Append "Remote" to the location string if present
      location += ' Remote';
    }

    return { title, employer, location };
  }

  //  Build the "Save PDF" button and its click handler ─
  function makeButton() {
    // Create a <button> element
    const btn = document.createElement('button');
    btn.textContent = '💾 Save PDF';
    btn.className = 'indeed-pdf-saver-btn';

    // Basic inline styling to match Indeed’s look-and-feel
    Object.assign(btn.style, {
      cursor: 'pointer',
      marginLeft: '12px',
      padding: '4px 8px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#fff'
    });

    // On click: extract data, build filename, set document.title, then print
    btn.addEventListener('click', () => {
      try {
        const { title, employer, location } = extractJobData();
        const date = new Date().toISOString().slice(0, 10);           // e.g. "2025-07-18"
        const token = [                                               
          date,
          sanitize(location),
          sanitize(employer),
          sanitize(title)
        ].join('_');                                                 // YYYY-MM-DD_Location_Employer_Title
        document.title = token;                                      // This becomes the default PDF name
        setTimeout(() => window.print(), 100);                       // Trigger browser print dialog
      } catch (err) {
        // If any step fails, show a friendly alert
        alert('Error: ' + err.message);
      }
    });

    return btn;
  }

  //  Insert the button next to the job title, if not already there ─
  function injectButtonOnce() {
    // Locate the same <h1> we used for the title
    const h1 = document.querySelector('h1.jobsearch-JobInfoHeader-title')
            || document.querySelector('h1');
    if (!h1) return;                                // Bail if no title found

    const container = h1.parentElement;             // Container to which we’ll append the button
    // Prevent inserting multiple buttons
    if (container.querySelector('.indeed-pdf-saver-btn')) return;

    container.appendChild(makeButton());
  }

  //  Initial injection on script load 
  injectButtonOnce();

  //  Re-inject if Indeed re-renders the header (client-side nav) ──
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes.length) {
        injectButtonOnce();
        break;  // No need to scan further mutations in this batch
      }
    }
  });
  // Watch the entire body subtree for added nodes
  observer.observe(document.body, { childList: true, subtree: true });

  // Optional: stop observing after 30 seconds to reduce overhead
  setTimeout(() => observer.disconnect(), 30_000);
})();
