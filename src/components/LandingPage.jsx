import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, ArrowRight, Terminal, Cpu, GitMerge } from 'lucide-react';

/* ─────────────────────────────────────────────
   Floating state-node decoration (background)
───────────────────────────────────────────── */
const NODES = [
  { id: 'q0', x: '8%', y: '18%', label: 'q₀', size: 52, delay: 0, duration: 7 },
  { id: 'q1', x: '82%', y: '12%', label: 'q₁', size: 44, delay: 0.6, duration: 9 },
  { id: 'q2', x: '75%', y: '72%', label: 'q₂', size: 56, delay: 1.2, duration: 8 },
  { id: 'q3', x: '14%', y: '78%', label: 'q₃', size: 40, delay: 0.9, duration: 11 },
  { id: 'qf', x: '50%', y: '88%', label: 'qf', size: 36, delay: 1.8, duration: 6 },
  { id: 'qt', x: '90%', y: '44%', label: 'qₜ', size: 30, delay: 2.1, duration: 10 },
  { id: 'qa', x: '4%', y: '52%', label: 'qₐ', size: 34, delay: 1.5, duration: 9 },
];

function FloatingNode({ x, y, label, size, delay, duration, isAccepting }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.18, 0.34, 0.18],
        y: [0, -14, 0],
        scale: [1, 1.07, 1],
      }}
      transition={{
        opacity: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: duration * 0.8, delay, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: duration * 1.1, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {isAccepting && (
          <circle cx="50" cy="50" r="48" fill="none" stroke="#c9a84c" strokeWidth="3" opacity="0.5" />
        )}
        <circle cx="50" cy="50" r="42" fill="none" stroke="#c9a84c" strokeWidth="2.5" opacity="0.6" />
        <circle cx="50" cy="50" r="32" fill="rgba(201,168,76,0.06)" />
        <text x="50" y="55" textAnchor="middle" fill="#c9a84c" fontSize="28" fontFamily="'IBM Plex Mono', monospace" opacity="0.7">
          {label}
        </text>
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Pill badge
───────────────────────────────────────────── */
function TypeBadge({ icon: Icon, label, sublabel, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: '8px',
        background: 'rgba(201,168,76,0.05)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Icon size={16} color="#c9a84c" opacity={0.85} />
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#c9a84c', letterSpacing: '0.06em' }}>
          {label}
        </div>
        <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: '11px', color: 'rgba(201,168,76,0.55)', marginTop: '1px' }}>
          {sublabel}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main landing page
───────────────────────────────────────────── */
export default function LandingPage({ onEnter }) {
  const [hovered, setHovered] = useState(false);
  const [typed, setTyped] = useState('');
  const TAGLINE = 'δ(q, σ) → q\'  ·  ε-closure  ·  formal language boundaries';

  // Typewriter effect for tagline
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(TAGLINE.slice(0, i + 1));
      i++;
      if (i >= TAGLINE.length) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        .landing-root {
          min-height: 100vh;
          background: #07070f;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,168,76,0.10) 0%, transparent 60%),
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 100% 100%, 48px 48px, 48px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 40px 24px;
        }

        .enter-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          background: transparent;
          border: 1.5px solid #c9a84c;
          border-radius: 4px;
          color: #c9a84c;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.12em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease;
        }
        .enter-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #c9a84c;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .enter-btn:hover::before { transform: translateX(0); }
        .enter-btn:hover { color: #07070f; }
        .enter-btn span, .enter-btn svg { position: relative; z-index: 1; }

        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 6px;
          color: rgba(201,168,76,0.7);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
          text-decoration: none;
          background: transparent;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .social-link:hover {
          border-color: rgba(201,168,76,0.6);
          color: #c9a84c;
          background: rgba(201,168,76,0.06);
        }

        .divider-line {
          width: 100%;
          max-width: 520px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent);
          margin: 40px 0;
        }

        @media (max-width: 600px) {
          .hero-title { font-size: clamp(32px, 8vw, 52px) !important; }
        }
      `}</style>

      <div className="landing-root">

        {/* Floating background state nodes */}
        {NODES.map((n, i) => (
          <FloatingNode key={n.id} {...n} isAccepting={n.id === 'qf'} />
        ))}

        {/* Vignette overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(7,7,15,0.85) 100%)',
        }} />

        {/* ── Main content ── */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, width: '100%', textAlign: 'center' }}>

          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'rgba(201,168,76,0.6)',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            <Terminal size={12} color="rgba(201,168,76,0.5)" />
            Theory of Automata &amp; Formal Languages
          </motion.div>

          {/* Hero title */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: 'clamp(42px, 6vw, 68px)',
              fontWeight: 300,
              lineHeight: 1.08,
              color: '#f0e6cc',
              letterSpacing: '-0.01em',
              margin: '0 0 6px 0',
            }}
          >
            Finite Automata
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: 'clamp(42px, 6vw, 68px)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.08,
              color: '#c9a84c',
              letterSpacing: '-0.01em',
              margin: '0 0 32px 0',
            }}
          >
            Simulator
          </motion.h1>

          {/* Typewriter tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: 'rgba(201,168,76,0.5)',
              letterSpacing: '0.04em',
              minHeight: '20px',
              marginBottom: '40px',
            }}
          >
            {typed}<span style={{ opacity: 0.4 }}>|</span>
          </motion.p>

          {/* Type badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <TypeBadge icon={Cpu} label="DFA" sublabel="Deterministic" delay={0.55} />
            <TypeBadge icon={GitMerge} label="NFA" sublabel="Non-Deterministic" delay={0.65} />
            <TypeBadge icon={Terminal} label="ε-NFA" sublabel="Epsilon Transitions" delay={0.75} />
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.85 }}
            style={{ marginBottom: '8px' }}
          >
            <button
              className="enter-btn"
              onClick={onEnter}
              aria-label="Launch the Finite Automata Simulator"
            >
              <span>Launch Simulator</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.1 }}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(201,168,76,0.5)',
              letterSpacing: '0.08em',
              marginBottom: '0',
            }}
          >
            Interactive DFA · NFA · ε-NFA visualization &amp; simulation
          </motion.p>

          {/* Divider */}
          <motion.div
            className="divider-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.7, ease: 'easeOut' }}
            style={{ margin: '44px auto' }}
          />

          {/* Author card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            style={{
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '12px',
              padding: '28px 32px',
              background: 'rgba(201,168,76,0.03)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Author avatar placeholder */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '1.5px solid rgba(201,168,76,0.35)',
              background: 'rgba(201,168,76,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Crimson Pro', serif",
              fontSize: '22px',
              color: '#c9a84c',
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}>
              S
            </div>

            <div>
              <div style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: '22px',
                fontWeight: 400,
                color: '#f0e6cc',
                letterSpacing: '0.01em',
                marginBottom: '4px',
              }}>
                Srishti
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: 'rgba(201,168,76,0.5)',
                letterSpacing: '0.1em',
              }}>
                2024UCA1923 · CSAI-2
              </div>
            </div>

            <p style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: '15px',
              color: 'rgba(240,230,204,0.55)',
              lineHeight: 1.6,
              maxWidth: 380,
              margin: '0',
              fontStyle: 'italic',
            }}>
              Building tools where theoretical computation meets interactive visualization — bridging formal language theory with modern web performance.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href="https://www.linkedin.com/in/sriiishmiss"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Srishti on LinkedIn"
              >
                <Linkedin size={13} />
                LinkedIn
              </a>
              <a
                href="https://github.com/OfEarthAndEther"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Srishti on GitHub"
              >
                <Github size={13} />
                GitHub
              </a>
            </div>
          </motion.div>

          {/* Footer label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{
              marginTop: '40px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(201,168,76,0.25)',
              letterSpacing: '0.1em',
            }}
          >
            React 19 · Vite · React Flow · Framer Motion
          </motion.div>
        </div>
      </div>
    </>
  );
}
