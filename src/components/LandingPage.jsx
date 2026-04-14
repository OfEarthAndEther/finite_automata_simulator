import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Cpu, GitMerge } from 'lucide-react';

const Github = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const Linkedin = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

/* ── palette ── */
const C = {
  bg: '#FFFDF2',
  gold: '#D97706',
  goldFaint: 'rgba(217, 119, 6, 0.08)',
  goldDim: 'rgba(217, 119, 6, 0.22)',
  goldMid: 'rgba(217, 119, 6, 0.55)',
  cream: '#1E1B18',
  creamDim: 'rgba(30, 27, 24, 0.65)',
  dark: '#FFFDF2',
};

/* ── floating state-node background decoration ── */
const NODES = [
  { id: 'q0', x: '7%', y: '16%', label: 'q0', size: 54, delay: 0, dur: 7 },
  { id: 'q1', x: '82%', y: '11%', label: 'q1', size: 44, delay: 0.6, dur: 9 },
  { id: 'q2', x: '76%', y: '70%', label: 'q2', size: 58, delay: 1.2, dur: 8 },
  { id: 'q3', x: '13%', y: '76%', label: 'q3', size: 42, delay: 0.9, dur: 11 },
  { id: 'qf', x: '50%', y: '88%', label: 'qf', size: 36, delay: 1.8, dur: 6 },
  { id: 'qt', x: '90%', y: '44%', label: 'qt', size: 30, delay: 2.1, dur: 10 },
  { id: 'qa', x: '3%', y: '51%', label: 'qa', size: 34, delay: 1.5, dur: 9 },
];

function FloatingNode({ x, y, label, size, delay, dur, accepting }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 0 }}
      animate={{ opacity: [0.15, 0.3, 0.15], y: [0, -12, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} overflow="visible">
        {accepting && (
          <circle cx="50" cy="50" r="48" fill="none" stroke={C.gold} strokeWidth="2.5" opacity="0.4" />
        )}
        <circle cx="50" cy="50" r="40" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.55" />
        <circle cx="50" cy="50" r="30" fill={C.goldFaint} />
        <text
          x="50" y="57"
          textAnchor="middle"
          fill={C.gold}
          fontSize="26"
          fontFamily="monospace"
          opacity="0.7"
        >
          {label}
        </text>
      </svg>
    </motion.div>
  );
}

/* ── automata type badge ── */
function Badge({ Icon, label, sublabel, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 18px',
        border: `1px solid ${C.goldDim}`,
        borderRadius: 8,
        background: C.goldFaint,
      }}
    >
      <Icon size={15} color={C.gold} />
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, color: C.gold, letterSpacing: '0.06em' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.goldMid, marginTop: 2 }}>
          {sublabel}
        </div>
      </div>
    </motion.div>
  );
}

/* ── social link ── */
function SocialLink({ href, Icon, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '9px 20px',
        border: `1px solid ${hov ? C.goldMid : C.goldDim}`,
        borderRadius: 6,
        color: hov ? C.gold : C.goldMid,
        fontFamily: 'monospace',
        fontSize: 12,
        letterSpacing: '0.05em',
        textDecoration: 'none',
        background: hov ? C.goldFaint : 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <Icon size={13} />
      {children}
    </a>
  );
}

/* ── CTA button ── */
function EnterButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '15px 36px',
        border: `1.5px solid ${C.gold}`,
        borderRadius: 4,
        background: hov ? C.gold : 'transparent',
        color: hov ? C.dark : C.gold,
        fontFamily: 'monospace',
        fontSize: 14,
        letterSpacing: '0.12em',
        cursor: 'pointer',
        transition: 'all 0.28s ease',
        outline: 'none',
      }}
    >
      Launch Simulator
      <ArrowRight size={16} />
    </button>
  );
}

