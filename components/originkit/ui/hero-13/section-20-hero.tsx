"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import { HeroContent } from "@/components/originkit/ui/hero-13/hero-content";

gsap.registerPlugin(ScrollTrigger);

/** Public asset under /sections/hero-13/assets */
function asset(file: string) {
  return `/originkit/hero-13/${file}`;
}

/** Dark slabs so non-photo panels stay invisible in the tunnel. */
const TUNNEL_COLORS = ["#181818", "#1c1c1c", "#222222", "#161616"];
const DEFAULT_IMAGES = [
  asset("potrait-1.png"),
  asset("potrait-2.png"),
  asset("potrait-3.png"),
  asset("potrait-4.png"),
  asset("potrait-5.png"),
  asset("potrait-6.png"),
]

export const Section20Hero = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    (window as any).__rasHero13Ready = true;
    window.dispatchEvent(new CustomEvent("ras:hero13-ready"));

    const handleReverseZoom = () => {
      handleReverseExplore();
    };

    window.addEventListener("ras:reverse-hero-zoom", handleReverseZoom);
    return () => {
      window.removeEventListener("ras:reverse-hero-zoom", handleReverseZoom);
    };
  }, []);

  const handleReverseExplore = () => {
    const oEl = document.getElementById("hero-o-portal");
    const section = document.getElementById("hero-13-section");
    const section2 = document.getElementById("brand-statement");

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let cpX = "50";
    let cpY = "50";

    if (oEl) {
      const oRect = oEl.getBoundingClientRect();
      const targetX = oRect.left + oRect.width * 0.72;
      const targetY = oRect.top + oRect.height * 0.50;
      cpX = ((targetX / vw) * 100).toFixed(2);
      cpY = ((targetY / vh) * 100).toFixed(2);
    }

    document.body.style.overflow = "hidden";

    let overlay = document.getElementById("cotton-portal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "cotton-portal-overlay";
      document.body.appendChild(overlay);
    }

    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#edebdd",
      zIndex: "99999",
      pointerEvents: "none",
      clipPath: `circle(180vmax at ${cpX}% ${cpY}%)`,
      willChange: "clip-path",
      opacity: "1",
    });

    // Hide Section 2 behind overlay
    if (section2) {
      section2.style.opacity = "0";
      section2.style.pointerEvents = "none";
      setTimeout(() => {
        section2.style.display = "none";
      }, 300);
    }

    if (section) {
      section.style.visibility = "visible";
      section.style.pointerEvents = "auto";
      gsap.set(section, {
        scale: 18,
        transformOrigin: `${cpX}% ${cpY}%`,
        opacity: 0.1,
      });
    }

    window.scrollTo({ top: 0, behavior: "auto" });

    const tl = gsap.timeline({
      onComplete: () => {
        if (section) {
          gsap.set(section, {
            clearProps: "scale,transformOrigin,opacity",
          });
        }
        document.body.style.overflow = "";
        overlay?.remove();
      },
    });

    if (section) {
      tl.to(section, {
        scale: 1,
        opacity: 1,
        duration: 1.3,
        ease: "power3.out",
      }, 0);
    }

    tl.to(overlay, {
      clipPath: `circle(0px at ${cpX}% ${cpY}%)`,
      duration: 1.3,
      ease: "power3.out",
    }, 0);
  };

  const handleExplore = () => {
    const oEl = document.getElementById("hero-o-portal");
    const section = document.getElementById("hero-13-section");
    const section2 = document.getElementById("brand-statement");

    if (!oEl || !section2) return;

    // 1. Target middle/right edge of the "O" portal
    const oRect = oEl.getBoundingClientRect();
    const targetX = oRect.left + oRect.width * 0.72; // Middle/right edge of O
    const targetY = oRect.top + oRect.height * 0.50; // Middle height

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const cpX = ((targetX / vw) * 100).toFixed(2);
    const cpY = ((targetY / vh) * 100).toFixed(2);

    const initialRadius = (((oRect.width / 2) / Math.max(vw, vh)) * 100).toFixed(2);

    // 2. Create or target Cotton Portal Overlay (#edebdd)
    let overlay = document.getElementById("cotton-portal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "cotton-portal-overlay";
      document.body.appendChild(overlay);
    }

    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#edebdd", // Cotton color
      zIndex: "99999",
      pointerEvents: "none",
      clipPath: `circle(${initialRadius}vmax at ${cpX}% ${cpY}%)`,
      willChange: "clip-path",
      opacity: "1",
    });

    document.body.style.overflow = "hidden";

    // 3. Cinematic Forward Zoom Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Reveal Section 2 in-place at top:0 on Cotton background
        section2.style.display = "flex";
        requestAnimationFrame(() => {
          section2.style.opacity = "1";
          section2.style.pointerEvents = "auto";
        });

        // Fade overlay smoothly after Section 2 is revealed on screen
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            overlay?.remove();
            document.body.style.overflow = "";
            // Hide the hero section and reset its scale so it doesn't cause
            // excessive page width, touch blocking, or the black ALK layer
            if (section) {
              section.style.visibility = "hidden";
              section.style.pointerEvents = "none";
              gsap.set(section, { scale: 1, clearProps: "transform" });
            }
            ScrollTrigger.refresh();
          },
        });
      },
    });

    // Camera surges forward toward right edge of O
    if (section) {
      tl.to(section, {
        scale: 18,
        transformOrigin: `${cpX}% ${cpY}%`,
        opacity: 0.1,
        duration: 1.3,
        ease: "power3.inOut",
      }, 0);
    }

    // Cotton O border expands rapidly outward to fill 100% of viewport
    tl.to(overlay, {
      clipPath: `circle(180vmax at ${cpX}% ${cpY}%)`,
      duration: 1.3,
      ease: "power3.inOut",
    }, 0);
  };

  return (
    <section
      id="hero-13-section"
      aria-label="MAKE PEOPLE TALK"
      className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#131313]"
    >
      {/* 3D portrait tunnel */}
      <div
        aria-hidden="true"
        className="pointer-events-auto absolute inset-0 z-0"
      >
        <GalleryTunnel
          images={DEFAULT_IMAGES}
          colors={TUNNEL_COLORS}
          background="#131313"
          lineColor="#B0B0B0"
          lineOpacity={0}
          grid={8}
          speed={50}
          boost={100}
          fade={100}
          label={false}
        />
      </div>

      {/* Smooth radial vignette wash behind text so copy stays readable while 3D images blend naturally */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[80vh] w-[100vw] wide-lg:w-[50vw] wide-lg:h-[50vh] ipad:w-[75vw] desktop-sm:w-[85vh] desktop-sm:w-[55vw] -translate-x-1/2 -translate-y-1/2 bg-[#131313] blur-[25px]"
      />

      <div className="hero-content-wrap pointer-events-none relative z-20 flex w-full max-w-[900px] items-center justify-center py-12">
        <div className="pointer-events-auto relative flex w-full items-center justify-center">
          <HeroContent
            onExplore={handleExplore}
          />
        </div>
      </div>
    </section>
  );
};
