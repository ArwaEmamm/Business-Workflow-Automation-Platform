import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState } from '../../app/store';
import {
  fetchRequests,
  setFilters,
  setPage,
  setPageSize,
  forceApproveRequest,
  forceRejectRequest
} from '../../features/requests/requestsSlice';
import { Button, Table, Space, Tag, Input, Select, DatePicker, message, Modal, Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Request, RequestFilters } from '../../types/request.types';
import { SearchOutlined, FilterOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const RequestsList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { requests, status, error, filters, total, page, pageSize } = useAppSelector((state: RootState) => state.requests);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchRequests(filters));
  }, [filters, dispatch]);

  const handleView = (id: string) => {
    navigate(`/hr/requests/${id}`);
  };

  const handleForceApprove = async (id: string) => {
    Modal.confirm({
      title: 'Force Approve Request',
      content: 'Are you sure you want to force approve this request? This will bypass the normal workflow.',
      onOk: async () => {
        try {
          await dispatch(forceApproveRequest(id)).unwrap();
          message.success('Request force approved successfully');
        } catch (error) {
          message.error('Failed to force approve request');
        }
      }
    });
  };

  const handleForceReject = async (id: string) => {
    Modal.confirm({
      title: 'Force Reject Request',
      content: 'Are you sure you want to force reject this request? This will bypass the normal workflow.',
      onOk: async () => {
        try {
          await dispatch(forceRejectRequest(id)).unwrap();
          message.success('Request force rejected successfully');
        } catch (error) {
          message.error('Failed to force reject request');
        }
      }
    });
  };

  const handleBulkApprove = () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: 'Bulk Force Approve',
      content: `Are you sure you want to force approve ${selectedRowKeys.length} requests?`,
      onOk: async () => {
        for (const id of selectedRowKeys) {
          try {
            await dispatch(forceApproveRequest(id as string)).unwrap();
          } catch (error) {
            message.error(`Failed to approve request ${id}`);
          }
        }
        message.success('Bulk approval completed');
        setSelectedRowKeys([]);
      }
    });
  };

  const handleBulkReject = () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: 'Bulk Force Reject',
      content: `Are you sure you want to force reject ${selectedRowKeys.length} requests?`,
      onOk: async () => {
        for (const id of selectedRowKeys) {
          try {
            await dispatch(forceRejectRequest(id as string)).unwrap();
          } catch (error) {
            message.error(`Failed to reject request ${id}`);
          }
        }
        message.success('Bulk rejection completed');
        setSelectedRowKeys([]);
      }
    });
  };

  const handleFilterChange = (key: keyof RequestFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
  };

  const handleDateRangeChange = (dates: any) => {
    const newFilters = {
      ...filters,
      dateFrom: dates?.[0]?.format('YYYY-MM-DD'),
      dateTo: dates?.[1]?.format('YYYY-MM-DD')
    };
    dispatch(setFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(setFilters({}));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const columns: ColumnsType<Request> = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span style={{ fontFamily: 'monospace' }}>{id.slice(-8)}</span>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Workflow',
      dataIndex: 'workflowName',
      key: 'workflowName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Current Step',
      dataIndex: 'currentStep',
      key: 'currentStep',
      render: (step, record) => {
        const currentStepData = record.steps.find(s => s.order === step);
        return currentStepData ? `${step}. ${currentStepData.title}` : step;
      }
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy) => createdBy.name
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record.id!)}>
            View
          </Button>
          <Button
            type="link"
            icon={<CheckCircleOutlined />}
            onClick={() => handleForceApprove(record.id!)}
            disabled={record.status === 'approved'}
          >
            Force Approve
          </Button>
          <Button
            type="link"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleForceReject(record.id!)}
            disabled={record.status === 'rejected'}
          >
            Force Reject
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="requests-list">
      <div className="requests-header">
        <h1>Requests Management</h1>
        <Space>
          {selectedRowKeys.length > 0 && (
            <>
              <Button type="primary" onClick={handleBulkApprove}>
                Bulk Approve ({selectedRowKeys.length})
              </Button>
              <Button danger onClick={handleBulkReject}>
                Bulk Reject ({selectedRowKeys.length})
              </Button>
            </>
          )}
          <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
            Filters
          </Button>
        </Space>
      </div>

      {showFilters && (
        <div className="filters-section" style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Space wrap>
            <Input
              placeholder="Search by title or ID"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <RangePicker
              onChange={handleDateRangeChange}
              value={filters.dateFrom && filters.dateTo ? [dayjs(filters.dateFrom), dayjs(filters.dateTo)] : undefined}
            />
            <Button onClick={clearFilters}>Clear Filters</Button>
          </Space>
        </div>
      )}

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={requests}
        loading={status === 'loading'}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (page, pageSize) => {
            dispatch(setPage(page));
            dispatch(setPageSize(pageSize));
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </div>
  );
};
