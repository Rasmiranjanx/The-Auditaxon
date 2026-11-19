import React, { useState, useEffect } from 'react'
import api from '../../lib/api'

const emptyForm = {
  type: 'service',
  category: '',
  subcategory: '',
  title: '',
  summary: '',
  body: '',
  tags: '',
  order: 0,
  isPublished: true,
}

const contentTypes = [
  'service',
  'law',
  'rule',
  'form',
  'bulletin',
  'vat_law',
  'vat_rule',
  'blog',
  'csr',
  'news',
  'link',
  'page',
]

const ContentPanel = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await api.get('/content', { params: { limit: 100 } })
      setItems(res.data.items)
    } catch (err) {
      setError('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const openNewForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (item) => {
    setFormData({
      type: item.type,
      category: item.category,
      subcategory: item.subcategory || '',
      title: item.title,
      summary: item.summary || '',
      body: item.body || '',
      tags: (item.tags || []).join(', '),
      order: item.order || 0,
      isPublished: item.isPublished,
    })
    setEditingId(item._id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(formData.order),
    }

    try {
      if (editingId) {
        await api.put(`/content/${editingId}`, payload)
      } else {
        await api.post('/content', payload)
      }
      setShowForm(false)
      fetchContent()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this content item permanently?')) return
    try {
      await api.delete(`/content/${id}`)
      setItems(items.filter((i) => i._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete (superadmin only)')
    }
  }

  const inputClass =
    'bg-black border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-white transition w-full'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Content</h2>
        <button
          onClick={openNewForm}
          className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          + New Content
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-400">No content yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                  <h3 className="text-white font-medium">{item.title}</h3>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  {item.category}
                  {item.subcategory ? ` / ${item.subcategory}` : ''}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditForm(item)}
                  className="text-slate-300 hover:text-white text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-semibold text-lg mb-4">
              {editingId ? 'Edit Content' : 'New Content'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
              >
                {contentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="category"
                placeholder="Category *"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                type="text"
                name="subcategory"
                placeholder="Subcategory (optional)"
                value={formData.subcategory}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="text"
                name="title"
                placeholder="Title *"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <textarea
                name="summary"
                placeholder="Short summary (optional)"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                className={inputClass}
              ></textarea>
              <textarea
                name="body"
                placeholder="Full body content"
                value={formData.body}
                onChange={handleChange}
                rows={5}
                className={inputClass}
              ></textarea>
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="number"
                name="order"
                placeholder="Display order"
                value={formData.order}
                onChange={handleChange}
                className={inputClass}
              />

              <label className="flex items-center gap-2 text-slate-300 text-sm">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
                Published (visible on site)
              </label>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white px-5 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentPanel
