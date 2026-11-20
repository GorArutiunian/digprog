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
 * DigProg L01 — elevated motion-graphics lesson
 * Visual craft informed by Opus MV reference (layered depth, accent-led
 * hierarchy, kinetic type, interface metaphors) — original DigProg scenes.
 */
export const L001_PRO_FPS = 30;
export const L001_PRO_DURATION = Math.ceil(75.5 * L001_PRO_FPS);

const BG = "#F3F0EA";
const BG2 = "#E8EEF6";
const INK = "#0B1220";
const MUTED = "#64748B";
const BLUE = "#1D4ED8";
const BLUE_SOFT = "#DBEAFE";
const ORANGE = "#EA580C";
const ORANGE_SOFT = "#FFEDD5";
const TEAL = "#0F766E";
const TEAL_SOFT = "#CCFBF1";
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

const slideY = (f: number, a: number, b: number, from = 28) =>
  interpolate(f, [a, b], [from, 0], { ...clamp, easing: easeOut });

const softSpring = (f: number, fps: number, delay = 0, stiff = 90) =>
  spring({
    frame: Math.max(0, f - delay),
    fps,
    config: { damping: 16, stiffness: stiff, mass: 0.85 },
  });

const Badge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 32,
      left: 40,
      zIndex: 40,
      background: BLUE,
      color: WHITE,
      fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 0.4,
      padding: "8px 14px",
      borderRadius: 8,
      boxShadow: "0 8px 24px rgba(29,78,216,0.25)",
    }}
  >
    DigProg · L01
  </div>
);

