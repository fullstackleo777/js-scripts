/*
How to Use:
1. Go to the user's GitHub page, like: https://github.com/fullstackleo777
2. Open DevTools (F12 or Ctrl+Shift+I)
3. Paste and run the code in the Console
4. CSV will auto-download!
*/
(async () => {
    const username = window.location.pathname.replace(/\//g, '');
    const perPage = 100;
    let page = 1;
    let repos = [];
  
    while (true) {
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`);
      if (!res.ok) {
        console.error("Failed to fetch:", res.status);
        break;
      }
  
      const data = await res.json();
      if (data.length === 0) break;
  
      repos = repos.concat(data.map(repo => ({
        name: repo.name,
        description: repo.description || ""
      })));
  
      page++;
    }
  
    // Convert to CSV
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["name,description"]
        .concat(repos.map(r => `"${r.name}","${r.description.replace(/"/g, '""')}"`))
        .join("\n");
  
    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${username}_repos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  })();
  