import { Request, Response } from 'express'
import authRoute from './src/route/routes'
// import userOrAdmin from './src/route/routes';
import cookieParser from 'cookie-parser';

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/auth', authRoute);
// app.use('/user-or-admin', userOrAdmin);
app.get('/hello-world', (req: Request, res: Response) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})