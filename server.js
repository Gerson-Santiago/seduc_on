/* ---------- server.js ---------- */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('==========================================');
  console.log(`🚀 Backend rodando em: http://localhost:${PORT}`);
  console.log('==========================================\n');

  console.log('🔗 URLs do Frontend:');
  console.log(`   • Home page: http://localhost:5173`);
  console.log(`   • Login page: http://localhost:5173/login\n`);

  console.log('==========================================');
});

