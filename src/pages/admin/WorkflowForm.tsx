import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaPlus, FaTrash } from 'react-icons/fa';
import { workflowsApi } from '../../features/workflows/workflowsAPI';
import type { Workflow, WorkflowFormData } from '../../features/workflows/types';

interface WorkflowFormProps {
  workflow: Workflow | null;
  onClose: () => void;
  onSave: () => void;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({ workflow, onClose, onSave }) => {
  const [formData, setFormData] = useState<WorkflowFormData>({
    name: '',
    description: '',
    steps: [{ title: '', order: 1, assignedRole: 'manager' }]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add CSS styles for the form
  const formStyles = `
    .workflow-form-modal {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      box-shadow: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
      border: 1px solid rgba(16,185,129,0.1);
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .workflow-form-modal .modal-header {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-bottom: 1px solid rgba(16,185,129,0.1);
      padding: 24px;
      border-radius: 16px 16px 0 0;
    }

    .workflow-form-modal .modal-header h2 {
      margin: 0;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 1.5rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .workflow-form-modal .modal-header h2::before {
      content: '⚙️';
      font-size: 1.75rem;
    }

    .workflow-form-modal .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .workflow-form-modal .modal-close:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .workflow-form-modal form {
      padding: 24px;
    }

    .workflow-form-modal .form-group {
      margin-bottom: 24px;
    }

    .workflow-form-modal .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .workflow-form-modal .form-group input,
    .workflow-form-modal .form-group textarea,
    .workflow-form-modal .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid rgba(16,185,129,0.2);
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: white;
    }

    .workflow-form-modal .form-group input:focus,
    .workflow-form-modal .form-group textarea:focus,
    .workflow-form-modal .form-group select:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
    }

    .workflow-form-modal .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .workflow-form-modal .steps-container {
      border: 2px solid rgba(16,185,129,0.2);
      border-radius: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .workflow-form-modal .step-item {
      background: white;
      border: 1px solid rgba(16,185,129,0.1);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .workflow-form-modal .step-item:last-child {
      margin-bottom: 0;
    }

    .workflow-form-modal .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .workflow-form-modal .step-number {
      font-weight: 700;
      color: #10b981;
      background: rgba(16,185,129,0.1);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
    }

    .workflow-form-modal .step-actions {
      display: flex;
      gap: 8px;
    }

    .workflow-form-modal .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .workflow-form-modal .btn-sm {
      padding: 4px 8px;
      font-size: 0.7rem;
    }

    .workflow-form-modal .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .workflow-form-modal .btn-secondary:hover {
      background: #e5e7eb;
    }

    .workflow-form-modal .btn-danger {
      background: #fef2f2;
      color: #dc2626;
    }

    .workflow-form-modal .btn-danger:hover {
      background: #fecaca;
    }

    .workflow-form-modal .step-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .workflow-form-modal .field-group {
      display: flex;
      flex-direction: column;
    }

    .workflow-form-modal .field-group label {
      margin-bottom: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
    }

    .workflow-form-modal .field-group input,
    .workflow-form-modal .field-group select {
      padding: 8px 12px;
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .workflow-form-modal .role-badge {
      margin-top: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-align: center;
      color: white;
    }

    .workflow-form-modal .add-step-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(16,185,129,0.3);
      margin-top: 16px;
    }

    .workflow-form-modal .add-step-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16,185,129,0.4);
    }

    .workflow-form-modal .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid rgba(16,185,129,0.1);
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0 0 16px 16px;
    }

    .workflow-form-modal .modal-footer .btn {
      padding: 10px 20px;
      font-size: 0.875rem;
    }

    .workflow-form-modal .modal-footer .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(16,185,129,0.3);
    }

    .workflow-form-modal .modal-footer .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16,185,129,0.4);
    }

    .workflow-form-modal .error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

    .workflow-form-modal .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 4px;
    }
  `;

  // Inject styles
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = formStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name,
        description: workflow.description,
        steps: workflow.steps.map(step => ({ ...step }))
      });
    }
  }, [workflow]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.steps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }

    formData.steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`step_${index}_title`] = 'Step title is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (workflow) {
        await workflowsApi.update(workflow.id!, formData);
      } else {
        await workflowsApi.create(formData);
      }
      onSave();
    } catch (err) {
      console.error('Failed to save workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    const newStep = {
      title: '',
      order: formData.steps.length + 1,
      assignedRole: 'manager' as const
    };
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({
          ...step,
          order: i + 1
        }))
      }));
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...formData.steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      newSteps.forEach((step, i) => step.order = i + 1);

      setFormData(prev => ({
        ...prev,
        steps: newSteps
      }));
    }
  };

  const updateStep = (index: number, field: keyof typeof formData.steps[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'hr_manager': return '#ef4444';
      case 'manager': return '#f59e0b';
      case 'employee': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content workflow-form-modal">
        <div className="modal-header">
          <h2>{workflow ? 'Edit Workflow' : 'Create New Workflow'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Steps *</label>
            {errors.steps && <span className="error-message">{errors.steps}</span>}

            <div className="steps-container">
              {formData.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-header">
                    <span className="step-number">Step {step.order}</span>
                    <div className="step-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === formData.steps.length - 1}
                        title="Move down"
                      >
                        <FaArrowDown />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeStep(index)}
                        disabled={formData.steps.length === 1}
                        title="Remove step"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="step-fields">
                    <div className="field-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                        className={errors[`step_${index}_title`] ? 'error' : ''}
                      />
                      {errors[`step_${index}_title`] && (
                        <span className="error-message">{errors[`step_${index}_title`]}</span>
                      )}
                    </div>

                    <div className="field-group">
                      <label>Assigned Role</label>
                      <select
                        value={step.assignedRole}
                        onChange={(e) => updateStep(index, 'assignedRole', e.target.value)}
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="hr_manager">HR Manager</option>
                      </select>
                      <span
                        className="role-badge"
                        style={{ backgroundColor: getRoleBadgeColor(step.assignedRole) }}
                      >
                        {step.assignedRole}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="btn btn-secondary add-step-btn" onClick={addStep}>
              <FaPlus /> Add Step
            </button>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowForm;
