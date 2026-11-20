import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO } from "./tokens";

export const L001_EDITORIAL_FPS = 30;
/** Aligned to voice-l001-final.mp3 (~107.93s) */
export const L001_EDITORIAL_DURATION = Math.ceil(107.93 * L001_EDITORIAL_FPS);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const fade = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], clamp);

const ease = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/** Scene starts in frames from aligned timeline */
const S = {
  hook: 0,
  framework: Math.round(10.84 * 30),
  customer: Math.round(23.56 * 30),
  offer: Math.round(30.91 * 30),
  delivery: Math.round(37.98 * 30),
  example: Math.round(47.87 * 30),
  exampleParts: Math.round(54.32 * 30),
  contrast: Math.round(67.47 * 30),
  recap: Math.round(84.78 * 30),
  quiz: Math.round(93.15 * 30),
  end: Math.round(107.93 * 30),
};

const Badge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 32,
      left: 48,
      zIndex: 40,
      background: C.blue,
      color: C.textLight,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 0.4,
      padding: "8px 14px",
      borderRadius: 8,
    }}
  >
    DigProg · L01
  </div>
);

/** Recurring orange attention marker */
const Marker: React.FC<{
  x: number;
  y: number;
  opacity?: number;
  size?: number;
  pulse?: number;
}> = ({ x, y, opacity = 1, size = 18, pulse = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size + pulse,
      height: size + pulse,
      marginLeft: -(size + pulse) / 2,
      marginTop: -(size + pulse) / 2,
      borderRadius: 99,
      background: C.orange,
      opacity,
      boxShadow: `0 0 0 ${4 + pulse * 0.4}px rgba(255,138,61,0.28)`,
      zIndex: 50,
      pointerEvents: "none",
    }}
  />
);

const SoftBg: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <AbsoluteFill
    style={{
      background: dark
        ? `radial-gradient(ellipse 90% 70% at 50% 40%, #142447 0%, ${C.videoDark} 72%)`
        : `radial-gradient(ellipse 85% 65% at 48% 28%, #FFFFFF 0%, ${C.bg} 68%)`,
    }}
  >
    {!dark && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            "linear-gradient(#D5DCE8 1px, transparent 1px), linear-gradient(90deg, #D5DCE8 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
    )}
  </AbsoluteFill>
);

const CaptionSafe: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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

const AppInterface: React.FC<{ scale?: number; dim?: boolean }> = ({
  scale = 1,
  dim = false,
}) => (
  <div
    style={{
      width: 280 * scale,
      height: 420 * scale,
      borderRadius: 28 * scale,
      border: `${3 * scale}px solid ${C.text}`,
      background: C.surface,
      opacity: dim ? 0.55 : 1,
      position: "relative",
      boxShadow: "0 18px 40px rgba(19,35,61,0.12)",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 16 * scale,
        left: "50%",
        transform: "translateX(-50%)",
        width: 72 * scale,
        height: 8 * scale,
        borderRadius: 99,
        background: C.line,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 48 * scale,
        left: 18 * scale,
        right: 18 * scale,
        bottom: 22 * scale,
        borderRadius: 14 * scale,
        background: `linear-gradient(165deg, #E8EEFA, #D6E4FF)`,
        padding: 16 * scale,
        display: "flex",
        flexDirection: "column",
        gap: 10 * scale,
      }}
    >
      <div
        style={{
          height: 14 * scale,
          width: "62%",
          background: C.blue,
          borderRadius: 6,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          height: 10 * scale,
          width: "88%",
          background: "rgba(19,35,61,0.12)",
          borderRadius: 5,
        }}
      />
      <div
        style={{
          height: 10 * scale,
          width: "74%",
          background: "rgba(19,35,61,0.1)",
          borderRadius: 5,
        }}
      />
      <div
        style={{
          marginTop: "auto",
          height: 44 * scale,
          borderRadius: 10 * scale,
          background: C.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.textLight,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 15 * scale,
        }}
      >
        Open app
      </div>
    </div>
  </div>
);

