import { Socket } from 'socket.io';
import {
  checkChildWalletBalancePbp,
  checkChildWalletBalance,
} from '../User/User.api.handlers';
import env from '../../util/constants/env';

export const initializeSockets = (io): void => {
  io.on('connection', (socket: Socket): void => {
    console.log('A user connected');

    socket.on('childWallet', (data): void => {
      setInterval(() => {
        env.isPbpay
          ? checkChildWalletBalancePbp(socket, data)
          : checkChildWalletBalance(socket, data);
      }, 6000);
    });

    socket.on('disconnect', (): void => {
      console.log('A user disconnected');
    });
  });
};
