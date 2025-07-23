function generateDownloadLinks() {
  const folderId = Browser.inputBox('Enter the Folder ID containing the Google Docs:'); // be sure to remove Browser.inputBox()
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
  let output = '';

  while (files.hasNext()) {
    const file = files.next();
    const fileId = file.getId();
    const fileName = file.getName();
    
    const pdfLink = `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
    const odtLink = `https://docs.google.com/document/d/${fileId}/export?format=odt`;

    output += `${fileName}\nPDF: ${pdfLink}\nODT: ${odtLink}\n\n`;
    Logger.log(`${fileName}:\nPDF: ${pdfLink}\nODT: ${odtLink}`);
  }

  if (output) {
    const htmlOutput = HtmlService.createHtmlOutput(`<pre>${output}</pre>`)
      .setWidth(800)
      .setHeight(600);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Download Links');
  } else {
    SpreadsheetApp.getUi().alert('No Google Docs found in the specified folder.');
  }
}
