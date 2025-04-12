import { services } from "@/assets/information";
import CustomContainer from "@/components/shared/Container";
import Title from "@/components/shared/Title";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

const Services = () => {
  return (
    <div className="pb-10">
      <CustomContainer>
        <>
          <Title text="Our Innovative Workforce Solutions" />
          <p className="pb-4 text-center">
            We address the complex workforce challenges organizations face
            today, from contingent and permanent staffing to talent management,
            outsourcing, and talent development. We deliver the solutions that
            drive your business forward.
          </p>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-10">
            {services.map((service, index) => (
              <div key={index} className="">
                <div>
                  <Image
                    width={1200}
                    height={1200}
                    alt="Manpower"
                    className="rounded-t-lg"
                    aria-hidden="true"
                    src={service.image}
                  />
                  <Image
                    width={1200}
                    height={1200}
                    alt="Manpower Logo"
                    className="logo w-3/4 mx-auto"
                    aria-hidden="false"
                    src={service.logo}
                  />
                </div>
                <div className="">
                  <p className="h-14 text-center">{service.title}</p>
                  <Link
                    href={`/service/${service.id}`}
                    target="_blank"
                    className="flex justify-center items-center gap-x-2 w-full text-primary hover:text-primary/80"
                  >
                    <p className="text-lg">LEARN MORE</p>
                    <FaArrowRightLong className="text-lg" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      </CustomContainer>
    </div>
  );
};

export default Services;