/** Atmospheric depth field */
const Stage: React.FC<{ tint?: string; children?: React.ReactNode }> = ({
  tint = BG,
  children,
}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 300], [0, 18], clamp);
  return (
    <AbsoluteFill style={{ background: tint, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -40,
          background: `radial-gradient(ellipse 70% 55% at ${48 + drift * 0.1}% 32%, ${WHITE} 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 80% 80%, ${BLUE_SOFT}55 0%, transparent 60%),
            linear-gradient(165deg, ${tint} 0%, ${BG2} 100%)`,
          transform: `translateY(${drift * 0.15}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #94A3B8 1px, transparent 0)",
          backgroundSize: "28px 28px",
          transform: `translate(${drift * 0.4}px, ${-drift * 0.2}px)`,
        }}
      />
      {/* corner marks — reference-inspired framing, DigProg palette */}
      {[
        { t: 24, l: 24 },
        { t: 24, r: 24 },
        { b: 24, l: 24 },
        { b: 24, r: 24 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 18,
            height: 18,
            borderColor: `${BLUE}55`,
            borderStyle: "solid",
            borderWidth: 0,
            borderTopWidth: p.t !== undefined ? 2 : 0,
            borderBottomWidth: p.b !== undefined ? 2 : 0,
            borderLeftWidth: p.l !== undefined ? 2 : 0,
            borderRightWidth: p.r !== undefined ? 2 : 0,
            ...p,
            opacity: 0.7,
          }}
        />
      ))}
      {children}
    </AbsoluteFill>
  );
};

const CaptionPad: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: 72,
      right: 72,
      top: 96,
      bottom: 110,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/* ─── Original vector illustration system ─── */

const PhoneUI: React.FC<{
  scale?: number;
  hearts?: number;
  paidZero?: boolean;
  glow?: number;
}> = ({ scale = 1, hearts = 0, paidZero = false, glow = 0 }) => (
  <div
    style={{
      width: 240 * scale,
      height: 420 * scale,
      borderRadius: 36 * scale,
      background: INK,
      padding: 10 * scale,
      boxShadow: `0 ${24 * scale}px ${60 * scale}px rgba(15,23,42,${0.28 + glow * 0.2}), 0 0 ${40 * scale}px rgba(29,78,216,${glow * 0.35})`,
      position: "relative",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 28 * scale,
        background: `linear-gradient(160deg, #EFF6FF 0%, #F8FAFC 45%, #FFF7ED 100%)`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: 36 * scale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 72 * scale,
            height: 8 * scale,
            borderRadius: 99,
            background: "#CBD5E1",
          }}
        />
      </div>
      <div style={{ padding: `${12 * scale}px ${16 * scale}px` }}>
        <div
          style={{
            height: 120 * scale,
            borderRadius: 16 * scale,
            background: `linear-gradient(135deg, ${BLUE}, #38BDF8)`,
            boxShadow: `0 12px 24px ${BLUE}44`,
          }}
        />
        <div
          style={{
            marginTop: 14 * scale,
            height: 14 * scale,
            width: "70%",
            borderRadius: 99,
            background: "#CBD5E1",
          }}
        />
        <div
          style={{
            marginTop: 8 * scale,
            height: 10 * scale,
            width: "45%",
            borderRadius: 99,
            background: "#E2E8F0",
          }}
        />
        <div
          style={{
            marginTop: 18 * scale,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8 * scale,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 48 * scale,
                borderRadius: 12 * scale,
                background: i % 2 ? ORANGE_SOFT : BLUE_SOFT,
              }}
            />
          ))}
        </div>
        {paidZero && (
          <div
            style={{
              marginTop: 16 * scale,
              background: WHITE,
              border: `${2 * scale}px solid ${ORANGE}`,
              borderRadius: 12 * scale,
              padding: `${10 * scale}px ${12 * scale}px`,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 16 * scale,
              color: ORANGE,
              textAlign: "center",
            }}
          >
            Paid customers: 0
          </div>
        )}
      </div>
    </div>
    {Array.from({ length: hearts }).map((_, i) => {
      const angle = -40 + i * 28;
      const dist = 110 + (i % 2) * 18;
      const rad = (angle * Math.PI) / 180;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${Math.cos(rad) * dist * scale}px)`,
            top: `${120 * scale + Math.sin(rad) * 40 * scale}px`,
            transform: "translate(-50%, -50%)",
            fontSize: 28 * scale,
            color: ORANGE,
            filter: "drop-shadow(0 4px 8px rgba(234,88,12,0.35))",
          }}
        >
          ♥
        </div>
      );
    })}
  </div>
);

const FreelancerDesk: React.FC<{ highlight?: boolean }> = ({ highlight }) => (
  <svg width="420" height="320" viewBox="0 0 420 320" fill="none">
    <rect x="40" y="200" width="340" height="18" rx="4" fill="#94A3B8" />
    <rect x="60" y="218" width="24" height="70" rx="3" fill="#64748B" />
    <rect x="336" y="218" width="24" height="70" rx="3" fill="#64748B" />
    {/* monitor */}
    <rect x="110" y="70" width="200" height="130" rx="10" fill={INK} />
    <rect
      x="120"
      y="80"
      width="180"
      height="100"
      rx="6"
      fill={highlight ? ORANGE_SOFT : "#E2E8F0"}
    />
    {/* messy invoice lines */}
    {[0, 1, 2, 4].map((i) => (
      <rect
        key={i}
        x={135}
        y={95 + i * 16}
        width={i === 2 ? 90 : 140 - i * 10}
        height={8}
        rx={2}
        fill={highlight ? ORANGE : "#94A3B8"}
        opacity={0.85}
      />
    ))}
    <path
      d="M250 100 L280 130 M280 100 L250 130"
      stroke={ORANGE}
      strokeWidth="3"
      strokeLinecap="round"
      opacity={highlight ? 1 : 0.4}
    />
    {/* person silhouette */}
    <circle cx="70" cy="150" r="22" fill={BLUE} />
    <path
      d="M40 210 C40 175 100 175 100 210"
      fill={BLUE}
      opacity={0.9}
    />
    <text
      x="70"
      y="270"
      textAnchor="middle"
      fill={BLUE}
      fontFamily="system-ui,sans-serif"
      fontWeight="800"
      fontSize="18"
    >
      Freelancer
    </text>
  </svg>
);

const GuideCover: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <div
    style={{
      width: 200 * size,
      height: 270 * size,
      borderRadius: 14 * size,
      background: `linear-gradient(155deg, ${WHITE} 0%, ${ORANGE_SOFT} 100%)`,
      border: `${3 * size}px solid ${ORANGE}`,
      boxShadow: `0 ${18 * size}px ${40 * size}px rgba(234,88,12,0.28)`,
      padding: 20 * size,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -30 * size,
        right: -30 * size,
        width: 120 * size,
        height: 120 * size,
        borderRadius: "50%",
        background: `${ORANGE}22`,
      }}
    />
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 13 * size,
        color: ORANGE,
        letterSpacing: 1.5,
        textTransform: "uppercase",
      }}
    >
      Digital guide
    </div>
    <div
      style={{
        marginTop: 12 * size,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 28 * size,
        color: INK,
        lineHeight: 1.15,
      }}
    >
      Invoicing
      <br />
      Guide
    </div>
    <div
      style={{
        marginTop: 10 * size,
        fontFamily: "system-ui, sans-serif",
        fontSize: 14 * size,
        color: MUTED,
        fontWeight: 600,
        lineHeight: 1.35,
      }}
    >
      Templates · Checklists
      <br />
      Freelancer workflow
    </div>
    <div
      style={{
        marginTop: "auto",
        fontFamily: "system-ui, sans-serif",
        fontWeight: 900,
        fontSize: 42 * size,
        color: ORANGE,
      }}
    >
      $79
    </div>
  </div>
);

const DownloadPanel: React.FC<{ progress?: number }> = ({ progress = 1 }) => (
  <div
    style={{
      width: 320,
      background: WHITE,
      borderRadius: 18,
      border: `2px solid ${TEAL}`,
      padding: 22,
      boxShadow: `0 16px 40px ${TEAL}33`,
    }}
  >
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 18,
        color: TEAL,
        marginBottom: 14,
      }}
    >
      Downloads
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: TEAL_SOFT,
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div
        style={{
          width: 40,
          height: 48,
          borderRadius: 6,
          background: ORANGE,
          opacity: 0.9,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: INK,
          }}
        >
          invoicing-guide.pdf
        </div>
        <div
          style={{
            marginTop: 8,
            height: 8,
            borderRadius: 99,
            background: "#99F6E4",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: TEAL,
              borderRadius: 99,
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

const NodePill: React.FC<{
  label: string;
  color: string;
  active: boolean;
  dim: boolean;
  s: number;
}> = ({ label, color, active, dim, s }) => (
  <div
    style={{
      transform: `scale(${0.92 + s * 0.08})`,
      opacity: dim ? 0.35 : 0.15 + s * 0.85,
      background: active ? color : WHITE,
      color: active ? WHITE : color,
      border: `3px solid ${color}`,
      borderRadius: 16,
      padding: "16px 28px",
      fontFamily: "system-ui, sans-serif",
      fontWeight: 800,
      fontSize: 34,
      minWidth: 190,
      textAlign: "center",
      boxShadow: active ? `0 16px 36px ${color}44` : `0 8px 20px rgba(15,23,42,0.06)`,
    }}
  >
    {label}
  </div>
);

const Connector: React.FC<{ progress: number; color: string }> = ({
  progress,
  color,
}) => (
  <div style={{ width: 56, height: 4, background: LINE, borderRadius: 99, position: "relative", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: `${progress * 100}%`,
        background: color,
        borderRadius: 99,
      }}
    />
  </div>
);

/* ─── Scenes ─── */

const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = softSpring(f, fps, 0, 100);
  const heartCount = Math.min(5, Math.floor(interpolate(f, [30, 95], [0, 5], clamp)));
  const showQuestion = f > 70;
  const showPaid = f > 125;
  const showHeadline = f > 140;
  const cam = interpolate(f, [0, 300], [1.04, 1], { ...clamp, easing: easeOut });

  return (
    <Stage>
      <Badge />
      <CaptionPad>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 72,
            transform: `scale(${cam})`,
            transformOrigin: "center left",
          }}
        >
          <div
            style={{
              opacity: phone,
              transform: `translateY(${(1 - phone) * 40}px) rotate(${(1 - phone) * -4}deg)`,
            }}
          >
            <PhoneUI
              scale={1.05}
              hearts={heartCount}
              paidZero={showPaid}
              glow={showPaid ? 0.6 : 0.2}
            />
          </div>
          <div style={{ flex: 1, maxWidth: 900 }}>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 58,
                color: INK,
                letterSpacing: -1.2,
                lineHeight: 1.12,
                opacity: fade(f, 8, 24),
                transform: `translateY(${slideY(f, 8, 24)}px)`,
              }}
            >
              You built an app.
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 40,
                color: MUTED,
                opacity: fade(f, 50, 70),
              }}
            >
              Friends love it.
            </div>
            {showQuestion && (
              <div
                style={{
                  marginTop: 28,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 44,
                  color: BLUE,
                  opacity: fade(f, 115, 135),
                }}
              >
                Will customers pay?
              </div>
            )}
            {showHeadline && (
              <div
                style={{
                  marginTop: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  background: WHITE,
                  border: `3px solid ${ORANGE}`,
                  borderRadius: 16,
                  padding: "18px 28px",
                  opacity: fade(f, 140, 158),
                  transform: `translateY(${slideY(f, 140, 158, 20)}px)`,
                  boxShadow: `0 18px 40px ${ORANGE}33`,
                }}
              >
                <span
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 900,
                    fontSize: 40,
                    color: ORANGE,
                    letterSpacing: -0.5,
                  }}
                >
                  Interest
                </span>
                <span style={{ fontSize: 36, color: MUTED, fontWeight: 800 }}>≠</span>
                <span
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 900,
                    fontSize: 40,
                    color: BLUE,
                    letterSpacing: -0.5,
                  }}
                >
                  paying demand
                </span>
              </div>
            )}
          </div>
        </div>
      </CaptionPad>
      {showPaid && (
        <Audio src={staticFile("sfx-tick.mp3")} volume={0.35} />
      )}
    </Stage>
  );
};

const SceneFramework: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const def = softSpring(f, fps, 0);
  const showParts = f > 105;
  const c = softSpring(f, fps, 130);
  const o = softSpring(f, fps, 170);
  const d = softSpring(f, fps, 210);
  const link1 = interpolate(f, [155, 180], [0, 1], { ...clamp, easing: easeInOut });
  const link2 = interpolate(f, [195, 220], [0, 1], { ...clamp, easing: easeInOut });

  return (
    <Stage tint="#EEF2F7">
      <Badge />
      <CaptionPad>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              opacity: def,
              transform: `translateY(${(1 - def) * 24}px)`,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 52,
              color: INK,
              letterSpacing: -1,
              marginBottom: 18,
            }}
          >
            Value exchanged for payment
          </div>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 28,
              color: MUTED,
              fontWeight: 600,
              opacity: fade(f, 90, 110),
              marginBottom: 48,
            }}
          >
            Three connected parts
          </div>
          {showParts && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <NodePill label="Customer" color={BLUE} active={false} dim={false} s={c} />
              <Connector progress={link1} color={BLUE} />
              <NodePill label="Offer" color={ORANGE} active={false} dim={false} s={o} />
              <Connector progress={link2} color={ORANGE} />
              <NodePill label="Delivery" color={TEAL} active={false} dim={false} s={d} />
            </div>
          )}
        </div>
      </CaptionPad>
      {f === 150 && <Audio src={staticFile("sfx-chime.mp3")} volume={0.4} />}
    </Stage>
  );
};

const SceneFocusPart: React.FC<{
  part: "customer" | "offer" | "delivery";
  title: string;
  line: string;
  sub?: string;
  visual: React.ReactNode;
}> = ({ part, title, line, sub, visual }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = softSpring(f, fps, 0, 110);
  const colors = { customer: BLUE, offer: ORANGE, delivery: TEAL };
  const color = colors[part];

  return (
    <Stage>
      <Badge />
      <CaptionPad>
        <div
          style={{
            display: "flex",
            gap: 56,
            alignItems: "center",
            opacity: e,
            transform: `translateX(${(1 - e) * 30}px)`,
          }}
        >
          <div style={{ flex: 1.1 }}>{visual}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
              {(["customer", "offer", "delivery"] as const).map((p) => (
                <div
                  key={p}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    textTransform: "capitalize",
                    background: p === part ? colors[p] : WHITE,
                    color: p === part ? WHITE : MUTED,
                    border: `2px solid ${p === part ? colors[p] : LINE}`,
                    opacity: p === part ? 1 : 0.4,
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 900,
                fontSize: 22,
                color,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 48,
                color: INK,
                lineHeight: 1.2,
                letterSpacing: -0.8,
              }}
            >
              {line}
            </div>
            {sub && f > 35 && (
              <div
                style={{
                  marginTop: 18,
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 30,
                  color: MUTED,
                  fontWeight: 600,
                  opacity: fade(f, 35, 50),
                }}
              >
                {sub}
              </div>
            )}
          </div>
        </div>
      </CaptionPad>
    </Stage>
  );
};

const SceneCustomer: React.FC = () => (
  <SceneFocusPart
    part="customer"
    title="Customer"
    line="Who buys? What do they need?"
    sub="Person or organization buying"
    visual={
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FreelancerDesk highlight />
      </div>
    }
  />
);

const SceneOffer: React.FC = () => {
  const f = useCurrentFrame();
  const morph = interpolate(f, [0, 35], [0, 1], { ...clamp, easing: easeOut });
  return (
    <SceneFocusPart
      part="offer"
      title="Offer"
      line="What they buy · Price · What’s included"
      visual={
        <div style={{ display: "flex", justifyContent: "center", position: "relative", height: 300 }}>
          <div
            style={{
              position: "absolute",
              opacity: 1 - morph,
              transform: `scale(${1 - morph * 0.2}) rotate(${-8 * (1 - morph)}deg)`,
            }}
          >
            <FreelancerDesk highlight />
          </div>
          <div
            style={{
              opacity: morph,
              transform: `scale(${0.85 + morph * 0.15}) translateY(${(1 - morph) * 40}px)`,
            }}
          >
            <GuideCover size={1.05} />
          </div>
        </div>
      }
    />
  );
};

const SceneDelivery: React.FC = () => {
  const f = useCurrentFrame();
  const path = interpolate(f, [10, 70], [0, 1], { ...clamp, easing: easeInOut });
  const prog = interpolate(f, [50, 100], [0, 1], clamp);
  return (
    <SceneFocusPart
      part="delivery"
      title="Delivery"
      line="How they receive the promised value"
      sub="Payment can come before or after delivery"
      visual={
        <div style={{ position: "relative", height: 320, width: "100%" }}>
          <div
            style={{
              position: "absolute",
              left: interpolate(path, [0, 1], [40, 280]),
              top: interpolate(path, [0, 1], [20, 40]),
              transform: `scale(${interpolate(path, [0, 1], [0.7, 0.45])}) rotate(${interpolate(path, [0, 1], [-6, 0])}deg)`,
              zIndex: 2,
            }}
          >
            <GuideCover />
          </div>
          <svg
            width="100%"
            height="320"
            style={{ position: "absolute", inset: 0 }}
          >
            <path
              d="M120 80 C 200 40, 260 120, 340 160"
              stroke={TEAL}
              strokeWidth="3"
              strokeDasharray="8 8"
              fill="none"
              opacity={0.5}
            />
            <circle
              cx={120 + path * 220}
              cy={80 + path * 80}
              r="8"
              fill={TEAL}
            />
          </svg>
          <div style={{ position: "absolute", right: 20, bottom: 10, opacity: fade(f, 40, 60) }}>
            <DownloadPanel progress={prog} />
          </div>
        </div>
      }
    />
  );
};

const SceneExample: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // local 0 @ 35.94s — customer ~150, offer ~274, delivery ~358
  const showC = f >= 145;
  const showO = f >= 265;
  const showD = f >= 350;
  const hold = softSpring(f, fps, 380, 70);
  const title = softSpring(f, fps, 0);

  return (
    <Stage tint="#F7F5F0">
      <Badge />
      <CaptionPad>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 40,
            color: INK,
            marginBottom: 28,
            opacity: title,
            letterSpacing: -0.5,
          }}
        >
          Example · Maya’s invoicing guide
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr 1.1fr",
            gap: 24,
            alignItems: "stretch",
            transform: `scale(${0.98 + hold * 0.02})`,
          }}
        >
          <div
            style={{
              background: WHITE,
              borderRadius: 20,
              border: `3px solid ${showC ? BLUE : LINE}`,
              padding: 28,
              minHeight: 300,
              opacity: showC ? fade(f, 145, 160) : 0.35,
              boxShadow: showC ? `0 20px 44px ${BLUE}22` : "none",
            }}
          >
            <div style={{ color: BLUE, fontWeight: 800, fontSize: 22, fontFamily: "system-ui, sans-serif" }}>
              Customer
            </div>
            {showC ? (
              <>
                <div style={{ marginTop: 16, fontWeight: 800, fontSize: 36, color: INK, fontFamily: "system-ui, sans-serif", lineHeight: 1.2 }}>
                  Freelance designers
                </div>
                {f > 175 && (
                  <div style={{ marginTop: 12, fontSize: 26, color: MUTED, fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>
                    Need help organizing invoices
                  </div>
                )}
                <div style={{ marginTop: 24, transform: "scale(0.72)", transformOrigin: "left top" }}>
                  <FreelancerDesk highlight />
                </div>
              </>
            ) : (
              <div style={{ marginTop: 40, color: LINE, fontSize: 48, fontWeight: 800 }}>…</div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: showO ? fade(f, 265, 280) : 0.35,
            }}
          >
            {showO ? (
              <>
                <GuideCover />
                <div style={{ marginTop: 14, color: ORANGE, fontWeight: 800, fontSize: 24, fontFamily: "system-ui, sans-serif" }}>
                  Offer · $79
                </div>
              </>
            ) : (
              <div
                style={{
                  width: 180,
                  height: 240,
                  borderRadius: 14,
                  border: `3px dashed ${LINE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: MUTED,
                  fontWeight: 800,
                  fontSize: 24,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Offer
              </div>
            )}
          </div>

          <div
            style={{
              background: WHITE,
              borderRadius: 20,
              border: `3px solid ${showD ? TEAL : LINE}`,
              padding: 28,
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: showD ? fade(f, 350, 365) : 0.35,
              boxShadow: showD ? `0 20px 44px ${TEAL}22` : "none",
            }}
          >
            <div style={{ color: TEAL, fontWeight: 800, fontSize: 22, fontFamily: "system-ui, sans-serif" }}>
              Delivery
            </div>
            {showD ? (
              <div style={{ marginTop: 20 }}>
                <DownloadPanel progress={1} />
              </div>
            ) : (
              <div style={{ marginTop: 40, color: LINE, fontSize: 48, fontWeight: 800 }}>…</div>
            )}
          </div>
        </div>
      </CaptionPad>
      {f === 355 && <Audio src={staticFile("sfx-chime.mp3")} volume={0.45} />}
    </Stage>
  );
};

