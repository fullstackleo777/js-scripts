function reduceFontSizeInDocsInFolder() {
  const folderId = 'YOUR_FOLDER_ID'; // Replace with your folder ID
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
  
  while (files.hasNext()) {
    const file = files.next();
    const doc = DocumentApp.openById(file.getId());
    const body = doc.getBody();
    reduceFontSizeInElement(body);
    doc.saveAndClose();
  }
}

function reduceFontSizeInElement(element) {
  const numChildren = element.getNumChildren();

  for (let i = 0; i < numChildren; i++) {
    const child = element.getChild(i);
    const type = child.getType();

    if (type === DocumentApp.ElementType.PARAGRAPH || type === DocumentApp.ElementType.TABLE_CELL) {
      const text = child.asText();
      for (let j = 0; j < text.getText().length; j++) {
        const attr = text.getFontSize(j);
        if (attr) {
          text.setFontSize(j, attr - 1);
        }
      }
    } else if (type === DocumentApp.ElementType.TABLE) {
      const table = child.asTable();
      for (let r = 0; r < table.getNumRows(); r++) {
        const row = table.getRow(r);
        for (let c = 0; c < row.getNumCells(); c++) {
          reduceFontSizeInElement(row.getCell(c));
        }
      }
    } else if (type === DocumentApp.ElementType.LIST_ITEM) {
      reduceFontSizeInElement(child.asListItem());
    }
  }
}
