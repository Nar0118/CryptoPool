import { useContext, useState } from 'react';
import { Form, Radio } from 'antd';
import Input from 'components/shared/input';
import Notification from 'components/shared/notification';
import Icon from 'components/shared/icon';
import { InvoiceServiceContext } from 'utils/services/service/invoiceService';
import {
  invoiceItems,
  InvoiceItem,
  InvoiceItemType,
} from 'utils/constants/paymentsModal';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { warningModalContent } from 'utils/constants/fakeData';
import { InvoiceProps } from './types';

import styles from './invoice.module.scss';

export default function Invoice({
  setOpen,
  setOpenParentModal,
}: InvoiceProps): JSX.Element {
  const invoiceService = useContext(InvoiceServiceContext);
  const [form] = Form.useForm();

  const [currency, setCurrency] = useState<InvoiceItemType>(
    InvoiceItemType.Dollar
  );

  const onFinish = async (): Promise<void> => {
    const {
      name,
      emailId,
      walletAddress,
      amount,
      currency,
    } = form.getFieldsValue();

    const res = await invoiceService.sendInvoice({
      name,
      emailId,
      walletAddress,
      amount: { value: amount, currency },
    });

    Notification(
      res?.message,
      res.success
        ? warningModalContent.acceptModalIcon
        : warningModalContent.filedModalIcon
    );

    if (res?.success) {
      form.resetFields();
      setOpenParentModal?.(true);
      setOpen(false);
    }
  };

  const changeCurrency = (type: InvoiceItemType): void => {
    setCurrency(type);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1>Invoice</h1>
        <Icon src={imagesSvg.gradientLine} width={60} height={3} />
        <div>
          <Form
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please enter  Name',
                },
              ]}
            >
              <Input
                type="text"
                label="Name"
                className={styles.formElement}
                placeholder="Name of the person"
              />
            </Form.Item>
            <Form.Item
              name="emailId"
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
                label="Email Id"
                className={styles.formElement}
                placeholder="Personemailid@gmail.com"
              />
            </Form.Item>
            <Form.Item
              name="walletAddress"
              rules={[
                {
                  required: true,
                  message: 'Please enter  Wallet Address',
                },
              ]}
            >
              <Input
                type="text"
                label="Wallet Address"
                className={styles.formElement}
                placeholder="2MwxNhM96fey5BzNfyNvt..."
              />
            </Form.Item>
            <div className={styles.amountSection}>
              <Form.Item
                name="amount"
                rules={[
                  {
                    required: true,
                    message: 'Please enter  Amount',
                  },
                ]}
              >
                <Input
                  type="text"
                  label="Amount"
                  className={styles.formElementAmount}
                  placeholder="$245.56"
                />
              </Form.Item>
              <Form.Item
                name="currency"
                className={styles.formItem}
                initialValue={InvoiceItemType.Dollar}
              >
                <Radio.Group
                  name="currency"
                  defaultValue={InvoiceItemType.Dollar}
                  className={styles.currency}
                >
                  {invoiceItems.map(
                    (e: InvoiceItem, index: number): JSX.Element => (
                      <Radio.Button value={e.title}>
                        <div
                          key={index}
                          className={`${styles.conversionType} ${
                            currency === e.title && styles.activeConversion
                          }`}
                          onClick={() => changeCurrency(e.title)}
                        >
                          <Icon src={e.icon} width={25} height={25} />
                        </div>
                      </Radio.Button>
                    )
                  )}
                </Radio.Group>
              </Form.Item>
            </div>

            <Form.Item shouldUpdate>
              {() => (
                <button type="submit" className={styles.confirmButton}>
                  <div className={styles.invoiceConfirmButton}>
                    <h1>Send Invoice</h1>
                    <Icon src={imagesSvg.nextIcon} width={38} height={38} />
                  </div>
                </button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
