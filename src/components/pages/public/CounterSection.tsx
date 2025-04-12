import CountUp from "react-countup";
import { FaPlus } from "react-icons/fa";

const CounterSection = () => {
  return (
    <div className={`mx-auto bg-primary`}>
      <div className="md:py-6 py-4 text-white">
        <div className="w-[80%] mx-auto flex md:flex-row flex-col gap-y-8 justify-between">
          {/* experience */}
          <div className="flex flex-col items-center">
            <div className="flex items-center md:gap-x-2">
              <CountUp
                end={5}
                duration={3}
                className="md:text-6xl text-4xl font-extrabold"
              />
              <FaPlus className="md:text-3xl text-sm" />
            </div>
            <p className="md:text-3xl text-xl font-extrabold">Experienced</p>
          </div>

          {/* clients */}
          <div className="flex flex-col items-center">
            <div className="flex items-center md:gap-x-2">
              <CountUp
                end={25}
                duration={3}
                className="md:text-6xl text-4xl font-extrabold"
              />
              <FaPlus className="md:text-3xl text-sm" />
            </div>
            <p className="md:text-3xl text-xl font-extrabold">Clients</p>
          </div>

          {/* Candidates */}
          <div className="flex flex-col items-center">
            <div className="flex items-center md:gap-x-2">
              <div className="flex items-center">
                <CountUp
                  end={12}
                  duration={3}
                  className="md:text-6xl text-4xl font-extrabold"
                />
                <p className="md:text-6xl font-extrabold text-4xl">K</p>
              </div>
              <FaPlus className="md:text-3xl text-sm" />
            </div>
            <p className="md:text-3xl text-xl font-extrabold">Candidates</p>
          </div>

          {/* employees */}
          <div className="flex flex-col items-center">
            <div className="flex items-center md:gap-x-2">
              <CountUp
                end={300}
                duration={3}
                className="md:text-6xl text-4xl font-extrabold"
              />
              <FaPlus className="md:text-3xl text-sm" />
            </div>
            <p className="md:text-3xl text-xl font-extrabold">Employees</p>
          </div>

          {/* project done */}
          <div className="flex flex-col items-center">
            <div className="flex items-center md:gap-x-2">
              <CountUp
                end={120}
                duration={3}
                className="md:text-6xl text-4xl font-extrabold"
              />
              <FaPlus className="md:text-3xl text-sm" />
            </div>
            <p className="md:text-3xl text-xl font-extrabold">
              Workshop / Training
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterSection;
