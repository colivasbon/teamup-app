'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function KarmaPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ev, setEv] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState(null); // null=loading, true=ok, false=no

  const [existingVote, setExistingVote] = useState(null); // the vote the user already cast for organizer
  const [votedOrganizer, setVotedOrganizer] = useState(null); // 1 or -1 just cast
  const [success, setSuccess] = useState(false);
  const [voting, setVoting] = useState(false);

  const [participantVotes, setParticipantVotes] = useState({}); // {profileId: true}
  const [votingParticipant, setVotingParticipant] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user || !id) return;
    const supabase = getSupabase();

    // Load event
    const { data: eventData } = await supabase
      .from('events')
      .select('*, profiles:creator_id(id, full_name, avatar_url)')
      .eq('id', id)
      .single();

    if (!eventData) {
      setAccess(false);
      setLoading(false);
      return;
    }

    setEv(eventData);
    setOrganizer(eventData.profiles);

    // Check if event has ended
    const eventDate = eventData.date || eventData.created_at;
    const eventTime = eventData.time || '00:00';
    const duration = eventData.duration_minutes || 0;
    const startStr = `${eventDate.slice(0, 10)}T${eventTime}:00`;
    const startMs = new Date(startStr).getTime();
    const endMs = startMs + duration * 60 * 1000;
    const eventEnded = Date.now() > endMs;

    if (!eventEnded) {
      setAccess(false);
      setLoading(false);
      return;
    }

    // Check if user participated (joined the event)
    const { data: participation } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!participation) {
      setAccess(false);
      setLoading(false);
      return;
    }

    setAccess(true);

    // Check if user already voted for organizer
    const { data: existingVoteData } = await supabase
      .from('karma_votes')
      .select('vote')
      .eq('event_id', id)
      .eq('voter_id', user.id)
      .eq('target_id', eventData.creator_id)
      .maybeSingle();

    if (existingVoteData) setExistingVote(existingVoteData.vote);

    // Load participants (excluding creator and self)
    const { data: participantsData } = await supabase
      .from('event_participants')
      .select('profiles:user_id(id, full_name, avatar_url)')
      .eq('event_id', id)
      .neq('user_id', eventData.creator_id)
      .neq('user_id', user.id);

    if (participantsData) {
      setParticipants(participantsData.map((p) => p.profiles).filter(Boolean));
    }

    // Check which participants the user already voted for
    const { data: extraVotes } = await supabase
      .from('karma_votes')
      .select('target_id')
      .eq('event_id', id)
      .eq('voter_id', user.id)
      .neq('target_id', eventData.creator_id);

    if (extraVotes) {
      const map = {};
      extraVotes.forEach((v) => { map[v.target_id] = true; });
      setParticipantVotes(map);
    }

    setLoading(false);
  }, [user, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const voteOrganizer = async (vote) => {
    if (!user || !ev || voting) return;
    setVoting(true);
    const supabase = getSupabase();
    await supabase.from('karma_votes').insert({
      event_id: id,
      voter_id: user.id,
      target_id: ev.creator_id,
      vote,
    });
    setVotedOrganizer(vote);
    setSuccess(true);
    setVoting(false);
    setTimeout(() => {
      router.push(`/events/${id}`);
    }, 2000);
  };

  const voteParticipant = async (targetId) => {
    if (!user || !ev || participantVotes[targetId] || votingParticipant) return;
    setVotingParticipant(targetId);
    const supabase = getSupabase();
    await supabase.from('karma_votes').insert({
      event_id: id,
      voter_id: user.id,
      target_id: targetId,
      vote: 1,
    });
    setParticipantVotes((prev) => ({ ...prev, [targetId]: true }));
    setVotingParticipant(null);
  };

  // --- Render states ---

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

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--text)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <p>Necesitas iniciar sesión para valorar eventos.</p>
        <button className="btn btn-primary" onClick={() => router.push('/login')}>
          Iniciar sesión
        </button>
        <Navbar />
      </div>
    );
  }

  if (access === false) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--text)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 4 }}>🔒</div>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Sin acceso</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Solo puedes valorar un evento si participaste en él y ya ha terminado.
        </p>
        <button className="btn btn-ghost" onClick={() => router.push(`/events/${id}`)}>
          Volver al evento
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
          aria-label="Volver"
        >
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Valorar evento</h1>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 20px' }}>
        {/* Success banner */}
        {success && (
          <div
            style={{
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 12,
              padding: '14px 18px',
              marginBottom: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#16a34a',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>✅</span>
            <span>¡Gracias por tu valoración! Redirigiendo…</span>
          </div>
        )}

        {/* Organizer section */}
        <div
          className="card"
          style={{ textAlign: 'center', padding: '28px 20px', marginBottom: 24 }}
        >
          {organizer?.avatar_url ? (
            <img
              src={organizer.avatar_url}
              alt={organizer.full_name || 'Organizador'}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 12px',
                display: 'block',
                border: '3px solid var(--border)',
              }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--surface2)',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
              }}
            >
              👤
            </div>
          )}
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
            Organizado por
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>
            {organizer?.full_name || 'El organizador'}
          </p>

          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
            ¿Cómo fue el evento?
          </h2>

          {existingVote !== null || votedOrganizer !== null ? (
            <div style={{ padding: '16px 0' }}>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>
                Ya has valorado este evento
              </p>
              <span style={{ fontSize: 36 }}>
                {(existingVote ?? votedOrganizer) === 1 ? '👍' : '👎'}
              </span>
              <p style={{ fontSize: 14, marginTop: 8, fontWeight: 600 }}>
                {(existingVote ?? votedOrganizer) === 1 ? 'Genial' : 'No tan bien'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={() => voteOrganizer(1)}
                disabled={voting}
                style={{
                  flex: 1,
                  maxWidth: 160,
                  padding: '20px 16px',
                  background: 'var(--surface)',
                  border: '2px solid var(--border)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, transform 0.1s',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#22c55e';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>👍</div>
                Genial
              </button>
              <button
                onClick={() => voteOrganizer(-1)}
                disabled={voting}
                style={{
                  flex: 1,
                  maxWidth: 160,
                  padding: '20px 16px',
                  background: 'var(--surface)',
                  border: '2px solid var(--border)',
                  borderRadius: 16,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, transform 0.1s',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>👎</div>
                No tan bien
              </button>
            </div>
          )}
        </div>

        {/* Participants kudos section */}
        {participants.length > 0 && (
          <div className="card" style={{ padding: '24px 20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              ¿Quieres destacar a alguien del grupo?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
              Da +1 karma a quien lo merezca. Puedes votar a varios.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {participants.map((p) => {
                const voted = participantVotes[p.id];
                const isVoting = votingParticipant === p.id;
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      background: voted ? 'rgba(34,197,94,0.08)' : 'var(--surface)',
                      borderRadius: 12,
                      border: `1px solid ${voted ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    {p.avatar_url ? (
                      <img
                        src={p.avatar_url}
                        alt={p.full_name || ''}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--border)',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'var(--surface2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        👤
                      </div>
                    )}
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                      {p.full_name || 'Participante'}
                    </span>
                    <button
                      onClick={() => voteParticipant(p.id)}
                      disabled={voted || isVoting}
                      style={{
                        padding: '7px 14px',
                        background: voted ? 'transparent' : 'var(--surface2)',
                        border: `1px solid ${voted ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                        borderRadius: 8,
                        cursor: voted ? 'default' : 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                        color: voted ? '#16a34a' : 'var(--text)',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isVoting ? (
                        <span className="spinner" />
                      ) : voted ? (
                        '⭐ +1 dado'
                      ) : (
                        '⭐ +1 karma'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}
