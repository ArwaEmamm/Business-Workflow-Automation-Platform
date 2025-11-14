import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Space, Tag, message, Select, Input, Popconfirm } from 'antd';
import { endpoints } from '../../api/apiEndpoints';
import type { ColumnsType } from 'antd/es/table';
// import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

interface UserItem {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  lastLogin?: string;
  department?: string;
  [key: string]: any;
}

const UsersList: React.FC = () => {
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  // no inline user creation in this view; backend provides users list

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoints.users.getAll, { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } });
      if (!res.ok) {
        if (res.status === 404) {
          message.warning('Users endpoint not found on backend (404).');
          setData([]);
          return;
        }
        throw new Error('Failed to fetch users');
      }
      const json = await res.json();
      // backend returns { success, count, data: [...] }
      const usersArr = json && Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      const list = (usersArr || []).map((u: any) => ({ id: u.id ?? u._id, ...u }));
      setData(list);
    } catch (err) {
      console.error(err);
      message.error((err as Error).message || 'Failed to load users');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Edit via inline form removed; keep placeholder handler for now
  const handleEdit = (_u: UserItem) => { message.info('Editing users is handled via the user management API (not implemented in this view).'); };

  const handleActivate = async (id: string, activate = true) => {
    try {
      const url = activate ? endpoints.users.activate(id) : endpoints.users.deactivate(id);
      const res = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } });
      if (!res.ok) throw new Error('Action failed');
      message.success(activate ? 'User activated' : 'User deactivated');
      fetchUsers();
    } catch (err) { message.error((err as Error).message || 'Failed'); }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const res = await fetch(endpoints.users.resetPassword(id), { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } });
      if (!res.ok) throw new Error('Failed to reset password');
      message.success('Password reset (admin action)');
    } catch (err) { message.error((err as Error).message || 'Failed'); }
  };

  const columns: ColumnsType<UserItem> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (a) => a ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag> },
    { title: 'Last Login', dataIndex: 'lastLogin', key: 'lastLogin', render: (d) => d ? new Date(d).toLocaleString() : '-' },
    { title: 'Actions', key: 'actions', render: (_: any, record) => (
      <Space>
        <Button size="small" onClick={() => handleEdit(record)}>Edit</Button>
        <Popconfirm title={record.isActive ? 'Deactivate user?' : 'Activate user?'} onConfirm={() => handleActivate(record.id, !record.isActive)}>
          <Button size="small">{record.isActive ? 'Deactivate' : 'Activate'}</Button>
        </Popconfirm>
        <Button size="small" onClick={() => handleResetPassword(record.id)}>Reset Password</Button>
      </Space>
    ) }
  ];

  const filtered = useMemo(() => data.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || String(u.id).includes(q);
    }
    return true;
  }), [data, roleFilter, search]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Search placeholder="Search by name/email/id" onSearch={val => setSearch(val)} style={{ width: 300 }} />
        <Select allowClear placeholder="Role" style={{ width: 180 }} onChange={v => setRoleFilter(v || null)}>
          <Option value="hr_manager">HR Manager</Option>
          <Option value="manager">Manager</Option>
          <Option value="employee">Employee</Option>
        </Select>
        <Button onClick={fetchUsers} style={{ marginLeft: 'auto' }}>Refresh</Button>
      </div>

      <Table rowKey={r => r.id} columns={columns} dataSource={filtered} loading={loading} pagination={{ pageSize: 10 }} />

      {/* Inline user creation removed as requested. Use backend/user management flow instead. */}
    </div>
  );
}

export default UsersList;
