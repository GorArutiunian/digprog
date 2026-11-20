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
const GREEN = "#15803D";
const RED = "#B91C1C";

export const L001_DENSE_FPS = 30;
/** ~1:50 with denser content + faster VO */
export const L001_DENSE_DURATION = 110 * L001_DENSE_FPS;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Notepad: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const f = useCurrentFrame();
  const drift = (f * 0.5 * intensity) % 48;
  const driftY = (f * 0.22 * intensity) % 48;
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
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {nodes}
      <div style={{ position: "absolute", left: 100, top: 0, bottom: 0, width: 3, background: ORANGE2, opacity: 0.6 }} />
    </AbsoluteFill>
  );
};

const Mark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 28,
      left: 128,
      background: BLUE,
      color: WHITE,
      fontFamily: "Arial Black, Arial",
      fontSize: 20,
      padding: "7px 12px",
      borderRadius: 8,
      boxShadow: `3px 3px 0 ${ORANGE}`,
      zIndex: 5,
    }}
  >
    DigProg · L01
  </div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: WHITE,
      border: `3px solid ${BLUE}`,
      borderRadius: 16,
      boxShadow: `8px 8px 0 ${ORANGE2}`,
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

const SceneTitle: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f, fps, config: { damping: 12, stiffness: 110 } });
  return (
    <AbsoluteFill>
      <Notepad />
      <Mark />
      <div style={{ position: "absolute", left: 150, top: 280, opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
        <div style={{ color: BLUE, fontFamily: "Arial", fontWeight: 800, fontSize: 28, marginBottom: 10 }}>LESSON 01 · FOUNDATIONS</div>
        <div style={{ color: INK, fontFamily: "Arial Black, Arial", fontSize: 78, letterSpacing: -2, lineHeight: 1.05 }}>
          What a business is
        </div>
        <div style={{ marginTop: 18, color: INK, fontFamily: "Arial", fontSize: 28, maxWidth: 1100, lineHeight: 1.35 }}>
          One definition. Three parts. Clear tests. So you can answer any question on this topic.
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
          {["Definition", "Spectrum", "3-part model", "Tests", "You write"].map((t, i) => (
            <div
              key={t}
              style={{
                background: i % 2 ? ORANGE : BLUE,
                color: WHITE,
                fontFamily: "Arial",
                fontWeight: 700,
                fontSize: 18,
                padding: "8px 14px",
                borderRadius: 999,
                opacity: interpolate(f, [10 + i * 4, 18 + i * 4], [0, 1], clamp),
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneDefinition: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f, fps, config: { damping: 14 } });
  const parts = [
    { n: "1", t: "Costly problem", d: "Pain expensive enough to pay for" },
    { n: "2", t: "Paying buyer", d: "Someone who can and will pay" },
    { n: "3", t: "You get paid", d: "Money moves to you for the fix" },
  ];
  return (
    <AbsoluteFill>
      <Notepad />
      <Mark />
      <div style={{ position: "absolute", left: 140, top: 120, right: 140, opacity: e }}>
        <div style={{ color: BLUE, fontFamily: "Arial Black, Arial", fontSize: 36, marginBottom: 16 }}>THE DEFINITION</div>
        <Card style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 36, color: INK, lineHeight: 1.35 }}>
            A <span style={{ color: BLUE, fontWeight: 700 }}>business</span> solves a{" "}
            <span style={{ color: ORANGE, fontWeight: 700 }}>costly problem</span> for people who can pay — and{" "}
            <span style={{ color: BLUE, fontWeight: 700 }}>you get paid</span> to solve it.
          </div>
        </Card>
        <div style={{ display: "flex", gap: 16 }}>
          {parts.map((p, i) => {
            const local = Math.max(0, f - 12 - i * 8);
            const s = spring({ frame: local, fps, config: { damping: 12, stiffness: 120 } });
            return (
              <div
                key={p.n}
                style={{
                  flex: 1,
                  background: WHITE,
                  border: `3px solid ${i === 1 ? ORANGE : BLUE}`,
                  borderRadius: 14,
                  padding: 18,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 30}px)`,
                }}
              >
                <div style={{ color: i === 1 ? ORANGE : BLUE, fontFamily: "Arial Black, Arial", fontSize: 22 }}>
                  {p.n}. {p.t}
                </div>
                <div style={{ color: INK, fontFamily: "Arial", fontSize: 22, marginTop: 10 }}>{p.d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Spectrum graph: hobby → project → business */
const SceneSpectrum: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(f, [8, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const levels = [
    { label: "Hobby", sub: "Fun / skill\nNo paid exchange", x: 0.12, c: "#64748B" },
    { label: "Project", sub: "Building\nStill unpaid", x: 0.42, c: ORANGE },
    { label: "Business", sub: "Paid exchange\nPromise kept", x: 0.78, c: BLUE },
  ];
  return (
    <AbsoluteFill>
      <Notepad intensity={1.1} />
      <Mark />
      <div style={{ position: "absolute", left: 140, top: 110, right: 140 }}>
        <div style={{ color: BLUE, fontFamily: "Arial Black, Arial", fontSize: 34, marginBottom: 8 }}>GRAPH · THE SPECTRUM</div>
        <div style={{ color: INK, fontFamily: "Arial", fontSize: 24, marginBottom: 28 }}>
          Same work can sit in three places. Only the right side is a business.
        </div>
        <Card style={{ height: 520, position: "relative", overflow: "hidden" }}>
          {/* axis */}
          <div style={{ position: "absolute", left: 60, right: 60, top: 280, height: 10, background: "#E2E8F0", borderRadius: 99 }}>
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                borderRadius: 99,
                background: `linear-gradient(90deg, #94A3B8, ${ORANGE}, ${BLUE})`,
              }}
            />
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 300, display: "flex", justifyContent: "space-between", color: "#64748B", fontFamily: "Arial", fontSize: 18 }}>
            <span>no money</span>
            <span>money moves →</span>
          </div>
          {levels.map((lv, i) => {
            const s = spring({ frame: Math.max(0, f - 10 - i * 10), fps, config: { damping: 12 } });
            return (
              <div
                key={lv.label}
                style={{
                  position: "absolute",
                  left: `${lv.x * 100}%`,
                  top: 70,
                  transform: `translateX(-50%) translateY(${(1 - s) * 24}px)`,
                  opacity: s,
                  textAlign: "center",
                  width: 280,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: lv.c,
                    color: WHITE,
                    fontFamily: "Arial Black, Arial",
                    fontSize: 26,
                    padding: "10px 18px",
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                >
                  {lv.label}
                </div>
                <div style={{ color: INK, fontFamily: "Arial", fontSize: 20, whiteSpace: "pre-line", lineHeight: 1.35 }}>{lv.sub}</div>
                <div
                  style={{
                    margin: "18px auto 0",
                    width: 4,
                    height: 90,
                    background: lv.c,
                    opacity: 0.5,
                  }}
                />
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 40,
              right: 40,
              background: "#FEF3C7",
              border: `2px solid ${ORANGE}`,
              borderRadius: 12,
              padding: "12px 16px",
              fontFamily: "Arial",
              fontSize: 22,
              color: INK,
              opacity: interpolate(f, [40, 55], [0, 1], clamp),
            }}
          >
            Interactive check: If nobody has paid you yet, you are left of “Business” — even if the idea is good.
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

const SceneThree: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boxes = [
    {
      t: "Customer",
      c: BLUE,
      lines: ["Has the problem", "Can pay", "You can reach them"],
    },
    {
      t: "Offer",
      c: ORANGE,
      lines: ["Clear promise", "Price attached", "Scope you can deliver"],
    },
    {
      t: "Delivery",
      c: BLUE,
      lines: ["How you fulfill", "After payment", "Keeps the promise"],
    },
  ];
  return (
    <AbsoluteFill>
      <Notepad intensity={1.2} />
      <Mark />
      <div style={{ position: "absolute", left: 120, top: 100, right: 120 }}>
        <div style={{ color: BLUE, fontFamily: "Arial Black, Arial", fontSize: 34, marginBottom: 6 }}>MODEL · THREE PARTS</div>
        <div style={{ color: INK, fontFamily: "Arial", fontSize: 24, marginBottom: 20 }}>
          Every real business has all three. Miss one → project, not a firm.
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
          {boxes.map((b, i) => {
            const s = spring({ frame: Math.max(0, f - i * 9), fps, config: { damping: 11, stiffness: 130 } });
            const bob = Math.sin((f + i * 10) / 12) * 5;
            return (
              <React.Fragment key={b.t}>
                <div
                  style={{
                    flex: 1,
                    background: WHITE,
                    border: `4px solid ${b.c}`,
                    borderRadius: 16,
                    boxShadow: `10px 10px 0 ${b.c === BLUE ? BLUE2 : ORANGE2}`,
                    padding: 22,
                    opacity: s,
                    transform: `translateY(${(1 - s) * 50 + bob}px)`,
                  }}
                >
                  <div style={{ color: b.c, fontFamily: "Arial Black, Arial", fontSize: 34 }}>{b.t}</div>
                  <ul style={{ margin: "16px 0 0", paddingLeft: 22, color: INK, fontFamily: "Arial", fontSize: 22, lineHeight: 1.45 }}>
                    {b.lines.map((ln) => (
                      <li key={ln} style={{ marginBottom: 8 }}>
                        {ln}
                      </li>
                    ))}
                  </ul>
                </div>
                {i < 2 ? (
                  <div
                    style={{
                      alignSelf: "center",
                      fontSize: 40,
                      fontWeight: 900,
                      color: ORANGE,
                      opacity: interpolate(Math.max(0, f - i * 9 - 4), [0, 10], [0, 1], clamp),
                    }}
                  >
                    →
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 18,
            opacity: interpolate(f, [35, 48], [0, 1], clamp),
            background: INK,
            color: WHITE,
            borderRadius: 12,
            padding: "14px 18px",
            fontFamily: "Arial",
            fontSize: 22,
          }}
        >
          Exam answer ready: “Customer + Offer + Delivery, with payment. Anything less is not a business yet.”
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneQuiz: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cases = [
    { q: "I post daily. No offer. No sales.", a: "NOT a business", ok: false },
    { q: "I sold a $79 guide and delivered it.", a: "YES — business", ok: true },
    { q: "I built an app. Friends like it. $0 paid.", a: "Project / not yet", ok: false },
  ];
  return (
    <AbsoluteFill>
      <Notepad />
      <Mark />
      <div style={{ position: "absolute", left: 140, top: 100, right: 140 }}>
        <div style={{ color: ORANGE, fontFamily: "Arial Black, Arial", fontSize: 34, marginBottom: 8 }}>INTERACTIVE · DOES IT COUNT?</div>
        <div style={{ color: INK, fontFamily: "Arial", fontSize: 24, marginBottom: 18 }}>
          Pause and answer before the verdict appears.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cases.map((c, i) => {
            const show = spring({ frame: Math.max(0, f - i * 18), fps, config: { damping: 14 } });
            const verdictAt = 12 + i * 18;
            const showV = interpolate(f, [verdictAt, verdictAt + 8], [0, 1], clamp);
            return (
              <div
                key={c.q}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  opacity: show,
                  transform: `translateX(${(1 - show) * 40}px)`,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    background: WHITE,
                    border: `3px solid ${BLUE}`,
                    borderRadius: 12,
                    padding: "16px 18px",
                    fontFamily: "Arial",
                    fontSize: 24,
                    color: INK,
                  }}
                >
                  {c.q}
                </div>
                <div
                  style={{
                    width: 280,
                    background: c.ok ? GREEN : RED,
                    color: WHITE,
                    borderRadius: 12,
                    padding: "16px 14px",
                    fontFamily: "Arial Black, Arial",
                    fontSize: 20,
                    textAlign: "center",
                    opacity: showV,
                    transform: `scale(${0.85 + showV * 0.15})`,
                  }}
                >
                  {c.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneQuestions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qs = [
    { q: "Is content a business?", a: "Only if it sells an offer and money moves." },
    { q: "Is a free community a business?", a: "Not until there is paid exchange (or a paid arm)." },
    { q: "Do I need an LLC first?", a: "No. Definition ≠ legal entity. Entity comes later." },
    { q: "What if I barter?", a: "Still exchange of value — treat it as payment in kind." },
  ];
  return (
    <AbsoluteFill>
      <Notepad intensity={0.9} />
      <Mark />
      <div style={{ position: "absolute", left: 130, top: 90, right: 130 }}>
        <div style={{ color: BLUE, fontFamily: "Arial Black, Arial", fontSize: 32, marginBottom: 6 }}>YOU CAN ANSWER THESE NOW</div>
        <div style={{ color: INK, fontFamily: "Arial", fontSize: 22, marginBottom: 16 }}>
          Same definition applied to edge cases.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {qs.map((item, i) => {
            const s = spring({ frame: Math.max(0, f - i * 7), fps, config: { damping: 13 } });
            return (
              <div
                key={item.q}
                style={{
                  background: WHITE,
                  border: `3px solid ${i % 2 ? ORANGE : BLUE}`,
                  borderRadius: 14,
                  padding: 16,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 24}px)`,
                }}
              >
                <div style={{ color: i % 2 ? ORANGE : BLUE, fontFamily: "Arial Black, Arial", fontSize: 20 }}>{item.q}</div>
                <div style={{ color: INK, fontFamily: "Arial", fontSize: 20, marginTop: 10, lineHeight: 1.35 }}>{item.a}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneAction: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 13 } });
  const caret = f % 14 < 7 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Notepad />
      <Mark />
      <div style={{ position: "absolute", left: 150, top: 160, right: 150, opacity: a }}>
        <div style={{ color: ORANGE, fontFamily: "Arial Black, Arial", fontSize: 32, marginBottom: 12 }}>YOUR MOVE</div>
        <Card>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 42, color: INK, lineHeight: 1.4 }}>
            I help <span style={{ color: ORANGE, borderBottom: `4px solid ${ORANGE}` }}>________</span> do{" "}
            <span style={{ color: BLUE, borderBottom: `4px solid ${BLUE}` }}>________</span>
            <br />
            so they can <span style={{ color: ORANGE, borderBottom: `4px solid ${ORANGE}` }}>________</span>
            <span style={{ color: BLUE, opacity: caret }}>▋</span>
          </div>
          <div style={{ marginTop: 22, color: INK, fontFamily: "Arial", fontSize: 24, lineHeight: 1.4 }}>
            If you cannot fill this with a paying customer in mind, you do not have a business statement yet — you have a theme.
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

const SceneRecap: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Notepad />
      <Mark />
      <div style={{ position: "absolute", left: 150, top: 180, right: 150, opacity: e }}>
        <div style={{ color: BLUE, fontFamily: "Arial Black, Arial", fontSize: 34, marginBottom: 14 }}>RECAP · LOCK THIS IN</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "Business = costly problem + paying buyer + you get paid",
            "Hobby / project sit left on the spectrum until money moves",
            "Model = Customer → Offer → Delivery (all three)",
            "Edge cases use the same test — payment + promise",
          ].map((t, i) => (
            <div
              key={t}
              style={{
                background: WHITE,
                borderLeft: `8px solid ${i % 2 ? ORANGE : BLUE}`,
                padding: "14px 18px",
                fontFamily: "Arial",
                fontSize: 26,
                color: INK,
                opacity: interpolate(f, [4 + i * 5, 12 + i * 5], [0, 1], clamp),
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, color: INK, fontFamily: "Arial", fontSize: 24 }}>
          Next: <span style={{ color: BLUE, fontWeight: 800 }}>Startup vs operating company</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const L001Dense: React.FC = () => {
  const fps = L001_DENSE_FPS;
  const beats: { Comp: React.FC; dur: number }[] = [
    { Comp: SceneTitle, dur: 7 * fps },
    { Comp: SceneDefinition, dur: 16 * fps },
    { Comp: SceneSpectrum, dur: 18 * fps },
    { Comp: SceneThree, dur: 18 * fps },
    { Comp: SceneQuiz, dur: 18 * fps },
    { Comp: SceneQuestions, dur: 16 * fps },
    { Comp: SceneAction, dur: 10 * fps },
    { Comp: SceneRecap, dur: 7 * fps },
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
      <Audio src={staticFile("voice-dense.mp3")} />
    </AbsoluteFill>
  );
};