const SceneContrast: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = softSpring(f, fps, 0);
  const left = f >= 95;
  const interest = f >= 150;
  const right = f >= 225;
  const caveat = f >= 300;

  return (
    <Stage>
      <Badge />
      <CaptionPad>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 44,
            color: INK,
            marginBottom: 32,
            opacity: e,
            letterSpacing: -0.6,
          }}
        >
          Compare the evidence
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <div
            style={{
              flex: 1,
              background: WHITE,
              borderRadius: 20,
              border: `3px solid ${LINE}`,
              padding: 28,
              opacity: left ? fade(f, 95, 112) : 0.35,
              transform: `translateY(${left ? 0 : 16}px)`,
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <PhoneUI scale={0.62} hearts={3} />
              <div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 32, color: MUTED }}>
                  Positive feedback
                </div>
                {interest && (
                  <div
                    style={{
                      marginTop: 16,
                      fontFamily: "system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: 28,
                      color: ORANGE,
                      lineHeight: 1.3,
                      opacity: fade(f, 150, 165),
                    }}
                  >
                    Interest does not establish paying demand.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: WHITE,
              borderRadius: 20,
              border: `3px solid ${right ? BLUE : LINE}`,
              padding: 28,
              opacity: right ? fade(f, 225, 242) : 0.35,
              boxShadow: right ? `0 20px 44px ${BLUE}22` : "none",
            }}
          >
            <div style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 32, color: BLUE }}>
              Completed purchase
            </div>
            <div
              style={{
                marginTop: 16,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: INK,
                lineHeight: 1.35,
              }}
            >
              Stronger evidence of paying demand
            </div>
            <div
              style={{
                marginTop: 28,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: BLUE_SOFT,
                borderRadius: 12,
                padding: "12px 16px",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 24,
                color: BLUE,
              }}
            >
              $ → access delivered
            </div>
            {caveat && (
              <div
                style={{
                  marginTop: 22,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 24,
                  color: MUTED,
                  background: "#F1F5F9",
                  borderRadius: 12,
                  padding: "12px 16px",
                  opacity: fade(f, 300, 318),
                }}
              >
                One sale ≠ proof of long-term success
              </div>
            )}
          </div>
        </div>
      </CaptionPad>
    </Stage>
  );
};

