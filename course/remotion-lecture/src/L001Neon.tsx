import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * DigProg L01 — Instagram-style neon stick-figure explainer
 * Visual language inspired by innerthinkings-style Reels:
 * black field, white/cyan glow line art, kinetic captions.
 * Same educational VO + quiz handoff as L001Pro.
 */
export const L001_NEON_FPS = 30;
export const L001_NEON_DURATION = Math.ceil(75.5 * L001_NEON_FPS);

const BG = "#05070A";
const WHITE = "#F8FAFC";
const CYAN = "#22D3EE";
const CYAN_DIM = "#0E7490";
const MUTED = "#64748B";
const ORANGE = "#FB923C";
const BLUE = "#3B82F6";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: easeOut });

const glowText = (color: string): React.CSSProperties => ({
  color,
  textShadow: `0 0 18px ${color}99, 0 0 40px ${color}44`,
});

const Badge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 36,
      left: 48,
      zIndex: 30,
      fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      fontWeight: 800,
      fontSize: 18,
      letterSpacing: 1,
      color: WHITE,
      border: `1.5px solid ${CYAN}`,
      borderRadius: 8,
      padding: "8px 14px",
      boxShadow: `0 0 20px ${CYAN}44`,
      background: "#0B1220CC",
    }}
  >
    DigProg · L01
  </div>
);

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const pulse = interpolate(Math.sin(f / 40), [-1, 1], [0.35, 0.55]);
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at 50% 55%, ${CYAN}${Math.round(pulse * 40).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** Kinetic caption line — highlight words in cyan */
const Caption: React.FC<{
  parts: { t: string; hi?: boolean }[];
  top?: number;
  size?: number;
  delay?: number;
}> = ({ parts, top = 120, size = 52, delay = 0 }) => {
  const f = useCurrentFrame();
  const o = fade(f, delay, delay + 12);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        right: 80,
        textAlign: "center",
        opacity: o,
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -0.5,
        lineHeight: 1.2,
        textTransform: "uppercase",
      }}
    >
      {parts.map((p, i) => (
        <span key={i} style={glowText(p.hi ? CYAN : WHITE)}>
          {p.t}
          {i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

const Stick: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  pose?: "stand" | "think" | "point" | "wave";
}> = ({ x, y, scale = 1, color = WHITE, pose = "stand" }) => {
  const arm =
    pose === "think"
      ? "M40 70 L28 52"
      : pose === "point"
        ? "M40 70 L70 55"
        : pose === "wave"
          ? "M40 70 L58 42"
          : "M40 70 L22 95 M40 70 L58 95";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
      <circle cx={40} cy={40} r={16} />
      <path d="M40 56 L40 110" />
      <path d={arm} />
      {pose === "stand" || pose === "wave" ? <path d="M40 110 L22 150 M40 110 L58 150" /> : <path d="M40 110 L22 150 M40 110 L58 150" />}
    </g>
  );
};

const PhoneIcon: React.FC<{ x: number; y: number; hearts?: number }> = ({
  x,
  y,
  hearts = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`} style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }}>
      <rect x={0} y={0} width={70} height={120} rx={12} fill="none" stroke={WHITE} strokeWidth={3} />
      <rect x={10} y={18} width={50} height={70} rx={4} fill="none" stroke={CYAN} strokeWidth={2} />
      {Array.from({ length: hearts }).map((_, i) => {
        const a = fade(f, 20 + i * 12, 32 + i * 12);
        return (
          <text
            key={i}
            x={80 + (i % 2) * 18}
            y={30 + i * 22}
            fill={ORANGE}
            fontSize={22}
            opacity={a}
            style={{ filter: `drop-shadow(0 0 6px ${ORANGE})` }}
          >
            ♥
          </text>
        );
      })}
    </g>
  );
};

const GuideIcon: React.FC<{ x: number; y: number; showPrice?: boolean }> = ({
  x,
  y,
  showPrice,
}) => (
  <g transform={`translate(${x} ${y})`} style={{ filter: `drop-shadow(0 0 10px ${ORANGE})` }}>
    <rect x={0} y={0} width={90} height={120} rx={8} fill="none" stroke={ORANGE} strokeWidth={3} />
    <path d="M16 28 H74 M16 48 H60 M16 68 H68" stroke={ORANGE} strokeWidth={2} opacity={0.8} />
    {showPrice && (
      <text x={45} y={108} textAnchor="middle" fill={ORANGE} fontSize={22} fontWeight={800} fontFamily="system-ui,sans-serif">
        $79
      </text>
    )}
  </g>
);

const Node: React.FC<{
  label: string;
  color: string;
  x: number;
  y: number;
  active: boolean;
  delay: number;
}> = ({ label, color, x, y, active, delay }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, f - delay), fps, config: { damping: 14, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${0.85 + s * 0.15})`,
        opacity: 0.2 + s * 0.8,
        border: `2px solid ${color}`,
        background: active ? color : "#0B1220",
        color: active ? BG : color,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 900,
        fontSize: 28,
        padding: "14px 26px",
        borderRadius: 14,
        boxShadow: `0 0 24px ${color}66`,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {label}
    </div>
  );
};

/* ── Scenes timed to Brian VO timeline ── */

const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const hearts = Math.min(4, Math.floor(interpolate(f, [25, 80], [0, 4], clamp)));
  return (
    <Stage>
      <Badge />
      <Caption
        parts={[
          { t: "Friends" },
          { t: "love" },
          { t: "your" },
          { t: "app", hi: true },
        ]}
        top={100}
        delay={8}
      />
      {f > 70 && (
        <Caption
          parts={[
            { t: "Will" },
            { t: "customers" },
            { t: "pay?", hi: true },
          ]}
          top={170}
          size={48}
          delay={70}
        />
      )}
      {f > 135 && (
        <Caption
          parts={[
            { t: "Interest" },
            { t: "≠" },
            { t: "paying", hi: true },
            { t: "demand", hi: true },
          ]}
          top={240}
          size={44}
          delay={135}
        />
      )}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={200} y1={820} x2={1720} y2={820} stroke={CYAN_DIM} strokeWidth={2} opacity={0.5} />
        <Stick x={520} y={560} scale={1.4} pose="wave" />
        <g opacity={fade(f, 10, 25)}>
          <PhoneIcon x={860} y={560} hearts={hearts} />
        </g>
        {f > 125 && (
          <g opacity={fade(f, 125, 140)}>
            <rect x={1080} y={620} width={280} height={56} rx={10} fill="none" stroke={ORANGE} strokeWidth={2} />
            <text x={1220} y={656} textAnchor="middle" fill={ORANGE} fontSize={24} fontWeight={800} fontFamily="system-ui,sans-serif">
              Paid customers: 0
            </text>
          </g>
        )}
      </svg>
    </Stage>
  );
};

const SceneFramework: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Badge />
      <Caption
        parts={[
          { t: "Value" },
          { t: "exchanged" },
          { t: "for" },
          { t: "payment", hi: true },
        ]}
        top={110}
        delay={0}
      />
      <Caption
        parts={[{ t: "Three", hi: true }, { t: "parts" }]}
        top={190}
        size={40}
        delay={100}
      />
      <Node label="Customer" color={BLUE} x={280} y={480} active={f > 130} delay={130} />
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 510,
          width: interpolate(f, [160, 190], [0, 120], clamp),
          height: 3,
          background: CYAN,
          boxShadow: `0 0 12px ${CYAN}`,
        }}
      />
      <Node label="Offer" color={ORANGE} x={720} y={480} active={f > 170} delay={170} />
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 510,
          width: interpolate(f, [200, 230], [0, 120], clamp),
          height: 3,
          background: CYAN,
          boxShadow: `0 0 12px ${CYAN}`,
        }}
      />
      <Node label="Delivery" color={CYAN} x={1160} y={480} active={f > 210} delay={210} />
    </Stage>
  );
};

