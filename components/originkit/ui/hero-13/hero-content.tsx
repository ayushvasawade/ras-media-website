"use client";

import { useState } from "react";
import { Variants, motion } from "motion/react";
import FocusReveal from "@/components/originkit/ui/hero-13/focus-reveal";

type HeroContentProps = {
  onExplore?: () => void;
};

const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const FADE_UP_ITEM: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export const HeroContent = ({
  onExplore,
}: HeroContentProps) => {
  const [headingComplete, setHeadingComplete] = useState(false);

  return (
    <div className="relative z-20 flex w-full items-center justify-center py-4">
      <div className="relative z-10 flex w-full flex-col items-center gap-8 px-4 text-center">
        <div className="flex w-full flex-col items-center gap-8">
          <FocusReveal
            as="h1"
            text="MAKE PEOPLE TALK."
            stackedWords={true}
            className="w-full font-display text-[48px] leading-[0.88] tracking-[-0.04em] text-[#edebdd] uppercase text-balance sm:text-[72px] md:text-[96px] lg:text-[115px] font-extrabold"
            staggerFrom="start"
            blur={20}
            transition={{
              type: "tween",
              duration: 0.5,
              staggerChildren: 0.04,
              ease: "easeOut",
            }}
            onComplete={() => setHeadingComplete(true)}
          />

          <motion.div
            className="flex w-full justify-center"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate={headingComplete ? "visible" : "hidden"}
          >
            <motion.div variants={FADE_UP_ITEM}>
              <button
                type="button"
                onClick={onExplore}
                aria-label="Explore section"
                className="group relative inline-flex items-center gap-4 rounded-full bg-black/90 px-10 py-4 font-display text-[13px] font-medium tracking-[0.25em] text-[#edebdd] uppercase border border-[#edebdd]/25 backdrop-blur-md transition-all duration-500 hover:border-[#edebdd]/90 hover:bg-black hover:scale-105 hover:shadow-[0_0_35px_rgba(237,235,221,0.18)] active:scale-95 cursor-pointer overflow-hidden"
              >
                {/* Radial ambient sheen on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-radial from-[#edebdd]/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <span className="relative z-10">EXPLORE</span>
                <span
                  aria-hidden="true"
                  className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#edebdd]/30 bg-[#edebdd]/5 text-[12px] transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#edebdd] group-hover:bg-[#edebdd] group-hover:text-black"
                >
                  ↗
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
