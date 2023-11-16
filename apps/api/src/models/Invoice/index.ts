import * as mongoose from 'mongoose';
import { dateParser } from '../../util/helpers';

enum InvoiceCurrency {
  Dollar = 'Dollar',
  Rupee = 'Rupee',
}

const currentDate = dateParser(new Date());
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  amount: {
    value: { type: Number, required: true },
    currency: { type: String, enum: InvoiceCurrency, required: true },
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: currentDate,
  },
});

export const Invoice = mongoose.model('Invoice', invoiceSchema);
