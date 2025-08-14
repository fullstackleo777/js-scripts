function updateHeadshotsInFolder() {
  const FOLDER_ID = 'YOUR_FOLDER_ID_HERE';
  const NEW_HEADSHOT_URL = 'https://fullstackleo.net/images/FullStackLeo-2025_500x500.png';

  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
  const headshotBlob = UrlFetchApp.fetch(NEW_HEADSHOT_URL).getBlob();

  while (files.hasNext()) {
    const file = files.next();
    const doc = DocumentApp.openById(file.getId());
    const body = doc.getBody();
    const images = body.getImages();

    images.forEach(image => {
      try {
        const parent = image.getParent().asParagraph();
        const positioned = (image.getParent() && image.getParent().getParent());
        // Attempt to get offsets if PositionedImage, else skip
        if (positioned && positioned.getTopOffset && positioned.getLeftOffset) {
          const top = positioned.getTopOffset();
          const left = positioned.getLeftOffset();
          // Identify image in top-right quadrant (adjust thresholds as needed)
          if (top < 50 && left > (body.getPageWidth() * 0.5)) {
            const w = image.getWidth();
            const h = image.getHeight();
            parent.appendInlineImage(headshotBlob).setWidth(w).setHeight(h);
            image.removeFromParent();
          }
        }
      } catch (e) {
        // If not a positioned image, ignore
      }
    });

    doc.saveAndClose();
  }
}
