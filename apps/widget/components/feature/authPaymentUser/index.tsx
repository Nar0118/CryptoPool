import { FC, useContext } from 'react';
import { Form } from 'antd';
import Input from 'components/shared/input';
import Button from 'components/shared/button';
import Notification from 'components/shared/notification';
import { ButtonType } from 'components/shared/button/type';
import AuthPaymentProps from 'components/feature/authPaymentUser/types';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { AuthPaymentServiceContext } from 'utils/services/service/authPaymentService';
import { useModalContext } from 'utils/context/modal/context';
import env from 'utils/constants/env';

import styles from './authorization.module.scss';

const AuthPaymentUser: FC<AuthPaymentProps> = ({
  setIsLogin,
  updateWalletData,
  merchantId,
}): JSX.Element => {
  const { setModal } = useModalContext();
  const authPaymentService = useContext(AuthPaymentServiceContext);

  const registerPaymentUser = async (value): Promise<void> => {
    const { email, amount } = value;

    const data = await authPaymentService.login(email, amount, merchantId);

    if (data.success === false) {
      Notification(data.error);
    } else {
      await updateWalletData(data);
      setIsLogin(data);
      setModal({ hide: false, index: 1 });
    }
  };

  return (
    <div className={styles.authorizationPage}>
      <div className={styles.loginPage}>
        <div className={styles.loginFormContainer}>
          <div className={styles.authHeader}>
            <div className={styles.logoContainer}>
              <Icon src={imagesSvg.logoSmall} width="180" height="60" />
            </div>
          </div>
          <Form
            autoComplete="off"
            initialValues={{ remember: true }}
            onFinish={registerPaymentUser}
          >
            <div className={styles.inputsContainer}>
              <Form.Item
                name="email"
                className={styles.formItem}
                rules={[
                  {
                    type: 'email',
                    message: 'Invalid email please try again',
                  },
                  {
                    required: true,
                    message: 'Please enter your email address',
                  },
                ]}
              >
                <Input
                  type="email"
                  label="Email Id"
                  placeholder="Your email id on which we should send Invoice"
                  className={styles.formInput}
                />
              </Form.Item>
              <Form.Item
                name="amount"
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                    message: 'Please enter just number',
                  },
                ]}
              >
                <Input
                  label="Amount(In USD)"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value <= 10) {
                      e.target.setCustomValidity(
                        'Value must be greater than 10'
                      );
                    } else {
                      e.target.setCustomValidity('');
                    }
                  }}
                  type="number"
                  step="any"
                  placeholder="Please enter the amount you want to pay in USD(only integers)."
                  className={`${styles.formInput} ${styles.formAmountInput}`}
                />
              </Form.Item>
            </div>

            <Form.Item shouldUpdate className={styles.buttonItem}>
              {() => (
                <Button
                  className={styles.loginButton}
                  text="Submit"
                  htmlType="submit"
                  btnType={ButtonType.blue}
                />
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={styles.creatorInfo}>
        <span>Powered by CryptoPool</span>
        <a href={`mailto:${env.supportEmailAddress}`}>Help & Support</a>
      </div>
    </div>
  );
};

export default AuthPaymentUser;
