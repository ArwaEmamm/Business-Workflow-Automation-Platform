import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox, message } from 'antd';
import { endpoints } from '../../api/apiEndpoints';
import type { WorkflowFormData } from '../../types/workflow.types';

const { Option } = Select;

interface UserFormProps {
  user: any | null;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ name: user.name, email: user.email, role: user.role, department: user.department, isActive: user.isActive });
    } else {
      form.resetFields();
    }
  }, [user]);

  const handleFinish = async (values: any) => {
    try {
      // basic unique email client-side check could be added by fetching users, skipped here to keep simple
      const method = user ? 'PUT' : 'POST';
      const url = user ? endpoints.users.update(user.id) : endpoints.users.create;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }, body: JSON.stringify(values) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save user');
      }
      message.success('Saved');
      onClose();
    } catch (err) {
      message.error((err as Error).message || 'Failed');
    }
  };

  return (
    <Modal title={user ? 'Edit User' : 'Create User'} open onCancel={onClose} onOk={() => form.submit()}>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isActive: true }}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name required' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
          <Input />
        </Form.Item>
        {!user && (
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 8, message: 'Password at least 8 chars' }]}>
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role required' }]}>
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="manager">Manager</Option>
            <Option value="employee">Employee</Option>
          </Select>
        </Form.Item>
        <Form.Item name="department" label="Department">
          <Input />
        </Form.Item>
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Active</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
