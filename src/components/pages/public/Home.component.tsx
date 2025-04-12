import Blog from "./Blog/Blog";
import Clients from "./Clients/Clients";
import CounterSection from "./CounterSection";
import OurValues from "./OurValues/OurValues";
import Services from "./Services/Services";
import TopSection from "./TopSection/TopSection";
import TrainingAndDevelopment from "./TrainingAndDevelopment/TrainingAndDevelopment";
import WhyWeAre from "./WhyWeAre/WhyWeAre";

const HomeComponent = () => {
  return (
    <div className="relative">
      <TopSection />
      <CounterSection />
      <OurValues />
      <Clients />
      <TrainingAndDevelopment />
      <WhyWeAre />
      <Blog />
      <Services />
    </div>
  );
};

export default HomeComponent;