const SceneRecap: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = softSpring(f, fps, 0);
  const items = [
    { q: "Who buys?", c: BLUE, delay: 8 },
    { q: "What is the offer?", c: ORANGE, delay: 28 },
    { q: "How is it delivered?", c: TEAL, delay: 48 },
  ];
  return (
    <Stage tint="#EEF2F7">
      <Badge />
      <CaptionPad>
        <div style={{ opacity: e }}>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 44,
              color: INK,
              marginBottom: 28,
              letterSpacing: -0.5,
            }}
          >
            When you examine an idea
          </div>
          <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
            <NodePill label="Customer" color={BLUE} active dim={false} s={1} />
            <Connector progress={1} color={BLUE} />
            <NodePill label="Offer" color={ORANGE} active dim={false} s={1} />
            <Connector progress={1} color={ORANGE} />
            <NodePill label="Delivery" color={TEAL} active dim={false} s={1} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {items.map((it) => (
              <div
                key={it.q}
                style={{
                  background: WHITE,
                  borderLeft: `8px solid ${it.c}`,
                  borderRadius: 14,
                  padding: "20px 26px",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 40,
                  color: INK,
                  opacity: fade(f, it.delay, it.delay + 14),
                  transform: `translateY(${slideY(f, it.delay, it.delay + 14, 18)}px)`,
                  boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
                }}
              >
                {it.q}
              </div>
            ))}
          </div>
        </div>
      </CaptionPad>
    </Stage>
  );
};

