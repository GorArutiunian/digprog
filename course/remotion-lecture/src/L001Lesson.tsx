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

/** DigProg L01 — What a business is (microlearning) */
export const L001_LESSON_FPS = 30;
/** Audio ~106.2s including end hold */
export const L001_LESSON_DURATION = Math.ceil(106.2 * L001_LESSON_FPS);

const BG = "#F6F4EF";
const INK = "#0F172A";
const MUTED = "#64748B";
const BLUE = "#1D4ED8"; // Customer
const ORANGE = "#EA580C"; // Offer
const TEAL = "#0F766E"; // Delivery
const WHITE = "#FFFFFF";
const SOFT = "#E8EEF5";
const CARD = "#FFFFFF";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const fadeIn = (f: number, at = 0, dur = 10) =>
  interpolate(f, [at, at + dur], [0, 1], clamp);

const rise = (f: number, fps: number, delay = 0) =>
  spring({
    frame: Math.max(0, f - delay),
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });

const Badge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 36,
      left: 48,
      background: BLUE,
      color: WHITE,
      fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: 0.3,
      padding: "8px 14px",
      borderRadius: 8,
      zIndex: 20,
    }}
  >
    DigProg · L01
  </div>
);

const SoftBg: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    {/* very soft vertical wash — no busy grid */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 80% 60% at 50% 30%, #FFFFFF 0%, transparent 70%), linear-gradient(180deg, #F8F6F1 0%, #EEF2F7 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.18,
        backgroundImage:
          "linear-gradient(#D7E0EC 1px, transparent 1px), linear-gradient(90deg, #D7E0EC 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
  </AbsoluteFill>
);

const CaptionSafe: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: 80,
      right: 80,
      top: 100,
      bottom: 120, // reserve caption band
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{
  label: string;
  color: string;
  active?: boolean;
  dim?: boolean;
}> = ({ label, color, active = false, dim = false }) => (
  <div
    style={{
      background: active ? color : WHITE,
      color: active ? WHITE : dim ? MUTED : color,
      border: `3px solid ${dim && !active ? "#CBD5E1" : color}`,
      fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      fontWeight: 800,
      fontSize: 36,
      padding: "14px 28px",
      borderRadius: 14,
      opacity: dim && !active ? 0.45 : 1,
      minWidth: 200,
      textAlign: "center",
    }}
  >
    {label}
  </div>
);

const FrameworkRow: React.FC<{
  active: "none" | "customer" | "offer" | "delivery" | "all";
  show: { customer: boolean; offer: boolean; delivery: boolean };
}> = ({ active, show }) => (
  <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center" }}>
    {show.customer && (
      <Pill label="Customer" color={BLUE} active={active === "customer" || active === "all"} dim={active !== "customer" && active !== "all" && active !== "none"} />
    )}
    {show.customer && show.offer && (
      <div style={{ fontSize: 40, color: MUTED, fontWeight: 700 }}>→</div>
    )}
    {show.offer && (
      <Pill label="Offer" color={ORANGE} active={active === "offer" || active === "all"} dim={active !== "offer" && active !== "all" && active !== "none"} />
    )}
    {show.offer && show.delivery && (
      <div style={{ fontSize: 40, color: MUTED, fontWeight: 700 }}>→</div>
    )}
    {show.delivery && (
      <Pill label="Delivery" color={TEAL} active={active === "delivery" || active === "all"} dim={active !== "delivery" && active !== "all" && active !== "none"} />
    )}
  </div>
);

