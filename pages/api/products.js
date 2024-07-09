import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir);
    const latestFile = files
      .filter(file => file.startsWith('snapshot'))
      .sort()
      .reverse()[0]; // Get the latest file

    if (!latestFile) {
      throw new Error('No snapshot file found');
    }

    const filePath = path.join(dataDir, latestFile);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents); // Data is already in the expected flat array format

    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading snapshot file:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
}