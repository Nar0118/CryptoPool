import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form } from 'antd';
import Image from 'components/shared/image';
import Input from 'components/shared/input';
import Button from 'components/shared/button';
import { ButtonType } from 'components/shared/button/type';
import Notification from 'components/feature/notification';
import Icon from 'components/shared/icon';
import { AuthServiceContext } from 'utils/services/service/authService';
import { imagesPng, imagesSvg } from 'utils/constants/imagesSrc';
import { notificationIcons } from 'utils/constants/buttons';

import styles from './login.module.scss';

export default function Login(): JSX.Element {
  const authService = useContext(AuthServiceContext);
  const router = useRouter();
  const [form] = Form.useForm();

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const onFinish = async (): Promise<void> => {
    const { email, password } = form.getFieldsValue();

    try {
      const res = await authService.login(email, password);
      if (res?.success) {
        router.push('/');
      } else {
        Notification(res.error, notificationIcons.fail);
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

  useEffect(() => {
    document.getElementById('__next').style.height = '100%';
  }, []);

  return (
    <div>
      <div className={styles.loginPage}>
        <div className={styles.bannerImage}>
          <Image src={imagesPng.loginPageBanner} width="830" height="750" />
        </div>
        <div className={styles.loginFormContainer}>
          <div className={styles.logoContainer}>
            <Image src={imagesSvg.websiteLogo} width="260" height="100" />
          </div>
          <div className={styles.loginHeader}>Login</div>
          <Form
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div className={styles.inputsContainer}>
              <Form.Item
                name="email"
                className={styles.formItem}
                rules={[
                  {
                    type: 'email',
                    message: 'Invalid Email. Please try again.',
                  },
                  {
                    required: true,
                    message: 'Please enter your email address.',
                  },
                ]}
              >
                <Input
                  type="email"
                  label="Username"
                  className={styles.formEmailInput}
                />
              </Form.Item>
              <div className={styles.formItem}>
                <div className={styles.eyeIcon}>
                  <Icon
                    src={imagesSvg.hiddenIcon}
                    className={styles.eye}
                    width={23}
                    height={23}
                    onClick={() => {
                      setPasswordVisible(!passwordVisible);
                    }}
                  />
                </div>
                <Form.Item
                  name="password"
                  className={styles.formItem}
                  rules={[
                    {
                      message: 'The input is not valid password!',
                    },
                    { required: true, message: 'Please enter your password.' },
                  ]}
                >
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    label="Password"
                    className={styles.formInput}
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item shouldUpdate>
              {() => (
                <Button
                  className={styles.loginButton}
                  text="Log In"
                  htmlType="submit"
                  disabled={isDisabled()}
                  btnType={ButtonType.black}
                />
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
