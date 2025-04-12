import "swiper/css";
import "swiper/css/effect-cards";
import RightSide from "./RightSide";
import LeftSide from "./LeftSide";
import BottomSection from "./BottomSection";
import CustomContainer from "@/components/shared/Container";

const TopSection = () => {
  return (
    <div className="bg-backgroundColor">
      <CustomContainer>
        <>
          <div className="md:flex gap-x-10 md:mt-10">
            <div className={`md:w-[50%]`}>
              <LeftSide />
            </div>

            <div className={`md:w-[50%]`}>
              <RightSide />
            </div>
          </div>

          <BottomSection />
        </>
      </CustomContainer>
    </div>
  );
};

export default TopSection;
