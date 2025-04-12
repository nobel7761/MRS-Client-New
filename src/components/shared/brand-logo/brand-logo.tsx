import Image from "next/image";
import brandLogo from "@/public/brand-logo.png";

const BrandLogo = ({
  imageClassName,
  textClassName = "hidden",
}: {
  imageClassName?: string;
  textClassName?: string;
}) => {
  return (
    <div className="flex items-center">
      <Image
        src={brandLogo}
        alt="mrs-logo"
        quality={100}
        priority
        className={`object-contain ${imageClassName}`}
      />
      <p className={`${textClassName}`}>Manpower Research & Synchronization</p>
    </div>
  );
};

export default BrandLogo;
