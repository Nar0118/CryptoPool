import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Form } from 'antd';
import Icon from 'components/shared/icon';
import Image from 'components/shared/image';
import Input from 'components/shared/input';
import Button from 'components/shared/button';
import Link from 'components/shared/link';
import Notification from 'components/shared/notification';
import { ButtonType } from 'components/shared/button/type';
import { AuthServiceContext } from 'utils/services/service/authService';
import { imagesSvg } from 'utils/constants/imagesSrc';
import navBarPaths from 'utils/constants/navBarPaths';
import { warningModalContent } from 'utils/constants/fakeData';
import { AuthorizationPasswordProps, PageType } from './types';

import styles from './authorizationPassword.module.scss';

export default function AuthorizationPassword({
  pageType = PageType.RESET_PASSWORD,
}: AuthorizationPasswordProps): JSX.Element {
  const router = useRouter();
  const [form] = Form.useForm();
  const authService = useContext(AuthServiceContext);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [emailSentSuccessfully, setEmailSentSuccessfully] = useState<boolean>(
    false
  );

  const onFinishCode = async (): Promise<void> => {
    const email = router?.query?.email;
    const { emailVerificationCode } = form.getFieldsValue();
    const res = await authService.checkVerificationCode(
      emailVerificationCode,
      email
    );
    if (res?.success) {
      router.push(`${navBarPaths.createNewPassword}?email=${email}`);
    } else {
      setErrorMessage(res?.message);
    }
  };

  const onFinishMail = async (): Promise<void> => {
    const { email } = form.getFieldsValue();
    const res = await authService.sendRecoverPasswordEmail(email);
    if (res?.success) {
      router.push(`${navBarPaths.checkMail}?email=${email}`);
    } else {
      Notification(res?.error, warningModalContent.filedModalIcon);
    }
    setEmailSentSuccessfully(res?.success);
  };

  const isDisabled = (): boolean => {
    return (
      emailSentSuccessfully ||
      !form.isFieldsTouched(true) ||
      !!form.getFieldsError().filter(({ errors }) => errors.length).length
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.whiteContainer}>
          <div className={styles.logoContainer}>
            <Image
              src={imagesSvg.cryptoPoolLogo}
              onClick={() => router.push(navBarPaths.login)}
              width="260"
              height="100"
            />
          </div>
          <div className={styles.titleSection}>
            <div className={styles.titleIconContainer}>
              <h1>
                {pageType === PageType.RESET_PASSWORD
                  ? 'Reset Password'
                  : 'Check Your Mail'}
              </h1>
              {pageType === PageType.CHECK_EMAIL && (
                <Icon src={imagesSvg.checkMail} width={25} height={25} />
              )}
            </div>
            <span>
              {pageType === PageType.RESET_PASSWORD
                ? 'Enter the email associated with your account and we’ll send an email with a code to reset your password'
                : 'We have sent a password reset code to your email, please enter that below and Create a New Password'}
            </span>
          </div>
          <div>
            <Form
              form={form}
              initialValues={{ remember: true }}
              onFinish={
                pageType === PageType.RESET_PASSWORD
                  ? onFinishMail
                  : onFinishCode
              }
              className={styles.form}
            >
              <div>
                <Form.Item
                  name={
                    pageType === PageType.RESET_PASSWORD
                      ? 'email'
                      : 'emailVerificationCode'
                  }
                  className={styles.formItem}
                  rules={[{ required: true, message: errorMessage }]}
                  validateStatus={errorMessage ? 'error' : ''}
                >
                  <Input
                    type={
                      pageType === PageType.RESET_PASSWORD ? 'email' : 'number'
                    }
                    label={
                      pageType === PageType.RESET_PASSWORD
                        ? 'Email Address'
                        : 'Code'
                    }
                    className={styles.formInput}
                  />
                </Form.Item>
                {errorMessage && (
                  <span className={styles.errorMessage}>{errorMessage}</span>
                )}
              </div>
              <Form.Item shouldUpdate className={styles.buttonItem}>
                {() => (
                  <Button
                    className={styles.buttonContainer}
                    text={
                      pageType === PageType.RESET_PASSWORD
                        ? 'Send Code'
                        : 'Next'
                    }
                    htmlType="submit"
                    disabled={isDisabled()}
                    btnType={ButtonType.blue}
                  />
                )}
              </Form.Item>
              <div className={styles.linkSection}>
                <p>Don't have an account</p>
                <Link href={navBarPaths.signUp} text="Signup" />
              </div>
              <div className={styles.moreInfo}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                aliquip ex ea commodo consequat.
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
