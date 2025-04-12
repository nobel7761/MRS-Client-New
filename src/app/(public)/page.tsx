"use client";

import Head from "next/head";
import HomeComponent from "@/components/pages/public/Home.component";

export default function Home() {
  return (
    <div>
      <Head>
        <title>MRS</title>
      </Head>
      <HomeComponent />
    </div>
  );
}
