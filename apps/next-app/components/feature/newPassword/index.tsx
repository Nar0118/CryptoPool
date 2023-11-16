import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form } from 'antd';
import Button from 'components/shared/button';
import { ButtonType } from 'components/shared/button/type';
import Input from 'components/shared/input';
import Notification from 'components/shared/notification';
import Image from 'components/shared/image';
import Icon from 'components/shared/icon';
import { AuthServiceContext } from 'utils/services/service/authService';
import { imagesSvg } from 'utils/constants/imagesSrc';
import navBarPaths from 'utils/constants/navBarPaths';
import { warningModalContent } from 'utils/constants/fakeData';

import styles from './newPassword.module.scss';

export default function NewPassword(): JSX.Element {
  const router = useRouter();
  const authService = useContext(AuthServiceContext);
  const [form] = Form.useForm();

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(
    false
  );

  const onFinish = async (): Promise<void> => {
    const { password } = form.getFieldsValue();
    const email = router.asPath.split('=')[1];

    const res = await authService.updateForgottenPassword(password, email);

    if (res?.success) {
      Notification(res?.message, warningModalContent.acceptModalIcon);

      router.push(navBarPaths.login);
    } else {
      Notification(
        res?.error ?? 'Something went wrong, please try again',
        warningModalContent.filedModalIcon
      );
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
      <div className={styles.imageSection}>
        <div className={styles.whiteContainer}>
          <div className={styles.logoContainer}>
            <Image src={imagesSvg.cryptoPoolLogo} width="260" height="100" />
          </div>
          <div className={styles.titleSection}>
            <h1>Create New Password</h1>
            <span>
              Your new password must be having A capital, Small letter, Numeric
              and at least 8 in length, to make it strong.
            </span>
          </div>
          <div>
            <Form
              form={form}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className={styles.form}
            >
              <div className={styles.passwordContainer}>
                <div className={styles.formItem}>
                  <div className={styles.eyeIcon}>
                    <Icon
                      src={imagesSvg.hiddenIcon}
                      className={styles.eye}
                      width={23}
                      height={23}
                      onClick={() => {
                        setPasswordVisible((prevState) => !prevState);
                      }}
                    />
                  </div>
                  <Form.Item name="password">
                    <Input
                      className={styles.formInput}
                      type={passwordVisible ? 'text' : 'password'}
                      label="Enter New Password"
                    />
                  </Form.Item>
                </div>
                <div className={styles.formItem}>
                  <div className={styles.eyeIcon}>
                    <Icon
                      className={styles.eye}
                      src={imagesSvg.hiddenIcon}
                      width={23}
                      height={23}
                      onClick={() => {
                        setConfirmPasswordVisible((prevState) => !prevState);
                      }}
                    />
                  </div>
                  <Form.Item
                    name="confirm"
                    rules={[
                      {
                        required: true,
                        message: 'Passwords don’t match.',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error('Passwords don’t match.')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input
                      className={styles.formInput}
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      label="Confirm password"
                    />
                  </Form.Item>
                </div>
              </div>
              <Form.Item shouldUpdate className={styles.buttonItem}>
                {() => (
                  <Button
                    className={styles.buttonContainer}
                    text="Done"
                    htmlType="submit"
                    btnType={ButtonType.black}
                    disabled={isDisabled()}
                  />
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
