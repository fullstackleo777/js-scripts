const fs = require('fs');
const path = require('path');

// Get the file path from the command-line arguments
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('❌ Please provide a file path.\nUsage: node extract-links.js <file-path>');
  process.exit(1);
}

// Resolve the full path in case it's relative
const filePath = path.resolve(inputPath);

// Read file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`❌ Error reading file at "${filePath}":`, err.message);
    process.exit(1);
  }

  // Regex to match HTTP/HTTPS URLs
  const urlRegex = /https?:\/\/[^\s"'<>]+/g;

  const urls = data.match(urlRegex);

  if (urls && urls.length) {
    console.log('✅ Extracted URLs:\n');
    console.log(urls.join('\n'));
  } else {
    console.log('ℹ️ No URLs found in the file.');
  }
});

/* Use in Bash Terminal

Example 1
node extract-links.js /absolute/or/relative/path/to/your/file.txt

Example 2
node extract-links.js ./my-notes.md

Example 3
node extract-links.js /Users/you/Documents/webpage.html

*/