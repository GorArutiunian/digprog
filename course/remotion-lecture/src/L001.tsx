import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** Bright lecture palette */
const PAPER = "#F4F1E8";
const GRID = "#D9E2EC";
const INK = "#0F172A";
const BLUE = "#2563EB";
const BLUE_SOFT = "#93C5FD";
const ORANGE = "#F97316";
const ORANGE_SOFT = "#FDBA74";
const WHITE = "#FFFFFF";

export const L001_FPS = 30;
/** ~1:30 lessons */
export const L001_DURATION = 2752; // ~91.7s voice

const GraphPaper: React.FC<{ drift?: number }> = ({ drift = 0 }) => {
  const f = useCurrentFrame();
  const offset = (f * 0.35 + drift) % 40;
  const lines: React.ReactNode[] = [];
  for (let x = -40; x < 2000; x += 40) {
    lines.push(
      <div
        key={`v${x}`}
        style={{
          position: "absolute",
          left: x + offset,
          top: 0,
          bottom: 0,
          width: 1,
          background: GRID,
        }}
      />,
    );
  }
  for (let y = -40; y < 1200; y += 40) {
    lines.push(
      <div
        key={`h${y}`}
        style={{
          position: "absolute",
          top: y + offset * 0.5,
          left: 0,
          right: 0,
          height: 1,
          background: GRID,
        }}
      />,
    );
  }
  // heavier every 5th
  for (let x = -40; x < 2000; x += 200) {
    lines.push(
      <div
        key={`V${x}`}
        style={{
          position: "absolute",
          left: x + offset,
          top: 0,
          bottom: 0,
          width: 2,
          background: "#C5D0DC",
        }}
      />,
    );
  }
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {lines}
      {/* margin line like a notepad */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 2,
          background: ORANGE_SOFT,
          opacity: 0.7,
        }}
      />
      {/* soft floating formula crumbs */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 60 + Math.sin(f / 20) * 10,
          color: BLUE_SOFT,
          fontFamily: "Georgia, serif",
          fontSize: 28,
          opacity: 0.45,
        }}
      >
        Σ → value
      </div>
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 80 + Math.cos(f / 18) * 12,
          color: ORANGE_SOFT,
          fontFamily: "Georgia, serif",
          fontSize: 26,
          opacity: 0.4,
        }}
      >
        f(x) = pay
      </div>
    </AbsoluteFill>
  );
};