const ReactionChip: React.FC<{
  label: string;
  x: number;
  y: number;
  opacity: number;
  scale?: number;
}> = ({ label, x, y, opacity, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      transform: `scale(${scale})`,
      background: C.surface,
      border: `2px solid ${C.line}`,
      borderRadius: 999,
      padding: "10px 16px",
      fontFamily: FONT,
      fontWeight: 650,
      fontSize: 22,
      color: C.text,
      boxShadow: "0 8px 20px rgba(19,35,61,0.08)",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

const PaidZero: React.FC<{ highlight?: boolean; scale?: number }> = ({
  highlight = false,
  scale = 1,
}) => (
  <div
    style={{
      background: highlight ? "#FFF4EC" : C.surface,
      border: `3px solid ${highlight ? C.orange : C.line}`,
      borderRadius: 16 * scale,
      padding: `${18 * scale}px ${24 * scale}px`,
      minWidth: 220 * scale,
      boxShadow: highlight
        ? "0 12px 32px rgba(255,138,61,0.22)"
        : "0 8px 20px rgba(19,35,61,0.06)",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontSize: 16 * scale,
        color: C.textSecondary,
        fontWeight: 600,
        marginBottom: 6 * scale,
      }}
    >
      Paid customers
    </div>
    <div
      style={{
        fontFamily: MONO,
        fontSize: 48 * scale,
        fontWeight: 700,
        color: highlight ? C.orangeDark : C.text,
        lineHeight: 1,
      }}
    >
      0
    </div>
  </div>
);

const FrameworkNode: React.FC<{
  label: string;
  color: string;
  active?: boolean;
  dim?: boolean;
  width?: number;
}> = ({ label, color, active = false, dim = false, width = 240 }) => {
  const onOrange = active && color === C.offer;
  return (
    <div
      style={{
        width,
        background: active ? color : C.surface,
        color: active
          ? onOrange
            ? C.text
            : C.textLight
          : dim
            ? C.textSecondary
            : color,
        border: `3px solid ${dim && !active ? C.line : color}`,
        borderRadius: 14,
        padding: "18px 22px",
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 36,
        opacity: dim && !active ? 0.42 : 1,
        boxShadow: active ? `0 10px 28px ${color}44` : "none",
      }}
    >
      {label}
    </div>
  );
};

const Arrow: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 40,
      fontWeight: 700,
      color: C.textSecondary,
      opacity,
      padding: "0 8px",
    }}
  >
    →
  </div>
);

const GuideCover: React.FC<{ scale?: number; showPrice?: boolean }> = ({
  scale = 1,
  showPrice = true,
}) => (
  <div
    style={{
      width: 220 * scale,
      height: 300 * scale,
      borderRadius: 16 * scale,
      background: `linear-gradient(155deg, ${C.blueDeep} 0%, ${C.blue} 55%, #3D7BFF 100%)`,
      boxShadow: "0 16px 36px rgba(16,42,86,0.28)",
      padding: 20 * scale,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        right: -30 * scale,
        top: -20 * scale,
        width: 120 * scale,
        height: 120 * scale,
        borderRadius: 99,
        background: "rgba(255,138,61,0.35)",
      }}
    />
    <div
      style={{
        fontFamily: FONT,
        fontSize: 13 * scale,
        fontWeight: 700,
        letterSpacing: 1.2,
        color: C.blueBright,
        textTransform: "uppercase",
      }}
    >
      DigProg Guides
    </div>
    <div
      style={{
        marginTop: 18 * scale,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 28 * scale,
        lineHeight: 1.15,
        color: C.textLight,
      }}
    >
      Invoice
      <br />
      Clarity
    </div>
    <div
      style={{
        marginTop: 10 * scale,
        fontFamily: FONT,
        fontSize: 14 * scale,
        color: "rgba(247,250,255,0.78)",
        lineHeight: 1.35,
      }}
    >
      Templates · checklists · wording
    </div>
    {showPrice && (
      <div
        style={{
          marginTop: "auto",
          alignSelf: "flex-start",
          background: C.orange,
          color: C.text,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 22 * scale,
          padding: `${8 * scale}px ${14 * scale}px`,
          borderRadius: 10 * scale,
        }}
      >
        $79
      </div>
    )}
  </div>
);

