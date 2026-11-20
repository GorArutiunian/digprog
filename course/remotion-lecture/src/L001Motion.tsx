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
 * DigProg L01 — motion-max cut
 * Craft borrowed from Opus MV analysis (continuous camera, orbits,
 * path-drawing, kinetic type, layered parallax, data HUD) —
 * DigProg blue/orange class palette. Same Brian VO timeline.
 */
export const L001_MOTION_FPS = 30;
export const L001_MOTION_DURATION = Math.ceil(75.5 * L001_MOTION_FPS);

const PAPER = "#F4F1EA";
const INK = "#0B1220";
const BLUE = "#1D4ED8";
const BLUE2 = "#60A5FA";
const ORANGE = "#EA580C";
const ORANGE2 = "#FB923C";
const TEAL = "#0F766E";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const LINE = "#CBD5E1";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: easeOut });

const spr = (f: number, fps: number, delay = 0, stiff = 100) =>
  spring({
    frame: Math.max(0, f - delay),
    fps,
    config: { damping: 14, stiffness: stiff, mass: 0.75 },
  });

/* ── always-on motion layers ── */

const Particles: React.FC<{ count?: number; accent?: string }> = ({
  count = 28,
  accent = BLUE2,
}) => {
  const f = useCurrentFrame();
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 97.3;
    const x = (seed * 13) % 1920;
    const baseY = (seed * 7) % 1080;
    const speed = 0.35 + (i % 5) * 0.15;
    const y = (baseY + f * speed * (i % 2 === 0 ? 1 : -1) + 2000) % 1200 - 60;
    const driftX = x + Math.sin((f + seed) / 40) * (12 + (i % 8) * 3);
    const size = 2 + (i % 4);
    const o = 0.15 + (i % 5) * 0.08;
    nodes.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: driftX,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: i % 3 === 0 ? ORANGE2 : accent,
          opacity: o,
          boxShadow: `0 0 ${6 + size}px ${i % 3 === 0 ? ORANGE2 : accent}`,
        }}
      />,
    );
  }
  return <>{nodes}</>;
};

const OrbitRings: React.FC<{ cx?: number; cy?: number; color?: string }> = ({
  cx = 960,
  cy = 540,
  color = BLUE,
}) => {
  const f = useCurrentFrame();
  const rot = f * 0.6;
  const rot2 = -f * 0.35;
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35 }}
    >
      <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
        <ellipse cx={0} cy={0} rx={320} ry={140} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="6 10" />
        <circle cx={320} cy={0} r={6} fill={ORANGE} />
      </g>
      <g transform={`translate(${cx} ${cy}) rotate(${rot2})`}>
        <ellipse cx={0} cy={0} rx={420} ry={200} fill="none" stroke={ORANGE2} strokeWidth={1} strokeDasharray="2 12" opacity={0.7} />
        <circle cx={-420} cy={0} r={4} fill={BLUE2} />
      </g>
      <circle cx={cx} cy={cy} r={80 + Math.sin(f / 20) * 8} fill="none" stroke={color} strokeWidth={1} opacity={0.25} />
    </svg>
  );
};

