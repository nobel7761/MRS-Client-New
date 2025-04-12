import Image from "next/image";

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
        src="/brand-logo.png"
        alt="mrs-logo"
        height={2400}
        width={2400}
        className={`w-[3rem] h-[3rem] object-contain ${imageClassName}`}
      />
      <p className={`${textClassName}`}>Manpower Research & Synchronization</p>
    </div>
  );
};

export default BrandLogo;