const SceneCustomer: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <Badge />
      <Caption
        parts={[{ t: "Customer", hi: true }]}
        top={100}
        size={56}
        delay={0}
      />
      <Caption
        parts={[
          { t: "Who" },
          { t: "buys?" },
          { t: "What" },
          { t: "do" },
          { t: "they" },
          { t: "need?", hi: true },
        ]}
        top={180}
        size={40}
        delay={40}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={300} y1={820} x2={1620} y2={820} stroke={CYAN_DIM} strokeWidth={2} opacity={0.45} />
        <Stick x={520} y={540} scale={1.5} color={BLUE} pose="think" />
        {/* messy invoices as glowing X docs */}
        <g opacity={fade(f, 30, 50)} style={{ filter: `drop-shadow(0 0 8px ${ORANGE})` }}>
          <rect x={900} y={560} width={100} height={130} rx={6} fill="none" stroke={ORANGE} strokeWidth={3} />
          <path d="M920 600 L980 680 M980 600 L920 680" stroke={ORANGE} strokeWidth={4} />
          <text x={950} y={730} textAnchor="middle" fill={ORANGE} fontSize={18} fontFamily="system-ui,sans-serif" fontWeight={700}>
            INVOICES
          </text>
        </g>
        <path
          d="M640 620 C 760 520, 820 560, 900 620"
          stroke={CYAN}
          strokeWidth={2}
          strokeDasharray="8 8"
          fill="none"
          opacity={fade(f, 40, 60)}
        />
      </svg>
    </Stage>
  );
};

