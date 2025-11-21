import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Space, Select, message, Card } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { WorkflowFormData } from '../../types/workflow.types';
import { defaultWorkflow } from '../../types/workflow.types';
import './WorkflowForm.css';

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
  navigate('/hr/workflows');
    } catch (error) {
      message.error(`Failed to ${isEdit ? 'update' : 'create'} workflow`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="workflow-form-wrapper">
      <Card className="workflow-form-card">
        <Form
          form={form}
          initialValues={initialValues}
          onFinish={handleSubmit}
          layout="vertical"
          className="workflow-form"
        >
          <Form.Item
            name="name"
            label={<span className="form-label">Workflow Name</span>}
            rules={[{ required: true, message: 'Please enter workflow name' }]}
          >
            <Input placeholder="Enter workflow name" className="form-input" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="form-label">Description</span>}
            rules={[{ required: true, message: 'Please enter workflow description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter workflow description" className="form-input" />
          </Form.Item>

          <div className="steps-section">
            <h3 className="steps-title">Workflow Steps</h3>
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
                    <Card key={key} className="step-card">
                      <div className="step-header">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-label">Step {index + 1}</span>
                      </div>
                      <Space align="baseline" style={{ width: '100%', gap: '16px', flexWrap: 'wrap' }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          rules={[{ required: true, message: 'Step title is required' }]}
                          style={{ flex: 1, minWidth: '250px' }}
                        >
                          <Input placeholder={`Step ${index + 1} title`} className="form-input" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'assignedRole']}
                          rules={[{ required: true, message: 'Role is required' }]}
                          style={{ minWidth: '150px' }}
                        >
                          <Select placeholder="Select Role" className="form-select">
                            <Select.Option value="manager">Manager</Select.Option>
                            <Select.Option value="hr_manager">HR Manager</Select.Option>
                          </Select>
                        </Form.Item>

                        {fields.length > 1 && (
                          <Button
                            danger
                            type="text"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            className="remove-step-btn"
                          />
                        )}
                      </Space>
                    </Card>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({ title: '', order: fields.length + 1, assignedRole: 'manager' })}
                      icon={<PlusOutlined />}
                      className="add-step-btn"
                    >
                      Add Step
                    </Button>
                  </Form.Item>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </div>

          <Form.Item className="form-actions">
            <Space>
              <Button className="form-submit-btn" type="primary" htmlType="submit" loading={isSubmitting} size="large">
                {isEdit ? 'Update' : 'Create'} Workflow
              </Button>
              <Button className="form-cancel-btn" onClick={() => navigate('/hr/workflows')} size="large">Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};