const WorkspaceCard: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      opacity,
      width: 520,
      background: C.surface,
      border: `2px solid ${C.line}`,
      borderRadius: 18,
      padding: 28,
      boxShadow: "0 14px 36px rgba(19,35,61,0.08)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "#E8EEFA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        ⌨
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 750, fontSize: 24, color: C.text }}>
          Freelancer workspace
        </div>
        <div style={{ fontFamily: FONT, fontSize: 16, color: C.textSecondary }}>
          Invoices scattered · late follow-ups
        </div>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {["Invoice #104 · overdue", "Invoice #108 · draft", "Client B · unpaid"].map(
        (row, i) => (
          <div
            key={row}
            style={{
              background: i === 0 ? "#FFF4EC" : C.bg,
              border: `1px solid ${i === 0 ? C.orange : C.line}`,
              borderRadius: 10,
              padding: "10px 14px",
              fontFamily: FONT,
              fontSize: 18,
              color: i === 0 ? C.orangeDark : C.textSecondary,
              fontWeight: 600,
            }}
          >
            {row}
          </div>
        ),
      )}
    </div>
  </div>
);

const DownloadUI: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      width: 560,
      background: C.surface,
      borderRadius: 18,
      border: `2px solid ${C.line}`,
      padding: 28,
      boxShadow: "0 14px 36px rgba(19,35,61,0.1)",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 750,
        fontSize: 26,
        color: C.text,
        marginBottom: 8,
      }}
    >
      Download ready
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: 18,
        color: C.textSecondary,
        marginBottom: 20,
      }}
    >
      invoice-clarity-guide.pdf
    </div>
    <div
      style={{
        height: 12,
        borderRadius: 99,
        background: C.bg,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: `${Math.round(progress * 100)}%`,
          height: "100%",
          background: C.blue,
          borderRadius: 99,
        }}
      />
    </div>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: progress >= 0.98 ? C.success : C.blue,
        color: C.textLight,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 18,
        padding: "12px 20px",
        borderRadius: 10,
      }}
    >
      {progress >= 0.98 ? "Link sent" : "Sending download link…"}
    </div>
  </div>
);

const ExampleCard: React.FC<{
  title: string;
  body: string;
  color: string;
  active?: boolean;
  dim?: boolean;
}> = ({ title, body, color, active = false, dim = false }) => (
  <div
    style={{
      width: 340,
      background: C.surface,
      border: `3px solid ${active ? color : C.line}`,
      borderRadius: 16,
      padding: 22,
      opacity: dim ? 0.4 : 1,
      boxShadow: active ? `0 12px 28px ${color}33` : "none",
      transform: active ? "translateY(-6px)" : "none",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 20,
        color,
        marginBottom: 10,
        letterSpacing: 0.3,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: 26,
        fontWeight: 650,
        color: C.text,
        lineHeight: 1.3,
      }}
    >
      {body}
    </div>
  </div>
);

