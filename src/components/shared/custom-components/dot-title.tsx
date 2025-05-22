import { archivo } from "@/lib/fonts";
import backgroundImage from "@/public/background.jpg";

const CustomDotTitle = ({
  title,
  dotColor,
  centerAligned,
  className,
}: {
  title: string;
  dotColor: string;
  centerAligned?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        centerAligned ? "justify-center" : "justify-start"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full  ${dotColor}`}
        // style={{ backgroundImage: `url(${backgroundImage.src})` }}
      ></div>
      <p
        className={`${archivo.medium500.className} text-[1rem] tracking-widest ${className}`}
      >
        {title}
      </p>
    </div>
  );
};

export default CustomDotTitle;
