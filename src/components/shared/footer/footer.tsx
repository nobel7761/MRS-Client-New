import backgroundImage from "@/public/background.jpg";
import FooterBottomPart from "./bottom-part";
import MarqueeScroller from "../marquee-scroller/marquee-scroller";
import { clientMarqueeData } from "@/resource-data/marquee-component";

const FooterComponent = () => {
  return (
    <footer
      className="bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* <MarqueeScroller options={clientMarqueeData} /> */}
      <div className="max-w-[1300px] px-[15px] mx-auto py-24">
        <FooterBottomPart />
      </div>
    </footer>
  );
};

export default FooterComponent;