const SceneOffer: React.FC = () => {
  const f = useCurrentFrame();
  const morph = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage>
      <Badge />
      <Caption parts={[{ t: "Offer", hi: true }]} top={100} size={56} delay={0} />
      <Caption
        parts={[
          { t: "What" },
          { t: "they" },
          { t: "buy" },
          { t: "·" },
          { t: "Price", hi: true },
          { t: "·" },
          { t: "Scope" },
        ]}
        top={180}
        size={38}
        delay={20}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={1 - morph}>
          <rect x={860} y={480} width={100} height={130} rx={6} fill="none" stroke={ORANGE} strokeWidth={3} opacity={0.5} />
          <path d="M880 520 L940 600 M940 520 L880 600" stroke={ORANGE} strokeWidth={3} opacity={0.5} />
        </g>
        <g opacity={morph} transform={`translate(0 ${(1 - morph) * 40})`}>
          <GuideIcon x={860} y={470} showPrice />
        </g>
      </svg>
    </Stage>
  );
};

const SceneDelivery: React.FC = () => {
  const f = useCurrentFrame();
  const path = interpolate(f, [8, 70], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage>
      <Badge />
      <Caption parts={[{ t: "Delivery", hi: true }]} top={100} size={56} delay={0} />
      <Caption
        parts={[
          { t: "How" },
          { t: "they" },
          { t: "receive", hi: true },
          { t: "it" },
        ]}
        top={180}
        size={40}
        delay={20}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path
          d="M420 560 C 700 420, 1100 420, 1380 560"
          stroke={CYAN}
          strokeWidth={3}
          strokeDasharray="10 10"
          fill="none"
          opacity={0.55}
        />
        <circle
          cx={420 + path * 960}
          cy={560 - Math.sin(path * Math.PI) * 140}
          r={10}
          fill={CYAN}
          style={{ filter: `drop-shadow(0 0 12px ${CYAN})` }}
        />
        <g opacity={1 - path * 0.3}>
          <GuideIcon x={360} y={500} showPrice />
        </g>
        <g opacity={fade(f, 40, 60)}>
          <rect x={1280} y={500} width={220} height={160} rx={12} fill="none" stroke={CYAN} strokeWidth={3} />
          <text x={1390} y={545} textAnchor="middle" fill={CYAN} fontSize={20} fontWeight={800} fontFamily="system-ui,sans-serif">
            DOWNLOAD
          </text>
          <rect x={1310} y={570} width={160} height={10} rx={5} fill={CYAN_DIM} />
          <rect
            x={1310}
            y={570}
            width={160 * interpolate(f, [45, 90], [0, 1], clamp)}
            height={10}
            rx={5}
            fill={CYAN}
          />
        </g>
      </svg>
      {f > 55 && (
        <Caption
          parts={[
            { t: "Pay" },
            { t: "before" },
            { t: "or" },
            { t: "after", hi: true },
          ]}
          top={860}
          size={32}
          delay={55}
        />
      )}
    </Stage>
  );
};

