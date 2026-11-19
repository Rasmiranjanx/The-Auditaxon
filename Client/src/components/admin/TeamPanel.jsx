import React, { useState, useEffect } from 'react'
import api from '../../lib/api'

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

  const inputClass =
    'bg-black border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-white transition w-full'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Team</h2>
        <button
          onClick={openNewForm}
          className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          + Add Team Member
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : members.length === 0 ? (
        <p className="text-slate-400">No team members yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                    {member.category}
                  </span>
                  <h3 className="text-white font-medium">{member.name}</h3>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  {member.role}
                  {member.designation ? ` — ${member.designation}` : ''}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditForm(member)}
                  className="text-slate-300 hover:text-white text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
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
              {editingId ? 'Edit Team Member' : 'Add Team Member'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                type="text"
                name="role"
                placeholder="Role (e.g. Partner) *"
                value={formData.role}
                onChange={handleChange}
                required
                className={inputClass}
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="partner">Partner</option>
                <option value="associate">Associate</option>
              </select>

              <input
                type="text"
                name="designation"
                placeholder="Designation (e.g. Chartered Accountant)"
                value={formData.designation}
                onChange={handleChange}
                className={inputClass}
              />
              <textarea
                name="bio"
                placeholder="Short bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className={inputClass}
              ></textarea>
              <input
                type="text"
                name="qualifications"
                placeholder="Qualifications (comma separated, e.g. FCA, LLB)"
                value={formData.qualifications}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="url"
                name="linkedIn"
                placeholder="LinkedIn URL (optional)"
                value={formData.linkedIn}
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
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active (visible on site)
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

export default TeamPanel
