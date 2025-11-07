import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Space, Tag, message, Select, DatePicker, Input } from 'antd';
import { endpoints } from '../../api/apiEndpoints';
import type { ColumnsType } from 'antd/es/table';
import RequestDetail from './RequestDetail';
import { useNavigate } from 'react-router-dom';
const { RangePicker } = DatePicker;
const { Option } = Select;

interface RequestItem {
  id: string;
  title: string;
  workflowId?: string;
  workflowName?: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  currentStep?: string;
  createdBy?: { id?: string; name?: string } | string;
  createdAt?: string;
  [key: string]: any;
}

const RequestsList: React.FC = () => {
  const [data, setData] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activeRequest, setActiveRequest] = useState<RequestItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [workflowFilter, setWorkflowFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // fetch requests and users in parallel so we can map creator ids to names
      // prefer the admin-wide requests endpoint if available: endpoints.users.getAllRequests
      const requestsUrl = (endpoints as any).users?.getAllRequests || endpoints.requests.getAll;
      const [reqRes, usersRes] = await Promise.all([
        fetch(requestsUrl, { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } }),
        fetch((endpoints as any).users?.getAll || '/api/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } }).catch(() => null)
      ]);

      if (!reqRes || !reqRes.ok) throw new Error('Failed to fetch requests');
      const reqJson = await reqRes.json();
      // API may return a wrapper { success, count, data: [...] }
      const reqList = (reqJson && Array.isArray(reqJson.data)) ? reqJson.data : (Array.isArray(reqJson) ? reqJson : []);

      const usersJson = usersRes && usersRes.ok ? await usersRes.json() : null;
      const usersList = usersJson && Array.isArray(usersJson.data) ? usersJson.data : (Array.isArray(usersJson) ? usersJson : []);
      const usersMap = new Map<string, any>();
      (usersList || []).forEach((u: any) => usersMap.set(u.id ?? u._id, u));

      // normalize: ensure id field exists and map createdBy to user object when possible
      const list = (reqList || []).map((r: any) => {
        const idVal = r.id ?? r._id;
        // title may be nested under r.data.title per new API shape
        const title = r.title ?? r.data?.title ?? '';
        const status = r.status ?? r.data?.status ?? r.status;
        const currentStep = r.currentStep ?? r.data?.currentStep ?? null;
        const createdAt = r.createdAt ?? r.data?.createdAt ?? null;
        // prefer embedded user object if present, otherwise try createdBy id and map to usersMap
        const createdBy = r.user ? r.user : (r.createdBy && typeof r.createdBy === 'string' ? (usersMap.get(r.createdBy) ?? r.createdBy) : (r.createdBy ?? null));
        const workflowName = r.workflow?.name ?? r.workflowName ?? (r.data?.workflow?.name);
        return ({ id: idVal, title, status, currentStep, createdAt, workflowName, ...r, createdBy });
      });
      setData(list);
    } catch (err) {
      console.error(err);
      message.error((err as Error).message || 'Failed to load requests');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleView = (record: RequestItem) => {
    setActiveRequest(record);
    setDetailVisible(true);
  };

  const handleForceDecision = async (requestId: string, decision: 'approved' | 'rejected') => {
    try {
      const res = await fetch(endpoints.requests.approve(requestId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ decision, comment: `Admin override: ${decision}` })
      });
      if (!res.ok) throw new Error('Action failed');
      message.success(`Request ${decision}`);
      fetchRequests();
    } catch (err) {
      message.error((err as Error).message || 'Failed to perform action');
    }
  };

  const columns: ColumnsType<RequestItem> = [
    { title: 'Request ID', dataIndex: 'id', key: 'id', width: 180 },
    { title: 'Title', dataIndex: 'title', key: 'title', render: (t) => <b>{t}</b> },
    { title: 'Workflow', dataIndex: 'workflowName', key: 'workflowName' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => {
      const color = s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'orange';
      return <Tag color={color}>{s}</Tag>;
    }},
    { title: 'Current Step', dataIndex: 'currentStep', key: 'currentStep' },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy', render: (c) => typeof c === 'string' ? c : c?.name || '-' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (d) => d ? new Date(d).toLocaleString() : '-' },
    { title: 'Actions', key: 'actions', render: (_: any, record) => (
      <Space>
        <Button size="small" onClick={() => handleView(record)}>View</Button>
        <Button size="small" onClick={() => handleForceDecision(record.id, 'approved')}>Force Approve</Button>
        <Button size="small" danger onClick={() => handleForceDecision(record.id, 'rejected')}>Force Reject</Button>
      </Space>
    ) }
  ];

  const filteredData = useMemo(() => {
    return data.filter(d => {
      if (statusFilter && d.status !== statusFilter) return false;
      if (workflowFilter && d.workflowId !== workflowFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(d.title?.toLowerCase().includes(q) || String(d.id).toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [data, statusFilter, workflowFilter, search]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <Input.Search placeholder="Search by title or ID" onSearch={val => setSearch(val)} style={{ width: 300 }} />
        <Select allowClear placeholder="Status" style={{ width: 160 }} onChange={v => setStatusFilter(v || null)}>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
        <Select allowClear placeholder="Workflow" style={{ width: 200 }} onChange={v => setWorkflowFilter(v || null)}>
          {/* workflows list could be fetched from api; for now use unique workflowName/workflowId pairs from data */}
          {Array.from(new Map(data.map(d => [d.workflowId ?? d.workflowName, d.workflowName || d.workflowId]))).map(([k, name]) => (
            <Option key={String(k)} value={String(k)}>{name || String(k)}</Option>
          ))}
        </Select>
        <RangePicker onChange={() => { /* date-range filtering could be implemented */ }} />
        <Space style={{ marginLeft: 'auto' }}>
          <Button onClick={() => navigate('/admin/workflows')}>Workflows</Button>
          <Button type="primary" onClick={fetchRequests}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey={(r) => r.id}
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: (keys) => setSelectedRows(keys)
        }}
        pagination={{ pageSize: 10 }}
      />

      {activeRequest && (
        <RequestDetail
          visible={detailVisible}
          requestId={activeRequest.id}
          onClose={() => { setDetailVisible(false); setActiveRequest(null); fetchRequests(); }}
        />
      )}
    </div>
  );
}

export default RequestsList;
