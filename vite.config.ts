import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { FRONTEND_PORT } from "../config"; 

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

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
      port: FRONTEND_PORT 
    },
  };
});