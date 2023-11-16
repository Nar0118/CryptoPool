import * as mongoose from 'mongoose';

export enum UserRoles {
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

const Schema = mongoose.Schema;
const adminSchema = new Schema({
  fullName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: null,
    select: false,
  },
  role: {
    type: String,
    default: UserRoles.ADMIN,
    required: true,
    immutable: true,
  },
});

export const Admin = mongoose.model('Admin', adminSchema);
