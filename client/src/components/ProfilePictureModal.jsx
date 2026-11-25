import { useState } from 'react';
import { uploadAvatar } from '../api/auth';
import { parseApiError } from '../api/client';

export default function ProfilePictureModal({ user, onClose, onUpdated }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatarUrl || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, etc.)');
      return;
    }
    setError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || loading) return;
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await uploadAvatar(file);
      onUpdated(updatedUser);
      onClose();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || 'Failed to upload image');
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dialog modal-card"
        style={{ maxWidth: '400px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <div className="modal-header-text">
            <h2 className="modal-title">Update Profile Picture</h2>
            <p className="modal-subtitle">Choose a photo to personalize your account.</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {error && <div className="alert" role="alert" style={{ marginBottom: '16px' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0' }}>
          {preview ? (
            <img
              src={preview}
              alt="Avatar Preview"
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent, #10b981)',
                marginBottom: '16px',
              }}
            />
          ) : (
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'var(--border, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}

          <label
            className="btn btn-secondary btn-compact"
            style={{ cursor: 'pointer', marginBottom: '8px' }}
          >
            Choose Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
          {file && <span className="muted small">{file.name}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button type="button" className="btn btn-secondary btn-compact" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-compact"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
