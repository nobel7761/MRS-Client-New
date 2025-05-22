import AnimatedIconTitleCard from "@/components/shared/custom-components/animated-icon-title-card";
import CustomDotTitle from "@/components/shared/custom-components/dot-title";
import { archivo } from "@/lib/fonts";
import { PiCirclesFourLight } from "react-icons/pi";
import { GrResources } from "react-icons/gr";
import AnimatedButton from "@/components/shared/custom-components/animated-button";
import BrandLogo from "@/components/shared/brand-logo/brand-logo";
import Image from "next/image";
import AboutUsImage1 from "@/public/about/about-img-1.jpg";
import AboutUsImage2 from "@/public/about/about-img-2.jpg";
import AboutUsImage3 from "@/public/about/about-img-3.jpg";
import backgroundImage from "@/public/background.jpg";

const SpinningLogo = () => {
  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
      {/* Outer spinning circle with text */}
      <div
        className="absolute w-full h-full animate-spin-slow bg-primary rounded-full flex items-center justify-center  bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <svg className="w-full h-full p-3" viewBox="0 0 100 100">
          <defs>
            <path
              id="circle"
              d="M 50,50 m -41,0 a 41,41 0 1,1 82,0 a 41,41 0 1,1 -82,0"
            />
          </defs>
          <text
            className={`${archivo.medium500.className} text-white text-[13px] fill-current`}
            wordSpacing="0.5"
          >
            <textPath href="#circle" startOffset="0%">
              National Ideal College Alumni Association
            </textPath>
          </text>
        </svg>
      </div>

      {/* Inner logo with slower spin */}
      <div className="absolute w-[75px] h-[75px] rounded-full flex items-center justify-center">
        <BrandLogo imageClassName="w-full h-full p-2" />
      </div>
    </div>
  );
};

const AboutUsImages = () => {
  const yearsOfExperience = new Date().getFullYear() - 2016;
  const formattedYears = yearsOfExperience.toString().padStart(2, "0");

  return (
    <div className="relative w-full min-h-[600px]">
      {/* Spinning Logo on top left */}
      <div className="absolute top-2 left-16 z-40">
        <SpinningLogo />
      </div>

      {/* About Image Box 1 */}
      <div className="absolute top-[27%] left-5 w-[38%] z-10">
        <div className="relative overflow-hidden rounded-[20px] group">
          <figure className="transform transition-transform duration-500 hover:scale-105">
            <Image
              src={AboutUsImage1}
              alt="About Us 1"
              width={400}
              height={500}
              className="w-full h-[200px] aspect-[1/0.96] object-cover"
            />
          </figure>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0"></div>
        </div>
      </div>

      {/* About Image Box 2 */}
      <div className="absolute top-0 right-0 w-[55%] z-10">
        <div className="relative overflow-hidden rounded-[20px] group">
          <figure className="transform transition-transform duration-500 hover:scale-105">
            <Image
              src={AboutUsImage2}
              alt="About Us 2"
              width={350}
              height={400}
              className="w-full h-[450px] aspect-[1/1.349] object-cover"
            />
          </figure>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0"></div>
        </div>
      </div>

      {/* About Image Box 3 */}
      <div className="absolute bottom-0 left-0 w-[60%] z-30">
        <div className="relative overflow-hidden rounded-[30px] border-[15px] border-white group">
          <figure className="transform transition-transform duration-500 hover:scale-105">
            <Image
              src={AboutUsImage3}
              alt="About Us 3"
              width={350}
              height={400}
              className="w-full h-auto aspect-[1/0.49] object-cover"
            />
          </figure>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0"></div>
        </div>
      </div>

      {/* Years of Togetherness Card anchored bottom right */}
      <div className="absolute w-[35%] bottom-6 right-5 text-black rounded-[20px] group overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage.src})` }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-6 flex justify-center items-center gap-x-3">
          <h2 className="text-4xl font-bold mb-1 text-white">
            <span className="counter">{formattedYears}</span>
          </h2>
          <p className="text-sm text-white">Years of Togetherness</p>
        </div>
      </div>
    </div>
  );
};

const AboutUsHomeComponent = () => {
  return (
    <div className="py-24 container mx-auto">
      <div className="flex gap-x-4 items-center">
        {/* left side */}
        <div className="w-1/2 flex justify-center items-center">
          <AboutUsImages />
        </div>
        <div className="w-1/2 px-10">
          <CustomDotTitle
            title="About Us"
            dotColor="bg-[#D00101]"
            className={`${archivo.medium500.className} text-primary uppercase text-sm`}
          />

          <p
            className={`${archivo.semibold600.className} text-black text-[2.7rem] leading-[3rem] tracking-[-0.02em] my-5`}
          >
            <span className="text-primary">Engaging</span> all former & current
            students <span className="text-primary">together</span>
          </p>

          <p
            className={`${archivo.regular400.className} text-[#666666] text-[1.05rem] leading-[1.8rem] mb-5`}
          >
            National Ideal College Alumni Association is a vibrant community
            dedicated to fostering lifelong connections among alumni, current
            students, and faculty.
          </p>

          <AnimatedIconTitleCard
            icon={
              <PiCirclesFourLight className="text-primary text-4xl group-hover:text-white transition-colors duration-500" />
            }
            title="Keeping the Legacy Alive"
            description="We foster lifelong connections among alumni, celebrating shared memories and building a strong network that supports personal and professional growth."
            descriptionClass="text-sm"
          />

          <AnimatedIconTitleCard
            icon={
              <GrResources className="text-primary text-4xl group-hover:text-white transition-colors duration-500" />
            }
            title="Empowering Alumni, Inspiring Generations"
            description="Our association is dedicated to uniting past and present members of the college community, creating opportunities for collaboration, mentorship, and contribution to future success stories."
            descriptionClass="text-sm"
          />

          <AnimatedButton
            route="/"
            text="More About Us"
            textColor="text-white"
            buttonBgColor="bg-primary"
            iconBgColor="bg-secondary"
            iconColor="text-black"
            hoverButtonBgColor="bg-black"
            hoverIconBgColor="bg-white"
            className="w-fit"
            showBackgroundImage={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsHomeComponent;
