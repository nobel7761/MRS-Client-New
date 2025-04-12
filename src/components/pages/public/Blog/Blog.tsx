import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import CustomContainer from "@/components/shared/Container";

import Link from "next/link";
import Image from "next/image";
import { blogData } from "@/assets/information";
import Title from "@/components/shared/Title";

const Blog = () => {
  return (
    <div className="pb-10 bg-backgroundColor">
      <CustomContainer>
        <>
          <Title text="Blogs" />
          <>
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Autoplay]}
              className="mySwiper"
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              breakpoints={{
                // when window width is >= 320px (mobile)
                320: {
                  slidesPerView: 1,
                },
                // when window width is >= 768px (tablet and above)
                768: {
                  slidesPerView: 3,
                },
              }}
            >
              {blogData.map((blog, index) => (
                <SwiperSlide key={index}>
                  <div>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="text-base font-extrabold pb-4 hover:text-primary"
                      target="_blank"
                    >
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        height={2400}
                        width={2400}
                        className="md:rounded-[30px] rounded-md object-cover mix-blend-overlay"
                      />
                    </Link>

                    <div className="p-4">
                      <Link
                        href={`/blog/${blog.id}`}
                        className="text-base font-extrabold pb-4 hover:text-primary"
                        target="_blank"
                      >
                        {blog.title.length > 60
                          ? blog.title.substring(0, 60) + "..."
                          : blog.title}
                      </Link>
                      <p className="text-xs mt-4 mb-8">
                        {blog.description.length > 220
                          ? blog.description.substring(0, 210) + "..."
                          : blog.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        </>
      </CustomContainer>
    </div>
  );
};

export default Blog;
