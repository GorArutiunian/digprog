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

const PAPER = "#F7F3EA";
const GRID = "#C9D6E5";
const INK = "#0B1220";
const BLUE = "#1D4ED8";
const BLUE2 = "#38BDF8";
const ORANGE = "#EA580C";
const ORANGE2 = "#FB923C";
const WHITE = "#FFFFFF";

export const L001_MAX_FPS = 30;
export const L001_MAX_DURATION = 90 * L001_MAX_FPS;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/** Animated math notepad */
const Notepad: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const f = useCurrentFrame();
  const drift = (f * 0.55 * intensity) % 48;
  const driftY = (f * 0.25 * intensity) % 48;
  const nodes: React.ReactNode[] = [];
  for (let x = -48; x < 2100; x += 48) {
    nodes.push(
      <div
        key={`v${x}`}
        style={{
          position: "absolute",
          left: x + drift,
          top: 0,
          bottom: 0,
          width: x % 240 === 0 ? 2 : 1,
          background: x % 240 === 0 ? "#B0C0D4" : GRID,
          opacity: 0.9,
        }}
      />,
    );
  }
  for (let y = -48; y < 1300; y += 48) {
    nodes.push(
      <div
        key={`h${y}`}
        style={{
          position: "absolute",
          top: y + driftY,
          left: 0,
          right: 0,
          height: y % 240 === 0 ? 2 : 1,
          background: y % 240 === 0 ? "#B0C0D4" : GRID,
        }}
      />,
    );
  }
  const floaters = [
    { t: "Σ", x: 86, y: 120, c: BLUE2, s: 42 },
    { t: "Δ", x: 1700, y: 160, c: ORANGE2, s: 36 },
    { t: "π", x: 1600, y: 820, c: BLUE2, s: 40 },
    { t: "→", x: 200, y: 880, c: ORANGE2, s: 34 },
    { t: "f(x)", x: 1500, y: 100, c: BLUE, s: 28 },
  ];
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {nodes}
      <div
        style={{
          position: "absolute",
          left: 110 + Math.sin(f / 40) * 4,
          top: 0,
          bottom: 0,
          width: 3,
          background: ORANGE2,
          opacity: 0.65,
        }}
      />
      {floaters.map((fl, i) => (
        <div
          key={fl.t + i}
          style={{
            position: "absolute",
            left: fl.x,
            top: fl.y + Math.sin((f + i * 20) / 18) * 14 * intensity,
            color: fl.c,
            fontFamily: "Georgia, serif",
            fontSize: fl.s,
            opacity: 0.35 + 0.1 * Math.sin((f + i) / 15),
            transform: `rotate(${Math.sin((f + i * 9) / 25) * 8}deg)`,
          }}
        >
          {fl.t}
        </div>
      ))}
      {/* orbiting dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ang = f / 18 + i * ((Math.PI * 2) / 6);
        const cx = 960 + Math.cos(ang) * (420 + i * 18);
        const cy = 540 + Math.sin(ang) * (260 + i * 10);
        return (
          <div
            key={`d${i}`}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              width: 10,
              height: 10,
              borderRadius: 99,
              background: i % 2 ? ORANGE : BLUE,
              opacity: 0.35,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const DigProgMark: React.FC<{ frame?: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 140,
        transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
        opacity: s,
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${BLUE}, ${ORANGE})`,
          transform: `rotate(${f * 2}deg)`,
        }}
      />
      <div
        style={{
          background: BLUE,
          color: WHITE,
          fontFamily: "Arial Black, Arial",
          fontSize: 22,
          padding: "8px 14px",
          borderRadius: 10,
          boxShadow: `4px 4px 0 ${ORANGE}`,
        }}
      >
        DigProg
      </div>
    </div>
  );
};

const SceneTitle: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 12, stiffness: 100 } });
  const bar = interpolate(f, [12, 40], [0, 520], clamp);
  const words = ["What", "a", "business", "is"];
  return (
    <AbsoluteFill>
      <Notepad />
      <DigProgMark />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 340,
          transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px) rotate(${interpolate(enter, [0, 1], [-3, 0])}deg)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            color: BLUE,
            fontFamily: "Arial",
            fontWeight: 800,
            fontSize: 30,
            marginBottom: 16,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Lesson 01
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", maxWidth: 1400 }}>
          {words.map((w, i) => {
            const local = Math.max(0, f - 6 - i * 4);
            const pop = spring({ frame: local, fps, config: { damping: 11, stiffness: 160 } });
            return (
              <span
                key={w}
                style={{
                  color: INK,
                  fontFamily: "Arial Black, Arial",
                  fontSize: 92,
                  letterSpacing: -2,
                  display: "inline-block",
                  transform: `translateY(${interpolate(pop, [0, 1], [40, 0])}px) scale(${interpolate(pop, [0, 1], [0.8, 1])})`,
                  opacity: pop,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 28,
            height: 10,
            width: bar,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${BLUE}, ${ORANGE})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 10, stiffness: 150 } });
  const pulse = 1 + Math.sin(f / 7) * 0.03;
  const ring = interpolate(f, [0, 40], [0.6, 1.35], clamp);
  const ringOp = interpolate(f, [0, 20, 50], [0, 0.5, 0], clamp);
  return (
    <AbsoluteFill>
      <Notepad intensity={1.2} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 520 * ring,
            height: 220 * ring,
            borderRadius: 28,
            border: `3px solid ${BLUE}`,
            opacity: ringOp,
          }}
        />
        <div
          style={{
            transform: `scale(${pop * pulse}) rotate(${interpolate(pop, [0, 1], [6, 0])}deg)`,
            background: WHITE,
            border: `5px solid ${BLUE}`,
            boxShadow: `16px 16px 0 ${ORANGE}`,
            borderRadius: 22,
            padding: "48px 70px",
          }}
        >
          <div style={{ color: INK, fontFamily: "Arial Black, Arial", fontSize: 64 }}>Paid problem-solving</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneDefinition: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 14 } });
  const b = spring({ frame: Math.max(0, f - 16), fps, config: { damping: 14 } });
  const chalk = interpolate(f, [20, 55], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Notepad />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path
          d={`M 180 720 Q 500 ${680 + Math.sin(f / 10) * 20} 900 710 T 1600 700`}
          fill="none"
          stroke={BLUE2}
          strokeWidth={3}
          strokeDasharray={1400}
          strokeDashoffset={1400 * (1 - chalk)}
          opacity={0.5}
        />
      </svg>
      <div style={{ position: "absolute", left: 170, top: 320 }}>
        <div
          style={{
            opacity: a,
            transform: `translateX(${interpolate(a, [0, 1], [-80, 0])}px)`,
            color: INK,
            fontFamily: "Arial Black, Arial",
            fontSize: 58,
            marginBottom: 30,
          }}
        >
          Solve a costly problem.
        </div>
        <div
          style={{
            opacity: b,
            transform: `translateX(${interpolate(b, [0, 1], [80, 0])}px)`,
            color: ORANGE,
            fontFamily: "Arial Black, Arial",
            fontSize: 58,
            textShadow: `0 0 0 ${ORANGE}`,
          }}
        >
          Get paid for it.
        </div>
        <div
          style={{
            marginTop: 26,
            height: 8,
            width: interpolate(f, [28, 60], [0, 560], clamp),
            borderRadius: 8,
            background: `linear-gradient(90deg, ${BLUE}, ${ORANGE})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const SceneThree: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boxes = [
    { t: "Customer", s: "who pays", c: BLUE, delay: 0 },
    { t: "Offer", s: "what they buy", c: ORANGE, delay: 10 },
    { t: "Delivery", s: "promise kept", c: BLUE, delay: 20 },
  ];
  const cam = interpolate(f, [0, 100], [1.08, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pan = Math.sin(f / 28) * 8;
  return (
    <AbsoluteFill>
      <Notepad intensity={1.3} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          transform: `scale(${cam}) translateX(${pan}px)`,
        }}
      >
        {boxes.map((b, i) => {
          const local = Math.max(0, f - b.delay);
          const enter = spring({ frame: local, fps, config: { damping: 10, stiffness: 130 } });
          const bob = Math.sin((f + i * 14) / 11) * 8;
          const spin = interpolate(enter, [0, 1], [i % 2 ? 12 : -12, 0]);
          return (
            <React.Fragment key={b.t}>
              <div
                style={{
                  width: 390,
                  height: 250,
                  borderRadius: 20,
                  background: WHITE,
                  border: `5px solid ${b.c}`,
                  boxShadow: `14px 14px 0 ${b.c === BLUE ? BLUE2 : ORANGE2}`,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [80, 0]) + bob}px) rotate(${spin}deg)`,
                  padding: 34,
                  boxSizing: "border-box",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -30,
                    top: -30,
                    width: 120,
                    height: 120,
                    borderRadius: 99,
                    background: b.c,
                    opacity: 0.12,
                    transform: `scale(${1 + Math.sin((f + i) / 15) * 0.15})`,
                  }}
                />
                <div style={{ color: b.c, fontFamily: "Arial Black, Arial", fontSize: 40 }}>{b.t}</div>
                <div style={{ color: INK, fontFamily: "Arial", fontSize: 26, marginTop: 16 }}>{b.s}</div>
                <div
                  style={{
                    position: "absolute",
                    left: 34,
                    bottom: 28,
                    fontFamily: "Georgia, serif",
                    color: b.c,
                    fontSize: 22,
                    opacity: 0.5,
                  }}
                >
                  {i + 1}/3
                </div>
              </div>
              {i < 2 ? (
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: ORANGE,
                    opacity: interpolate(Math.max(0, f - b.delay - 5), [0, 12], [0, 1], clamp),
                    transform: `translateX(${Math.sin(f / 8) * 6}px) scale(${1 + Math.sin(f / 10) * 0.08})`,
                  }}
                >
                  →
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneContrast: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 11, stiffness: 120 } });
  const flash = f > 18 && f < 26 ? interpolate(f, [18, 22, 26], [0, 0.25, 0], clamp) : 0;
  return (
    <AbsoluteFill>
      <Notepad />
      <div style={{ position: "absolute", inset: 0, background: ORANGE, opacity: flash }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: enter,
            transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])}) rotate(${interpolate(enter, [0, 1], [-8, 0])}deg)`,
            background: INK,
            color: WHITE,
            fontFamily: "Arial Black, Arial",
            fontSize: 48,
            padding: "40px 52px",
            borderRadius: 18,
            boxShadow: `0 0 0 8px ${ORANGE}, 18px 18px 0 ${BLUE}`,
          }}
        >
          No payment → not a business yet
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAction: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 13 } });
  const b = spring({ frame: Math.max(0, f - 12), fps, config: { damping: 13 } });
  const caret = f % 16 < 8 ? 1 : 0;
  const draw = interpolate(f, [0, 40], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Notepad intensity={0.8} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <rect
          x={150}
          y={280}
          width={1500}
          height={420}
          rx={22}
          fill="none"
          stroke={BLUE}
          strokeWidth={4}
          strokeDasharray={4000}
          strokeDashoffset={4000 * (1 - draw)}
        />
      </svg>
      <div style={{ position: "absolute", left: 190, top: 320, width: 1400 }}>
        <div style={{ color: BLUE, fontFamily: "Arial", fontWeight: 800, fontSize: 28, marginBottom: 18, opacity: a }}>
          WRITE THIS
        </div>
        <div
          style={{
            opacity: a,
            transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`,
            background: WHITE,
            borderRadius: 18,
            padding: "40px 44px",
            boxShadow: `14px 14px 0 ${ORANGE}`,
            fontFamily: "Georgia, serif",
            fontSize: 50,
            color: INK,
            lineHeight: 1.4,
          }}
        >
          <div>
            I help <span style={{ color: ORANGE, borderBottom: `4px solid ${ORANGE}` }}>______</span> do{" "}
            <span style={{ color: BLUE, borderBottom: `4px solid ${BLUE}` }}>______</span>
          </div>
          <div style={{ opacity: b, marginTop: 10 }}>
            so they can <span style={{ color: ORANGE, borderBottom: `4px solid ${ORANGE}` }}>______</span>
            <span style={{ color: BLUE, opacity: caret }}>▋</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Notepad />
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 400,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ color: BLUE, fontFamily: "Arial", fontWeight: 800, fontSize: 28, marginBottom: 12 }}>NEXT</div>
        <div style={{ color: INK, fontFamily: "Arial Black, Arial", fontSize: 52 }}>Startup vs operating company</div>
        <div
          style={{
            marginTop: 22,
            width: interpolate(f, [8, 35], [0, 420], clamp),
            height: 10,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${ORANGE}, ${BLUE})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const L001Max: React.FC = () => {
  const fps = L001_MAX_FPS;
  const beats: { Comp: React.FC; dur: number }[] = [
    { Comp: SceneTitle, dur: 6 * fps },
    { Comp: SceneHook, dur: 9 * fps },
    { Comp: SceneDefinition, dur: 20 * fps },
    { Comp: SceneThree, dur: 24 * fps },
    { Comp: SceneContrast, dur: 12 * fps },
    { Comp: SceneAction, dur: 13 * fps },
    { Comp: SceneEnd, dur: 6 * fps },
  ];
  let from = 0;
  return (
    <AbsoluteFill>
      {beats.map(({ Comp, dur }, i) => {
        const start = from;
        from += dur;
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <Comp />
          </Sequence>
        );
      })}
      <Audio src={staticFile("voice-max.mp3")} />
    </AbsoluteFill>
  );
};
