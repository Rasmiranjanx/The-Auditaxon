import React, { useState, useEffect, useRef } from 'react'
import api from '../../lib/api'
import { CircleAlert, FileText, Pencil, Plus, Trash2 } from 'lucide-react'

// Keeps Tab focus inside the open dialog (keyboard accessibility only).
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
const keepFocusInDialog = (e, dialog) => {
  if (e.key !== 'Tab' || !dialog) return
  const nodes = dialog.querySelectorAll(FOCUSABLE)
  if (nodes.length === 0) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (!dialog.contains(document.activeElement)) {
    e.preventDefault()
    ;(e.shiftKey ? last : first).focus()
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

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
  // The list endpoint omits `body`; when editing, we only send `body` once the full item has
  // loaded, so a failed or pending load can never overwrite the stored body with an empty string.
  const bodyLoadedRef = useRef(true)

  // Dialog keyboard support only: while open, Escape does what Cancel does and Tab stays inside;
  // once closed, focus returns to the control that opened it.
  const lastFocusRef = useRef(null)
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!showForm) {
      const el = lastFocusRef.current
      if (el && el.isConnected) el.focus()
      return
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false)
        return
      }
      keepFocusInDialog(e, dialogRef.current)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showForm])

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
    bodyLoadedRef.current = true
    setShowForm(true)
  }

  const openEditForm = (item) => {
    bodyLoadedRef.current = typeof item.body === 'string'
    if (!bodyLoadedRef.current && item.slug) {
      api
        .get(`/content/${item.slug}`)
        .then((res) => {
          if (typeof res.data?.body !== 'string') return
          bodyLoadedRef.current = true
          // Don't clobber anything the admin typed while the body was loading.
          setFormData((prev) => (prev.body ? prev : { ...prev, body: res.data.body }))
        })
        .catch(() => {})
    }
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
    // Body never loaded and left untouched: omit it so the server keeps the stored text.
    if (editingId && !bodyLoadedRef.current && !formData.body) delete payload.body

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

  // Display only: a failed load leaves the list empty, so show just the error, not "0" / "No content yet."
  const loadFailed = Boolean(error) && items.length === 0

  return (
    <div>
      <section
        aria-labelledby="content-panel-title"
        inert={showForm}
        onFocus={(e) => {
          lastFocusRef.current = e.target
        }}
        className="card overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 id="content-panel-title" className="text-lg font-semibold text-ink">
                Content
              </h2>
              {!loading && !loadFailed && (
                <span className="badge badge-slate">
                  {items.length}
                  <span className="sr-only"> items</span>
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Website content such as services, articles, bulletins, laws and forms.
            </p>
          </div>
          <button onClick={openNewForm} className="btn btn-primary btn-sm h-10 px-4 sm:h-9">
            <Plus size={16} aria-hidden="true" />
            New Content
          </button>
        </div>

        {error && (
          <div className="px-4 pt-4 last:pb-4 sm:px-6 sm:last:pb-6">
            <div role="alert" className="alert alert-error">
              <CircleAlert size={18} className="mt-px shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <p role="status" className="px-6 py-16 text-center text-sm text-slate-500">
            Loading content…
          </p>
        ) : items.length === 0 ? (
          loadFailed ? null : (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <FileText size={40} strokeWidth={1.5} className="text-slate-300" aria-hidden="true" />
              <p className="mt-4 font-medium text-ink">No content yet.</p>
              <p className="mt-1 text-sm text-balance text-slate-500">
                Use “New Content” to add the first item.
              </p>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="block w-full text-left text-sm sm:table">
              <thead className="hidden border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase sm:table-header-group">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                    Title
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                    Type
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-semibold lg:table-cell">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="block divide-y divide-slate-100 sm:table-row-group">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 px-4 py-4 transition-colors hover:bg-slate-50/70 sm:table-row"
                  >
                    <th
                      scope="row"
                      className="min-w-0 text-left align-middle font-normal sm:px-6 sm:py-3"
                    >
                      <p className="font-medium text-ink">{item.title}</p>
                      <p className="mt-0.5 text-slate-500 lg:hidden">
                        {item.category}
                        {item.subcategory ? ` / ${item.subcategory}` : ''}
                      </p>
                    </th>
                    <td className="col-start-2 row-start-1 justify-self-end align-middle sm:px-4 sm:py-3">
                      <span className="badge badge-navy tracking-wide uppercase">{item.type}</span>
                    </td>
                    <td className="hidden px-4 py-3 align-middle text-slate-600 lg:table-cell">
                      {item.category}
                      {item.subcategory ? ` / ${item.subcategory}` : ''}
                    </td>
                    <td className="col-span-2 justify-self-end align-middle sm:py-3 sm:pr-6 sm:pl-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(item)}
                          aria-label={`Edit ${item.title}`}
                          className="btn btn-outline btn-sm h-10 sm:h-8"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          aria-label={`Delete ${item.title}`}
                          className="btn btn-danger btn-sm h-10 sm:h-8"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 sm:p-6">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="content-form-title"
            className="card flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden shadow-2xl"
          >
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h3 id="content-form-title" className="text-lg font-semibold text-ink">
                {editingId ? 'Edit Content' : 'New Content'}
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                Fields marked <span className="text-red-600">*</span> are required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
                {error && (
                  <div role="alert" className="alert alert-error">
                    <CircleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                <fieldset>
                  <legend className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Classification
                  </legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="content-type" className="form-label">
                        Type
                      </label>
                      <select
                        id="content-type"
                        autoFocus
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="form-control"
                      >
                        {contentTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="content-category" className="form-label">
                        Category{' '}
                        <span className="text-red-600" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="content-category"
                        name="category"
                        placeholder="e.g. Direct Tax"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="content-subcategory" className="form-label">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        id="content-subcategory"
                        name="subcategory"
                        placeholder="Optional"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Details
                  </legend>
                  <div className="mt-3 grid gap-4">
                    <div>
                      <label htmlFor="content-title" className="form-label">
                        Title{' '}
                        <span className="text-red-600" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="content-title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="content-summary" className="form-label">
                        Summary
                      </label>
                      <textarea
                        id="content-summary"
                        name="summary"
                        placeholder="Optional short summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows={2}
                        className="form-control resize-y"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="content-body" className="form-label">
                        Body
                      </label>
                      <textarea
                        id="content-body"
                        name="body"
                        placeholder="Full body content"
                        value={formData.body}
                        onChange={handleChange}
                        rows={5}
                        className="form-control resize-y"
                      ></textarea>
                    </div>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Publishing
                  </legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="content-tags" className="form-label">
                        Tags
                      </label>
                      <input
                        type="text"
                        id="content-tags"
                        name="tags"
                        aria-describedby="content-tags-hint"
                        value={formData.tags}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <p id="content-tags-hint" className="form-hint">
                        Separate tags with commas.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="content-order" className="form-label">
                        Display order
                      </label>
                      <input
                        type="number"
                        id="content-order"
                        name="order"
                        aria-describedby="content-order-hint"
                        value={formData.order}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <p id="content-order-hint" className="form-hint">
                        Lower numbers appear first.
                      </p>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="content-published"
                        className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-700"
                      >
                        <input
                          type="checkbox"
                          id="content-published"
                          name="isPublished"
                          checked={formData.isPublished}
                          onChange={handleChange}
                          className="size-4 shrink-0 cursor-pointer accent-navy-800"
                        />
                        Published (visible on site)
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary sm:min-w-28">
                  {saving ? 'Saving...' : 'Save'}
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
