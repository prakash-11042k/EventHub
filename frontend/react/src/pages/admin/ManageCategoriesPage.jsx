import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, ArrowLeft, Layers, AlertCircle, Save } from 'lucide-react';

export const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { showNotification } = useNotification();

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      showNotification('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
  };

  const resetForm = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: name.trim(),
      description: description.trim(),
    };

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
        showNotification('Category updated successfully.', 'success');
      } else {
        await categoryService.createCategory(payload);
        showNotification('New category added successfully.', 'success');
      }
      resetForm();
      loadCategories();
    } catch (err) {
      showNotification(err.message || 'Failed to save category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const promptDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await categoryService.deleteCategory(deleteId);
      showNotification('Category deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setDeleteId(null);
      loadCategories();
    } catch (err) {
      showNotification(
        'Cannot delete category that is currently linked to existing events.',
        'error'
      );
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="text-muted text-sm flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>Manage Categories</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Form Column */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card" style={{ padding: '2rem 1.5rem', position: 'sticky', top: '6rem' }}>
            <div className="flex items-center gap-2 mb-4">
              <Layers size={20} className="text-primary" />
              <h3 style={{ fontSize: '1.25rem' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Technology, Workshop"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Brief description of events in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Save size={16} />
                  {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Categories Table Column */}
        <div style={{ gridColumn: 'span 2' }}>
          {loading ? (
            <LoadingSpinner text="Loading category list..." />
          ) : (
            <div className="card table-container">
              <table>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted" style={{ padding: '3rem' }}>
                        No categories found. Use the form to add one.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>
                          <div className="font-semibold" style={{ fontSize: '1rem' }}>
                            {cat.name}
                          </div>
                        </td>
                        <td className="text-muted">
                          {cat.description || '—'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Category"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => promptDelete(cat.id)}
                              className="btn btn-danger btn-sm"
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Category Deletion"
        footer={
          <>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger">
              Yes, Delete Category
            </button>
          </>
        }
      >
        <div className="flex items-center gap-3 text-warning mb-3">
          <AlertCircle size={24} />
          <span className="font-semibold">Are you sure you want to delete this category?</span>
        </div>
        <p className="text-muted text-sm">
          If any existing events belong to this category, deletion will fail to protect data integrity.
        </p>
      </Modal>
    </div>
  );
};

export default ManageCategoriesPage;
