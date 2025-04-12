"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BrandLogo from "./shared/brand-logo/brand-logo";

const PageLoader = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    // Heartbeat animation for logo
    tl.set(".brand-logo", { scale: 1 }).to(".brand-logo", {
      scale: 1.1,
      duration: 0.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Initial text animation
    tl.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          setIsTypingComplete(true);
          // Start continuous text animation after initial appearance
          gsap.to(textRef.current, {
            scale: 1.05,
            duration: 1.5,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      }
    );

    // Add 3 second delay
    tl.to(
      {},
      {
        duration: 3,
      }
    );

    // Fade out the entire loader
    tl.to(".loading-page", {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        const loader = document.querySelector(".loading-page");
        if (loader) {
          (loader as HTMLElement).style.display = "none";
        }
      },
    });
  }, []);

  return (
    <div className="absolute top-0 left-0 h-[100%] w-[100%] flex flex-col justify-center items-center bg-secondary bg-cover bg-center loading-page">
      <div className="brand-logo w-[15rem] h-[15rem] flex items-center justify-center">
        <BrandLogo imageClassName="w-full h-full" />
      </div>

      <div className="min-h-[60px] flex items-center">
        <div
          ref={textRef}
          className="text-3xl font-bold uppercase [letter-spacing:5px] logo-name bg-gradient-to-r from-brandColorPrimary to-brandColorSecondary bg-clip-text text-transparent opacity-0"
        >
          Manpower Research & Synchronization
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
