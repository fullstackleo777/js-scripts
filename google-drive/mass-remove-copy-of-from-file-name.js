function removeCopyOfPrefix() {
  const folderId = 'YOUR_FOLDER_ID_HERE'; // Replace with your actual folder ID
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const originalName = file.getName();
    if (originalName.startsWith('Copy of ')) {
      const newName = originalName.replace(/^Copy of /, '');
      file.setName(newName);
    }
  }
}
