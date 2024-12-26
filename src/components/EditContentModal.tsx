'use client';

import { useState } from 'react';

interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  tags: string[];
}

interface EditContentModalProps {
  content: Content;
  availableTags: string[];
  categories: string[];
  onSave: (content: Content) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function EditContentModal({
  content,
  availableTags,
  categories,
  onSave,
  onCancel,
  isSaving
}: EditContentModalProps) {
  const [editedContent, setEditedContent] = useState<Content>(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedContent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Content</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editedContent.title}
                onChange={(e) => setEditedContent({
                  ...editedContent,
                  title: e.target.value
                })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editedContent.description}
                onChange={(e) => setEditedContent({
                  ...editedContent,
                  description: e.target.value
                })}
                className="w-full p-2 border rounded-lg"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={editedContent.category}
                onChange={(e) => setEditedContent({
                  ...editedContent,
                  category: e.target.value
                })}
                className="w-full p-2 border rounded-lg"
              >
                {categories.filter(cat => cat !== 'All').map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = editedContent.tags.includes(tag)
                        ? editedContent.tags.filter(t => t !== tag)
                        : [...editedContent.tags, tag];
                      setEditedContent({
                        ...editedContent,
                        tags: newTags
                      });
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      editedContent.tags.includes(tag)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 