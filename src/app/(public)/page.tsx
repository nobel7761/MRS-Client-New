"use client";

import MainNavbar from "@/components/shared/navbar/main-navbar";
import HomeComponent from "@/components/pages/public/Home/Home";
import Head from "next/head";
import HeroSection from "@/components/pages/public/Home/Hero/HeroSection";

import FooterComponent from "@/components/shared/footer/footer";
import { clientMarqueeData } from "@/resource-data/marquee-component";
import MarqueeScroller from "@/components/shared/marquee-scroller/marquee-scroller";

export default function Home() {
  return (
    <div>
      <Head>
        <title>NICAA</title>
      </Head>

      {/* available color palette */}
      {/* <div className="w-full h-[10vh] bg-primary"></div>
      <div className="w-full h-[10vh] bg-secondary"></div>
      <div className="w-full h-[10vh] bg-brandColorPrimary"></div>
      <div className="w-full h-[10vh] bg-brandColorSecondary"></div>
      <div className="w-full h-[10vh] bg-facebook"></div>
      <div className="w-full h-[10vh] bg-whatsapp"></div> */}

      <HeroSection />
      {/* <MarqueeScroller options={clientMarqueeData} /> */}
      <HomeComponent />
    </div>
  );
}
