import Link from "next/link";
import { archivo } from "@/lib/fonts";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import backgroundImage from "@/public/background.jpg";

interface AnimatedButtonProps {
  route?: string;
  text?: string;
  textColor?: string;
  buttonBgColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  hoverButtonBgColor?: string;
  hoverIconBgColor?: string;
  className?: string;
  showBackgroundImage?: boolean;
}

const AnimatedButton = ({
  route,
  text,
  textColor = "text-white",
  buttonBgColor = "bg-primary",
  iconBgColor = "bg-primary",
  iconColor = "text-white",
  hoverButtonBgColor = "bg-primary/90",
  hoverIconBgColor = "bg-primary/90",
  className = "",
  showBackgroundImage = false,
}: AnimatedButtonProps) => {
  return (
    <Link
      href={route || "/"}
      className={`relative inline-block overflow-hidden ${buttonBgColor} ${textColor} rounded-xl px-5 py-2.5 transition-all duration-500 ease-in-out flex gap-x-2 items-center group ${
        showBackgroundImage ? "bg-cover bg-center bg-no-repeat" : ""
      } ${className}`}
      style={
        showBackgroundImage
          ? { backgroundImage: `url(${backgroundImage.src})` }
          : undefined
      }
    >
      <div
        className={`absolute inset-0 ${hoverButtonBgColor} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out delay-[1ms]`}
      ></div>
      <p className={`${archivo.semibold600.className} relative z-10 text-base`}>
        {text}
      </p>
      <div className="relative overflow-hidden w-8 h-8 rounded-lg">
        <div
          className={`absolute inset-0 ${iconBgColor} transition-transform duration-500 ease-in-out`}
        ></div>
        <div
          className={`absolute inset-0 ${hoverIconBgColor} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out delay-150`}
        ></div>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <TbArrowBadgeRightFilled className={`text-xl ${iconColor}`} />
        </div>
      </div>
    </Link>
  );
};

export default AnimatedButton;
