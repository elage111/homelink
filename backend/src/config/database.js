import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Check if we're on Railway (has VOLUME_MOUNT_PATH)
const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH || '/app/backend';

// Create the directory if it doesn't exist
if (!fs.existsSync(volumePath)) {
    fs.mkdirSync(volumePath, { recursive: true });
}

const file = join(volumePath, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();
db.data ||= { listings: [] };
await db.write();

console.log(`✅ Database ready at: ${file}`);
export default db;
