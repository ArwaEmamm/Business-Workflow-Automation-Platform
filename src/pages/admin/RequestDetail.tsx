import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Timeline, Card, Button, Tag, message } from 'antd';
import { endpoints } from '../../api/apiEndpoints';

interface RequestDetailProps {
  requestId: string;
  visible: boolean;
  onClose: () => void;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ requestId, visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoints.requests.getById(requestId), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch request detail');
      const json = await res.json();
      // normalize wrapper { success, data } -> data
      const payload = json?.data ?? json;
      setData(payload);
    } catch (err) {
      message.error((err as Error).message || 'Failed to load request');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, requestId]);

  const handleForceApprove = async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoints.requests.approve(requestId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ decision: 'approved', comment: 'Admin override' })
      });
      if (!res.ok) throw new Error('Action failed');
      message.success('Request approved');
      await fetchDetail();
    } catch (err) {
      message.error((err as Error).message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForceReject = async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoints.requests.approve(requestId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ decision: 'rejected', comment: 'Admin override: rejected' })
      });
      if (!res.ok) throw new Error('Action failed');
      message.success('Request rejected');
      await fetchDetail();
    } catch (err) {
      message.error((err as Error).message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={data?.title ? data.title : 'Request Details'} open={visible} onCancel={onClose} footer={null} width={800}>
      {loading && <div>Loading...</div>}
      {!loading && !data && <div>No data available</div>}

      {data && (
        <div>
          <Card style={{ marginBottom: 12 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Title">{data.title ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Description">{data.description ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Workflow">{data.workflow?.name ?? data.workflowName ?? data.workflowId ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color={data.status === 'approved' ? 'green' : data.status === 'rejected' ? 'red' : 'orange'}>{data.status ?? '-'}</Tag></Descriptions.Item>
              <Descriptions.Item label="Created By">{(data.createdBy && (typeof data.createdBy === 'object')) ? data.createdBy.name : (data.createdBy ?? '-')}</Descriptions.Item>
              <Descriptions.Item label="Created At">{data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Workflow Steps" style={{ marginBottom: 12 }}>
            <Timeline mode="left">
              {((data.workflow && data.workflow.steps) || data.steps || []).map((s: any, idx: number) => (
                <Timeline.Item key={idx} label={`Step ${s.order ?? idx + 1}`}>{s.title ?? '-'} — {s.assignedRole ?? (s.assignedTo ?? '-')}</Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <Card title="Approvals History">
            <Timeline>
              {((data.approvalsHistory || data.history || [])).map((h: any, i: number) => (
                <Timeline.Item key={i}>{(h.user && h.user.name) ? h.user.name : (h.user ?? '-')} — {h.decision ?? '-'} — {(h.at || h.atedAt || h.date) ? new Date(h.at || h.atedAt || h.date).toLocaleString() : '-'} {h.comment ? `— ${h.comment}` : ''}</Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={loading}>Close</Button>
            <Button danger onClick={handleForceReject} disabled={loading}>Force Reject</Button>
            <Button type="primary" onClick={handleForceApprove} disabled={loading}>Force Approve</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RequestDetail;
