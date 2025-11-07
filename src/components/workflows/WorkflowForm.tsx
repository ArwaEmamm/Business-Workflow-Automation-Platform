import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Space, Select, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { WorkflowFormData } from '../../types/workflow.types';
import { defaultWorkflow } from '../../types/workflow.types';

interface WorkflowFormProps {
  initialValues?: WorkflowFormData;
  onSubmit: (values: WorkflowFormData) => Promise<void>;
  isEdit?: boolean;
}

export const WorkflowForm = ({ initialValues = defaultWorkflow, onSubmit, isEdit = false }: WorkflowFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: WorkflowFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      message.success(`Workflow ${isEdit ? 'updated' : 'created'} successfully`);
      navigate('/admin/workflows');
    } catch (error) {
      message.error(`Failed to ${isEdit ? 'update' : 'create'} workflow`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={handleSubmit}
      layout="vertical"
      className="workflow-form"
    >
      <Form.Item
        name="name"
        label="Workflow Name"
        rules={[{ required: true, message: 'Please enter workflow name' }]}
      >
        <Input placeholder="Enter workflow name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter workflow description' }]}
      >
        <Input.TextArea rows={4} placeholder="Enter workflow description" />
      </Form.Item>

      <Form.List
        name="steps"
        rules={[
          {
            validator: async (_: any, steps: any[]) => {
              if (!steps || steps.length < 1) {
                return Promise.reject(new Error('At least one step is required'));
              }
            },
          },
        ]}
      >
        {(fields: any[], { add, remove }: { add: (defaultValue?: any) => void; remove: (index: number) => void }, { errors }: { errors: React.ReactNode[] }) => (
          <>
            {fields.map(({ key, name, ...restField }: any, index: number) => (
              <div key={key} className="step-form-item">
                <Space align="baseline" style={{ width: '100%', gap: '16px' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                    rules={[{ required: true, message: 'Step title is required' }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={`Step ${index + 1} title`} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'assignedRole']}
                    rules={[{ required: true, message: 'Role is required' }]}
                  >
                    <Select style={{ width: 120 }}>
                      <Select.Option value="manager">Manager</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                    </Select>
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )}
                </Space>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add({ title: '', order: fields.length + 1, assignedRole: 'manager' })}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                Add Step
              </Button>
            </Form.Item>
            <Form.ErrorList errors={errors} />
          </>
        )}
      </Form.List>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isEdit ? 'Update' : 'Create'} Workflow
          </Button>
          <Button onClick={() => navigate('/admin/workflows')}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};