const EvidencePanel: React.FC<{
  title: string;
  items: string[];
  tone: "interest" | "purchase";
  active?: boolean;
}> = ({ title, items, tone, active = false }) => {
  const accent = tone === "interest" ? C.blue : C.orange;
  return (
    <div
      style={{
        width: 420,
        background: active ? C.surface : "rgba(255,255,255,0.92)",
        border: `3px solid ${active ? accent : C.line}`,
        borderRadius: 18,
        padding: 26,
        opacity: active ? 1 : 0.55,
        boxShadow: active ? `0 14px 32px ${accent}28` : "none",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 24,
          color: accent,
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      {items.map((item) => (
        <div
          key={item}
          style={{
            fontFamily: FONT,
            fontSize: 22,
            color: C.text,
            padding: "10px 0",
            borderBottom: `1px solid ${C.line}`,
            fontWeight: 600,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

/* ——— Scenes ——— */

const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = f - S.hook;
  const appIn = spring({
    frame: Math.max(0, local - 4),
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const r1 = fade(local, 28, 42);
  const r2 = fade(local, 42, 56);
  const r3 = fade(local, 56, 70);
  const paidIn = spring({
    frame: Math.max(0, local - 100),
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const question = fade(local, 78, 100);
  const markerX = ease(local, 110, 160, 920, 1280);
  const markerY = ease(local, 110, 160, 280, 420);
  const markerOp = fade(local, 100, 118);
  const out = fade(local, 290, 320, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 64,
            position: "relative",
            minHeight: 560,
          }}
        >
          <div
            style={{
              transform: `scale(${0.85 + appIn * 0.15})`,
              opacity: appIn,
              position: "relative",
            }}
          >
            <AppInterface />
            <ReactionChip label="Love this!" x={220} y={40} opacity={r1} />
            <ReactionChip label="So useful" x={-90} y={120} opacity={r2} />
            <ReactionChip label="Nice work" x={200} y={280} opacity={r3} />
          </div>
          <div
            style={{
              opacity: paidIn,
              transform: `translateY(${(1 - paidIn) * 24}px)`,
            }}
          >
            <PaidZero highlight={local > 130} />
            <div
              style={{
                marginTop: 28,
                maxWidth: 340,
                opacity: question,
                fontFamily: FONT,
                fontSize: 36,
                fontWeight: 750,
                color: C.text,
                lineHeight: 1.25,
              }}
            >
              Interest ≠ paying demand
            </div>
          </div>
          <Marker x={markerX} y={markerY} opacity={markerOp} pulse={fade(local, 130, 170) * 6} />
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneFramework: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - S.framework;
  const def = fade(local, 0, 18);
  const showC = fade(local, 140, 165);
  const showO = fade(local, 195, 220);
  const showD = fade(local, 250, 275);
  const active: "none" | "customer" | "offer" | "delivery" | "all" =
    local < 195 ? (showC > 0.5 ? "customer" : "none") : local < 250 ? "offer" : showD > 0.5 ? "delivery" : "offer";
  const out = fade(local, 350, 380, 1, 0);
  const markerX =
    active === "customer"
      ? 520
      : active === "offer"
        ? 960
        : active === "delivery"
          ? 1400
          : 960;

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div
          style={{
            textAlign: "center",
            opacity: def,
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 650,
            color: C.text,
            maxWidth: 1200,
            margin: "0 auto 56px",
            lineHeight: 1.35,
          }}
        >
          A business provides something customers value
          <br />
          <span style={{ color: C.textSecondary }}>in exchange for payment.</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            position: "relative",
          }}
        >
          <div style={{ opacity: showC }}>
            <FrameworkNode
              label="Customer"
              color={C.customer}
              active={active === "customer" || active === "all"}
            />
          </div>
          <div style={{ opacity: showO }}>
            <Arrow />
          </div>
          <div style={{ opacity: showO }}>
            <FrameworkNode
              label="Offer"
              color={C.offer}
              active={active === "offer" || active === "all"}
              dim={active === "customer"}
            />
          </div>
          <div style={{ opacity: showD }}>
            <Arrow />
          </div>
          <div style={{ opacity: showD }}>
            <FrameworkNode
              label="Delivery"
              color={C.delivery}
              active={active === "delivery" || active === "all"}
              dim={active === "customer" || active === "offer"}
            />
          </div>
          {showC > 0.2 && (
            <Marker
              x={markerX}
              y={520}
              opacity={0.95}
              size={16}
              pulse={4}
            />
          )}
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneCustomer: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - S.customer;
  const inA = fade(local, 0, 16);
  const q1 = fade(local, 70, 95);
  const q2 = fade(local, 110, 135);
  const out = fade(local, 190, 220, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div style={{ display: "flex", gap: 48, alignItems: "center", justifyContent: "center" }}>
          <div style={{ opacity: inA }}>
            <WorkspaceCard />
          </div>
          <div style={{ width: 420 }}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 48,
                color: C.customer,
                marginBottom: 28,
              }}
            >
              Customer
            </div>
            <div
              style={{
                opacity: q1,
                fontFamily: FONT,
                fontSize: 32,
                fontWeight: 700,
                color: C.text,
                marginBottom: 16,
              }}
            >
              Who buys?
            </div>
            <div
              style={{
                opacity: q2,
                fontFamily: FONT,
                fontSize: 32,
                fontWeight: 700,
                color: C.text,
              }}
            >
              What do they need?
            </div>
            <Marker x={1680} y={420} opacity={q1} />
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneOffer: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - S.offer;
  const cover = fade(local, 0, 18);
  const title = fade(local, 40, 65);
  const price = fade(local, 90, 115);
  const incl = fade(local, 120, 145);
  const out = fade(local, 180, 210, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div style={{ display: "flex", gap: 64, alignItems: "center", justifyContent: "center" }}>
          <div style={{ opacity: cover, transform: `translateY(${(1 - cover) * 20}px)` }}>
            <GuideCover showPrice={price > 0.5} />
          </div>
          <div style={{ width: 520 }}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 48,
                color: C.offer,
                marginBottom: 20,
              }}
            >
              Offer
            </div>
            <div
              style={{
                opacity: title,
                fontFamily: FONT,
                fontSize: 36,
                fontWeight: 700,
                color: C.text,
                marginBottom: 14,
              }}
            >
              Clear product or service
            </div>
            <div
              style={{
                opacity: price,
                fontFamily: MONO,
                fontSize: 44,
                fontWeight: 700,
                color: C.orangeDark,
                marginBottom: 14,
              }}
            >
              Price · what’s included
            </div>
            <div
              style={{
                opacity: incl,
                fontFamily: FONT,
                fontSize: 24,
                color: C.textSecondary,
              }}
            >
              Templates · checklists · wording
            </div>
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneDelivery: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - S.delivery;
  const ui = fade(local, 0, 18);
  const progress = ease(local, 40, 140, 0, 1);
  const note = fade(local, 150, 180);
  const out = fade(local, 210, 235, 1, 0);
  const guideX = ease(local, 20, 90, 200, 520);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div style={{ position: "relative", minHeight: 520 }}>
          <div
            style={{
              position: "absolute",
              left: guideX,
              top: 40,
              opacity: fade(local, 0, 20) * (1 - fade(local, 100, 130)),
              transform: "scale(0.55)",
              transformOrigin: "top left",
            }}
          >
            <GuideCover />
          </div>
          <div
            style={{
              position: "absolute",
              right: 80,
              top: 80,
              opacity: ui,
            }}
          >
            <DownloadUI progress={progress} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 80,
              bottom: 40,
              opacity: note,
              fontFamily: FONT,
              fontSize: 28,
              fontWeight: 650,
              color: C.textSecondary,
              maxWidth: 700,
            }}
          >
            Payment can happen before or after delivery.
          </div>
          <svg
            width="1920"
            height="1080"
            style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: fade(local, 50, 90) }}
          >
            <path
              d="M 340 280 C 520 200, 700 220, 980 320"
              fill="none"
              stroke={C.orange}
              strokeWidth={4}
              strokeDasharray="8 8"
            />
          </svg>
          <Marker x={980} y={320} opacity={fade(local, 70, 100)} />
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneExample: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - S.example;
  const intro = fade(local, 0, 18);
  const partsLocal = f - S.exampleParts;
  const inParts = partsLocal >= 0;
  const cAct = inParts && partsLocal < 90;
  const oAct = inParts && partsLocal >= 90 && partsLocal < 180;
  const dAct = inParts && partsLocal >= 180;
  const all = inParts && partsLocal > 280;
  const out = fade(f, S.contrast - 30, S.contrast, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div
          style={{
            textAlign: "center",
            marginBottom: 36,
            opacity: intro,
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 700,
            color: C.text,
          }}
        >
          Maya’s invoicing guide · worked example
        </div>
        <div
          style={{
            display: "flex",
            gap: 28,
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <div style={{ opacity: inParts ? fade(partsLocal, 0, 20) : fade(local, 40, 70) }}>
            <ExampleCard
              title="Customer"
              body="Freelance designers who need help organizing invoices"
              color={C.customer}
              active={cAct || all}
              dim={inParts && !cAct && !all}
            />
          </div>
          <div style={{ opacity: inParts ? fade(partsLocal, 80, 100) : 0.15 }}>
            <ExampleCard
              title="Offer"
              body="Invoicing guide · $79"
              color={C.offer}
              active={oAct || all}
              dim={inParts && !oAct && !all}
            />
          </div>
          <div style={{ opacity: inParts ? fade(partsLocal, 170, 190) : 0.15 }}>
            <ExampleCard
              title="Delivery"
              body="Download link"
              color={C.delivery}
              active={dAct || all}
              dim={inParts && !dAct && !all}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, opacity: fade(local, 20, 50) }}>
          <GuideCover scale={0.72} />
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneContrast: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - S.contrast;
  const left = fade(local, 0, 20);
  const right = fade(local, 120, 150);
  const out = fade(local, 420, 455, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div style={{ opacity: left }}>
            <div style={{ marginBottom: 20, transform: "scale(0.7)", transformOrigin: "top left" }}>
              <AppInterface dim />
            </div>
            <EvidencePanel
              title="Interest"
              tone="interest"
              active={local < 200}
              items={["Friends praise the app", "Useful feedback", "Not proof of payment"]}
            />
          </div>
          <div style={{ opacity: right, paddingTop: 40 }}>
            <EvidencePanel
              title="Paying demand"
              tone="purchase"
              active={local >= 200}
              items={["Completed purchase", "Stronger evidence", "One sale ≠ long-term proof"]}
            />
            <div style={{ marginTop: 24 }}>
              <PaidZero highlight={local > 220} scale={0.9} />
            </div>
          </div>
        </div>
        <Marker
          x={local < 200 ? 520 : 1280}
          y={local < 200 ? 520 : 360}
          opacity={0.9}
        />
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneRecap: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - S.recap;
  const row = fade(local, 0, 18);
  const cta = fade(f, S.quiz, S.quiz + 20);
  const simplify = ease(local, 40, 100, 1, 0.92);

  return (
    <AbsoluteFill>
      <SoftBg dark={f >= S.quiz} />
      <Badge />
      <CaptionSafe>
        <div
          style={{
            opacity: row,
            transform: `scale(${simplify})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <FrameworkNode label="Customer" color={C.customer} active />
          <Arrow />
          <FrameworkNode label="Offer" color={C.offer} active />
          <Arrow />
          <FrameworkNode label="Delivery" color={C.delivery} active />
        </div>
        <div
          style={{
            textAlign: "center",
            opacity: fade(local, 60, 90),
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 650,
            color: f >= S.quiz ? C.textLight : C.text,
            marginBottom: 36,
          }}
        >
          Who is the customer · what is the offer · how is it delivered?
        </div>
        <div
          style={{
            opacity: cta,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 800,
            color: C.orange,
          }}
        >
          Your turn: identify the missing part.
        </div>
        <Marker x={960} y={720} opacity={cta} size={20} pulse={cta * 8} />
      </CaptionSafe>
    </AbsoluteFill>
  );
};

export const L001Editorial: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <Audio src={staticFile("voice-l001-final.mp3")} />
      {frame < S.framework && <SceneHook />}
      {frame >= S.framework - 20 && frame < S.customer && <SceneFramework />}
      {frame >= S.customer - 15 && frame < S.offer && <SceneCustomer />}
      {frame >= S.offer - 15 && frame < S.delivery && <SceneOffer />}
      {frame >= S.delivery - 15 && frame < S.example && <SceneDelivery />}
      {frame >= S.example - 15 && frame < S.contrast && <SceneExample />}
      {frame >= S.contrast - 20 && frame < S.recap && <SceneContrast />}
      {frame >= S.recap - 15 && <SceneRecap />}
    </AbsoluteFill>
  );
};
