import CustomContainer from "@/components/shared/Container";
import Title from "@/components/shared/Title";

import Image from "next/image";

const TrainingAndDevelopment = () => {
  return (
    <div className="bg-[#EFECE4] pb-10">
      <CustomContainer>
        <>
          <div className="flex flex-col-reverse md:flex-row md:items-center">
            <Image
              src="/mrs/TrainingAndDevelopment.png"
              alt="top-section-photo"
              height={1200}
              width={1200}
              className="md:w-2/4"
            />
            <Title text="Training & Development" />
          </div>

          <p className="md:text-xl">
            We work for them, arrange training methodology and find out their
            competency and searching suitable job openings for them. Our work is
            to ensure the environment as if they can introduce themselves with
            own strengths to perform better and create values for the business
            as well as our society.
          </p>
        </>
      </CustomContainer>
    </div>
  );
};

export default TrainingAndDevelopment;
