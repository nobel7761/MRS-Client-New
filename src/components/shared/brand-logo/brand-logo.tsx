import Image from "next/image";
import brandLogo from "@/public/nicaa-logo-white-bg.png";

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
        alt="nicaa-logo"
        quality={100}
        priority
        className={`object-contain ${imageClassName}`}
      />
      <p className={`${textClassName}`}>
        National Ideal College Alumni Association
      </p>
    </div>
  );
};

export default BrandLogo;
