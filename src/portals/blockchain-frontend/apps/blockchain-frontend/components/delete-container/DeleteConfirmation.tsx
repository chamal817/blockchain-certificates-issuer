import React from 'react';
import {message, Modal } from 'antd';
import { deleteById } from 'apps/blockchain-frontend/api/fetchData';
import {ExclamationCircleOutlined } from '@ant-design/icons/lib/icons';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteConfirmation = ({ itemName, id }) => {
  const handleDelete = () => {
    Modal.confirm({
      title: `Are you sure you want to delete this ${itemName}?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteById(id,itemName).then((success) => {
          if (success) {
            message.success(`${itemName} deleted successfully`);
          } else {
            message.error(`Failed to delete ${itemName}`);
          }
        });
      },
      onCancel() { },
    });
  };

  return (
    <>
      <DeleteOutlined
        onClick={handleDelete}
        style={{ color: 'red', marginLeft: 4 }}
      />
    </>
  );
};

export default DeleteConfirmation;
