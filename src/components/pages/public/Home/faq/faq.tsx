import AnimatedButton from "@/components/shared/custom-components/animated-button";
import CustomDotTitle from "@/components/shared/custom-components/dot-title";
import { archivo } from "@/lib/fonts";
import backgroundImage from "@/public/background.jpg";
import faqBackgroundImage from "@/public/faqs/faqs-bg.svg";
import Image from "next/image";
import faqsImage from "@/public/faqs/faqs-image.jpg";
import { SpinningLogo } from "../AboutUs/AboutUsHome";
import BrandLogo from "@/components/shared/brand-logo/brand-logo";

const SpinningComponent = ({
  outerCircleColor,
}: {
  outerCircleColor?: string;
}) => {
  return (
    <div className="relative w-[220px] h-[220px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-[15px] rounded-full bg-cover bg-center bg-no-repeat animate-[infiniterotate_20s_infinite_linear]"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      />
      <div className="absolute inset-[15px] flex items-center justify-center">
        <BrandLogo imageClassName="w-[85px] h-[85px]" />
      </div>
      <div className="absolute inset-0 rounded-full border-[15px] border-[#FAFAFA]" />
      <svg
        className="absolute inset-0 animate-[infiniterotate_20s_infinite_linear] pointer-events-none"
        viewBox="0 0 220 220"
        width="220"
        height="220"
      >
        <path
          id="textPath"
          d="M 110,110 m -80,0 a 80,80 0 1,0 160,0 a 80,80 0 1,0 -160,0"
          fill="none"
        />
        <text
          fill="white"
          fontSize="16"
          fontWeight="700"
          style={{ letterSpacing: 2.3, fontFamily: "Archivo" }}
        >
          <textPath href="#textPath" startOffset="50%" textAnchor="middle">
            National Ideal College Alumni Association (NICAA)
          </textPath>
        </text>
      </svg>
    </div>
  );
};

const FAQComponent = () => {
  return (
    <div
      className="bg-[#FAFAFA] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${faqBackgroundImage.src})` }}
    >
      <div className="max-w-[1300px] mx-auto md:py-24 md:px-[15px]">
        <CustomDotTitle
          title="FAQ"
          dotColor="bg-[#D00101]"
          className={`${archivo.medium500.className} text-primary uppercase text-sm`}
        />

        <div className="flex justify-between items-center">
          <p
            className={`w-1/2 ${archivo.semibold600.className} text-black md:text-[2.7rem] text-[1.8rem] md:leading-[3rem] tracking-[-0.02em] my-5`}
          >
            Your questions answered HR{" "}
            <span className="text-primary">solutions simplified</span>
          </p>

          <p className="w-1/2 flex justify-end">
            <AnimatedButton
              route="/"
              text="View All FAQs"
              textColor="text-white"
              buttonBgColor="bg-primary"
              iconBgColor="bg-secondary"
              iconColor="text-black"
              hoverButtonBgColor="bg-black"
              hoverIconBgColor="bg-white"
              className="md:w-fit w-full flex justify-center"
              showBackgroundImage={true}
            />
          </p>
        </div>

        <div className="flex justify-between gap-x-10">
          {/* left side */}
          <div className="md:w-1/2 w-full relative">
            <Image
              src={faqsImage}
              width={1000}
              height={1000}
              alt="faq"
              className="w-[90%] mt-[1.2rem] rounded-[20px] aspect-[1/1.034] object-cover"
            />

            <div className="absolute top-0 right-0">
              <SpinningComponent outerCircleColor="bg-transparent" />
            </div>
          </div>
          {/* right side */}
          <div className="md:w-1/2 w-full bg-blue-600">
            <p>right side</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