/* ══════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════ */
export default function LandingPage({ onEnter }) {
  const TAGLINE = "delta(q, sigma) -> q'  ·  epsilon-closure  ·  formal language";
  const [typed, setTyped] = useState('');

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTyped(TAGLINE.slice(0, i + 1));
      i++;
      if (i >= TAGLINE.length) clearInterval(iv);
    }, 36);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: C.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 24px',
      boxSizing: 'border-box',
    }}>

      {/* Dot-grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(217, 119, 6, 0.10) 0%, transparent 55%)',
          'linear-gradient(rgba(217, 119, 6, 0.05) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(217, 119, 6, 0.05) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '100% 100%, 48px 48px, 48px 48px',
      }} />

      {/* Floating nodes */}
      {NODES.map(n => (
        <FloatingNode key={n.id} {...n} accepting={n.id === 'qf'} />
      ))}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 72% 72% at 50% 50%, transparent 25%, rgba(255,253,242,0.88) 100%)',
      }} />

      {/* ── Main content ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 660, width: '100%',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Category label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: 11,
            letterSpacing: '0.18em', color: C.goldMid,
            textTransform: 'uppercase', marginBottom: 28,
          }}
        >
          <Terminal size={12} color={C.goldMid} />
          Theory of Automata &amp; Formal Languages
        </motion.div>

        {/* Heading line 1 */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(38px, 6.5vw, 64px)',
            fontWeight: 300, lineHeight: 1.08,
            color: C.cream, margin: '0 0 4px 0',
            letterSpacing: '-0.01em',
            fontFamily: 'Georgia, serif',
          }}
        >
          Finite Automata
        </motion.div>

        {/* Heading line 2 — italic gold */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          style={{
            fontSize: 'clamp(38px, 6.5vw, 64px)',
            fontWeight: 300, fontStyle: 'italic', lineHeight: 1.08,
            color: C.gold, margin: '0 0 30px 0',
            letterSpacing: '-0.01em',
            fontFamily: 'Georgia, serif',
          }}
        >
          Simulator
        </motion.div>

        {/* Typewriter line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            fontFamily: 'monospace', fontSize: 11,
            color: C.goldMid, letterSpacing: '0.04em',
            minHeight: 18, marginBottom: 38,
          }}
        >
          {typed}
          <span style={{ opacity: 0.35 }}>|</span>
        </motion.div>

        {/* Type badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            display: 'flex', gap: 12,
            justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: 46,
          }}
        >
          <Badge Icon={Cpu} label="DFA" sublabel="Deterministic" delay={0.5} />
          <Badge Icon={GitMerge} label="NFA" sublabel="Non-Deterministic" delay={0.62} />
          <Badge Icon={Terminal} label="e-NFA" sublabel="Epsilon Transitions" delay={0.74} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.84 }}
          style={{ marginBottom: 8 }}
        >
          <EnterButton onClick={onEnter} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.38 }}
          transition={{ delay: 1.1 }}
          style={{
            fontFamily: 'monospace', fontSize: 10,
            color: C.goldMid, letterSpacing: '0.08em',
          }}
        >
          Interactive DFA · NFA · e-NFA visualization &amp; simulation
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.65, ease: 'easeOut' }}
          style={{
            width: '100%', maxWidth: 480, height: 1,
            background: `linear-gradient(90deg, transparent, ${C.goldDim}, transparent)`,
            margin: '42px auto',
          }}
        />

        {/* Author card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            border: `1px solid ${C.goldDim}`,
            borderRadius: 12,
            padding: '28px 32px',
            background: C.goldFaint,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Avatar circle */}
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            border: `1.5px solid ${C.goldDim}`,
            background: C.goldFaint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Georgia, serif',
            fontSize: 22, color: C.gold, fontWeight: 400,
          }}>
            S
          </div>

          {/* Name */}
          <div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 22, fontWeight: 400,
              color: C.cream, marginBottom: 4,
            }}>
              Srishti
            </div>
            <div style={{
              fontFamily: 'monospace', fontSize: 11,
              color: C.goldMid, letterSpacing: '0.1em',
            }}>
              2024UCA1923 · CSAI-2
            </div>
          </div>

          {/* Bio */}
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: 14, color: C.creamDim,
            lineHeight: 1.6, maxWidth: 660,
            textAlign: 'left',
          }}>
            <p style={{marginBottom: '0.8em'}}>
              Hi, I am Srishti, a Computer Science Engineering undergrad at Netaji Subhas University of Technology. I am currently exploring the convergence of computational systems and human cognition. My work operates at the intersection of rigorous systems engineering—specifically high-performance computing and operating system architecture—and the abstract theoretical frameworks of philosophy and psychology.
            </p>
            <p style={{marginBottom: '0.8em'}}>
              I believe that the pursuit of Artificial General Intelligence (AGI) requires a synthesis of mathematical pattern analysis, evolutionary history, and behavioral psychology. Without the semantic depth provided by art and philosophy, technical execution remains incomplete.
            </p>
            <div style={{fontWeight: 'bold', marginBottom: '0.4em', color: C.cream}}>Research Focus:</div>
            <ul style={{margin: '0 0 1em 1.5em', padding: 0}}>
              <li style={{marginBottom: '0.3em'}}><strong>The Convergence of AGI &amp; Psychology:</strong> Investigating whether human behavioral patterns and machine learning models share a converging asymptotic limit.</li>
              <li><strong>Systems Architecture:</strong> Analyzing the Zircon microkernel (Fuchsia OS) with a focus on capability-based security and inter-process communication (IPC) primitives compared to traditional monolithic kernels.</li>
            </ul>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <SocialLink href="https://www.linkedin.com/in/sriiishmiss" Icon={Linkedin}>
              LinkedIn
            </SocialLink>
            <SocialLink href="https://github.com/OfEarthAndEther" Icon={Github}>
              GitHub
            </SocialLink>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            marginTop: 36,
            fontFamily: 'monospace', fontSize: 10,
            color: C.goldDim,
            letterSpacing: '0.1em',
          }}
        >
          React 19 · Vite · React Flow · Framer Motion
        </motion.div>

      </div>
    </div>
  );
}