const Camera: React.FC<{ children: React.ReactNode; intensity?: number }> = ({
  children,
  intensity = 1,
}) => {
  const f = useCurrentFrame();
  const x = Math.sin(f / 55) * 10 * intensity;
  const y = Math.cos(f / 70) * 7 * intensity;
  const scale = 1.03 + Math.sin(f / 90) * 0.012 * intensity;
  const rot = Math.sin(f / 120) * 0.35 * intensity;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Stage: React.FC<{
  dark?: boolean;
  children: React.ReactNode;
}> = ({ dark = false, children }) => {
  const f = useCurrentFrame();
  const drift = (f * 0.4) % 64;
  return (
    <AbsoluteFill style={{ background: dark ? "#0B1220" : PAPER, overflow: "hidden" }}>
      {!dark && (
        <div
          style={{
            position: "absolute",
            inset: -40,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(#C9D6E5 1px, transparent 1px), linear-gradient(90deg, #C9D6E5 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            transform: `translate(${drift}px, ${drift * 0.4}px)`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: dark
            ? `radial-gradient(ellipse 60% 50% at ${50 + Math.sin(f / 80) * 8}% 40%, ${BLUE}33 0%, transparent 65%)`
            : `radial-gradient(ellipse 70% 55% at 50% 30%, ${WHITE} 0%, transparent 70%)`,
        }}
      />
      <Particles count={dark ? 36 : 22} accent={dark ? BLUE2 : BLUE} />
      {/* corner marks */}
      {[
        { t: 20, l: 20 },
        { t: 20, r: 20 },
        { b: 20, l: 20 },
        { b: 20, r: 20 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 16,
            height: 16,
            borderColor: dark ? `${BLUE2}88` : `${BLUE}66`,
            borderStyle: "solid",
            borderWidth: 0,
            borderTopWidth: p.t !== undefined ? 2 : 0,
            borderBottomWidth: p.b !== undefined ? 2 : 0,
            borderLeftWidth: p.l !== undefined ? 2 : 0,
            borderRightWidth: p.r !== undefined ? 2 : 0,
            ...p,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 44,
          zIndex: 40,
          background: BLUE,
          color: WHITE,
          fontFamily: "system-ui,sans-serif",
          fontWeight: 800,
          fontSize: 17,
          padding: "7px 12px",
          borderRadius: 7,
          boxShadow: `0 8px 24px ${BLUE}55`,
        }}
      >
        DigProg · L01
      </div>
      {/* HUD clock */}
      <div
        style={{
          position: "absolute",
          top: 32,
          right: 48,
          zIndex: 40,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 14,
          color: dark ? BLUE2 : MUTED,
          opacity: 0.7,
        }}
      >
        t={(f / 30).toFixed(2)}s
      </div>
      {children}
    </AbsoluteFill>
  );
};

const KineticLine: React.FC<{
  words: { t: string; color?: string }[];
  delay?: number;
  size?: number;
  y?: number;
}> = ({ words, delay = 0, size = 56, y = 140 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 100,
        right: 100,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.35em",
        fontFamily: "system-ui,sans-serif",
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -1,
        lineHeight: 1.15,
      }}
    >
      {words.map((w, i) => {
        const s = spr(f, fps, delay + i * 3, 140);
        const float = Math.sin((f + i * 12) / 18) * 3;
        return (
          <span
            key={i}
            style={{
              color: w.color ?? INK,
              opacity: s,
              transform: `translateY(${(1 - s) * 28 + float}px) scale(${0.9 + s * 0.1})`,
              display: "inline-block",
              textShadow: w.color ? `0 0 24px ${w.color}55` : undefined,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

const DrawCircle: React.FC<{
  progress: number;
  r: number;
  cx: number;
  cy: number;
  color: string;
  sw?: number;
}> = ({ progress, r, cx, cy, color, sw = 3 }) => {
  const c = 2 * Math.PI * r;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeDasharray={c}
      strokeDashoffset={c * (1 - progress)}
      strokeLinecap="round"
    />
  );
};

/* ── Scenes ── */

const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = spr(f, fps, 0, 90);
  const heartN = Math.min(6, Math.floor(interpolate(f, [20, 100], [0, 6], clamp)));
  const zoom = interpolate(f, [0, 240], [1.08, 1], { ...clamp, easing: easeOut });
  const paidPulse = 1 + Math.sin(f / 8) * 0.04;

  return (
    <Stage>
      <Camera intensity={1.2}>
        <OrbitRings cx={640} cy={560} />
        <KineticLine
          words={[
            { t: "You" },
            { t: "built" },
            { t: "an" },
            { t: "app.", color: BLUE },
          ]}
          delay={2}
          y={100}
        />
        {f > 35 && (
          <KineticLine
            words={[
              { t: "Friends" },
              { t: "love" },
              { t: "it." },
            ]}
            delay={35}
            size={42}
            y={175}
          />
        )}
        {f > 70 && (
          <KineticLine
            words={[
              { t: "Will" },
              { t: "customers" },
              { t: "pay?", color: ORANGE },
            ]}
            delay={70}
            size={46}
            y={245}
          />
        )}
        {f > 135 && (
          <div
            style={{
              position: "absolute",
              top: 320,
              left: "50%",
              transform: `translateX(-50%) scale(${spr(f, fps, 135)})`,
              background: WHITE,
              border: `3px solid ${ORANGE}`,
              borderRadius: 16,
              padding: "16px 28px",
              fontFamily: "system-ui,sans-serif",
              fontWeight: 900,
              fontSize: 40,
              boxShadow: `0 16px 40px ${ORANGE}44`,
              opacity: fade(f, 135, 150),
            }}
          >
            <span style={{ color: ORANGE }}>Interest</span>
            <span style={{ color: MUTED }}> ≠ </span>
            <span style={{ color: BLUE }}>paying demand</span>
          </div>
        )}

        {/* phone with continuous float + orbiting hearts */}
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 420,
            transform: `scale(${phone * zoom}) translateY(${Math.sin(f / 15) * 12}px) rotate(${Math.sin(f / 40) * 3}deg)`,
            transformOrigin: "center top",
          }}
        >
          <div
            style={{
              width: 220,
              height: 400,
              borderRadius: 36,
              background: INK,
              padding: 10,
              boxShadow: `0 30px 60px rgba(15,23,42,0.35), 0 0 ${20 + Math.sin(f / 10) * 10}px ${BLUE}55`,
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 28,
                background: `linear-gradient(${135 + f * 0.3}deg, #DBEAFE, #FFF7ED)`,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  margin: "40px 16px 0",
                  height: 100,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`,
                  transform: `translateY(${Math.sin(f / 12) * 4}px)`,
                }}
              />
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    margin: "10px 16px",
                    height: 36,
                    borderRadius: 10,
                    background: i % 2 ? ORANGE2 + "55" : BLUE2 + "55",
                    transform: `translateX(${Math.sin((f + i * 20) / 18) * 6}px)`,
                  }}
                />
              ))}
              {f > 120 && (
                <div
                  style={{
                    margin: "16px",
                    border: `2px solid ${ORANGE}`,
                    borderRadius: 10,
                    padding: "10px 8px",
                    textAlign: "center",
                    fontFamily: "system-ui,sans-serif",
                    fontWeight: 800,
                    fontSize: 16,
                    color: ORANGE,
                    transform: `scale(${paidPulse})`,
                    background: WHITE,
                  }}
                >
                  Paid customers: 0
                </div>
              )}
            </div>
          </div>
          {Array.from({ length: heartN }).map((_, i) => {
            const ang = -50 + i * 22 + f * 1.2;
            const rad = ((ang * Math.PI) / 180);
            const dist = 130 + Math.sin((f + i * 10) / 10) * 14;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 110 + Math.cos(rad) * dist,
                  top: 140 + Math.sin(rad) * (40 + i * 8),
                  fontSize: 28,
                  color: ORANGE,
                  opacity: fade(f, 20 + i * 10, 35 + i * 10),
                  transform: `scale(${1 + Math.sin((f + i) / 8) * 0.15})`,
                  filter: `drop-shadow(0 0 8px ${ORANGE})`,
                }}
              >
                ♥
              </div>
            );
          })}
        </div>
      </Camera>
    </Stage>
  );
};

const SceneFramework: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(f, [20, 100], [0, 1], { ...clamp, easing: easeInOut });
  const nodes = [
    { l: "Customer", c: BLUE, delay: 115 },
    { l: "Offer", c: ORANGE, delay: 155 },
    { l: "Delivery", c: TEAL, delay: 195 },
  ];

  return (
    <Stage>
      <Camera>
        <OrbitRings cx={960} cy={620} color={ORANGE} />
        <KineticLine
          words={[
            { t: "Value" },
            { t: "exchanged" },
            { t: "for" },
            { t: "payment", color: BLUE },
          ]}
          delay={0}
          y={120}
          size={50}
        />
        <KineticLine
          words={[{ t: "Three", color: ORANGE }, { t: "connected" }, { t: "parts" }]}
          delay={90}
          size={36}
          y={200}
        />

        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* assembling triangle / system */}
          <g transform="translate(960 620)">
            <DrawCircle progress={draw} r={180} cx={0} cy={0} color={BLUE} sw={2} />
            <DrawCircle progress={draw * 0.85} r={240} cx={0} cy={0} color={ORANGE2} sw={1.5} />
            {/* rotating spokes */}
            {[0, 120, 240].map((deg, i) => (
              <line
                key={deg}
                x1={0}
                y1={0}
                x2={Math.cos(((deg + f * 0.8) * Math.PI) / 180) * 180 * draw}
                y2={Math.sin(((deg + f * 0.8) * Math.PI) / 180) * 180 * draw}
                stroke={i === 1 ? ORANGE : BLUE}
                strokeWidth={2}
                opacity={0.5}
              />
            ))}
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 480,
            display: "flex",
            justifyContent: "center",
            gap: 28,
          }}
        >
          {nodes.map((n, i) => {
            const s = spr(f, fps, n.delay, 120);
            const bob = Math.sin((f + i * 20) / 14) * 6;
            return (
              <div
                key={n.l}
                style={{
                  transform: `translateY(${(1 - s) * 40 + bob}px) scale(${0.85 + s * 0.15})`,
                  opacity: s,
                  background: WHITE,
                  border: `3px solid ${n.c}`,
                  color: n.c,
                  fontFamily: "system-ui,sans-serif",
                  fontWeight: 900,
                  fontSize: 32,
                  padding: "18px 32px",
                  borderRadius: 16,
                  boxShadow: `0 16px 36px ${n.c}44`,
                }}
              >
                {n.l}
              </div>
            );
          })}
        </div>

        {/* animated connectors between nodes */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path
            d={`M 620 ${520 + Math.sin(f / 14) * 6} C 780 480, 840 480, 960 ${520 + Math.sin((f + 10) / 14) * 6}`}
            fill="none"
            stroke={BLUE}
            strokeWidth={3}
            strokeDasharray="10 8"
            strokeDashoffset={-f * 2}
            opacity={fade(f, 160, 180)}
          />
          <path
            d={`M 1020 ${520 + Math.sin((f + 10) / 14) * 6} C 1140 480, 1200 480, 1320 ${520 + Math.sin((f + 20) / 14) * 6}`}
            fill="none"
            stroke={ORANGE}
            strokeWidth={3}
            strokeDasharray="10 8"
            strokeDashoffset={-f * 2}
            opacity={fade(f, 200, 220)}
          />
        </svg>
      </Camera>
    </Stage>
  );
};

const SceneCustomer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spr(f, fps, 0);
  const shake = Math.sin(f / 3) * (f > 40 && f < 100 ? 2 : 0);

  return (
    <Stage>
      <Camera intensity={0.9}>
        <KineticLine
          words={[{ t: "Customer", color: BLUE }]}
          delay={0}
          size={58}
          y={110}
        />
        <KineticLine
          words={[
            { t: "Who" },
            { t: "buys?" },
            { t: "What" },
            { t: "do" },
            { t: "they" },
            { t: "need?", color: ORANGE },
          ]}
          delay={35}
          size={38}
          y={190}
        />

        <div
          style={{
            position: "absolute",
            left: 280,
            top: 360,
            opacity: s,
            transform: `translate(${shake}px, ${(1 - s) * 30 + Math.sin(f / 16) * 8}px)`,
          }}
        >
          <svg width={500} height={420} viewBox="0 0 500 420">
            {/* person */}
            <circle cx={120} cy={140} r={36} fill={BLUE}>
              <animate attributeName="cy" values="140;136;140" dur="2s" repeatCount="indefinite" />
            </circle>
            <path d="M70 240 C70 180 170 180 170 240" fill={BLUE} />
            {/* desk + monitor */}
            <rect x={220} y={200} width={220} height={14} rx={3} fill={MUTED} />
            <rect
              x={250}
              y={80}
              width={160}
              height={110}
              rx={8}
              fill={INK}
              transform={`rotate(${Math.sin(f / 20) * 1.5} 330 135)`}
            />
            <rect x={260} y={90} width={140} height={80} rx={4} fill={ORANGE + "33"} />
            {/* flying X marks — chaos */}
            {[0, 1, 2, 3].map((i) => {
              const px = 270 + i * 28 + Math.sin((f + i * 15) / 10) * 10;
              const py = 110 + (i % 2) * 25 + Math.cos((f + i * 10) / 12) * 8;
              return (
                <g key={i} opacity={0.7 + (i % 2) * 0.3}>
                  <path
                    d={`M${px} ${py} l14 14 M${px + 14} ${py} l-14 14`}
                    stroke={ORANGE}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
            <text x={120} y={320} textAnchor="middle" fill={BLUE} fontSize={22} fontWeight={800} fontFamily="system-ui,sans-serif">
              FREELANCER
            </text>
            <text x={330} y={340} textAnchor="middle" fill={ORANGE} fontSize={20} fontWeight={800} fontFamily="system-ui,sans-serif">
              invoice chaos
            </text>
          </svg>
        </div>

        {/* floating need chips */}
        {["Who?", "Need?", "Reach?"].map((t, i) => {
          const ss = spr(f, fps, 50 + i * 12);
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                right: 220,
                top: 400 + i * 90 + Math.sin((f + i * 30) / 15) * 10,
                opacity: ss,
                transform: `translateX(${(1 - ss) * 60}px)`,
                background: WHITE,
                border: `2px solid ${BLUE}`,
                borderRadius: 12,
                padding: "14px 22px",
                fontFamily: "system-ui,sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: BLUE,
                boxShadow: `0 12px 28px ${BLUE}33`,
              }}
            >
              {t}
            </div>
          );
        })}
      </Camera>
    </Stage>
  );
};

const SceneOffer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const morph = interpolate(f, [0, 40], [0, 1], { ...clamp, easing: easeOut });
  const spin = f * 2;
  const s = spr(f, fps, 0);

  return (
    <Stage>
      <Camera>
        <KineticLine words={[{ t: "Offer", color: ORANGE }]} delay={0} size={58} y={110} />
        <KineticLine
          words={[
            { t: "Product" },
            { t: "·" },
            { t: "Price", color: ORANGE },
            { t: "·" },
            { t: "Scope" },
          ]}
          delay={25}
          size={36}
          y={190}
        />

        {/* morph: chaos docs → guide */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 360,
            transform: `translateX(-50%) scale(${s}) rotate(${(1 - morph) * -12}deg)`,
          }}
        >
          <div
            style={{
              width: 220,
              height: 300,
              borderRadius: 16,
              border: `4px solid ${ORANGE}`,
              background: `linear-gradient(${145 + f * 0.4}deg, ${WHITE}, ${ORANGE}22)`,
              boxShadow: `0 24px 50px ${ORANGE}55, 0 0 ${16 + Math.sin(f / 10) * 10}px ${ORANGE}44`,
              padding: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* spinning accent orb */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: `${ORANGE}33`,
                transform: `rotate(${spin}deg)`,
              }}
            />
            <div style={{ fontFamily: "system-ui,sans-serif", fontWeight: 800, fontSize: 14, color: ORANGE, letterSpacing: 2 }}>
              DIGITAL GUIDE
            </div>
            <div style={{ marginTop: 12, fontFamily: "system-ui,sans-serif", fontWeight: 900, fontSize: 36, color: INK, lineHeight: 1.1 }}>
              Invoicing
              <br />
              Guide
            </div>
            <div style={{ marginTop: 12, color: MUTED, fontWeight: 600, fontSize: 16, fontFamily: "system-ui,sans-serif" }}>
              Templates · Checklists
            </div>
            <div
              style={{
                marginTop: "auto",
                position: "absolute",
                bottom: 24,
                left: 24,
                fontFamily: "system-ui,sans-serif",
                fontWeight: 900,
                fontSize: 48,
                color: ORANGE,
                transform: `scale(${1 + Math.sin(f / 12) * 0.05})`,
              }}
            >
              $79
            </div>
          </div>
        </div>

        {/* orbiting price chips */}
        {["Price", "Scope", "Promise"].map((t, i) => {
          const ang = f * 1.5 + i * 120;
          const rad = (ang * Math.PI) / 180;
          const cx = 960 + Math.cos(rad) * 280;
          const cy = 520 + Math.sin(rad) * 120;
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                transform: "translate(-50%, -50%)",
                background: WHITE,
                border: `2px solid ${ORANGE}`,
                borderRadius: 999,
                padding: "10px 18px",
                fontFamily: "system-ui,sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: ORANGE,
                opacity: fade(f, 30 + i * 8, 45 + i * 8),
                boxShadow: `0 8px 20px ${ORANGE}33`,
              }}
            >
              {t}
            </div>
          );
        })}
      </Camera>
    </Stage>
  );
};

const SceneDelivery: React.FC = () => {
  const f = useCurrentFrame();
  const path = interpolate(f, [5, 90], [0, 1], { ...clamp, easing: easeInOut });
  const prog = interpolate(f, [50, 120], [0, 1], clamp);

  // flying guide along bezier
  const t = path;
  const x = 400 + t * 900;
  const y = 520 - Math.sin(t * Math.PI) * 180;

  return (
    <Stage>
      <Camera intensity={1.1}>
        <KineticLine words={[{ t: "Delivery", color: TEAL }]} delay={0} size={58} y={110} />
        <KineticLine
          words={[
            { t: "How" },
            { t: "they" },
            { t: "receive", color: TEAL },
            { t: "it" },
          ]}
          delay={20}
          size={36}
          y={190}
        />

        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            d="M420 560 C 700 320, 1100 320, 1480 560"
            fill="none"
            stroke={TEAL}
            strokeWidth={3}
            strokeDasharray="12 10"
            strokeDashoffset={-f * 3}
            opacity={0.55}
          />
          {/* motion trail dots */}
          {[0.15, 0.3, 0.45, 0.6, 0.75].map((p) =>
            p < path ? (
              <circle
                key={p}
                cx={420 + p * 1060}
                cy={560 - Math.sin(p * Math.PI) * 180}
                r={5}
                fill={TEAL}
                opacity={0.3 + p * 0.5}
              />
            ) : null,
          )}
        </svg>

        {/* flying guide */}
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            transform: `translate(-50%, -50%) scale(${interpolate(path, [0, 1], [1, 0.45])}) rotate(${interpolate(path, [0, 1], [-8, 6])}deg)`,
            width: 140,
            height: 180,
            borderRadius: 12,
            border: `3px solid ${ORANGE}`,
            background: WHITE,
            boxShadow: `0 20px 40px ${ORANGE}55`,
            opacity: fade(f, 5, 20),
          }}
        />

        {/* download dock pulsing */}
        <div
          style={{
            position: "absolute",
            right: 160,
            top: 480,
            width: 300,
            background: WHITE,
            border: `3px solid ${TEAL}`,
            borderRadius: 18,
            padding: 22,
            boxShadow: `0 0 ${20 + Math.sin(f / 8) * 12}px ${TEAL}55`,
            opacity: fade(f, 40, 60),
            transform: `translateY(${Math.sin(f / 14) * 6}px)`,
          }}
        >
          <div style={{ fontFamily: "system-ui,sans-serif", fontWeight: 800, color: TEAL, fontSize: 20 }}>
            DOWNLOAD
          </div>
          <div
            style={{
              marginTop: 14,
              height: 12,
              borderRadius: 99,
              background: "#99F6E4",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${prog * 100}%`,
                height: "100%",
                background: TEAL,
                borderRadius: 99,
                boxShadow: `0 0 12px ${TEAL}`,
              }}
            />
          </div>
          <div style={{ marginTop: 10, fontFamily: "ui-monospace,monospace", fontSize: 14, color: MUTED }}>
            {(prog * 100).toFixed(0)}% · invoicing-guide.pdf
          </div>
        </div>

        {f > 70 && (
          <KineticLine
            words={[
              { t: "Pay" },
              { t: "before" },
              { t: "or" },
              { t: "after", color: TEAL },
            ]}
            delay={70}
            size={32}
            y={880}
          />
        )}
      </Camera>
    </Stage>
  );
};

const SceneExample: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const showC = f >= 145;
  const showO = f >= 265;
  const showD = f >= 350;

  const cards = [
    {
      show: showC,
      at: 145,
      color: BLUE,
      title: "Customer",
      body: "Freelance designers",
      sub: "Need invoice help",
    },
    {
      show: showO,
      at: 265,
      color: ORANGE,
      title: "Offer",
      body: "Invoicing guide",
      sub: "$79 · templates + checklists",
    },
    {
      show: showD,
      at: 350,
      color: TEAL,
      title: "Delivery",
      body: "Download link",
      sub: "Instant access",
    },
  ];

  return (
    <Stage>
      <Camera intensity={0.85}>
        <OrbitRings cx={960} cy={700} />
        <KineticLine
          words={[
            { t: "Maya", color: ORANGE },
            { t: "·" },
            { t: "worked" },
            { t: "example" },
          ]}
          delay={0}
          size={44}
          y={100}
        />

        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 280,
            display: "flex",
            gap: 24,
          }}
        >
          {cards.map((c, i) => {
            const s = c.show ? spr(f, fps, c.at, 110) : 0.15;
            const bob = Math.sin((f + i * 25) / 13) * 8;
            return (
              <div
                key={c.title}
                style={{
                  flex: 1,
                  background: WHITE,
                  border: `3px solid ${c.show ? c.color : LINE}`,
                  borderRadius: 20,
                  padding: 28,
                  minHeight: 380,
                  opacity: c.show ? fade(f, c.at, c.at + 15) : 0.25,
                  transform: `translateY(${(1 - s) * 50 + bob}px) scale(${0.92 + s * 0.08})`,
                  boxShadow: c.show ? `0 24px 48px ${c.color}44` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    fontWeight: 900,
                    fontSize: 22,
                    color: c.color,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {c.title}
                </div>
                {c.show ? (
                  <>
                    <div
                      style={{
                        marginTop: 20,
                        fontFamily: "system-ui,sans-serif",
                        fontWeight: 900,
                        fontSize: 36,
                        color: INK,
                        lineHeight: 1.2,
                      }}
                    >
                      {c.body}
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        fontFamily: "system-ui,sans-serif",
                        fontWeight: 600,
                        fontSize: 22,
                        color: MUTED,
                      }}
                    >
                      {c.sub}
                    </div>
                    {/* mini orbit */}
                    <svg width={120} height={120} style={{ marginTop: 40 }}>
                      <circle
                        cx={60}
                        cy={60}
                        r={40}
                        fill="none"
                        stroke={c.color}
                        strokeWidth={2}
                        strokeDasharray="6 8"
                        strokeDashoffset={-f * 2}
                        opacity={0.6}
                      />
                      <circle cx={60 + Math.cos(f / 12 + i) * 40} cy={60 + Math.sin(f / 12 + i) * 40} r={6} fill={c.color} />
                    </svg>
                  </>
                ) : (
                  <div style={{ marginTop: 80, color: LINE, fontSize: 64, fontWeight: 900, textAlign: "center" }}>…</div>
                )}
              </div>
            );
          })}
        </div>

        {/* connecting energy beams */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {showC && showO && (
            <path
              d="M520 480 C 700 400, 820 400, 960 480"
              fill="none"
              stroke={BLUE}
              strokeWidth={3}
              strokeDasharray="8 8"
              strokeDashoffset={-f * 3}
              opacity={0.5}
            />
          )}
          {showO && showD && (
            <path
              d="M1080 480 C 1220 400, 1340 400, 1480 480"
              fill="none"
              stroke={ORANGE}
              strokeWidth={3}
              strokeDasharray="8 8"
              strokeDashoffset={-f * 3}
              opacity={0.5}
            />
          )}
        </svg>
      </Camera>
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
    <Stage dark>
      <Camera intensity={1.15}>
        <OrbitRings cx={960} cy={540} color={BLUE2} />
        <KineticLine
          words={[
            { t: "Compare", color: WHITE },
            { t: "the", color: WHITE },
            { t: "evidence", color: ORANGE2 },
          ]}
          delay={0}
          size={48}
          y={90}
        />

        {/* left */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 260,
            width: 800,
            height: 560,
            borderRadius: 24,
            border: `2px solid ${left ? MUTED : "#1E293B"}`,
            background: "#111827",
            padding: 36,
            opacity: left ? fade(f, 95, 115) : 0.2,
            transform: `translateY(${Math.sin(f / 16) * 8}px)`,
            overflow: "hidden",
          }}
        >
          <div style={{ fontFamily: "system-ui,sans-serif", fontWeight: 900, fontSize: 28, color: MUTED }}>
            POSITIVE FEEDBACK
          </div>
          {/* floating hearts field */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 80 + (i % 4) * 140,
                top: 120 + Math.floor(i / 4) * 120 + Math.sin((f + i * 20) / 12) * 20,
                fontSize: 32,
                color: ORANGE2,
                opacity: 0.35 + (i % 3) * 0.15,
                transform: `scale(${1 + Math.sin((f + i) / 10) * 0.2})`,
              }}
            >
              ♥
            </div>
          ))}
          {interest && (
            <div
              style={{
                position: "absolute",
                bottom: 48,
                left: 36,
                right: 36,
                fontFamily: "system-ui,sans-serif",
                fontWeight: 900,
                fontSize: 32,
                color: ORANGE2,
                opacity: fade(f, 150, 168),
                textShadow: `0 0 20px ${ORANGE2}`,
              }}
            >
              Interest ≠ paying demand
            </div>
          )}
        </div>

        {/* right */}
        <div
          style={{
            position: "absolute",
            right: 100,
            top: 260,
            width: 800,
            height: 560,
            borderRadius: 24,
            border: `2px solid ${right ? BLUE2 : "#1E293B"}`,
            background: "#111827",
            padding: 36,
            opacity: right ? fade(f, 225, 245) : 0.2,
            boxShadow: right ? `0 0 ${30 + Math.sin(f / 8) * 15}px ${BLUE}66` : "none",
            transform: `translateY(${Math.sin((f + 20) / 16) * 8}px)`,
          }}
        >
          <div style={{ fontFamily: "system-ui,sans-serif", fontWeight: 900, fontSize: 28, color: BLUE2 }}>
            COMPLETED PURCHASE
          </div>
          <div
            style={{
              marginTop: 40,
              fontFamily: "system-ui,sans-serif",
              fontWeight: 800,
              fontSize: 36,
              color: WHITE,
            }}
          >
            Stronger evidence of paying demand
          </div>
          {/* animated $ counter */}
          <div
            style={{
              marginTop: 50,
              fontFamily: "ui-monospace,monospace",
              fontWeight: 900,
              fontSize: 64,
              color: BLUE2,
              textShadow: `0 0 24px ${BLUE2}`,
              transform: `scale(${1 + Math.sin(f / 10) * 0.04})`,
            }}
          >
            $ → ACCESS
          </div>
          {caveat && (
            <div
              style={{
                marginTop: 40,
                fontFamily: "system-ui,sans-serif",
                fontWeight: 700,
                fontSize: 24,
                color: MUTED,
                opacity: fade(f, 300, 318),
              }}
            >
              One sale ≠ proof of long-term success
            </div>
          )}
        </div>
      </Camera>
    </Stage>
  );
};

