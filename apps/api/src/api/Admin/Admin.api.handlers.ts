import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { MailOptions, sendEmail } from '../../util/email/email.util.nodemailer';
import { UserRoles } from '../../models/User';
import { Admin } from '../../models/Admin';
import env from '../../util/constants/env';

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const adminsCount = await Admin.collection.countDocuments();
    const admins = await Admin.find().skip(offset).limit(limit);

    return res.send({ data: admins, count: adminsCount });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const getCurrentAdmin = async (req: Request, res: Response) => {
  try {
    const admin = req['admin'];

    if (!admin) {
      return res.json({ success: false, error: 'Admin does not exist!' });
    }

    return res.send({ success: true, data: admin });
  } catch (err) {
    res.send({ success: false, error: err });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    const isAdminExist = await Admin.findOne({
      email,
    });

    if (isAdminExist) {
      return res.json({ success: false, message: `${email} already exist` });
    }

    const admin = await Admin.create({
      fullName,
      email,
      password,
    });

    return res.json({
      success: true,
      message: `${email} successfully created`,
      data: admin,
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const loginForAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        error: 'Submit all required parameters',
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.json({
        success: false,
        error: `Account with ${email} doesn't exist`,
      });
    }

    if (admin.role !== UserRoles.ADMIN) {
      return res.json({
        success: false,
        error: `Only admin can log in to the Admin dashboard`,
      });
    }

    if (password !== admin.password) {
      return res.json({ success: false, error: 'Wrong password' });
    }

    admin.password = undefined;
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      env.secretJwtCode
    );

    return res.json({ success: true, token, admin });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const updateAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.json({ success: false, error: 'Admin does not exist!' });
    }

    admin.email = email;
    admin.fullName = fullName;

    await admin.save();
    return res.send({ success: true, data: admin });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Admin.deleteOne({ _id: id });

    return res.send({ success: true });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const signupForAdmin = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  if (!email || !password || !fullName) {
    return res.json({
      success: false,
      error: 'Submit all required parameters',
    });
  }

  try {
    const registeredAdmin = await Admin.findOne({ email }).select('+password');
    if (registeredAdmin)
      return res.json({ success: false, error: 'You already have an account' });

    const admin = await Admin.create({
      fullName,
      email,
      password,
    });

    const token = jwt.sign({ id: admin._id, email }, env.secretJwtCode);

    const mailOptions: MailOptions = {
      to: email,
      subject: 'You have successfully registered in CryptoPool as Admin',
      text: 'Welcome to CryptoPool',
    };

    await sendEmail(mailOptions);
    return res.json({ success: true, token, admin });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
