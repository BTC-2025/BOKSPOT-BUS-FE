'use client';

import React, { useState } from 'react';
import { ARCHETYPE_SCHEMAS, Archetype } from '../lib/archetypes';
import { Save, AlertCircle } from 'lucide-react';

interface DynamicFormProps {
  archetype: Archetype;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function DynamicForm({ archetype, initialData = {}, onSubmit, onCancel, isLoading }: DynamicFormProps) {
  const schema = ARCHETYPE_SCHEMAS[archetype];
  const [formData, setFormData] = useState<any>(initialData || {});

  if (!schema) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-xl">Invalid Archetype Configured</div>;
  }

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{schema.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Fill in the details for this {archetype.toLowerCase()} service.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {schema.fields.map((field: any, idx: number) => {
          return (
            <div key={idx} className="space-y-1.5">
              <label className="block text-sm font-semibold text-[var(--text-primary)]">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {/* Text Input */}
              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {/* Number Input */}
              {field.type === 'number' && (
                <input
                  type="number"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, Number(e.target.value))}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder={`0`}
                />
              )}

              {/* Textarea */}
              {field.type === 'textarea' && (
                <textarea
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors min-h-[100px]"
                  placeholder={`Enter details...`}
                />
              )}

              {/* Date Input */}
              {field.type === 'date' && (
                <input
                  type="date"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              )}

              {/* Time Input */}
              {field.type === 'time' && (
                <input
                  type="time"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              )}

              {/* Array / Multi-select (Simplified as comma separated for now) */}
              {(field.type === 'array' || field.type === 'multi-select') && (
                <div>
                  <input
                    type="text"
                    required={field.required}
                    value={Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : (formData[field.name] || '')}
                    onChange={(e) => {
                      const val = e.target.value.split(',').map((s: string) => s.trim());
                      handleChange(field.name, val);
                    }}
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                    placeholder={`Comma separated values (e.g. Item 1, Item 2)`}
                  />
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-wider">
                    Separate items with commas
                  </p>
                </div>
              )}

              {/* Image Array */}
              {field.type === 'image-array' && (
                <div className="p-4 border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-base)] text-center">
                  <span className="text-sm font-semibold text-[var(--primary)] cursor-pointer">
                    Click to upload images
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    (Mock implementation: URLs will be simulated)
                  </p>
                  <input
                    type="text"
                    value={Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : (formData[field.name] || '')}
                    onChange={(e) => {
                      const val = e.target.value.split(',').map((s: string) => s.trim());
                      handleChange(field.name, val);
                    }}
                    className="w-full mt-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)]"
                    placeholder={`Or paste image URLs (comma separated)`}
                  />
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Save size={16} />
                Save Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
