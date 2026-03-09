import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'file-writer',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              try {
                // Ensure the directory exists
                const dbPath = path.resolve(__dirname, 'src/data/store.json');
                fs.writeFileSync(dbPath, body);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})