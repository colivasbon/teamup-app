'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SportIcon } from '@/components/SportIcon';

const PROVINCIAS = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
  'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
  'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada',
  'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Illes Balears', 'Jaén',
  'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga',
  'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
];

const DEPORTES = [
  'running', 'padel', 'senderismo', 'futbol', 'gimnasio', 'tenis',
  'natacion', 'ciclismo', 'yoga', 'baloncesto', 'voleibol', 'badminton',
];

export default function OnboardingModal({ onComplete }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSport = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleFinish = async () => {
    if (selectedSports.length === 0) return;
    setLoading(true);
    try {
      const sb = getSupabase();
      await sb
        .from('profiles')
        .update({ location: selectedProvince, sports: selectedSports })
        .eq('id', user.id);
      onComplete();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes onboardingFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .onboarding-panel {
          animation: onboardingFadeIn 0.22s ease-out both;
        }
        .sport-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 8px;
          border-radius: 12px;
          border: 1.5px solid #e0ddd7;
          background: var(--solid, #fff);
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          color: inherit;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .sport-btn.selected {
          background: #586875;
          color: #f6eddc;
          border-color: #586875;
        }
        .sport-btn:hover:not(.selected) {
          border-color: #586875;
        }
        .progress-bar-track {
          height: 4px;
          border-radius: 2px;
          background: #e0ddd7;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: #586875;
          transition: width 0.3s ease;
        }
        .onboarding-btn-primary {
          display: block;
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          border: none;
          background: #586875;
          color: #f6eddc;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          transition: opacity 0.15s;
        }
        .onboarding-btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .onboarding-select {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #e0ddd7;
          background: var(--solid, #fff);
          font-size: 15px;
          color: inherit;
          margin-top: 8px;
          outline: none;
          cursor: pointer;
        }
        .onboarding-select:focus {
          border-color: #586875;
        }
        .sports-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 16px;
        }
      `}</style>

      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Panel */}
        <div
          className="onboarding-panel"
          style={{
            background: 'var(--solid, #fff)',
            borderRadius: 24,
            padding: 28,
            maxWidth: 400,
            width: 'calc(100% - 32px)',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {/* Progress bar */}
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          <p style={{ fontSize: 12, color: '#888', marginBottom: 12, marginTop: -8 }}>
            Paso {step} de 2
          </p>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                ¿Dónde estás?
              </h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                Te mostramos eventos cerca de ti
              </p>

              <select
                className="onboarding-select"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">Selecciona tu provincia…</option>
                {PROVINCIAS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <button
                className="onboarding-btn-primary"
                disabled={!selectedProvince}
                onClick={() => setStep(2)}
              >
                Siguiente →
              </button>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                ¿Qué deportes te gustan?
              </h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 0 }}>
                Elige todos los que quieras
              </p>

              <div className="sports-grid">
                {DEPORTES.map((sport) => {
                  const isSelected = selectedSports.includes(sport);
                  return (
                    <button
                      key={sport}
                      className={`sport-btn${isSelected ? ' selected' : ''}`}
                      onClick={() => toggleSport(sport)}
                      type="button"
                    >
                      <SportIcon sport={sport} size={28} />
                      <span style={{ textTransform: 'capitalize' }}>{sport}</span>
                    </button>
                  );
                })}
              </div>

              <button
                className="onboarding-btn-primary"
                disabled={selectedSports.length === 0 || loading}
                onClick={handleFinish}
              >
                {loading ? 'Guardando…' : 'Empezar'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
