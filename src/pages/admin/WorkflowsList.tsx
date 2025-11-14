import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { workflowsApi } from '../../features/workflows/workflowsAPI';
import type { Workflow } from '../../types/workflow.types';
import WorkflowDetail from './WorkflowDetail';
import './Workflows.css';

const WorkflowsList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const navigate = useNavigate();

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workflowsApi.getAll();
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Workflow fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workflows';
      message.error(errorMessage);
      setError(errorMessage);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  
  const handleView = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setModalVisible(true);
  };

  const handleEdit = (workflow: Workflow) => {
    const id = (workflow as any).id ?? (workflow as any)._id;
    if (!id) {
      message.error('Cannot edit workflow: missing id');
      return;
    }
  navigate(`/hr/workflows/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await workflowsApi.delete(id);
      message.success('Workflow deleted successfully');
      fetchWorkflows();
    } catch (err) {
      message.error('Failed to delete workflow');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedWorkflow(null);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Workflow, b: Workflow) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      key: 'steps',
      render: (steps: any[]) => steps?.length || 0,
    },
    {
      title: 'Created By',
      key: 'createdBy',
      render: (_: any, record: Workflow) => {
        const name = typeof record.createdBy === 'object' 
          ? record.createdBy.name 
          : (record.createdBy || 'Unknown');
        return name;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
      sorter: (a: Workflow, b: Workflow) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Workflow) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this workflow?"
            onConfirm={() => handleDelete((record as any).id ?? (record as any)._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="workflows-page">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Workflows</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/hr/workflows/create')}
        >
          Create Workflow
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={workflows}
        rowKey={record => (record as any).id ?? (record as any)._id ?? Math.random().toString()}
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} workflows`,
        }}
      />

      {selectedWorkflow && (
        <WorkflowDetail
          workflow={selectedWorkflow}
          visible={modalVisible}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default WorkflowsList;
