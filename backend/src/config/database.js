import jsonfile from 'jsonfile';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../../db.json');

// Simple database functions
const db = {
  data: { listings: [] },

  async read() {
    try {
      this.data = await jsonfile.readFile(file);
    } catch (error) {
      // File doesn't exist, use default data
      this.data = { listings: [] };
      await this.write();
    }
  },

  async write() {
    await jsonfile.writeFile(file, this.data, { spaces: 2 });
  }
};

await db.read();
console.log('✅ Database ready!');
export default db;
