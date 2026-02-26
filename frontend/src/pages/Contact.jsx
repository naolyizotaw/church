import { useState } from 'react';
import api from '../api/axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await api.post('/contacts', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Contact Us</h1>
      <p style={styles.sub}>We would love to hear from you. Send us a message below.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {status === 'success' && (
          <p style={styles.success}>Message sent! We will get back to you soon.</p>
        )}
        {status === 'error' && (
          <p style={styles.error}>Something went wrong. Please try again.</p>
        )}
        <label style={styles.label}>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="Your name"
        />
        <label style={styles.label}>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="you@example.com"
        />
        <label style={styles.label}>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ ...styles.input, resize: 'vertical' }}
          placeholder="Write your message here…"
        />
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '0.5rem' },
  sub: { color: '#6b7280', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { fontWeight: '600', fontSize: '0.9rem', color: '#374151' },
  input: {
    padding: '0.65rem 0.85rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
  },
  btn: {
    background: '#1a1a2e',
    color: '#e2b04a',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  success: { color: '#16a34a', background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', margin: 0 },
  error: { color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: '6px', margin: 0 },
};
