import Image from "next/image";
import { Playfair_Display, Inter } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
});

const SilverJubileeFormBanner = () => {
  return (
    <div className="relative w-full h-32 md:h-40 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/theme/themebackgroundonly.jpg"
        alt="Silver Jubilee Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-12 py-4 md:py-6 h-full flex items-center gap-6 md:gap-8">
        {/* Left Side - Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/theme/silverjubileelogo.png"
            alt="Silver Jubilee Logo"
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
          />
        </div>

        {/* Center - Text */}
        <div className="flex-1 text-center">
          <h1
            className={`${playfairDisplay.className} text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 drop-shadow-lg tracking-wide`}
          >
            National Ideal College Silver Jubilee
          </h1>
          <p
            className={`${inter.className} text-xs md:text-sm lg:text-base font-light text-white/90 drop-shadow-md tracking-wider`}
          >
            organized by National Ideal College Alumni Association
          </p>
        </div>
      </div>
    </div>
  );
};

export default SilverJubileeFormBanner;