/** Simple phone / app illustration */
const AppMock: React.FC<{ hearts?: boolean; scale?: number }> = ({
  hearts = true,
  scale = 1,
}) => (
  <div
    style={{
      width: 220 * scale,
      height: 360 * scale,
      borderRadius: 28 * scale,
      border: `${4 * scale}px solid ${INK}`,
      background: WHITE,
      position: "relative",
      boxShadow: "0 12px 0 rgba(15,23,42,0.08)",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 14 * scale,
        left: "50%",
        transform: "translateX(-50%)",
        width: 70 * scale,
        height: 8 * scale,
        borderRadius: 99,
        background: "#CBD5E1",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 48 * scale,
        left: 18 * scale,
        right: 18 * scale,
        bottom: 24 * scale,
        borderRadius: 12 * scale,
        background: `linear-gradient(160deg, ${SOFT}, #DBEAFE)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10 * scale,
      }}
    >
      <div
        style={{
          width: 56 * scale,
          height: 56 * scale,
          borderRadius: 14 * scale,
          background: BLUE,
        }}
      />
      <div
        style={{
          width: 100 * scale,
          height: 10 * scale,
          borderRadius: 99,
          background: "#94A3B8",
        }}
      />
      <div
        style={{
          width: 70 * scale,
          height: 8 * scale,
          borderRadius: 99,
          background: "#CBD5E1",
        }}
      />
    </div>
    {hearts && (
      <>
        {[
          { t: 40, l: -36, r: 12 },
          { t: 90, l: -28, r: 10 },
          { t: 55, r: -34, rot: -8 },
        ].map((h, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: h.t * scale,
              left: h.l !== undefined ? h.l * scale : undefined,
              right: h.r !== undefined ? (h as { r: number }).r * scale : undefined,
              fontSize: 36 * scale,
              transform: `rotate(${(h as { rot?: number }).rot ?? 8}deg)`,
              color: ORANGE,
              fontWeight: 800,
            }}
          >
            ♥
          </div>
        ))}
      </>
    )}
  </div>
);

const GuideMock: React.FC = () => (
  <div
    style={{
      width: 200,
      height: 260,
      borderRadius: 12,
      background: WHITE,
      border: `4px solid ${ORANGE}`,
      display: "flex",
      flexDirection: "column",
      padding: 18,
      boxShadow: "0 10px 0 rgba(234,88,12,0.15)",
    }}
  >
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 22,
        color: ORANGE,
        lineHeight: 1.2,
      }}
    >
      Invoicing
      <br />
      Guide
    </div>
    <div
      style={{
        marginTop: "auto",
        fontFamily: "system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 36,
        color: INK,
      }}
    >
      $79
    </div>
  </div>
);

/* ─── Scenes timed to voice-l001-lesson.mp3 (timeline.json) ─── */

const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = rise(f, fps);
  // headline after "Not yet…" (~6.98s into section → frame ~210)
  const showHeadline = f > 200;
  return (
    <AbsoluteFill>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
            opacity: e,
            transform: `translateY(${(1 - e) * 16}px)`,
          }}
        >
          <AppMock />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
                fontWeight: 800,
                fontSize: 64,
                color: INK,
                lineHeight: 1.15,
                letterSpacing: -1,
                maxWidth: 980,
              }}
            >
              Friends love your app.
            </div>
            <div
              style={{
                marginTop: 18,
                fontFamily: "system-ui, sans-serif",
                fontSize: 42,
                color: MUTED,
                fontWeight: 600,
              }}
            >
              Will customers pay?
            </div>
            {showHeadline && (
              <div
                style={{
                  marginTop: 36,
                  display: "inline-block",
                  background: WHITE,
                  border: `3px solid ${ORANGE}`,
                  borderRadius: 14,
                  padding: "16px 28px",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 44,
                  color: ORANGE,
                  opacity: fadeIn(f, 200, 12),
                }}
              >
                Interest ≠ paying demand
              </div>
            )}
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneFramework: React.FC = () => {
  const f = useCurrentFrame();
  // section local: 0 at 12.816s
  // value/payment until ~17.8s local → frames 0–150
  // three parts from ~17.8: customer, offer, delivery stagger
  const showDef = f >= 0;
  const showParts = f >= 150;
  const showCustomer = f >= 210;
  const showOffer = f >= 255;
  const showDelivery = f >= 300;
  return (
    <AbsoluteFill>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div style={{ textAlign: "center" }}>
          {showDef && (
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 56,
                color: INK,
                marginBottom: 48,
                opacity: fadeIn(f, 0, 12),
              }}
            >
              Value exchanged for payment
            </div>
          )}
          {showParts && (
            <div style={{ opacity: fadeIn(f, 150, 10) }}>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 36,
                  color: MUTED,
                  fontWeight: 600,
                  marginBottom: 28,
                }}
              >
                Three parts
              </div>
              <FrameworkRow
                active="none"
                show={{
                  customer: showCustomer,
                  offer: showOffer,
                  delivery: showDelivery,
                }}
              />
            </div>
          )}
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const ScenePart: React.FC<{
  part: "customer" | "offer" | "delivery";
  prompt: string;
  detail?: string;
}> = ({ part, prompt, detail }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = rise(f, fps);
  const colors = { customer: BLUE, offer: ORANGE, delivery: TEAL };
  const labels = { customer: "Customer", offer: "Offer", delivery: "Delivery" };
  return (
    <AbsoluteFill>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div style={{ opacity: e, transform: `translateY(${(1 - e) * 12}px)` }}>
          <FrameworkRow
            active={part}
            show={{ customer: true, offer: true, delivery: true }}
          />
          <div
            style={{
              marginTop: 56,
              background: CARD,
              border: `4px solid ${colors[part]}`,
              borderRadius: 20,
              padding: "40px 48px",
              maxWidth: 1400,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 32,
                color: colors[part],
                marginBottom: 16,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {labels[part]}
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 52,
                color: INK,
                lineHeight: 1.25,
              }}
            >
              {prompt}
            </div>
            {detail && f > 40 && (
              <div
                style={{
                  marginTop: 22,
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 36,
                  color: MUTED,
                  fontWeight: 600,
                  opacity: fadeIn(f, 40, 10),
                }}
              >
                {detail}
              </div>
            )}
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneExample: React.FC = () => {
  const f = useCurrentFrame();
  // Combined example_intro + example_parts as one Sequence spanning both.
  // Local 0 = 51.28s absolute
  // intro until 58.21 → local frames 0–208
  // customers 58.31 → local ~211
  // offer 63.47 → local ~366
  // delivery 67.22 → local ~478
  // hold until 71.35 → local ~602
  const showMaya = f >= 0;
  const showCustomer = f >= 210;
  const showOffer = f >= 365;
  const showDelivery = f >= 478;
  return (
    <AbsoluteFill>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 44,
              color: INK,
              marginBottom: 28,
              opacity: fadeIn(f, 0, 10),
            }}
          >
            Example · Maya’s invoicing guide
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              alignItems: "stretch",
              opacity: showMaya ? 1 : 0,
            }}
          >
            <div
              style={{
                flex: 1,
                background: WHITE,
                border: `3px solid ${showCustomer ? BLUE : "#CBD5E1"}`,
                borderRadius: 18,
                padding: 28,
                minHeight: 280,
                opacity: showCustomer ? fadeIn(f, 210, 10) : 0.4,
              }}
            >
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  color: showCustomer ? BLUE : MUTED,
                  marginBottom: 12,
                }}
              >
                Customer
              </div>
              {showCustomer ? (
                <>
                  <div
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: 40,
                      color: INK,
                      lineHeight: 1.25,
                    }}
                  >
                    Freelance designers
                  </div>
                  {f > 250 && (
                    <div
                      style={{
                        marginTop: 14,
                        fontFamily: "system-ui, sans-serif",
                        fontSize: 32,
                        color: MUTED,
                        fontWeight: 600,
                        opacity: fadeIn(f, 250, 10),
                      }}
                    >
                      Need help organizing invoices
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: "#CBD5E1", fontSize: 40, fontWeight: 800 }}>…</div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                minWidth: 220,
                opacity: showOffer ? fadeIn(f, 365, 10) : 0.4,
              }}
            >
              {showOffer ? (
                <>
                  <GuideMock />
                  <div
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: 28,
                      color: ORANGE,
                    }}
                  >
                    Offer · $79
                  </div>
                </>
              ) : (
                <div
                  style={{
                    width: 200,
                    height: 260,
                    borderRadius: 12,
                    border: "3px dashed #CBD5E1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: MUTED,
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 28,
                  }}
                >
                  Offer
                </div>
              )}
            </div>

            <div
              style={{
                flex: 1,
                background: WHITE,
                border: `3px solid ${showDelivery ? TEAL : "#CBD5E1"}`,
                borderRadius: 18,
                padding: 28,
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                opacity: showDelivery ? fadeIn(f, 478, 10) : 0.4,
              }}
            >
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  color: showDelivery ? TEAL : MUTED,
                  marginBottom: 12,
                }}
              >
                Delivery
              </div>
              {showDelivery ? (
                <div
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 40,
                    color: INK,
                  }}
                >
                  Download link
                </div>
              ) : (
                <div style={{ color: "#CBD5E1", fontSize: 40, fontWeight: 800 }}>…</div>
              )}
            </div>
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneContrast: React.FC = () => {
  const f = useCurrentFrame();
  // local 0 = 71.35s
  // feedback useful ~76.2 → frame 146
  // not pay ~78.97 → 229
  // purchase / one sale ~82.48 → 334
  const showFeedback = f >= 140;
  const showInterest = f >= 220;
  const showPurchase = f >= 330;
  const showCaveat = f >= 420;
  return (
    <AbsoluteFill>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 48,
              color: INK,
              marginBottom: 36,
              opacity: fadeIn(f, 0, 10),
            }}
          >
            Compare the evidence
          </div>
          <div style={{ display: "flex", gap: 36, alignItems: "stretch" }}>
            <div
              style={{
                flex: 1,
                background: WHITE,
                borderRadius: 18,
                border: "3px solid #CBD5E1",
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                opacity: showFeedback ? 1 : 0.4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <AppMock hearts scale={0.72} />
                <div
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 36,
                    color: MUTED,
                  }}
                >
                  Positive feedback
                </div>
              </div>
              {showInterest && (
                <div
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 34,
                    fontWeight: 700,
                    color: ORANGE,
                    lineHeight: 1.3,
                  }}
                >
                  Interest does not establish paying demand.
                </div>
              )}
            </div>
            <div
              style={{
                flex: 1,
                background: WHITE,
                borderRadius: 18,
                border: `3px solid ${showPurchase ? BLUE : "#CBD5E1"}`,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                opacity: showPurchase ? 1 : 0.4,
              }}
            >
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 36,
                  color: BLUE,
                }}
              >
                Completed purchase
              </div>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 34,
                  fontWeight: 600,
                  color: INK,
                  lineHeight: 1.35,
                }}
              >
                Stronger evidence of paying demand
              </div>
              {showCaveat && (
                <div
                  style={{
                    marginTop: "auto",
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: MUTED,
                    background: "#F1F5F9",
                    borderRadius: 12,
                    padding: "14px 18px",
                  }}
                >
                  One sale ≠ proof of long-term success
                </div>
              )}
            </div>
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneCustomer: React.FC = () => (
  <ScenePart
    part="customer"
    prompt="Who buys? What do they need?"
    detail="The person or organization buying"
  />
);

const SceneOffer: React.FC = () => (
  <ScenePart part="offer" prompt="What they buy · Price · What’s included" />
);

const SceneDelivery: React.FC = () => (
  <ScenePart
    part="delivery"
    prompt="How they receive the promised value"
    detail="Payment can come before or after delivery"
  />
);

const SceneRecap: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = rise(f, fps);
  const qs = [
    { q: "Who buys?", c: BLUE },
    { q: "What is the offer?", c: ORANGE },
    { q: "How is it delivered?", c: TEAL },
  ];
  return (
    <AbsoluteFill>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div style={{ opacity: e }}>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 48,
              color: INK,
              marginBottom: 36,
            }}
          >
            When you examine an idea
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {qs.map((item, i) => (
              <div
                key={item.q}
                style={{
                  background: WHITE,
                  borderLeft: `8px solid ${item.c}`,
                  borderRadius: 12,
                  padding: "22px 28px",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 44,
                  color: INK,
                  opacity: fadeIn(f, 8 + i * 18, 10),
                }}
              >
                {item.q}
              </div>
            ))}
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

const SceneQuizHandoff: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = rise(f, fps);
  return (
    <AbsoluteFill>
      <SoftBg />
      <Badge />
      <CaptionSafe>
        <div
          style={{
            textAlign: "center",
            opacity: e,
            transform: `translateY(${(1 - e) * 12}px)`,
          }}
        >
          <FrameworkRow
            active="all"
            show={{ customer: true, offer: true, delivery: true }}
          />
          <div
            style={{
              marginTop: 56,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 56,
              color: INK,
              lineHeight: 1.25,
            }}
          >
            Your turn: apply it to a new example.
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: "system-ui, sans-serif",
              fontSize: 36,
              color: MUTED,
              fontWeight: 600,
            }}
          >
            Quiz next — answers stay hidden until you submit.
          </div>
        </div>
      </CaptionSafe>
    </AbsoluteFill>
  );
};

/**
 * Absolute section starts from timeline.json (seconds → frames @ 30fps)
 * hook 0.00 | framework 12.816 | customer 25.228 | offer 33.894
 * delivery 41.600 | example 51.280 | contrast 71.350
 * recap 90.576 | quiz 98.566 | end pad ~106.2
 */
const sec = (s: number) => Math.round(s * L001_LESSON_FPS);

export const L001Lesson: React.FC = () => {
  const beats: { Comp: React.FC; from: number; to: number }[] = [
    { Comp: SceneHook, from: sec(0), to: sec(12.816) },
    { Comp: SceneFramework, from: sec(12.816), to: sec(25.228) },
    { Comp: SceneCustomer, from: sec(25.228), to: sec(33.894) },
    { Comp: SceneOffer, from: sec(33.894), to: sec(41.6) },
    { Comp: SceneDelivery, from: sec(41.6), to: sec(51.28) },
    { Comp: SceneExample, from: sec(51.28), to: sec(71.35) },
    { Comp: SceneContrast, from: sec(71.35), to: sec(90.576) },
    { Comp: SceneRecap, from: sec(90.576), to: sec(98.566) },
    { Comp: SceneQuizHandoff, from: sec(98.566), to: L001_LESSON_DURATION },
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