const SceneExample: React.FC = () => {
  const f = useCurrentFrame();
  const showC = f >= 145;
  const showO = f >= 265;
  const showD = f >= 350;
  return (
    <Stage>
      <Badge />
      <Caption
        parts={[
          { t: "Maya", hi: true },
          { t: "·" },
          { t: "Invoicing" },
          { t: "guide" },
        ]}
        top={90}
        size={44}
        delay={0}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={200} y1={820} x2={1720} y2={820} stroke={CYAN_DIM} strokeWidth={2} opacity={0.4} />
        {/* Customer */}
        <g opacity={showC ? fade(f, 145, 160) : 0.2}>
          <Stick x={280} y={520} scale={1.3} color={BLUE} pose="stand" />
          <text x={340} y={780} textAnchor="middle" fill={BLUE} fontSize={22} fontWeight={800} fontFamily="system-ui,sans-serif">
            FREELANCE DESIGNERS
          </text>
        </g>
        {/* Offer */}
        <g opacity={showO ? fade(f, 265, 280) : 0.2}>
          <GuideIcon x={860} y={520} showPrice />
          <text x={905} y={780} textAnchor="middle" fill={ORANGE} fontSize={22} fontWeight={800} fontFamily="system-ui,sans-serif">
            OFFER · $79
          </text>
        </g>
        {/* Delivery */}
        <g opacity={showD ? fade(f, 350, 365) : 0.2}>
          <rect x={1380} y={540} width={200} height={140} rx={12} fill="none" stroke={CYAN} strokeWidth={3} />
          <text x={1480} y={600} textAnchor="middle" fill={CYAN} fontSize={20} fontWeight={800} fontFamily="system-ui,sans-serif">
            DOWNLOAD
          </text>
          <text x={1480} y={640} textAnchor="middle" fill={CYAN} fontSize={18} fontFamily="system-ui,sans-serif">
            LINK
          </text>
          <text x={1480} y={780} textAnchor="middle" fill={CYAN} fontSize={22} fontWeight={800} fontFamily="system-ui,sans-serif">
            DELIVERY
          </text>
        </g>
        {showC && showO && (
          <path d="M420 620 L840 600" stroke={CYAN} strokeWidth={2} strokeDasharray="6 6" opacity={0.5} fill="none" />
        )}
        {showO && showD && (
          <path d="M980 600 L1360 600" stroke={CYAN} strokeWidth={2} strokeDasharray="6 6" opacity={0.5} fill="none" />
        )}
      </svg>
      {f === 355 && <Audio src={staticFile("sfx-chime.mp3")} volume={0.4} />}
    </Stage>
  );
};

const SceneContrast: React.FC = () => {
  const f = useCurrentFrame();
  const left = f >= 95;
  const interest = f >= 150;
  const right = f >= 225;
  const caveat = f >= 300;
  return (
    <Stage>
      <Badge />
      <Caption
        parts={[
          { t: "Compare" },
          { t: "the" },
          { t: "evidence", hi: true },
        ]}
        top={90}
        size={46}
        delay={0}
      />
      {/* left panel */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 280,
          width: 780,
          height: 520,
          border: `2px solid ${left ? MUTED : "#1E293B"}`,
          borderRadius: 20,
          opacity: left ? fade(f, 95, 115) : 0.25,
          padding: 32,
        }}
      >
        <svg width={700} height={280}>
          <PhoneIcon x={40} y={40} hearts={3} />
          <Stick x={220} y={40} scale={1.1} pose="wave" />
        </svg>
        <div style={{ fontFamily: "system-ui,sans-serif", fontWeight: 800, fontSize: 32, color: MUTED, marginTop: 8 }}>
          POSITIVE FEEDBACK
        </div>
        {interest && (
          <div
            style={{
              marginTop: 18,
              fontFamily: "system-ui,sans-serif",
              fontWeight: 900,
              fontSize: 30,
              ...glowText(ORANGE),
              opacity: fade(f, 150, 165),
            }}
          >
            INTEREST ≠ PAYING DEMAND
          </div>
        )}
      </div>
      {/* right panel */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 280,
          width: 780,
          height: 520,
          border: `2px solid ${right ? CYAN : "#1E293B"}`,
          borderRadius: 20,
          opacity: right ? fade(f, 225, 245) : 0.25,
          padding: 32,
          boxShadow: right ? `0 0 40px ${CYAN}33` : "none",
        }}
      >
        <div style={{ fontFamily: "system-ui,sans-serif", fontWeight: 900, fontSize: 32, ...glowText(CYAN) }}>
          COMPLETED PURCHASE
        </div>
        <div style={{ marginTop: 20, fontFamily: "system-ui,sans-serif", fontWeight: 700, fontSize: 28, color: WHITE }}>
          Stronger evidence of paying demand
        </div>
        <svg width={400} height={160} style={{ marginTop: 40 }}>
          <text x={20} y={60} fill={CYAN} fontSize={36} fontWeight={900} fontFamily="system-ui,sans-serif">
            $ → ACCESS
          </text>
        </svg>
        {caveat && (
          <div
            style={{
              marginTop: 20,
              fontFamily: "system-ui,sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: MUTED,
              opacity: fade(f, 300, 318),
            }}
          >
            ONE SALE ≠ LONG-TERM SUCCESS
          </div>
        )}
      </div>
    </Stage>
  );
};

