import React from "react";
import { Composition } from "remotion";
import { L001, L001_DURATION } from "./L001";
import { L001Max, L001_MAX_DURATION, L001_MAX_FPS } from "./L001Max";
import { L001Dense, L001_DENSE_DURATION, L001_DENSE_FPS } from "./L001Dense";
import { L001Lesson, L001_LESSON_DURATION, L001_LESSON_FPS } from "./L001Lesson";
import { L001Pro, L001_PRO_DURATION, L001_PRO_FPS } from "./L001Pro";
import { L001Neon, L001_NEON_DURATION, L001_NEON_FPS } from "./L001Neon";
import { L001Motion, L001_MOTION_DURATION, L001_MOTION_FPS } from "./L001Motion";
import {
  L001Editorial,
  L001_EDITORIAL_DURATION,
  L001_EDITORIAL_FPS,
} from "./L001Editorial";
import {
  UGCWaitlistHook,
  UGC_DURATION,
  UGC_FPS,
  UGC_HEIGHT,
  UGC_WIDTH,
} from "./UGCWaitlistHook";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UGCWaitlistHook"
        component={UGCWaitlistHook}
        durationInFrames={UGC_DURATION}
        fps={UGC_FPS}
        width={UGC_WIDTH}
        height={UGC_HEIGHT}
      />
      <Composition
        id="L001Editorial"
        component={L001Editorial}
        durationInFrames={L001_EDITORIAL_DURATION}
        fps={L001_EDITORIAL_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="L001"
        component={L001}
        durationInFrames={L001_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="L001Max"
        component={L001Max}
        durationInFrames={L001_MAX_DURATION}
        fps={L001_MAX_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="L001Dense"
        component={L001Dense}
        durationInFrames={L001_DENSE_DURATION}
        fps={L001_DENSE_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="L001Lesson"
        component={L001Lesson}
        durationInFrames={L001_LESSON_DURATION}
        fps={L001_LESSON_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="L001Pro"
        component={L001Pro}
        durationInFrames={L001_PRO_DURATION}
        fps={L001_PRO_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="L001Neon"
        component={L001Neon}
        durationInFrames={L001_NEON_DURATION}
        fps={L001_NEON_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="L001Motion"
        component={L001Motion}
        durationInFrames={L001_MOTION_DURATION}
        fps={L001_MOTION_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
