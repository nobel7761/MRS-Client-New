"use client";

import { useState, useEffect } from "react";
import CustomDotTitle from "@/components/shared/custom-components/dot-title";
import { archivo } from "@/lib/fonts";
import faqBackgroundImage from "@/public/faqs/faqs-bg.svg";

const AboutUsComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="bg-[#FAFAFA] bg-cover bg-center bg-no-repeat overflow-hidden relative min-h-screen flex items-center"
        style={{ backgroundImage: `url(${faqBackgroundImage.src})` }}
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/90 via-primary/5 to-blue-500/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Elements */}
        <div
          className="absolute top-32 left-16 w-4 h-4 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-64 right-32 w-6 h-6 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-3 h-3 bg-green-500 rounded-full animate-bounce"
          style={{ animationDelay: "5s" }}
        ></div>

        <div className="max-w-[1300px] mx-auto md:py-8 md:px-[15px] relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div
              className={`transition-all duration-1500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-20"
              }`}
            >
              <h1
                className={`mt-8 ${archivo.semibold600.className} text-black md:text-[3.5rem] text-[2.2rem] md:leading-[4rem] tracking-[-0.02em] my-8 leading-tight`}
              >
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-600 to-red-800 animate-pulse">
                  National Ideal College Alumni Association
                </span>
              </h1>

              {/* Enhanced Statistics */}
              <div className="flex items-center mb-10 group">
                <div className="bg-gradient-to-br from-primary to-red-600 text-white px-8 py-4 rounded-3xl font-bold text-4xl mr-8 shadow-2xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">8</span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    Years of Excellence
                  </div>
                  <div className="text-gray-600 text-lg">
                    Building stronger communities together
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-lg">
                We connect alumni with opportunity, fostering growth, success,
                and a brighter future for our community and beyond.
              </p>
            </div>

            <div
              className={`relative transition-all duration-1500 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-20"
              }`}
            >
              <div className="relative group">
                {/* Main Card */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl"></div>
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="text-white text-6xl relative z-10">
                          🎓
                        </span>
                      </div>
                      <h3
                        className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-4`}
                      >
                        Our Mission
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        To unite alumni, foster growth, and create lasting
                        impact in our community through meaningful connections
                        and shared values.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          10K+
                        </div>
                        <div className="text-sm text-gray-600">Alumni</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          8
                        </div>
                        <div className="text-sm text-gray-600">Years</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "2s" }}
                >
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <div
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "4s" }}
                >
                  <span className="text-white text-xl">💎</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Breadcrumb */}
          {/* <div className="absolute top-8 right-8">
            <nav className="text-sm">
              <ol className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <li>
                  <a
                    href="/"
                    className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    home
                  </a>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <span className="text-primary font-semibold">about us</span>
                </li>
              </ol>
            </nav>
          </div> */}
        </div>
      </section>

      {/* Vision/Mission Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Elements */}
        <div
          className="absolute top-20 left-20 w-3 h-3 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-40 right-40 w-4 h-4 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-40 left-40 w-2 h-2 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: "5s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block mb-6">
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 px-6 py-3 rounded-full">
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    Foundation
                  </span>
                </div>
              </div>
              <h2
                className={`${
                  archivo.semibold600.className
                } text-5xl lg:text-6xl font-bold text-gray-900 mb-8 transition-all duration-1500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
              >
                Our Vision, Mission &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Values
                </span>
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed transition-all duration-1500 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
              >
                The foundation of our community and the principles that guide
                our every action towards building a stronger, more connected
                alumni network
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10 items-stretch">
              {/* Vision Card */}
              <div
                className={`group relative transition-all duration-1500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full blur-xl"></div>

                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="text-white text-4xl relative z-10">
                      👁️
                    </span>
                  </div>

                  <h3
                    className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-500`}
                  >
                    Our Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    To build a lifelong, supportive community of National Ideal
                    College alumni, dedicated to personal growth, social
                    responsibility, and strengthening the legacy of our alma
                    mater.
                  </p>
                </div>
              </div>

              {/* Mission Card */}
              <div
                className={`group relative transition-all duration-1500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full blur-xl"></div>

                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="text-white text-4xl relative z-10">
                      🎯
                    </span>
                  </div>

                  <h3
                    className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-500`}
                  >
                    Our Mission
                  </h3>
                  <ul className="text-gray-700 space-y-4">
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <span>Unite alumni under one recognized platform</span>
                    </li>
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <span>
                        Foster mentorship, networking, and career development
                      </span>
                    </li>
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <span>Organize impactful events and reunions</span>
                    </li>
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">4</span>
                      </div>
                      <span>Serve society through humanitarian aid</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Values Card */}
              <div
                className={`group relative transition-all duration-1500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full blur-xl"></div>

                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="text-white text-4xl relative z-10">
                      💎
                    </span>
                  </div>

                  <h3
                    className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-6 group-hover:text-purple-600 transition-colors duration-500`}
                  >
                    Core Values
                  </h3>
                  <ul className="text-gray-700 space-y-3">
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">C</span>
                      </div>
                      <span>
                        <strong>Commitment</strong> – Staying connected to our
                        college
                      </span>
                    </li>
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">I</span>
                      </div>
                      <span>
                        <strong>Integrity</strong> – Acting with honesty and
                        fairness
                      </span>
                    </li>
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <span>
                        <strong>Service</strong> – Giving back to society
                      </span>
                    </li>
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">E</span>
                      </div>
                      <span>
                        <strong>Excellence</strong> – Striving for quality
                      </span>
                    </li>
                    <li className="flex items-start group/item">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 mt-1 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xs font-bold">C</span>
                      </div>
                      <span>
                        <strong>Collaboration</strong> – Building bridges
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`${
                  archivo.semibold600.className
                } text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                What We Do
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Our comprehensive activities and services that strengthen the
                alumni community and serve society
              </p>
            </div>

            {/* Main Activities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: "🎉",
                  title: "Alumni Reunions & Events",
                  desc: "Organize annual reunions, Iftar Mahfils, and cultural events that bring our community together",
                  color: "from-pink-50 to-pink-100",
                  iconBg: "bg-pink-500",
                },
                {
                  icon: "🎓",
                  title: "Student Mentorship",
                  desc: "Guide current students in education, career development, and extracurricular activities",
                  color: "from-blue-50 to-blue-100",
                  iconBg: "bg-blue-500",
                },
                {
                  icon: "🤝",
                  title: "Crisis Support",
                  desc: "Support alumni families during difficult times with financial aid, healthcare, and essentials",
                  color: "from-green-50 to-green-100",
                  iconBg: "bg-green-500",
                },
                {
                  icon: "🚑",
                  title: "Humanitarian Aid",
                  desc: "Provide emergency relief during disasters like pandemics, floods, and other crises",
                  color: "from-red-50 to-red-100",
                  iconBg: "bg-red-500",
                },
                {
                  icon: "🏛️",
                  title: "Campus Partnerships",
                  desc: "Collaborate with student clubs (Debating, Science, Sports, Arts) to strengthen campus culture",
                  color: "from-purple-50 to-purple-100",
                  iconBg: "bg-purple-500",
                },
                {
                  icon: "🌐",
                  title: "Professional Networks",
                  desc: "Build and maintain professional networks among alumni across diverse industries",
                  color: "from-indigo-50 to-indigo-100",
                  iconBg: "bg-indigo-500",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${
                    activity.color
                  } p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`w-16 h-16 ${activity.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">{activity.icon}</span>
                  </div>
                  <h3
                    className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300`}
                  >
                    {activity.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {activity.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Impact Highlights */}
            <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <h3
                  className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-8 text-center`}
                >
                  Our Impact in Numbers
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { number: "10,000+", label: "Alumni Members", icon: "👥" },
                    {
                      number: "1,500+",
                      label: "People Helped in 2024 Floods",
                      icon: "🌊",
                    },
                    {
                      number: "1,000+",
                      label: "Largest Reunion Gathering",
                      icon: "🎊",
                    },
                    { number: "6", label: "Homes Rebuilt", icon: "🏠" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <div
                        className={`${archivo.semibold600.className} text-3xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-300`}
                      >
                        {stat.number}
                      </div>
                      <div className="text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History & Achievements Timeline */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`${
                  archivo.semibold600.className
                } text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Our Journey Through Time
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                From humble beginnings to becoming a recognized force for
                positive change
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-blue-500 to-green-500 rounded-full"></div>

              {/* Timeline items */}
              <div className="space-y-16">
                {/* 2016 - Foundation */}
                <div
                  className={`flex items-center justify-between transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                >
                  <div className="w-5/12 text-right pr-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="flex items-center justify-end mb-4">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                        <span
                          className={`${archivo.semibold600.className} text-2xl font-bold text-blue-600`}
                        >
                          2016
                        </span>
                      </div>
                      <h3
                        className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 mb-3`}
                      >
                        Foundation
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Founded as Ex-Students Association. Hosted the
                        first-ever alumni event in college history:
                        <span className="font-semibold text-blue-600">
                          {" "}
                          Iftar Mahfil with 827 alumni
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="w-2/12 flex justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                  </div>

                  <div className="w-5/12"></div>
                </div>

                {/* 2020 - Official Recognition */}
                <div
                  className={`flex items-center justify-between transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <div className="w-5/12"></div>

                  <div className="w-2/12 flex justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                  </div>

                  <div className="w-5/12 text-left pl-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="flex items-center mb-4">
                        <span
                          className={`${archivo.semibold600.className} text-2xl font-bold text-green-600`}
                        >
                          2020
                        </span>
                        <div className="w-4 h-4 bg-green-500 rounded-full ml-4"></div>
                      </div>
                      <h3
                        className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 mb-3`}
                      >
                        Official Recognition
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Officially recognized as NICAA by the college governing
                        body. Organized the first full-scale reunion with
                        <span className="font-semibold text-green-600">
                          {" "}
                          1,000+ alumni
                        </span>
                      </p>
                      <div className="bg-white/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Title sponsor:</span>{" "}
                          PRAN-RFL Group
                          <br />
                          <span className="font-semibold">
                            Chief Guest:
                          </span>{" "}
                          Honorable MP Saber Hossain Chawdhury
                          <br />
                          <span className="font-semibold">
                            Live concert by:
                          </span>{" "}
                          Shironamhin
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2020 COVID-19 Response */}
                <div
                  className={`flex items-center justify-between transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                  style={{ transitionDelay: "700ms" }}
                >
                  <div className="w-5/12 text-right pr-8">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="flex items-center justify-end mb-4">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
                        <span
                          className={`${archivo.semibold600.className} text-2xl font-bold text-red-600`}
                        >
                          2020
                        </span>
                      </div>
                      <h3
                        className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 mb-3`}
                      >
                        COVID-19 Response
                      </h3>
                      <ul className="text-gray-700 space-y-2">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Telemedicine services
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Financial & medical aid to struggling families
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Grocery & Eid essentials distribution
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="w-2/12 flex justify-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                  </div>

                  <div className="w-5/12"></div>
                </div>

                {/* 2024 Flood Relief */}
                <div
                  className={`flex items-center justify-between transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{ transitionDelay: "900ms" }}
                >
                  <div className="w-5/12"></div>

                  <div className="w-2/12 flex justify-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                  </div>

                  <div className="w-5/12 text-left pl-8">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="flex items-center mb-4">
                        <span
                          className={`${archivo.semibold600.className} text-2xl font-bold text-purple-600`}
                        >
                          2024
                        </span>
                        <div className="w-4 h-4 bg-purple-500 rounded-full ml-4"></div>
                      </div>
                      <h3
                        className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 mb-3`}
                      >
                        Flood Relief in Cumilla, Feni, Laxmipur
                      </h3>
                      <ul className="text-gray-700 space-y-2 mb-4">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Free medical treatment & medicines for{" "}
                          <span className="font-semibold text-purple-600">
                            1,500+ victims
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Rebuilt homes for{" "}
                          <span className="font-semibold text-purple-600">
                            6 affected families
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Featured on{" "}
                          <span className="font-semibold text-purple-600">
                            Jamuna TV & Desh TV
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`${
                  archivo.semibold600.className
                } text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Our Leadership Team
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Dedicated leaders driving NICAA's mission forward
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "President",
                  position: "Leadership & Vision",
                  initials: "P",
                  color: "from-red-50 to-red-100",
                  iconBg: "bg-red-500",
                  description:
                    "Leading NICAA's strategic direction and community engagement",
                },
                {
                  name: "General Secretary",
                  position: "Operations & Coordination",
                  initials: "GS",
                  color: "from-blue-50 to-blue-100",
                  iconBg: "bg-blue-500",
                  description:
                    "Managing day-to-day operations and member coordination",
                },
                {
                  name: "Vice Presidents",
                  position: "Regional Coordination",
                  initials: "VP",
                  color: "from-green-50 to-green-100",
                  iconBg: "bg-green-500",
                  description:
                    "Overseeing regional activities and member engagement",
                },
                {
                  name: "Treasurer",
                  position: "Financial Management",
                  initials: "T",
                  color: "from-purple-50 to-purple-100",
                  iconBg: "bg-purple-500",
                  description:
                    "Managing finances and ensuring transparent accounting",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${
                    member.color
                  } p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                        <div
                          className={`w-16 h-16 ${member.iconBg} rounded-2xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <span className="text-white font-bold text-xl">
                            {member.initials}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3
                      className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300`}
                    >
                      {member.name}
                    </h3>
                    <p className="text-gray-600 font-medium mb-3">
                      {member.position}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {member.description}
                    </p>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Executive Committee Note */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
                <h3
                  className={`${archivo.semibold600.className} text-2xl font-bold text-gray-900 mb-4`}
                >
                  Executive Committee Members
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Our dedicated executive committee members work tirelessly to
                  support NICAA's mission, organize events, and maintain strong
                  connections within our alumni community.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    "Event Coordination",
                    "Member Relations",
                    "Communications",
                    "Student Affairs",
                    "Community Outreach",
                    "Technology",
                  ].map((role, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors duration-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Network Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`${
                  archivo.semibold600.className
                } text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Our Alumni Network
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                10,000+ alumni across Bangladesh and abroad, making their mark
                in diverse industries
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🎵",
                  title: "Music & Arts",
                  desc: "Lead vocalist of Arbovirus, other cultural icons",
                  color: "from-pink-50 to-pink-100",
                  iconBg: "bg-pink-500",
                },
                {
                  icon: "🎓",
                  title: "Academia",
                  desc: "Faculty members at prestigious universities",
                  color: "from-blue-50 to-blue-100",
                  iconBg: "bg-blue-500",
                },
                {
                  icon: "💼",
                  title: "Corporate & Business",
                  desc: "Leaders in multinational companies",
                  color: "from-green-50 to-green-100",
                  iconBg: "bg-green-500",
                },
                {
                  icon: "📺",
                  title: "Media & Public Service",
                  desc: "Influential professionals in journalism and administration",
                  color: "from-purple-50 to-purple-100",
                  iconBg: "bg-purple-500",
                },
                {
                  icon: "💻",
                  title: "Tech & Entrepreneurship",
                  desc: "Founders, thought leaders, and innovators",
                  color: "from-indigo-50 to-indigo-100",
                  iconBg: "bg-indigo-500",
                },
                {
                  icon: "🏥",
                  title: "Healthcare",
                  desc: "Medical professionals and healthcare leaders",
                  color: "from-red-50 to-red-100",
                  iconBg: "bg-red-500",
                },
                {
                  icon: "⚖️",
                  title: "Legal & Finance",
                  desc: "Lawyers, judges, and financial experts",
                  color: "from-yellow-50 to-yellow-100",
                  iconBg: "bg-yellow-500",
                },
                {
                  icon: "🌍",
                  title: "International",
                  desc: "Alumni working and living abroad",
                  color: "from-teal-50 to-teal-100",
                  iconBg: "bg-teal-500",
                },
              ].map((industry, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${
                    industry.color
                  } p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-12 h-12 ${industry.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-2xl">{industry.icon}</span>
                  </div>
                  <h3
                    className={`${archivo.semibold600.className} text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300`}
                  >
                    {industry.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {industry.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-red-600 to-red-700 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`${
                  archivo.semibold600.className
                } text-4xl lg:text-5xl font-bold mb-6 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                NICAA by the Numbers
              </h2>
              <p
                className={`text-xl opacity-90 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Our impact and growth in numbers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                {
                  number: "2016",
                  label: "Year Established",
                  icon: "🏛️",
                  description: "Founded as Ex-Students Association",
                },
                {
                  number: "2020",
                  label: "Official Recognition",
                  icon: "✅",
                  description: "Recognized by college governing body",
                },
                {
                  number: "10,000+",
                  label: "Alumni Members",
                  icon: "👥",
                  description: "Across Bangladesh and abroad",
                },
                {
                  number: "1,000+",
                  label: "Largest Gathering",
                  icon: "🎊",
                  description: "2020 Reunion attendees",
                },
                {
                  number: "1,500+",
                  label: "People Helped",
                  icon: "🌊",
                  description: "During 2024 flood relief",
                },
                {
                  number: "6",
                  label: "Homes Rebuilt",
                  icon: "🏠",
                  description: "For affected families",
                },
                {
                  number: "10+",
                  label: "Major Events",
                  icon: "🎉",
                  description: "Reunions & Iftar Mahfils",
                },
                {
                  number: "100%",
                  label: "Community Focus",
                  icon: "❤️",
                  description: "Dedicated to service",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group hover:scale-105 transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div
                      className={`${archivo.semibold600.className} text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300`}
                    >
                      {stat.number}
                    </div>
                    <div className="text-lg font-medium mb-2">{stat.label}</div>
                    <div className="text-sm opacity-80">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`${
                  archivo.semibold600.className
                } text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                What Our Alumni Say
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Real stories from our community members about their NICAA
                experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alumni Member",
                  position: "Class of 2010",
                  quote:
                    "NICAA gave me the opportunity to reconnect with my roots and contribute to society during the pandemic. It's more than an alumni group—it's a family.",
                  color: "from-blue-50 to-blue-100",
                  icon: "👨‍💼",
                },
                {
                  name: "Alumni Member",
                  position: "Class of 2015",
                  quote:
                    "From reunions to relief work, NICAA proves that alumni can make a difference both inside and outside the campus. Proud to be part of this community.",
                  color: "from-green-50 to-green-100",
                  icon: "👩‍🎓",
                },
                {
                  name: "Alumni Member",
                  position: "Class of 2012",
                  quote:
                    "The mentorship programs and networking opportunities through NICAA have been invaluable for my career growth. The support system is incredible.",
                  color: "from-purple-50 to-purple-100",
                  icon: "👨‍🎨",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${
                    testimonial.color
                  } p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {testimonial.icon}
                  </div>
                  <div className="text-4xl text-primary mb-4 opacity-60">"</div>
                  <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-gray-200/50 pt-4">
                    <h4
                      className={`${archivo.semibold600.className} font-semibold text-gray-900 text-lg mb-1`}
                    >
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 font-medium">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-red-600 to-red-700 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`${
                archivo.semibold600.className
              } text-4xl lg:text-5xl font-bold mb-6 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Join the NICAA Community
            </h2>
            <p
              className={`text-xl mb-8 opacity-90 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Be part of a community that makes a difference. Connect with
              fellow alumni, contribute to society, and help shape the future of
              National Ideal College.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl">
                Become a Member
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsComponent;
