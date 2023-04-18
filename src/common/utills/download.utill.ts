import path from 'path';
import fs from 'fs';
import https from 'https';

export function downloadFile(url, callback) {
  const filename = path.basename(url);
  const downloadsDir = 'downloads';
  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);
  const filePath = `${downloadsDir}/${filename}`;
  https.get(url, (res) => {
    const fileStream = fs.createWriteStream(filePath);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      callback(filePath);
    });
  });
  return filePath;
}