const SceneQuizHandoff: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = softSpring(f, fps, 0, 100);
  return (
    <Stage>
      <Badge />
      <CaptionPad>
        <div
          style={{
            textAlign: "center",
            opacity: e,
            transform: `translateY(${(1 - e) * 18}px)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 40 }}>
            <NodePill label="Customer" color={BLUE} active dim={false} s={1} />
            <Connector progress={1} color={BLUE} />
            <NodePill label="Offer" color={ORANGE} active dim={false} s={1} />
            <Connector progress={1} color={ORANGE} />
            <NodePill label="Delivery" color={TEAL} active dim={false} s={1} />
          </div>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 52,
              color: INK,
              letterSpacing: -1,
              lineHeight: 1.2,
            }}
          >
            Your turn: apply it to a new example.
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: "system-ui, sans-serif",
              fontSize: 30,
              color: MUTED,
              fontWeight: 600,
            }}
          >
            Quiz next — answers stay hidden until you submit.
          </div>
        </div>
      </CaptionPad>
      {f === 8 && <Audio src={staticFile("sfx-whoosh.mp3")} volume={0.25} />}
    </Stage>
  );
};

const sec = (s: number) => Math.round(s * L001_PRO_FPS);

export const L001Pro: React.FC = () => {
  const beats: { Comp: React.FC; from: number; to: number }[] = [
    { Comp: SceneHook, from: sec(0), to: sec(8.3) },
    { Comp: SceneFramework, from: sec(8.3), to: sec(18.104) },
    { Comp: SceneCustomer, from: sec(18.104), to: sec(23.548) },
    { Comp: SceneOffer, from: sec(23.548), to: sec(28.752) },
    { Comp: SceneDelivery, from: sec(28.752), to: sec(35.936) },
    { Comp: SceneExample, from: sec(35.936), to: sec(50.628) },
    { Comp: SceneContrast, from: sec(50.628), to: sec(64.228) },
    { Comp: SceneRecap, from: sec(64.228), to: sec(70.372) },
    { Comp: SceneQuizHandoff, from: sec(70.372), to: L001_PRO_DURATION },
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
