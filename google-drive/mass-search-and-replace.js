function replaceTextSpecificFolder() {
  var files = DriveApp.getFolderById("FOLDER_ID").getFiles();
  while (files.hasNext()) {
    var file = files.next();
    var doc = DocumentApp.openById(file.getId());
    doc.replaceText("SEARCH_TEXT", "REPLACE_TEXT");
  }
}

// Source: https://stackoverflow.com/questions/64990217/find-and-replace-text-in-entire-google-drive-folder-headers-footers-google-do