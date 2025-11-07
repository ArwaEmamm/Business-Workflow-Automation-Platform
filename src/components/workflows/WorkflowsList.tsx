import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState } from '../../app/store';
import { fetchWorkflows, deleteWorkflow } from '../../features/workflows/workflowsSlice';
import { Button, Table, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Workflow } from '../../types/workflow.types';

export const WorkflowsList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workflows, status, error } = useAppSelector((state: RootState) => state.workflows);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWorkflows());
    }
  }, [status, dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/workflows/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteWorkflow(id)).unwrap();
      message.success('Workflow deleted successfully');
    } catch (error) {
      message.error('Failed to delete workflow');
    }
  };

  const columns: ColumnsType<Workflow> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      key: 'steps',
      render: (steps) => steps.length,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record.id!)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id!)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="workflows-list">
      <div className="workflows-header">
        <h1>Workflows</h1>
        <Button type="primary" onClick={() => navigate('/workflows/create')}>
          Create New Workflow
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={Array.isArray(workflows) ? workflows : []}
        loading={status === 'loading'}
        rowKey="id"
      />
    </div>
  );
};