const Mark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 36,
      left: 148,
      background: BLUE,
      color: WHITE,
      fontFamily: "Arial Black, Arial",
      fontSize: 22,
      padding: "8px 14px",
      borderRadius: 10,
    }}
  >
    DigProg
  </div>
);

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 14, stiffness: 90 } });
  const rot = interpolate(f, [0, 40], [-2, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <GraphPaper />
      <Mark />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 360,
          transform: `translateY(${interpolate(enter, [0, 1], [50, 0])}px) rotate(${rot}deg)`,
          opacity: enter,
        }}
      >
        <div style={{ color: BLUE, fontFamily: "Arial", fontSize: 32, marginBottom: 12, fontWeight: 700 }}>
          Lesson 01
        </div>
        <div
          style={{
            color: INK,
            fontFamily: "Arial Black, Arial",
            fontSize: 86,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          What a business is
        </div>
        <div
          style={{
            marginTop: 24,
            width: interpolate(f, [10, 35], [0, 420], { extrapolateRight: "clamp" }),
            height: 8,
            background: ORANGE,
            borderRadius: 8,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 12, stiffness: 140 } });
  const pulse = 1 + Math.sin(f / 8) * 0.02;
  return (
    <AbsoluteFill>
      <GraphPaper drift={20} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${pop * pulse})`,
            background: WHITE,
            border: `4px solid ${BLUE}`,
            boxShadow: `12px 12px 0 ${ORANGE}`,
            borderRadius: 20,
            padding: "44px 64px",
          }}
        >
          <div style={{ color: INK, fontFamily: "Arial Black, Arial", fontSize: 62 }}>Paid problem-solving</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Definition: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 16 } });
  const b = spring({ frame: Math.max(0, f - 18), fps, config: { damping: 16 } });
  const underline = interpolate(f, [25, 50], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <GraphPaper drift={40} />
      <div style={{ position: "absolute", left: 160, top: 340 }}>
        <div
          style={{
            opacity: a,
            transform: `translateX(${interpolate(a, [0, 1], [-40, 0])}px)`,
            color: INK,
            fontFamily: "Arial Black, Arial",
            fontSize: 56,
            marginBottom: 28,
          }}
        >
          Solve a costly problem.
        </div>
        <div
          style={{
            opacity: b,
            transform: `translateX(${interpolate(b, [0, 1], [40, 0])}px)`,
            color: ORANGE,
            fontFamily: "Arial Black, Arial",
            fontSize: 56,
          }}
        >
          Get paid for it.
        </div>
        <div style={{ marginTop: 20, width: underline, height: 6, background: BLUE, borderRadius: 6 }} />
      </div>
    </AbsoluteFill>
  );
};

const ThreeParts: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boxes = [
    { t: "Customer", s: "who pays", color: BLUE },
    { t: "Offer", s: "what they buy", color: ORANGE },
    { t: "Delivery", s: "promise kept", color: BLUE },
  ];
  const cam = interpolate(f, [0, 90], [1.04, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <GraphPaper drift={10} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          transform: `scale(${cam})`,
        }}
      >
        {boxes.map((b, i) => {
          const local = Math.max(0, f - i * 10);
          const enter = spring({ frame: local, fps, config: { damping: 11, stiffness: 120 } });
          const bob = Math.sin((f + i * 12) / 12) * 6;
          return (
            <React.Fragment key={b.t}>
              <div
                style={{
                  width: 380,
                  height: 240,
                  borderRadius: 18,
                  background: WHITE,
                  border: `4px solid ${b.color}`,
                  boxShadow: `10px 10px 0 ${b.color === BLUE ? BLUE_SOFT : ORANGE_SOFT}`,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [60, 0]) + bob}px) rotate(${interpolate(enter, [0, 1], [i % 2 ? 4 : -4, 0])}deg)`,
                  padding: 32,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ color: b.color, fontFamily: "Arial Black, Arial", fontSize: 38 }}>{b.t}</div>
                <div style={{ color: INK, fontFamily: "Arial", fontSize: 26, marginTop: 14 }}>{b.s}</div>
              </div>
              {i < 2 ? (
                <div
                  style={{
                    fontSize: 40,
                    color: ORANGE,
                    opacity: interpolate(Math.max(0, f - i * 10 - 6), [0, 12], [0, 1], { extrapolateRight: "clamp" }),
                    transform: `translateX(${Math.sin(f / 10) * 4}px)`,
                    fontWeight: 800,
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

const Contrast: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 12, stiffness: 100 } });
  const shake = f > 20 && f < 28 ? Math.sin(f * 2) * 3 : 0;
  return (
    <AbsoluteFill>
      <GraphPaper drift={30} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: enter,
            transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])}) translateX(${shake}px)`,
            background: INK,
            color: WHITE,
            fontFamily: "Arial Black, Arial",
            fontSize: 46,
            padding: "36px 48px",
            borderRadius: 16,
            boxShadow: `0 0 0 6px ${ORANGE}`,
          }}
        >
          No payment → not a business yet
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Action: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 14 } });
  const b = spring({ frame: Math.max(0, f - 14), fps, config: { damping: 14 } });
  const cursor = f % 20 < 10 ? 1 : 0;
  return (
    <AbsoluteFill>
      <GraphPaper drift={5} />
      <div style={{ position: "absolute", left: 160, top: 320, width: 1400 }}>
        <div style={{ color: BLUE, fontFamily: "Arial", fontSize: 28, marginBottom: 20, opacity: a }}>Write this</div>
        <div
          style={{
            opacity: a,
            transform: `translateY(${interpolate(a, [0, 1], [30, 0])}px)`,
            background: WHITE,
            border: `3px solid ${BLUE}`,
            borderRadius: 16,
            padding: "36px 40px",
            boxShadow: `10px 10px 0 ${ORANGE_SOFT}`,
            fontFamily: "Georgia, serif",
            fontSize: 48,
            color: INK,
            lineHeight: 1.35,
          }}
        >
          <div>
            I help <span style={{ color: ORANGE, borderBottom: `3px solid ${ORANGE}` }}>___</span> do{" "}
            <span style={{ color: BLUE, borderBottom: `3px solid ${BLUE}` }}>___</span>
          </div>
          <div style={{ opacity: b, marginTop: 12 }}>
            so they can <span style={{ color: ORANGE, borderBottom: `3px solid ${ORANGE}` }}>___</span>
            <span style={{ opacity: cursor, color: BLUE }}>|</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <GraphPaper />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 420,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ color: BLUE, fontFamily: "Arial", fontSize: 28, marginBottom: 10, fontWeight: 700 }}>Next</div>
        <div style={{ color: INK, fontFamily: "Arial Black, Arial", fontSize: 48 }}>
          Startup vs operating company
        </div>
        <div
          style={{
            marginTop: 20,
            width: interpolate(f, [5, 25], [0, 360], { extrapolateRight: "clamp" }),
            height: 8,
            background: ORANGE,
            borderRadius: 8,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const L001: React.FC = () => {
  const fps = L001_FPS;
  // 90s total
  const beats: { Comp: React.FC; dur: number }[] = [
    { Comp: Title, dur: 5 * fps },
    { Comp: Hook, dur: 8 * fps },
    { Comp: Definition, dur: 20 * fps },
    { Comp: ThreeParts, dur: 24 * fps },
    { Comp: Contrast, dur: 12 * fps },
    { Comp: Action, dur: 15 * fps },
    { Comp: EndCard, dur: 6 * fps },
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
      <Audio src={staticFile("voice.mp3")} />
    </AbsoluteFill>
  );
};
