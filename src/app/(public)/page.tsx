"use client";

import HomeComponent from "@/components/pages/public/Home/Home";
import Head from "next/head";
import HeroSection from "@/components/pages/public/Home/Hero/HeroSection";

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
      {/* <MarqueeScroller options={clientMarqueeData} /> */}
      <HomeComponent />
    </div>
  );
}
