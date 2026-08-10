// src/app/admin/settings/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Selected file preview state
  const [preview, setPreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  // Fetch current logo settings
  useEffect(() => {
    fetch('/api/settings?key=logoUrl')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.value) setLogoUrl(data.value);
      })
      .catch(() => {});
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!imageBase64) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'logoUrl', imageBase64 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to upload logo.');
      } else {
        setLogoUrl(data.value);
        setPreview('');
        setImageBase64('');
        setSuccess('🎉 Website logo updated successfully!');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!confirm('Are you sure you want to reset the website logo to the default SVG?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/settings?key=logoUrl', {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to reset logo.');
      } else {
        setLogoUrl('');
        setPreview('');
        setImageBase64('');
        setSuccess('✨ Website logo reset to default SVG successfully.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 650 }}>
      <h1 className="admin-page-title serif" style={{ marginBottom: 28 }}>
        Website Settings
      </h1>

      <div
        style={{
          background: '#fff',
          borderRadius: 'var(--r-lg)',
          padding: 32,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 className="serif" style={{ fontSize: 20, marginTop: 0, marginBottom: 20, color: 'var(--charcoal)' }}>
          Customize Website Logo
        </h2>

        {error && <div className="form-error" style={{ marginBottom: 20 }}>{error}</div>}
        {success && <div className="form-success" style={{ marginBottom: 20 }}>{success}</div>}

        {/* Current Logo Rendering */}
        <div style={{ marginBottom: 28 }}>
          <h4 style={{ fontSize: 13, color: 'var(--warm-gray)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current Brand Logo
          </h4>
          <div
            style={{
              background: 'var(--oat-pale, #FAF6EF)',
              border: '1px dashed rgba(44,44,44,.12)',
              borderRadius: 'var(--r-md)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 100,
            }}
          >
            {logoUrl ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={logoUrl}
                  alt="Custom Logo"
                  style={{ maxHeight: 60, width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 12px auto' }}
                />
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--terracotta)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset to Default SVG Logo
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--warm-gray)', fontSize: 13 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🧶</div>
                <strong>Using Default Vector SVG Logo</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: 11 }}>TRIANYAA emblem will display site-wide.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              Select Custom Logo Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                display: 'block',
                width: '100%',
                fontSize: 13,
                color: 'var(--warm-gray)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* New Selected Image Preview */}
          {preview && (
            <div>
              <h4 style={{ fontSize: 13, color: 'var(--warm-gray)', marginBottom: 8, textTransform: 'uppercase' }}>
                Selected Image Preview
              </h4>
              <div
                style={{
                  background: 'var(--oat-pale, #FAF6EF)',
                  border: '1px solid rgba(44,44,44,.12)',
                  borderRadius: 'var(--r-md)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={preview}
                  alt="New Logo Preview"
                  style={{ maxHeight: 60, width: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !imageBase64}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: 14,
              width: 'auto',
              alignSelf: 'start',
              background: loading || !imageBase64 ? 'var(--warm-gray)' : 'var(--forest)',
              cursor: loading || !imageBase64 ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Uploading logo to Cloudinary...' : 'Upload Custom Logo'}
          </button>
        </form>
      </div>
    </div>
  );
}
