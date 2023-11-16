import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import UserRouter from './api/User';
import UserPaymentRouter from './api/UserPayment';
import AdminRouter from './api/Admin';
import OrderRouter from './api/Order';
import InvoiceRouter from './api/Invoice';
import PaymentRouter from './api/Payment';
import TransactionRouter from './api/Transaction';
import { initializeSockets } from './api/socket';
import env from './util/constants/env';
import WalletRouter from './api/Wallet';

const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);
app.use(cookieParser());

// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require('http').Server(app);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initializeSockets(io);

mongoose.connect(env.databaseConnectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: true,
});

app.use('/users', UserRouter);
app.use('/user-payments', UserPaymentRouter);
app.use('/admins', AdminRouter);
app.use('/orders', OrderRouter);
app.use('/invoices', InvoiceRouter);
app.use('/payments', PaymentRouter);
app.use('/transactions', TransactionRouter);
app.use('/wallets', WalletRouter);

http.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
