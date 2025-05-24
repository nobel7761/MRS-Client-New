import Link from "next/link";
import React from "react";

interface TitleSectionProps {
  title: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title }) => {
  return (
    <div className="max-w-[1300px] px-[15px] mx-auto py-24">
      <p className="text-white text-4xl font-bold text-center">{title}</p>
      <p className="text-white text-xl font-bold text-center pt-6">
        <Link href="/" className="hover:text-secondary">
          Home
        </Link>{" "}
        / {title}
      </p>
    </div>
  );
};

export default TitleSection;
