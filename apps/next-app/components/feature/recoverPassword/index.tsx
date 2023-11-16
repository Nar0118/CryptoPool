import { useContext, useState } from 'react';
import { Form } from 'antd';
import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Notification from 'components/shared/notification';
import { AuthServiceContext } from 'utils/services/service/authService';
import { warningModalContent } from 'utils/constants/fakeData';
import { ButtonType } from 'components/shared/button/type';

import styles from './recoverPassword.module.scss';

export default function RecoverPassword(): JSX.Element {
  const authService = useContext(AuthServiceContext);

  const [form] = Form.useForm();

  const [resendEmail, setResendEmail] = useState<string>();
  const [emailSentSuccessfully, setEmailSentSuccessfully] = useState<boolean>(
    false
  );

  const onFinish = async (): Promise<void> => {
    const { email } = form.getFieldsValue();

    const res = await authService.sendRecoverPasswordEmail(
      email ?? resendEmail
    );

    if (res?.success) {
      Notification(res.message, warningModalContent.acceptModalIcon);
    } else {
      Notification(
        res?.error ?? 'Something went wrong, please try again',
        warningModalContent.filedModalIcon
      );
    }

    setEmailSentSuccessfully(res?.success);
    setResendEmail(email ?? resendEmail);
  };

  const isDisabled = (): boolean => {
    return (
      !form.isFieldsTouched(true) ||
      !!form.getFieldsError().filter(({ errors }) => errors.length).length
    );
  };

  return (
    <div className={styles.container}>
      <h2>Recover Password</h2>
      {!emailSentSuccessfully ? (
        <p>
          Enter your account Email. We'll send you a link to recover your
          account.
        </p>
      ) : (
        <p>An email has been sent. Please click the link when you get it.</p>
      )}
      {!emailSentSuccessfully ? (
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className={styles.emailContainer}>
            <Form.Item
              name="email"
              className={styles.formItem}
              validateStatus="success"
              rules={[
                {
                  type: 'email',
                  message: 'Please enter valid email address!',
                },
                {
                  required: true,
                  message: 'Please enter your email address',
                },
              ]}
            >
              <Input
                type="email"
                className={styles.formEmailInput}
                placeholder="Enter Email"
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  text="Send Email"
                  htmlType="submit"
                  className={styles.sendEmail}
                  disabled={isDisabled()}
                  btnType={ButtonType.black}
                />
              )}
            </Form.Item>
          </div>
        </Form>
      ) : (
        <Button
          text="Resend Email"
          onClick={onFinish}
          className={styles.button}
          btnType={ButtonType.black}
        />
      )}
    </div>
  );
}
