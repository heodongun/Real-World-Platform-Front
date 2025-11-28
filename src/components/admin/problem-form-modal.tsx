'use client';

import { useState, useEffect } from 'react';
import type { Problem, CreateProblemPayload, Difficulty, Language } from '@/lib/types';

interface ProblemFormModalProps {
  problem?: Problem;
  onClose: () => void;
  onSubmit: (payload: CreateProblemPayload) => void;
  submitting: boolean;
}

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';
const textAreaClass = `${fieldClass} font-mono text-sm`;
const buttonMutedClass =
  'rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100';

export function ProblemFormModal({ problem, onClose, onSubmit, submitting }: ProblemFormModalProps) {
  const [formData, setFormData] = useState<CreateProblemPayload>({
    title: problem?.title || '',
    slug: problem?.slug || '',
    description: problem?.description || '',
    difficulty: problem?.difficulty || 'EASY',
    language: problem?.language || 'KOTLIN',
    tags: problem?.tags || [],
    starterCode: problem?.starterCode || '',
    testFiles: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [testFileInput, setTestFileInput] = useState({ path: '', content: '' });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleAddTestFile = () => {
    if (testFileInput.path.trim() && testFileInput.content.trim()) {
      setFormData({
        ...formData,
        testFiles: [...formData.testFiles, { ...testFileInput }],
      });
      setTestFileInput({ path: '', content: '' });
    }
  };

  const handleRemoveTestFile = (index: number) => {
    setFormData({
      ...formData,
      testFiles: formData.testFiles.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white px-1 pb-6 text-slate-900 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-3xl bg-white px-6 py-5 shadow-sm">
          <h2 className="text-2xl font-semibold">
            {problem ? 'Edit Problem' : 'Create Problem'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 transition hover:text-slate-600"
            disabled={submitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={fieldClass}
              placeholder="Two Sum"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className={fieldClass}
              placeholder="two-sum"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Description *</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={textAreaClass}
              placeholder="Problem description..."
            />
          </div>

          {/* Difficulty & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Difficulty *</label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value as Difficulty })
                }
                className={fieldClass}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">Language *</label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value as Language })
                }
                className={fieldClass}
              >
                <option value="KOTLIN">Kotlin</option>
                <option value="JAVA">Java</option>
                <option value="SPRING_BOOT_KOTLIN">Spring Boot (Kotlin)</option>
                <option value="SPRING_BOOT_JAVA">Spring Boot (Java)</option>
                <option value="PYTHON">Python</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Tags</label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className={fieldClass}
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={buttonMutedClass}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-indigo-500 transition hover:text-indigo-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Starter Code */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Starter Code</label>
            <textarea
              rows={8}
              value={formData.starterCode || ''}
              onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
              className={textAreaClass}
              placeholder="fun solution() { ... }"
            />
          </div>

          {/* Test Files */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">Test Files *</label>
            <div className="mb-3 space-y-3">
              <input
                type="text"
                value={testFileInput.path}
                onChange={(e) => setTestFileInput({ ...testFileInput, path: e.target.value })}
                className={fieldClass}
                placeholder="src/test/kotlin/SolutionTest.kt"
              />
              <textarea
                rows={6}
                value={testFileInput.content}
                onChange={(e) => setTestFileInput({ ...testFileInput, content: e.target.value })}
                className={textAreaClass}
                placeholder="Test file content..."
              />
              <button
                type="button"
                onClick={handleAddTestFile}
                className={`${buttonMutedClass} w-full`}
              >
                Add Test File
              </button>
            </div>
            <div className="space-y-2">
              {formData.testFiles.map((file, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{file.path}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestFile(index)}
                      className="text-sm text-red-600 transition hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-slate-600">
                    {file.content.substring(0, 200)}
                    {file.content.length > 200 && '...'}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || formData.testFiles.length === 0}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:opacity-40"
            >
              {submitting ? 'Saving...' : problem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
