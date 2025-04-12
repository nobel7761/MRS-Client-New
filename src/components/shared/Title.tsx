import React from "react";

const Title = ({ text, className }: { text?: string; className?: string }) => {
  return (
    <p
      className={`text-center md:text-5xl text-3xl font-extrabold md:py-10 py-5 ${className}`}
    >
      {text}
    </p>
  );
};

export default Title;
