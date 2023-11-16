import { useContext, useState } from 'react';
import { Form } from 'antd';
import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Notification from 'components/shared/notification';
import { ButtonType } from 'components/shared/button/type';
import { AuthServiceContext } from 'utils/services/service/authService';
import { warningModalContent } from 'utils/constants/fakeData';

import styles from './changePassword.module.scss';

export default function ChangePassword(): JSX.Element {
  const authService = useContext(AuthServiceContext);
  const [form] = Form.useForm();

  const [errorPassword, setErrorPassword] = useState<string>();

  const onFinish = async (): Promise<void> => {
    const { oldPassword, newPassword } = form.getFieldsValue();

    try {
      const res = await authService.changePassword(oldPassword, newPassword);
      if (res.success) {
        Notification(
          'Your password has been successfully changed.',
          warningModalContent.acceptModalIcon
        );
      } else {
        setErrorPassword(res.error);
        Notification(res.error, warningModalContent.filedModalIcon);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isDisabled = (): boolean => {
    return (
      !form.isFieldsTouched(true) ||
      !!form.getFieldsError().filter(({ errors }) => errors.length).length
    );
  };

  return (
    <div className={styles.container}>
      <main>
        <div className={styles.title}>Change Password</div>
        <div className={styles.description}>
          Your new password must be different from previous one.
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ remember: true }}
          className={styles.form}
        >
          <div className={styles.oldPasswordContainer}>
            <Form.Item
              name="oldPassword"
              className={styles.inputContainer}
              rules={[
                {
                  required: true,
                  message: 'Entered password is wrong.',
                },
              ]}
            >
              <Input
                className={styles.oldPassword}
                type="password"
                label="Old Password*"
                placeholder="Enter old password"
              />
            </Form.Item>
            {errorPassword && (
              <div className={styles.oldPasswordError}>
                <span>{errorPassword}</span>
              </div>
            )}
          </div>
          <Form.Item
            name="newPassword"
            className={styles.inputContainer}
            rules={[
              {
                required: true,
                message: 'Entered password is wrong.',
              },
            ]}
          >
            <Input
              className={styles.input}
              type="password"
              label="New Password*"
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            className={styles.inputContainer}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('Password dont match.'));
                },
              }),
            ]}
          >
            <Input
              className={styles.input}
              type="password"
              label="Confirm password*"
              placeholder="Confirm password"
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                className={styles.submitButton}
                htmlType="submit"
                text="Submit"
                disabled={isDisabled()}
                btnType={ButtonType.black}
              />
            )}
          </Form.Item>
        </Form>
      </main>
    </div>
  );
}
