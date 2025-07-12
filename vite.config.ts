import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
  const envFile = `.env.${mode}`;
  dotenv.config({ path: envFile });

  const isProduction = mode === 'production';
  const FRONTEND_PORT = parseInt(process.env.VITE_FRONTEND_PORT, 10);

  return {
    plugins: [react()],
    define: {
      'process.env': process.env,
    },
    server: {
      allowedHosts: isProduction ? ['spotwise.cs.colman.ac.il'] : 'all',
      host: '0.0.0.0',
      https: isProduction
        ? {
          key: fs.readFileSync(path.resolve(__dirname, 'cert/myserver.key')),
          cert: fs.readFileSync(path.resolve(__dirname, 'cert/CSB.crt')),
        }
        : false,
      port: FRONTEND_PORT,
    },
  };
});

