import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface MarqueeItem {
  source: string;
}

interface MarqueeScrollerProps {
  options: MarqueeItem[];
  speed?: number;
}

const MarqueeScroller: React.FC<MarqueeScrollerProps> = ({
  options,
  speed = 50,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const containerWidth = container.offsetWidth;
    const contentWidth = content.offsetWidth;

    // Clone the content to create seamless loop
    const clone = content.cloneNode(true) as HTMLDivElement;
    container.appendChild(clone);

    let position = 0;

    const animate = () => {
      position -= 1;
      if (position <= -contentWidth) {
        position = 0;
      }
      container.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [options]);

  return (
    <div className="relative overflow-hidden bg-secondary py-8">
      <div
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ transition: "transform 0.1s linear" }}
      >
        <div ref={contentRef} className="flex items-center">
          {options.map((item, index) => (
            <div key={index} className="relative h-12 w-32 mx-20 flex-shrink-0">
              <Image
                src={item.source}
                alt={`Client logo ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 128px) 100vw, 128px"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center">
          {options.map((item, index) => (
            <div
              key={`clone-${index}`}
              className="relative h-12 w-32 mx-20 flex-shrink-0"
            >
              <Image
                src={item.source}
                alt={`Client logo ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 128px) 100vw, 128px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeScroller;
