function changePaperSizeInFolder() {
  // Replace with your folder ID (from the URL in Drive)
  var folderId = 'your-folder-id-here';
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFilesByType(MimeType.GOOGLE_DOCS);

  while (files.hasNext()) {
    var file = files.next();
    var doc = DocumentApp.openById(file.getId());
    var body = doc.getBody();

    var attributes = {};
    attributes[DocumentApp.Attribute.PAGE_WIDTH] = 612;  // 8.5 inches
    attributes[DocumentApp.Attribute.PAGE_HEIGHT] = 792; // 11 inches

    body.setAttributes(attributes);
    doc.saveAndClose();
    Logger.log('Updated: ' + file.getName());
  }

  Logger.log('All documents updated to Letter size.');
}