const SceneRecap: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qs = [
    { q: "Who buys?", c: BLUE, d: 8 },
    { q: "What is the offer?", c: ORANGE, d: 28 },
    { q: "How is it delivered?", c: TEAL, d: 48 },
  ];

  return (
    <Stage>
      <Camera>
        <OrbitRings />
        <KineticLine
          words={[
            { t: "Examine" },
            { t: "an" },
            { t: "idea", color: BLUE },
          ]}
          delay={0}
          size={48}
          y={100}
        />
        <div style={{ position: "absolute", left: 260, right: 260, top: 260 }}>
          {qs.map((item, i) => {
            const s = spr(f, fps, item.d, 120);
            const bob = Math.sin((f + i * 18) / 14) * 5;
            return (
              <div
                key={item.q}
                style={{
                  marginBottom: 22,
                  background: WHITE,
                  borderLeft: `8px solid ${item.c}`,
                  borderRadius: 14,
                  padding: "24px 28px",
                  fontFamily: "system-ui,sans-serif",
                  fontWeight: 900,
                  fontSize: 42,
                  color: INK,
                  opacity: s,
                  transform: `translateX(${(1 - s) * 80}px) translateY(${bob}px)`,
                  boxShadow: `0 16px 36px ${item.c}33`,
                }}
              >
                {item.q}
              </div>
            );
          })}
        </div>
      </Camera>
    </Stage>
  );
};

