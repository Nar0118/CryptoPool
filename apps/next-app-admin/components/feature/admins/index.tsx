import { useContext, useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import Modal from 'components/shared/modal';
import Input from 'components/shared/input';
import Loader from 'components/shared/loader';
import Button from 'components/shared/button';
import WarningModal from 'components/shared/warningModal';
import PageTable from 'components/shared/table';
import notification from 'components/shared/notification';
import { ButtonType } from 'components/shared/button/type';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { acceptWarningModal, handelCancel } from 'utils/helpers';
import { AdminServiceContext } from 'utils/services/service/adminService';
import { Admin } from 'types/admin';
import { handleValidation, validator } from 'utils/constants/validation';
import { UserRoles } from 'utils/constants/userRoles';
import { isDisabled } from 'utils/constants/companyValidation';
import { ModalType } from 'utils/constants/enum';

import styles from './admins.module.scss';

export default function Admins(): JSX.Element {
  const adminService = useContext(AdminServiceContext);

  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const [limit, setLimit] = useState<number>(10);
  const [admins, setAdmins] = useState<Array<Admin>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin>();
  const [defaultAdmin, setDefaultAdmin] = useState<Admin>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [warningModalVisible, setWarningModalVisible] = useState<boolean>(
    false
  );
  const [admin, setAdmin] = useState<Admin>(null);
  const [defaultCreateFormValue, setDefaultCreateFormValue] = useState<Admin>();
  const [passwordError, setPasswordErr] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);
  const [modalType, setModalType] = useState<ModalType>();

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      tooltip: true,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      tooltip: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      tooltip: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      tooltip: true,
      width: '100px',
    },
    {
      width: '100px',
      key: 'changeRole',
      tooltip: true,
      render: (admin: Admin) => (
        <div className={styles.buttonsContainer}>
          <Button
            isUpdatedButton={true}
            onClick={() => handleEdit(admin)}
            btnType={ButtonType.edit}
            iconSrc={imagesSvg.editIcon}
          />
          <Button
            isUpdatedButton={true}
            onClick={() => removeAdmin(admin)}
            btnType={ButtonType.delete}
            iconSrc={imagesSvg.deleteIcon}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllAdmins();
  }, [limit]);

  const getAllAdmins = async (): Promise<void> => {
    const res = await adminService.getAllAdmins(
      limit,
      limit * (currentPage - 1)
    );

    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count));
      setAdmins(res?.data);
      setFirstRefresh(false);
    }
  };

  const setWarningModalVisibility = (): void => {
    setWarningModalVisible(!warningModalVisible);
  };

  const handleWarningModal = (): void => {
    acceptWarningModal(
      setWarningModalVisibility,
      modalType === ModalType.CREATE
        ? setCreateModalVisibility
        : setUpdateModalVisibility
    );
    createForm.resetFields();
  };

  const handleFormCancel = (value: boolean): void => {
    value
      ? handelCancel(
          defaultCreateFormValue,
          createForm.getFieldsValue(),
          setCreateModalVisibility,
          setWarningModalVisibility
        )
      : handelCancel(
          defaultAdmin,
          selectedAdmin,
          setUpdateModalVisibility,
          setWarningModalVisibility
        );
  };

  const handleEdit = (admin: Admin): void => {
    setDefaultAdmin({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
    });

    setSelectedAdmin({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
    });

    setUpdateModalVisibility();
  };

  const removeAdmin = (admin: Admin = null): void => {
    setAdmin(admin);
  };

  useEffect(() => {
    editForm.resetFields();
  }, [modalVisible]);

  const disableButton = useMemo((): boolean => {
    return (
      defaultAdmin?.role === selectedAdmin?.role &&
      defaultAdmin?.fullName === selectedAdmin?.fullName
    );
  }, [selectedAdmin]);

  const setUpdateModalVisibility = (): void => {
    setModalType(ModalType.EDIT);
    setModalVisible(!modalVisible);
  };

  const setCreateModalVisibility = (): void => {
    setModalType(ModalType.CREATE);
    setModalVisible(!modalVisible);
    if (!modalVisible) {
      const myTimeout = setTimeout(() => {
        setDefaultCreateFormValue(createForm.getFieldsValue());
        clearTimeout(myTimeout);
      }, 100);
    }
  };

  const handleEditAdmin = async (): Promise<void> => {
    const updatedAdmin = await adminService.updateAdmin(selectedAdmin);
    if (updatedAdmin?.success) {
      notification({
        messageType: 'success',
        message: 'Success',
        description: 'Admin successfully updated',
      });

      const foundAdmin = admins.find(
        (admin: Admin) => admin._id === updatedAdmin.data._id
      );
      const foundAdminIndex = admins.indexOf(foundAdmin);
      const newArray = [...admins];
      newArray[foundAdminIndex] = updatedAdmin.data;
      setAdmins(newArray);
    } else {
      notification({
        messageType: 'error',
        message: 'Oops!',
        description: 'Something went wrong, please try again.',
      });
    }
    setUpdateModalVisibility();
  };

  const handleCreateAdmin = async (): Promise<void> => {
    const { fullName, email, password } = createForm.getFieldsValue();
    const createdAdmin = await adminService.createAdmin(
      fullName,
      email,
      password
    );
    if (createdAdmin?.success) {
      notification({
        messageType: 'success',
        message: 'Success',
        description: createdAdmin?.message,
      });
      getAllAdmins();
    } else {
      notification({
        messageType: 'error',
        message: 'Oops!',
        description: createdAdmin?.message,
      });
    }
    createForm.resetFields();
    setCreateModalVisibility();
  };

  const handleDeleteAdmin = async (id: string) => {
    const isDeleted = await adminService.deleteAdmin(id);

    if (isDeleted) {
      notification({
        messageType: 'success',
        message: 'Success',
        description: 'Admin successfully deleted',
      });
      const arr = [...admins];
      const index = arr.indexOf(arr.find((item: Admin) => item._id === id));
      arr.splice(index, 1);
      setAdmins(arr);
      removeAdmin();
    } else {
      notification({
        messageType: 'error',
        message: 'Oops!',
        description: 'Something went wrong, please try again.',
      });
    }
  };

  return admins.length || !firstRefresh ? (
    <div className={styles.container}>
      <WarningModal
        onCancel={() => removeAdmin()}
        onAccept={() => handleDeleteAdmin(admin?._id)}
        visible={!!admin}
        messageTitle={`Are you sure you want to delete ${admin?.email} admin`}
      />
      <div className={styles.headerText}>
        <h1>Admins</h1>
      </div>
      <PageTable
        columns={columns}
        dataSource={admins}
        limit={limit}
        creatingItem="Admin"
        countOfPage={countOfPage}
        setCreateModalVisibility={setCreateModalVisibility}
        setCurrentPage={setCurrentPage}
        setLimit={setLimit}
      />
      <Modal
        title={modalType === ModalType.EDIT ? 'Edit Admin' : 'Create Admin'}
        bodyStyle={{ overflow: 'auto' }}
        isModalVisible={modalVisible}
        className={styles.modal}
        onCancel={() => handleFormCancel(!(modalType === ModalType.EDIT))}
      >
        <WarningModal
          messageTitle="Are you sure you want to close this Modal?"
          visible={warningModalVisible}
          onAccept={handleWarningModal}
          onCancel={setWarningModalVisibility}
        />
        {modalType === ModalType.EDIT && (
          <Form
            layout="vertical"
            className={styles.editAdmin}
            form={editForm}
            initialValues={{
              fullName: selectedAdmin?.fullName,
              email: selectedAdmin?.email,
            }}
            onFinish={handleEditAdmin}
          >
            <div className={styles.adminInfo}>
              {selectedAdmin?.email && (
                <div className={styles.infoRows}>
                  <span className={styles.labelModal}>Email: </span>
                  <span>{selectedAdmin?.email}</span>
                </div>
              )}
            </div>
            <Form.Item
              name="fullName"
              label="Full Name"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: 'Please enter Full Name',
                },
                {
                  validator: (_, value) => validator(_, value),
                },
              ]}
            >
              <Input
                placeholder="Enter Full Name"
                onChange={(e) => {
                  setSelectedAdmin({
                    ...selectedAdmin,
                    fullName: e,
                  });
                }}
              />
            </Form.Item>
            <Form.Item>
              <div className={styles.modalButtonsContainer}>
                <Button
                  className={styles.modalButtons}
                  text="Edit user"
                  htmlType="submit"
                  disabled={disableButton}
                  btnType={ButtonType.black}
                />
                <Button
                  className={styles.modalButtons}
                  onClick={() => handleFormCancel(false)}
                  text="Cancel"
                  btnType={ButtonType.black}
                />
              </div>
            </Form.Item>
          </Form>
        )}
        {modalType === ModalType.CREATE && (
          <Form
            layout="vertical"
            form={createForm}
            initialValues={{
              remember: true,
              role: UserRoles.MERCHANT,
            }}
            onFinish={handleCreateAdmin}
          >
            <div className={styles.inputsContainer}>
              <Form.Item
                name="fullName"
                label="Full Name"
                className={styles.formItem}
                rules={[
                  {
                    required: true,
                    message: 'Please input Full Name',
                  },
                  {
                    validator: (_, value) => validator(_, value),
                  },
                ]}
              >
                <Input placeholder="Enter Full Name" />
              </Form.Item>
              <Form.Item
                name="email"
                className={styles.formItem}
                validateStatus="success"
                label="Email"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    type: 'email',
                    message: 'Please enter valid email address.',
                  },
                  { required: true, message: 'Please input your Email!' },
                ]}
              >
                <Input type="email" placeholder="namesurname@mail.com" />
              </Form.Item>
              <div className={styles.passwordContainer}>
                <Form.Item
                  name="password"
                  label="Password"
                  className={styles.formItem}
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (passwordSuccess) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(passwordError));
                      },
                    }),
                    { required: true, message: 'Please input your Password!' },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) =>
                      handleValidation(e, setPasswordErr, setPasswordSuccess)
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <div className={styles.buttonSection}>
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    className={styles.submitButton}
                    htmlType="submit"
                    text="Submit"
                    disabled={isDisabled(createForm)}
                    btnType={ButtonType.black}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  className={styles.rightButton}
                  text="Cancel"
                  onClick={() => handleFormCancel(true)}
                  btnType={ButtonType.white}
                />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  ) : (
    <Loader />
  );
}
