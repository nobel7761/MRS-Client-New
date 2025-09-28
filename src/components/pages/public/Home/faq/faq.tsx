import AnimatedButton from "@/components/shared/custom-components/animated-button";
import CustomDotTitle from "@/components/shared/custom-components/dot-title";
import { archivo } from "@/lib/fonts";
import backgroundImage from "@/public/background.jpg";
import faqBackgroundImage from "@/public/faqs/faqs-bg.svg";
import Image from "next/image";
import faqsImage from "@/public/faqs/faqs-image.jpg";
import { SpinningLogo } from "../AboutUs/AboutUsHome";
import BrandLogo from "@/components/shared/brand-logo/brand-logo";
import {
  useState as useLocalState,
  useRef,
  useEffect as useLocalEffect,
} from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { useApi } from "@/hooks/useApi";
import { FAQ, HomePageFAQ } from "@/types/faq";

const SpinningComponent = ({
  outerCircleColor,
}: {
  outerCircleColor?: string;
}) => {
  return (
    <div className="relative w-[220px] h-[220px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-[15px] rounded-full bg-cover bg-center bg-no-repeat animate-[infiniterotate_20s_infinite_linear]"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      />
      <div className="absolute inset-[15px] flex items-center justify-center">
        <BrandLogo imageClassName="w-[85px] h-[85px]" />
      </div>
      <div className="absolute inset-0 rounded-full border-[15px] border-[#FAFAFA]" />
      <svg
        className="absolute inset-0 animate-[infiniterotate_20s_infinite_linear] pointer-events-none"
        viewBox="0 0 220 220"
        width="220"
        height="220"
      >
        <path
          id="textPath"
          d="M 110,110 m -80,0 a 80,80 0 1,0 160,0 a 80,80 0 1,0 -160,0"
          fill="none"
        />
        <text
          fill="white"
          fontSize="16"
          fontWeight="700"
          style={{ letterSpacing: 3, fontFamily: "Archivo" }}
        >
          <textPath href="#textPath" startOffset="50%" textAnchor="middle">
            National Ideal College Alumni Association
          </textPath>
        </text>
      </svg>
    </div>
  );
};

// Static FAQ data as fallback
const staticFaqData: HomePageFAQ[] = [
  {
    id: 1,
    question: "How do I get started with your services?",
    answer:
      "We offer a range of HR solutions, including recruitment services, employee training and development, compliance support, and strategic workforce planning. Our team will work with you to understand your specific needs and create a customized solution. Our team will work with you to understand your.",
  },
  {
    id: 2,
    question: "What services does your HR agency provide?",
    answer:
      "We offer a comprehensive range of HR solutions, including recruitment services, employee training and development, compliance support, strategic workforce planning, payroll solutions, and employee engagement programs.",
  },
  {
    id: 3,
    question: "How do I apply for a job through your platform?",
    answer:
      "We offer a range of HR solutions, including recruitment services, employee training and development. Our platform connects talented professionals with opportunities that match their skills and career goals.",
  },
  {
    id: 4,
    question: "Do you offer employee training programs?",
    answer:
      "Yes, we offer comprehensive employee training and development programs designed to enhance skills, improve performance, and support career growth. Our programs are tailored to meet the specific needs of your organization.",
  },
  {
    id: 5,
    question: "What industries do you specialize in?",
    answer:
      "We offer a range of HR solutions, including recruitment services, employee training and development. Our expertise spans across various industries, ensuring we can meet the unique needs of different sectors.",
  },
];

