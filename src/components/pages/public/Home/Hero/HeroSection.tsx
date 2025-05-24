import AnimatedButton from "@/components/shared/custom-components/animated-button";
import { archivo } from "@/lib/fonts";
import Image from "next/image";
import { TiTick } from "react-icons/ti";
import heroImage from "@/public/hero/hero-image.png";
import heroButtonIcon from "@/public/hero/hero-btn-arrow.svg";
import CustomDotTitle from "@/components/shared/custom-components/dot-title";
import backgroundImage from "@/public/background.jpg";

const HeroSection = () => {
  return (
    <div
      className="relative min-h-screen"
      // style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <div className="relative pt-24 text-white text-center">
        <CustomDotTitle
          title="Welcome to NICAA"
          dotColor="bg-secondary"
          centerAligned={true}
        />
        <div className="my-4">
          <p
            className={`${archivo.bold700.className} text-[4rem] w-[65%] mx-auto`}
          >
            National Ideal College
          </p>
          <p
            className={`${archivo.bold700.className} text-[4rem] w-[65%] mx-auto text-secondary -mt-5`}
          >
            Alumni Association
          </p>
        </div>

        <div
          className={`${archivo.thin300.className} flex justify-center items-center gap-16`}
        >
          <div className={`flex items-center gap-2`}>
            <div className="w-4 h-4 rounded-full bg-secondary flex justify-center items-center">
              <TiTick className="text-black" />
            </div>
            <p>সেই পুরোনো বেঞ্চ, সেই বন্ধুত্ব - আবারও জীবন্ত হোক!</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-secondary flex justify-center items-center">
              <TiTick className="text-black" />
            </div>
            <p>সেই কৈশোর, সেই দিন, সেই আমরা!</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-secondary flex justify-center items-center">
              <TiTick className="text-black" />
            </div>
            <p>ফিরে দেখা সেই সোনালি দিন!</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center py-16">
        <div
          className="relative"
          style={{
            position: "relative",
          }}
        >
          <AnimatedButton
            route="/representative-registration-reunion-2026"
            text="রিপ্রেজেন্টেটিভ রেজিস্ট্রেশন করুন এখানে"
            textColor="text-black"
            buttonBgColor="bg-secondary"
            iconBgColor="bg-primary"
            hoverButtonBgColor="bg-white"
            hoverIconBgColor="bg-black"
            showBackgroundImage={false}
          />
          <div
            style={{
              content: "",
              position: "absolute",
              right: "-110px",
              top: "-20px",
              background: `url(${heroButtonIcon.src}) no-repeat`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
              width: "100px",
              height: "70px",
              animation: "ctaarrow 2s infinite linear",
            }}
          />
        </div>
      </div>

      <div className="w-[80%] mx-auto">
        <Image
          src={heroImage}
          alt="Hero Image"
          width={1000}
          height={1000}
          className="w-full max-w-[85%] mx-auto aspect-[1/0.66] object-cover"
        />
      </div>
    </div>
  );
};

export default HeroSection;
