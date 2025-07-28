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

    if (type === DocumentApp.ElementType.PARAGRAPH || type === DocumentApp.ElementType.LIST_ITEM || type === DocumentApp.ElementType.TABLE_CELL) {
      const text = child.asText();
      let start = 0;
      while (start < text.getText().length) {
        const currentFontSize = text.getFontSize(start);
        if (currentFontSize) {
          let end = start + 1;
          while (end < text.getText().length && text.getFontSize(end) === currentFontSize) {
            end++;
          }
          text.setFontSize(start, end - 1, currentFontSize - 1);
          start = end;
        } else {
          start++;
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
    }
  }
}
