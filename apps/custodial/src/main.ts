import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import WalletRouter from '../src/api/WalletManager';
import env from './util/constants/env';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);
app.use(cookieParser());

mongoose.connect(env.databaseConnectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: true,
});

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use('/wallets', WalletRouter);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