// FAQ Accordion Item Component
const FAQAccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: HomePageFAQ;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const [expanded, setExpanded] = useLocalState(false);
  const [showReadMore, setShowReadMore] = useLocalState(false);
  const answerRef = useRef<HTMLParagraphElement>(null);

  useLocalEffect(() => {
    if (isOpen && answerRef.current) {
      // Check if the answer overflows 4 lines
      const el = answerRef.current;
      // Get computed line height
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 4;
      setShowReadMore(el.scrollHeight > maxHeight + 2); // +2 for rounding
    } else {
      setShowReadMore(false);
      setExpanded(false);
    }
  }, [isOpen, item.answer]);

  return (
    <div className="mb-2">
      <div
        className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-in-out`}
      >
        {/* Background Image Layer */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out ${
            isOpen ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ backgroundImage: `url(${backgroundImage.src})` }}
        ></div>

        {/* Content Layer */}
        <div className="relative z-10">
          <button
            className="w-full p-6 text-left flex justify-between items-center transition-all duration-500 ease-in-out"
            onClick={onToggle}
          >
            <h3
              className={`$
                archivo.semibold600.className
              } text-lg pr-4 transition-colors duration-500 ${
                isOpen ? "text-white" : "text-gray-900"
              }`}
            >
              {item.question}
            </h3>
            <div className="flex-shrink-0">
              <div className="relative w-6 h-6">
                <div
                  className={`absolute inset-0 bg-primary transform transition-all duration-500 ease-in-out rounded-lg ${
                    isOpen ? "rotate-180 translate-y-1" : "translate-y-0"
                  }`}
                ></div>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                    isOpen ? "translate-y-1" : "translate-y-0"
                  }`}
                >
                  {isOpen ? (
                    <MdKeyboardArrowUp className="w-6 h-6 text-white" />
                  ) : (
                    <MdKeyboardArrowDown className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 pb-6">
              <p
                ref={answerRef}
                className={`${
                  archivo.regular400.className
                } text-white leading-relaxed whitespace-pre-line break-words ${
                  !expanded ? "line-clamp-4" : ""
                }`}
                style={{ WebkitLineClamp: !expanded ? 4 : undefined }}
              >
                {item.answer}
              </p>
              {isOpen && showReadMore && (
                <button
                  className="mt-2 text-sm text-primary underline focus:outline-none"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQComponent = () => {
  const [openItem, setOpenItem] = useLocalState<number | null>(2); // Second item open by default
  const [faqData, setFaqData] = useLocalState<HomePageFAQ[]>([]);

  // Fetch FAQs from API
  const {
    data: apiFaqs,
    loading,
    error,
  } = useApi<FAQ[]>({
    url: "/faqs/homepage",
  });

  // Process API data and combine with static data if needed
  useLocalEffect(() => {
    if (apiFaqs && apiFaqs.length > 0) {
      // Convert API FAQs to HomePageFAQ format
      const apiFaqsFormatted: HomePageFAQ[] = apiFaqs.map((faq, index) => ({
        id: index + 1,
        question: faq.question,
        answer: faq.answer,
      }));

      // If we have less than 5 FAQs from API, fill with static data
      if (apiFaqsFormatted.length < 5) {
        const remainingCount = 5 - apiFaqsFormatted.length;
        const staticFaqsToAdd = staticFaqData
          .slice(0, remainingCount)
          .map((faq, index) => ({
            ...faq,
            id: apiFaqsFormatted.length + index + 1,
          }));
        setFaqData([...apiFaqsFormatted, ...staticFaqsToAdd]);
      } else {
        setFaqData(apiFaqsFormatted);
      }
    } else if (!loading && !error) {
      // If no API data and not loading, use static data
      setFaqData(staticFaqData);
    } else if (error) {
      // If there's an error, use static data
      setFaqData(staticFaqData);
      console.error("Error fetching FAQs from API:", error);
    }
  }, [apiFaqs, loading, error]);

  const handleToggle = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div
      className="bg-[#FAFAFA] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${faqBackgroundImage.src})` }}
    >
      <div className="max-w-[1300px] mx-auto md:py-24 md:px-[15px]">
        <CustomDotTitle
          title="FAQ"
          dotColor="bg-[#D00101]"
          className={`${archivo.medium500.className} text-primary uppercase text-sm`}
        />

        <div className="flex justify-between items-center">
          <p
            className={`w-1/2 ${archivo.semibold600.className} text-black md:text-[2.7rem] text-[1.8rem] md:leading-[3rem] tracking-[-0.02em] my-5`}
          >
            FAQs about{" "}
            <span className="text-primary">
              National Ideal College Alumni Association
            </span>
          </p>

          <p className="w-1/2 flex justify-end">
            <AnimatedButton
              route="/faqs"
              text="View All FAQs"
              textColor="text-white"
              buttonBgColor="bg-primary"
              iconBgColor="bg-secondary"
              iconColor="text-black"
              hoverButtonBgColor="bg-black"
              hoverIconBgColor="bg-white"
              className="md:w-fit w-full flex justify-center"
              showBackgroundImage={true}
            />
          </p>
        </div>

        <div className="flex justify-between gap-x-10">
          {/* left side */}
          <div className="md:w-1/2 w-full relative">
            <Image
              src={faqsImage}
              width={1000}
              height={1000}
              alt="faq"
              className="w-[90%] mt-[1.2rem] rounded-[20px] aspect-[1/1.034] object-cover"
            />

            <div className="absolute top-0 right-0">
              <SpinningComponent outerCircleColor="bg-transparent" />
            </div>
          </div>
          {/* right side - FAQ Accordion */}
          <div
            className="md:w-1/2 w-full flex flex-col justify-center"
            style={{ minHeight: "600px" }}
          >
            <div className="">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : faqData.length > 0 ? (
                faqData.map((item) => (
                  <FAQAccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openItem === item.id}
                    onToggle={() => handleToggle(item.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No FAQs available at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
