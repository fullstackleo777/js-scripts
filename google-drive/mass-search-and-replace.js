function replaceInDocs() {
  const FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // Replace with your folder ID
  const SEARCH_TEXT = 'camapaigns';
  const REPLACE_TEXT = 'campaigns';
  
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);

  while (files.hasNext()) {
    const file = files.next();
    const doc = DocumentApp.openById(file.getId());
    const body = doc.getBody();

    body.replaceText(SEARCH_TEXT, REPLACE_TEXT);
    doc.saveAndClose();
    
    Logger.log(`Updated: ${file.getName()}`);
  }

  Logger.log('All documents have been processed.');
}