const SceneQuiz: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spr(f, fps, 0, 100);

  return (
    <Stage>
      <Camera intensity={1.2}>
        <OrbitRings cx={960} cy={400} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: s,
            transform: `translateY(${(1 - s) * 24}px)`,
          }}
        >
          <div style={{ display: "flex", gap: 18, marginBottom: 48 }}>
            {[
              { l: "Customer", c: BLUE },
              { l: "Offer", c: ORANGE },
              { l: "Delivery", c: TEAL },
            ].map((n, i) => (
              <div
                key={n.l}
                style={{
                  border: `3px solid ${n.c}`,
                  color: n.c,
                  background: WHITE,
                  fontFamily: "system-ui,sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  padding: "16px 28px",
                  borderRadius: 14,
                  boxShadow: `0 0 ${18 + Math.sin((f + i * 20) / 10) * 10}px ${n.c}66`,
                  transform: `translateY(${Math.sin((f + i * 15) / 12) * 8}px)`,
                }}
              >
                {n.l}
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: "system-ui,sans-serif",
              fontWeight: 900,
              fontSize: 52,
              color: INK,
              textAlign: "center",
              maxWidth: 1100,
              lineHeight: 1.2,
            }}
          >
            Your turn — apply it to a new example
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: "system-ui,sans-serif",
              fontWeight: 700,
              fontSize: 26,
              color: MUTED,
            }}
          >
            Quiz next · answers stay hidden until you submit
          </div>
        </div>
      </Camera>
      {f === 6 && <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.3} />}
    </Stage>
  );
};

const sec = (s: number) => Math.round(s * L001_MOTION_FPS);

export const L001Motion: React.FC = () => {
  const beats: { Comp: React.FC; from: number; to: number }[] = [
    { Comp: SceneHook, from: sec(0), to: sec(8.3) },
    { Comp: SceneFramework, from: sec(8.3), to: sec(18.104) },
    { Comp: SceneCustomer, from: sec(18.104), to: sec(23.548) },
    { Comp: SceneOffer, from: sec(23.548), to: sec(28.752) },
    { Comp: SceneDelivery, from: sec(28.752), to: sec(35.936) },
    { Comp: SceneExample, from: sec(35.936), to: sec(50.628) },
    { Comp: SceneContrast, from: sec(50.628), to: sec(64.228) },
    { Comp: SceneRecap, from: sec(64.228), to: sec(70.372) },
    { Comp: SceneQuiz, from: sec(70.372), to: L001_MOTION_DURATION },
  ];

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {beats.map(({ Comp, from, to }, i) => (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
          <Comp />
        </Sequence>
      ))}
      <Audio src={staticFile("voice-l001-lesson.mp3")} />
    </AbsoluteFill>
  );
};
