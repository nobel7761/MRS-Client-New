"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BrandLogo from "./shared/brand-logo/brand-logo";
import backgroundImage from "@/public/background.jpg";

const PageLoader = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const mobileTextRef = useRef<HTMLDivElement>(null);

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

    // Initial text animation for both desktop and mobile
    const animateText = (element: HTMLDivElement | null) => {
      if (!element) return;

      gsap.fromTo(
        element,
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
            gsap.to(element, {
              scale: 1.05,
              duration: 1.5,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        }
      );
    };

    animateText(textRef.current);
    animateText(mobileTextRef.current);

    // Add 3 second delay
    tl.to(
      {},
      {
        duration: 1,
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
    <div
      className="fixed top-0 left-0 h-[100vh] w-[100vw] flex flex-col justify-center items-center loading-page z-[9999] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <div className="brand-logo w-[15rem] h-[15rem] flex items-center justify-center">
        <BrandLogo imageClassName="w-full h-full" />
      </div>

      <div className="min-h-[60px] flex items-center">
        <div
          ref={textRef}
          className="md:block hidden text-3xl font-bold uppercase [letter-spacing:5px] logo-name text-white bg-clip-text text-transparent opacity-0"
        >
          National Ideal College Alumni Association
        </div>
        <div
          ref={mobileTextRef}
          className="md:hidden block text-center text-lg font-bold uppercase [letter-spacing:5px] logo-name text-white bg-clip-text text-transparent opacity-0"
        >
          National Ideal College <br /> Alumni Association
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
