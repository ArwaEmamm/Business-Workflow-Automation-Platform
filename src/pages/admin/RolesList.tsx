import React from 'react';
import { Card, List, Tag } from 'antd';

const staticRoles = [
  { name: 'admin', description: 'Full access' },
  { name: 'manager', description: 'Manage workflows and approvals' },
  { name: 'employee', description: 'Submit requests' }
];

const RolesList: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Roles</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={staticRoles}
        renderItem={role => (
          <List.Item>
            <Card>
              <h3 style={{ textTransform: 'capitalize' }}>{role.name} <Tag>{role.name}</Tag></h3>
              <p>{role.description}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

export default RolesList;
