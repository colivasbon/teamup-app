'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const DURATION_OPTIONS = [
  { label: '30 min', value: 30 },
  { label: '1 h', value: 60 },
  { label: '1 h 30 min', value: 90 },
  { label: '2 h', value: 120 },
  { label: '2 h 30 min', value: 150 },
  { label: '3 h', value: 180 },
  { label: '4 h', value: 240 },
  { label: 'Todo el día', value: 1440 },
];

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration_minutes: 60,
    location: '',
    province: '',
    max_players: '',
    price: '',
    third_place: false,
  });

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      const supabase = getSupabase();
      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (err || !data) {
        setLoading(false);
        return;
      }

      setEv(data);

      // Extract date and time from stored datetime
      const dateObj = data.date ? new Date(data.date) : null;
      const dateStr = dateObj
        ? dateObj.toISOString().slice(0, 10)
        : '';
      const timeStr = data.time || (dateObj ? dateObj.toTimeString().slice(0, 5) : '');

      setForm({
        title: data.title || '',
        description: data.description || '',
        date: dateStr,
        time: timeStr,
        duration_minutes: data.duration_minutes || 60,
        location: data.location || '',
        province: data.province || '',
        max_players: data.max_players?.toString() || '',
        price: data.price?.toString() || '',
        third_place: data.third_place || false,
      });

      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  // Auth / owner guard
  useEffect(() => {
    if (!loading && ev && user && ev.creator_id !== user.id) {
      router.replace(`/events/${id}`);
    }
  }, [loading, ev, user, id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const supabase = getSupabase();
    const { error: updateErr } = await supabase
      .from('events')
      .update({
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time,
        duration_minutes: parseInt(form.duration_minutes, 10),
        location: form.location.trim(),
        province: form.province.trim(),
        max_players: form.max_players ? parseInt(form.max_players, 10) : null,
        price: form.price ? parseFloat(form.price) : null,
        third_place: form.third_place,
      })
      .eq('id', id);

    setSaving(false);
    if (updateErr) {
      setError('Error al guardar los cambios. Inténtalo de nuevo.');
      return;
    }
    router.push(`/events/${id}`);
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      '¿Seguro que quieres cancelar este evento? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;
    setCancelling(true);
    const supabase = getSupabase();
    await supabase
      .from('events')
      .update({ cancelled: true })
      .eq('id', id);
    setCancelling(false);
    router.push('/events');
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="spinner" />
      </div>
    );
  }

  if (!ev) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <p>Evento no encontrado.</p>
        <button className="btn btn-ghost" onClick={() => router.back()}>
          Volver
        </button>
        <Navbar />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          className="btn btn-ghost"
          style={{ padding: '6px 10px', fontSize: 20, lineHeight: 1 }}
          onClick={() => router.push(`/events/${id}`)}
          aria-label="Volver al evento"
        >
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Editar evento</h1>
      </div>

      <form
        onSubmit={handleSave}
        style={{ maxWidth: 560, margin: '0 auto', padding: '24px 20px' }}
      >
        {/* Título */}
        <div style={{ marginBottom: 20 }}>
          <label className="label" htmlFor="title">
            Título *
          </label>
          <input
            className="input"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ej: Pádel tarde libre"
            style={{ width: '100%' }}
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: 20 }}>
          <label className="label" htmlFor="description">
            Descripción
          </label>
          <textarea
            className="input"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detalles del evento…"
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        {/* Fecha y hora */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label className="label" htmlFor="date">
              Fecha *
            </label>
            <input
              className="input"
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label" htmlFor="time">
              Hora *
            </label>
            <input
              className="input"
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Duración */}
        <div style={{ marginBottom: 20 }}>
          <label className="label">Duración</label>
          <div
            className="scroll-x"
            style={{ display: 'flex', gap: 8, paddingBottom: 4 }}
          >
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={
                  form.duration_minutes === opt.value
                    ? 'pill pill-active'
                    : 'pill pill-inactive'
                }
                onClick={() =>
                  setForm((prev) => ({ ...prev, duration_minutes: opt.value }))
                }
                style={{ whiteSpace: 'nowrap' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lugar */}
        <div style={{ marginBottom: 20 }}>
          <label className="label" htmlFor="location">
            Lugar
          </label>
          <input
            className="input"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Nombre del recinto o dirección"
            style={{ width: '100%' }}
          />
        </div>

        {/* Provincia */}
        <div style={{ marginBottom: 20 }}>
          <label className="label" htmlFor="province">
            Provincia
          </label>
          <input
            className="input"
            id="province"
            name="province"
            value={form.province}
            onChange={handleChange}
            placeholder="Ej: Madrid"
            style={{ width: '100%' }}
          />
        </div>

        {/* Max jugadores y precio */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label className="label" htmlFor="max_players">
              Jugadores máx.
            </label>
            <input
              className="input"
              id="max_players"
              name="max_players"
              type="number"
              min={2}
              max={100}
              value={form.max_players}
              onChange={handleChange}
              placeholder="Ej: 10"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label" htmlFor="price">
              Precio (€)
            </label>
            <input
              className="input"
              id="price"
              name="price"
              type="number"
              min={0}
              step={0.5}
              value={form.price}
              onChange={handleChange}
              placeholder="0 = gratis"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Tercer puesto */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 28,
            padding: '14px 16px',
            background: 'var(--surface)',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          <input
            type="checkbox"
            id="third_place"
            name="third_place"
            checked={form.third_place}
            onChange={handleChange}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
          <label
            htmlFor="third_place"
            style={{ fontSize: 14, cursor: 'pointer', userSelect: 'none' }}
          >
            Incluir partido por el tercer puesto
          </label>
        </div>

        {error && (
          <p
            style={{
              color: '#ef4444',
              fontSize: 14,
              marginBottom: 16,
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.08)',
              borderRadius: 8,
            }}
          >
            {error}
          </p>
        )}

        {/* Guardar */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          style={{ width: '100%', marginBottom: 12 }}
        >
          {saving ? <span className="spinner" /> : 'Guardar cambios'}
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push(`/events/${id}`)}
          style={{ width: '100%', marginBottom: 32 }}
        >
          Cancelar
        </button>

        {/* Zona peligrosa */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
            }}
          >
            Zona de peligro
          </p>
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            {cancelling ? <span className="spinner" /> : '🗑 Cancelar evento'}
          </button>
        </div>
      </form>

      <Navbar />
    </div>
  );
}
