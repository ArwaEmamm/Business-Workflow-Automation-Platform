import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CreateRequestPage.css';
import { endpoints } from '../../api/apiEndpoints';

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: {
    id: string;
    title: string;
    order: number;
    assignedRole: string;
  }[];
}

export default function CreateRequestPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchWorkflows = async () => {
      setLoading(true);
      try {
        const response = await fetch(endpoints.workflows.getAll, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          const rawList = Array.isArray(data) ? data : data?.workflows ?? [];
          // normalize id field to always be `id`
          const wfList = (rawList || []).map((w: any) => ({ id: w.id ?? w._id ?? w.workflowId ?? w.name, name: w.name ?? w.title ?? String(w.id ?? w._id) , description: w.description, steps: w.steps || [] }));
          setWorkflows(wfList);
        }
      } catch (err) {
        setError('Failed to load workflows');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();

    // Check if workflow is pre-selected from URL params
    const workflowId = searchParams.get('workflow');
    if (workflowId) {
      // if param matches a workflow name, convert to its id
      // we'll resolve after workflows are loaded; temporarily set it
      setSelectedWorkflow(workflowId);
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!selectedWorkflow || !title.trim() || !description.trim()) {
      setError('يجب ملء جميع الحقول المطلوبة (العنوان والوصف مطلوبين)');
      return;
    }

    // Validate attachments if any
    if (attachments.length > 5) {
      setError('الحد الأقصى للملفات المرفقة هو 5 ملفات');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // ensure we send the actual workflow id (not the name)
      const selected = workflows.find(w => w.id === selectedWorkflow || w.name === selectedWorkflow || (w as any)._id === selectedWorkflow);
      const workflowIdToSend = selected?.id ?? selectedWorkflow;

      // auth token check
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated. Please login to create a request.');
      }

      const formData = new FormData();
      // Don't need to send workflowId in form data since it's in the URL
      formData.append('title', title.trim());
      formData.append('description', description.trim());

      if (attachments.length > 0) {
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await fetch((endpoints.requests.create as any)(workflowIdToSend), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'فشل في إنشاء الطلب');
      }

      // Wait for response to be fully processed
      await response.json();
      
      // Redirect to My Requests after successful creation
      navigate('/employee/requests');
    } catch (err) {
      setError((err as Error).message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);

  return (
    <div className="create-request-page">
      <div className="create-request-container">
        <header className="page-header">
          <h1>Create New Request</h1>
          <p>Fill in the details below to submit your request</p>
        </header>

        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-section">
            <label htmlFor="workflow" className="form-label">
              Workflow Type <span className="required">*</span>
            </label>
            <select
              id="workflow"
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select a workflow</option>
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label htmlFor="title" className="form-label">
              Request Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Enter a clear title for your request"
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="description" className="form-label">
              Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Provide detailed description of your request"
              rows={4}
            />
          </div>

          <div className="form-section">
            <label htmlFor="attachments" className="form-label">
              Attachments
            </label>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileChange}
              className="form-file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <small className="form-help">
              Supported formats: PDF, DOC, DOCX, JPG, PNG. Maximum 10MB per file.
            </small>
            {attachments.length > 0 && (
              <div className="attachments-list">
                <h4>Selected Files:</h4>
                <ul>
                  {attachments.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${index}`}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {selectedWorkflowData && (
            <div className="workflow-preview">
              <h3>Workflow Steps Preview</h3>
              <div className="steps-timeline">
                {selectedWorkflowData.steps.map((step, index) => (
                  <div key={step.id || `step-${index}`} className="step-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>Assigned to: {step.assignedRole}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/employee')}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || loading}
            >
              {submitting ? 'Creating Request...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
