import CustomContainer from "@/components/shared/Container";
import Title from "@/components/shared/Title";

import Image from "next/image";

const WhyWeAre = () => {
  return (
    <div className="pb-10">
      <CustomContainer>
        <>
          <Title text="Why We Are?" />
          <div className="flex md:flex-row md:gap-x-10 flex-col gap-y-5">
            <div className="md:w-1/3 flex flex-col md:gap-y-5 gap-y-3">
              <Image
                src="/mrs/whyweare-1.png"
                alt="top-section-photo"
                height={1200}
                width={1200}
                className="w-full h-[250px]"
              />
              <p className="text-center text-xl font-bold">
                Discover work opportunity for people
              </p>
            </div>

            <div className="md:w-1/3 flex flex-col md:gap-y-5 gap-y-3">
              <Image
                src="/mrs/whyweare-2.png"
                alt="top-section-photo"
                height={1200}
                width={1200}
                className="w-full h-[250px]"
              />
              <p className="text-center text-xl font-bold">
                Unfold manpower as business resource
              </p>
            </div>

            <div className="md:w-1/3 flex flex-col md:gap-y-5 gap-y-3">
              <Image
                src="/mrs/whyweare-3.png"
                alt="top-section-photo"
                height={1200}
                width={1200}
                className="w-full h-[250px]"
              />
              <p className="text-center text-xl font-bold">
                Sustainable work force
              </p>
            </div>
          </div>
        </>
      </CustomContainer>
    </div>
  );
};

export default WhyWeAre;
