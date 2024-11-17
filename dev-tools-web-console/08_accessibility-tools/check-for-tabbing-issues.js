Array.from(document.querySelectorAll('*')).filter(el => el.tabIndex > 0).forEach(el => console.log(el));
