import { archivo } from "@/lib/fonts";
import { useEffect, useRef } from "react";

interface AnimatedIconTitleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  hoverIconBgColor?: string;
  titleClass?: string;
  descriptionClass?: string;
}

const AnimatedIconTitleCard: React.FC<AnimatedIconTitleCardProps> = ({
  icon,
  title,
  description,
  iconBgColor = "bg-[#fafafa]",
  hoverIconBgColor = "bg-primary",
  titleClass = "",
  descriptionClass = "",
}) => {
  const iconRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex gap-x-4 mb-7 group">
      <div
        ref={iconRef}
        className={`w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden ${iconBgColor}`}
      >
        {/* Background animation element */}
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out scale-0 group-hover:scale-100 origin-center rounded-full"></div>

        {/* Icon container */}
        <div className="relative z-10">{icon}</div>
      </div>
      <div className="w-[75%]">
        <h3
          className={`md:text-xl text-base ${archivo.medium500.className} ${titleClass}`}
        >
          {title}
        </h3>
        <p
          className={`md:text-base text-sm text-[#666666] ${archivo.regular400.className} ${descriptionClass}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default AnimatedIconTitleCard;