const SceneRecap: React.FC = () => {
  const f = useCurrentFrame();
  const qs = [
    { q: "WHO BUYS?", c: BLUE, d: 8 },
    { q: "WHAT IS THE OFFER?", c: ORANGE, d: 28 },
    { q: "HOW IS IT DELIVERED?", c: CYAN, d: 48 },
  ];
  return (
    <Stage>
      <Badge />
      <Caption
        parts={[
          { t: "Examine" },
          { t: "an" },
          { t: "idea", hi: true },
        ]}
        top={100}
        delay={0}
      />
      <div style={{ position: "absolute", left: 280, right: 280, top: 280 }}>
        {qs.map((item) => (
          <div
            key={item.q}
            style={{
              marginBottom: 22,
              borderLeft: `6px solid ${item.c}`,
              padding: "22px 28px",
              background: "#0B1220",
              borderRadius: 12,
              fontFamily: "system-ui,sans-serif",
              fontWeight: 900,
              fontSize: 40,
              ...glowText(item.c),
              opacity: fade(f, item.d, item.d + 14),
              boxShadow: `0 0 24px ${item.c}33`,
            }}
          >
            {item.q}
          </div>
        ))}
      </div>
    </Stage>
  );
};

const SceneQuiz: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 100 } });
  return (
    <Stage>
      <Badge />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 360,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          opacity: s,
          transform: `translateY(${(1 - s) * 20}px)`,
        }}
      >
        {[
          { l: "Customer", c: BLUE },
          { l: "Offer", c: ORANGE },
          { l: "Delivery", c: CYAN },
        ].map((n) => (
          <div
            key={n.l}
            style={{
              border: `2px solid ${n.c}`,
              color: n.c,
              fontFamily: "system-ui,sans-serif",
              fontWeight: 900,
              fontSize: 28,
              padding: "14px 26px",
              borderRadius: 14,
              boxShadow: `0 0 24px ${n.c}66`,
              textTransform: "uppercase",
            }}
          >
            {n.l}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 520,
          textAlign: "center",
          fontFamily: "system-ui,sans-serif",
          fontWeight: 900,
          fontSize: 48,
          ...glowText(WHITE),
          opacity: fade(f, 10, 24),
          textTransform: "uppercase",
        }}
      >
        Your turn — apply it to a new example
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 620,
          textAlign: "center",
          fontFamily: "system-ui,sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: MUTED,
          opacity: fade(f, 24, 40),
        }}
      >
        QUIZ NEXT · ANSWERS HIDDEN UNTIL YOU SUBMIT
      </div>
    </Stage>
  );
};

const sec = (s: number) => Math.round(s * L001_NEON_FPS);

export const L001Neon: React.FC = () => {
  const beats: { Comp: React.FC; from: number; to: number }[] = [
    { Comp: SceneHook, from: sec(0), to: sec(8.3) },
    { Comp: SceneFramework, from: sec(8.3), to: sec(18.104) },
    { Comp: SceneCustomer, from: sec(18.104), to: sec(23.548) },
    { Comp: SceneOffer, from: sec(23.548), to: sec(28.752) },
    { Comp: SceneDelivery, from: sec(28.752), to: sec(35.936) },
    { Comp: SceneExample, from: sec(35.936), to: sec(50.628) },
    { Comp: SceneContrast, from: sec(50.628), to: sec(64.228) },
    { Comp: SceneRecap, from: sec(64.228), to: sec(70.372) },
    { Comp: SceneQuiz, from: sec(70.372), to: L001_NEON_DURATION },
  ];

  return (
    <AbsoluteFill style={{ background: BG }}>
      {beats.map(({ Comp, from, to }, i) => (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
          <Comp />
        </Sequence>
      ))}
      <Audio src={staticFile("voice-l001-lesson.mp3")} />
    </AbsoluteFill>
  );
};
