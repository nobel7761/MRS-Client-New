import Image from "next/image";

const BottomSection = () => {
  return (
    <div className="md:flex">
      <Image
        src="/mrs/smiling-housekeeper-in-uniform-holding-stack-of-towels-happy-female-housemaid-or-janitor-working-in-hotel-housekeeping.png"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="md:w-[25%] md:-ml-20"
      />
      <Image
        src="/mrs/old-care.png"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="md:w-[25%]"
      />
      <Image
        src="/mrs/waiter-restaurant-workers-man-and-woman.png"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="md:w-[25%]"
      />
      <Image
        src="/mrs/cleaner.png"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="md:w-[25%]"
      />
      <Image
        src="/mrs/security-guard.png"
        alt="top-section-photo"
        height={1200}
        width={1200}
        className="md:w-1/5"
      />
    </div>
  );
};

export default BottomSection;
