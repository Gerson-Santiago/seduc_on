/* ---------- server.js ---------- */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server backend http://localhost:${PORT}`);
  console.log(`Acessar login em: http://localhost:3001/aee`);
});

