import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** 9:16 sales/UGC-style hook → DigProg waitlist */
export const UGC_FPS = 30;
export const UGC_DURATION = 30 * 32; // ~32s covers VO + CTA hold
export const UGC_WIDTH = 1080;
export const UGC_HEIGHT = 1920;

const NAVY = "#102A56";
const ORANGE = "#FF8A3D";
const WHITE = "#FFFFFF";
const FONT = 'Manrope, system-ui, -apple-system, "Segoe UI", sans-serif';

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const Logo: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="24" cy="30" r="15" fill={WHITE} />
    <rect x="35.5" y="8" width="6" height="30" rx="1.5" fill={WHITE} />
    <circle cx="40" cy="34" r="15" fill={ORANGE} />
    <rect x="22.5" y="34" width="6" height="22" rx="1.5" fill={ORANGE} />
  </svg>
);

export const UGCWaitlistHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scene =
    f < 3 * fps
      ? 0
      : f < 10 * fps
        ? 1
        : f < 18 * fps
          ? 2
          : f < 24 * fps
            ? 3
            : 4;

  const fade = (a: number, b: number) =>
    interpolate(f, [a, a + 8, b - 8, b], [0, 1, 1, 0], clamp);

  const s0 = fade(0, 3 * fps);
  const s1 = fade(3 * fps, 10 * fps);
  const s2 = fade(10 * fps, 18 * fps);
  const s3 = fade(18 * fps, 24 * fps);
  const s4 = fade(24 * fps, UGC_DURATION);

  return (
    <AbsoluteFill style={{ background: NAVY, fontFamily: FONT }}>
      <Audio src={staticFile("ugc-waitlist-hook.mp3")} />

      <div
        style={{
          position: "absolute",
          top: 64,
          left: 56,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: 0.95,
        }}
      >
        <Logo size={64} />
        <div>
          <div style={{ color: WHITE, fontWeight: 800, fontSize: 36 }}>DigProg</div>
          <div
            style={{
              color: ORANGE,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            BUSINESS EDUCATION
          </div>
        </div>
      </div>

      {scene === 0 && (
        <AbsoluteFill
          style={{
            opacity: s0,
            justifyContent: "center",
            padding: "0 64px",
          }}
        >
          <div
            style={{
              color: WHITE,
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: -1.5,
            }}
          >
            Friends love your app.
            <br />
            <span style={{ color: ORANGE }}>Will they pay?</span>
          </div>
        </AbsoluteFill>
      )}

      {scene === 1 && (
        <AbsoluteFill style={{ opacity: s1, padding: "220px 56px 120px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.14)",
              borderRadius: 28,
              padding: 40,
            }}
          >
            <div style={{ color: ORANGE, fontWeight: 800, fontSize: 22, marginBottom: 16 }}>
              REAL TALK
            </div>
            <div style={{ color: WHITE, fontSize: 48, fontWeight: 750, lineHeight: 1.25 }}>
              Interest is useful.
              <br />
              It is not paying demand.
            </div>
            <div
              style={{
                marginTop: 28,
                color: "rgba(247,250,255,0.7)",
                fontSize: 28,
                lineHeight: 1.4,
              }}
            >
              A purchase is stronger evidence than praise — one sale still isn’t long-term proof.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {scene === 2 && (
        <AbsoluteFill
          style={{
            opacity: s2,
            justifyContent: "center",
            padding: "0 48px",
            gap: 28,
          }}
        >
          <div
            style={{
              color: WHITE,
              fontSize: 44,
              fontWeight: 750,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            A business has three parts
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
            }}
          >
            {["Customer", "Offer", "Delivery"].map((label, i) => (
              <React.Fragment key={label}>
                <div
                  style={{
                    width: "86%",
                    background: ORANGE,
                    color: NAVY,
                    fontWeight: 800,
                    fontSize: 44,
                    textAlign: "center",
                    padding: "22px 20px",
                    borderRadius: 18,
                  }}
                >
                  {label}
                </div>
                {i < 2 && (
                  <div style={{ color: WHITE, fontSize: 40, fontWeight: 700 }}>↓</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {scene === 3 && (
        <AbsoluteFill style={{ opacity: s3, padding: "240px 56px" }}>
          <div style={{ color: ORANGE, fontWeight: 800, fontSize: 24, marginBottom: 18 }}>
            DIGPROG
          </div>
          <div
            style={{
              color: WHITE,
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 28,
            }}
          >
            ~100 short lessons.
            <br />
            Quizzes that force practice.
            <br />
            No 40-hour water.
          </div>
          <div style={{ color: "rgba(247,250,255,0.75)", fontSize: 30, lineHeight: 1.4 }}>
            Built for beginners who want a real first offer — not another binge course.
          </div>
        </AbsoluteFill>
      )}

      {scene === 4 && (
        <AbsoluteFill
          style={{
            opacity: s4,
            justifyContent: "center",
            alignItems: "center",
            padding: 56,
            textAlign: "center",
          }}
        >
          <Logo size={120} />
          <div
            style={{
              marginTop: 36,
              color: WHITE,
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            Join the waitlist
          </div>
          <div
            style={{
              marginTop: 18,
              color: ORANGE,
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            30% early-bird
          </div>
          <div
            style={{
              marginTop: 40,
              background: WHITE,
              color: NAVY,
              fontWeight: 800,
              fontSize: 34,
              padding: "22px 36px",
              borderRadius: 18,
            }}
          >
            digprog.vercel.app
          </div>
          <div
            style={{
              marginTop: 28,
              color: "rgba(247,250,255,0.65)",
              fontSize: 24,
            }}
          >
            Link in bio · start with Lesson 01
          </div>
        </AbsoluteFill>
      )}

      {/* Caption-safe bottom brand bar */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "rgba(247,250,255,0.35)",
          fontSize: 20,
          fontWeight: 650,
          letterSpacing: 2,
        }}
      >
        DIGPROG · BUSINESS EDUCATION
      </div>
    </AbsoluteFill>
  );
};
