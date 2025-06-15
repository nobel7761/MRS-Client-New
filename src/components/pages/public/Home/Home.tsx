import MarqueeScroller from "@/components/shared/marquee-scroller/marquee-scroller";
import { clientMarqueeData } from "@/resource-data/marquee-component";
import AboutUsHomeComponent from "./AboutUs/AboutUsHome";
import FAQComponent from "./faq/faq";
const HomeComponent = () => {
  return (
    <div>
      <AboutUsHomeComponent />
      <FAQComponent />
    </div>
  );
};

export default HomeComponent;
