import * as https from 'https';
import * as fs from 'fs';

export function downloadFile(url, downloadsDir): Promise<any> {
  const filename = url.split('/').pop();
  fs.access(downloadsDir, (error) => {
    if (error) fs.mkdirSync(downloadsDir);
  });
  const filePath = `${downloadsDir}/${filename}`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
        });
        res.on('end', () => resolve(filePath));
      })
      .on('error', (err) => reject(err));
  });
}
