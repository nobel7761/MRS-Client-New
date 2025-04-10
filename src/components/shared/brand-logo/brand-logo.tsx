import Image from "next/image";
import brandLogo from "@/public/mrs/brand-logo.png";

const BrandLogo = () => {
  return (
    <div className="flex items-center">
      <Image
        src={brandLogo}
        alt="mrs-logo"
        height={2400}
        width={2400}
        className="md:w-[15%] w-[20%] transform md:hover:scale-125 transition-transform duration-300"
      />
      <p className={`md:text-[26px] text-[16px] md:text-white`}>
        Manpower Research & Synchronization
      </p>
    </div>
  );
};

export default BrandLogo;
