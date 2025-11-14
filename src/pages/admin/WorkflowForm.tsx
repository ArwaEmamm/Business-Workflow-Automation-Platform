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
