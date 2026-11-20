import React, { useState, useEffect, useRef } from 'react'
import api from '../../lib/api'
import { CircleAlert, Pencil, Trash2, UserPlus, Users } from 'lucide-react'

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

// Monogram for the list avatar (display only): first and last initials of the name.
const getInitials = (name) => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

const emptyForm = {
  name: '',
  role: '',
  category: 'partner',
  designation: '',
  bio: '',
  qualifications: '',
  email: '',
  linkedIn: '',
  order: 0,
  isActive: true,
}

const TeamPanel = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

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

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/team')
      setMembers(res.data)
    } catch (err) {
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
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

  const openEditForm = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      designation: member.designation || '',
      bio: member.bio || '',
      qualifications: (member.qualifications || []).join(', '),
      email: member.email || '',
      linkedIn: member.linkedIn || '',
      order: member.order || 0,
      isActive: member.isActive,
    })
    setEditingId(member._id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...formData,
      qualifications: formData.qualifications
        .split(',')
        .map((q) => q.trim())
        .filter(Boolean),
      order: Number(formData.order),
    }

    try {
      if (editingId) {
        await api.put(`/team/${editingId}`, payload)
      } else {
        await api.post('/team', payload)
      }
      setShowForm(false)
      fetchMembers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team member')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member?')) return
    try {
      await api.delete(`/team/${id}`)
      setMembers(members.filter((m) => m._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
    }
  }

  // Display only: a failed load leaves the list empty, so show just the error, not "0" / "No team members yet."
  const loadFailed = Boolean(error) && members.length === 0

  return (
    <div>
      <section
        aria-labelledby="team-panel-title"
        inert={showForm}
        onFocus={(e) => {
          lastFocusRef.current = e.target
        }}
        className="card overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 id="team-panel-title" className="text-lg font-semibold text-ink">
                Team
              </h2>
              {!loading && !loadFailed && (
                <span className="badge badge-slate">
                  {members.length}
                  <span className="sr-only"> members</span>
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Profiles of the firm&apos;s partners and associates.
            </p>
          </div>
          <button onClick={openNewForm} className="btn btn-primary btn-sm h-10 px-4 sm:h-9">
            <UserPlus size={16} aria-hidden="true" />
            Add Team Member
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
            Loading team members…
          </p>
        ) : members.length === 0 ? (
          loadFailed ? null : (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <Users size={40} strokeWidth={1.5} className="text-slate-300" aria-hidden="true" />
              <p className="mt-4 font-medium text-ink">No team members yet.</p>
              <p className="mt-1 text-sm text-balance text-slate-500">
                Use “Add Team Member” to add the first person.
              </p>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="block w-full text-left text-sm sm:table">
              <thead className="hidden border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase sm:table-header-group">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                    Name
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-semibold lg:table-cell">
                    Role
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="block divide-y divide-slate-100 sm:table-row-group">
                {members.map((member) => (
                  <tr
                    key={member._id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 px-4 py-4 transition-colors hover:bg-slate-50/70 sm:table-row"
                  >
                    <th
                      scope="row"
                      className="min-w-0 text-left align-middle font-normal sm:px-6 sm:py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-700 ring-1 ring-navy-100 ring-inset"
                        >
                          {getInitials(member.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{member.name}</p>
                          <p className="mt-0.5 text-slate-500 lg:hidden">
                            {member.role}
                            {member.designation ? ` — ${member.designation}` : ''}
                          </p>
                        </div>
                      </div>
                    </th>
                    <td className="hidden px-4 py-3 align-middle text-slate-600 lg:table-cell">
                      {member.role}
                      {member.designation ? ` — ${member.designation}` : ''}
                    </td>
                    <td className="col-start-2 row-start-1 justify-self-end align-middle sm:px-4 sm:py-3">
                      <span
                        className={`badge capitalize ${
                          member.category === 'partner' ? 'badge-navy' : 'badge-slate'
                        }`}
                      >
                        {member.category}
                      </span>
                    </td>
                    <td className="col-span-2 justify-self-end align-middle sm:py-3 sm:pr-6 sm:pl-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(member)}
                          aria-label={`Edit ${member.name}`}
                          className="btn btn-outline btn-sm h-10 sm:h-8"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          aria-label={`Delete ${member.name}`}
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
            aria-labelledby="team-form-title"
            className="card flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden shadow-2xl"
          >
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h3 id="team-form-title" className="text-lg font-semibold text-ink">
                {editingId ? 'Edit Team Member' : 'Add Team Member'}
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
                    Profile
                  </legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="team-name" className="form-label">
                        Full name{' '}
                        <span className="text-red-600" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="team-name"
                        autoFocus
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="team-role" className="form-label">
                        Role{' '}
                        <span className="text-red-600" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="team-role"
                        name="role"
                        placeholder="e.g. Partner"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="team-category" className="form-label">
                        Category
                      </label>
                      <select
                        id="team-category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="partner">Partner</option>
                        <option value="associate">Associate</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="team-designation" className="form-label">
                        Designation
                      </label>
                      <input
                        type="text"
                        id="team-designation"
                        name="designation"
                        placeholder="e.g. Chartered Accountant"
                        value={formData.designation}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="team-bio" className="form-label">
                        Short bio
                      </label>
                      <textarea
                        id="team-bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="form-control resize-y"
                      ></textarea>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="team-qualifications" className="form-label">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        id="team-qualifications"
                        name="qualifications"
                        placeholder="e.g. FCA, LLB"
                        aria-describedby="team-qualifications-hint"
                        value={formData.qualifications}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <p id="team-qualifications-hint" className="form-hint">
                        Separate qualifications with commas.
                      </p>
                    </div>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Contact
                  </legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="team-email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="team-email"
                        name="email"
                        placeholder="Optional"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label htmlFor="team-linkedin" className="form-label">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        id="team-linkedin"
                        name="linkedIn"
                        placeholder="Optional"
                        value={formData.linkedIn}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Visibility
                  </legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="team-order" className="form-label">
                        Display order
                      </label>
                      <input
                        type="number"
                        id="team-order"
                        name="order"
                        aria-describedby="team-order-hint"
                        value={formData.order}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <p id="team-order-hint" className="form-hint">
                        Lower numbers appear first.
                      </p>
                    </div>
                    <div className="sm:pt-6.5">
                      <label
                        htmlFor="team-active"
                        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700"
                      >
                        <input
                          type="checkbox"
                          id="team-active"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                          className="size-4 shrink-0 cursor-pointer accent-navy-800"
                        />
                        Active (visible on site)
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

export default TeamPanel
