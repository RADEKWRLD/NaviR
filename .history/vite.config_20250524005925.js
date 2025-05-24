import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/Cert/key.pem')), 
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/Cert/cert.pem')),
    },
    host: '0.0.0.0'
  }
});

