"use client";

import { useState, useEffect } from "react";
import { archivo } from "@/lib/fonts";
import faqBackgroundImage from "@/public/faqs/faqs-bg.svg";
import backgroundImage from "@/public/background.jpg";
import photo from "@/public/1.png";

const TeamComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const teamData = [
    {
      name: "ABCD",
      designation: "President, NICAA",
      photo: photo.src,
      mobile: "+8801711000000",
      facebook: "https://facebook.com/abcd",
      instagram: "https://instagram.com/abcd",
      linkedin: "https://linkedin.com/in/abcd",
      email: "abcd@example.com",
    },
    {
      name: "XYZ",
      designation: "General Secretary, NICAA",
      photo: photo.src,
      mobile: "+8801711000001",
      facebook: "https://facebook.com/xyz",
      instagram: "https://instagram.com/xyz",
      linkedin: "https://linkedin.com/in/xyz",
      email: "xyz@example.com",
    },
    {
      name: "Mahfuz Ahmed",
      designation: "Treasurer, NICAA",
      photo: photo.src,
      mobile: "+8801711000002",
      facebook: "https://facebook.com/mahfuz",
      instagram: "https://instagram.com/mahfuz",
      linkedin: "https://linkedin.com/in/mahfuz",
      email: "mahfuz@example.com",
    },
    {
      name: "Farhana Akter",
      designation: "Event Coordinator, NICAA",
      photo: photo.src,
      mobile: "+8801711000003",
      facebook: "https://facebook.com/farhana",
      instagram: "https://instagram.com/farhana",
      linkedin: "https://linkedin.com/in/farhana",
      email: "farhana@example.com",
    },
  ];

  return (
    <div className="min-h-screen">
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

        <div className="max-w-[1300px] mx-auto md:py-24 md:px-[15px] relative z-10">
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
                Meet Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-600 to-red-800 animate-pulse">
                  Leadership
                </span>
              </h1>

              {/* Main Content */}
              <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-lg">
                Our dedicated team of leaders works tirelessly to serve the
                NICAA community. Meet the individuals who guide our mission and
                vision forward.
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
                <div className="relative bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-4">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-red-600/20 rounded-full blur-xl"></div>

                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="text-white text-6xl relative z-10">
                        👥
                      </span>
                    </div>
                    <h3
                      className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-4`}
                    >
                      Leadership Team
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Elected in 2020, our dedicated team leads NICAA with
                      passion and commitment.
                    </p>
                  </div>

                  {/* Team Stats */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      5 Leaders
                    </div>
                    <div className="text-sm text-gray-600">
                      Guiding our community
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
                  <span className="text-white text-xl">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Hierarchy Section */}
      <section className="py-20 bg-white relative">
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 "></div>

        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
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
                    Leadership Structure
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
                Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Team Hierarchy
                </span>
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed transition-all duration-1500 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
              >
                Elected in 2020, our leadership team represents the best of
                NICAA's alumni community.
              </p>
            </div>

            {/* Organizational Chart */}
            <div className="relative">
              {/* Chief Advisor */}
              <div
                className={`flex justify-center mb-16 transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="relative group">
                  {/* Profile Card */}
                  <div className="relative w-80 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    {/* Transparent top section with person's head and shoulders */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"
                      alt="Dr. Ahmed Rahman"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />

                    {/* Overlay Card */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-r from-blue-200 to-green-200 rounded-b-3xl p-6 flex flex-col justify-center">
                      <h3
                        className={`${archivo.semibold600.className} text-2xl font-bold text-gray-900 text-center mb-2`}
                      >
                        Dr. Ahmed Rahman
                      </h3>
                      <p className="text-gray-700 text-center mb-4 font-medium">
                        Chief Advisor
                      </p>

                      {/* Social Media Icons */}
                      <div className="flex justify-center space-x-4">
                        <a
                          href="#"
                          className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                        >
                          <span className="text-white text-xs font-bold">
                            f
                          </span>
                        </a>
                        <a
                          href="#"
                          className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors duration-300"
                        >
                          <span className="text-white text-xs">🐦</span>
                        </a>
                        <a
                          href="#"
                          className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center hover:from-orange-500 hover:to-pink-600 transition-colors duration-300"
                        >
                          <span className="text-white text-xs">📷</span>
                        </a>
                        <a
                          href="#"
                          className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
                        >
                          <span className="text-white text-xs">▶</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leadership Team */}
              <div
                className={`grid md:grid-cols-2 lg:grid-cols-4 gap-16 transition-all duration-1000 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                {teamData.map((member, index) => {
                  return (
                    <div key={index} className="relative group mb-20">
                      <div
                        className={`relative w-60 h-72 rounded-3xl shadow-xl bg-cover bg-center bg-no-repeat`}
                        style={{
                          backgroundImage: `url(${backgroundImage.src})`,
                        }}
                      >
                        {/* Background-less photo */}
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="absolute inset-0 w-full h-full object-cover object-top rounded-3xl group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Card half inside and half outside the image - disappears on hover */}
                        <div className="absolute h-40 -bottom-20 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 z-10 group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-500">
                          <h4
                            className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 text-center mb-2`}
                          >
                            {member.name}
                          </h4>
                          <p
                            className={`text-center mb-4 text-sm font-semibold`}
                          >
                            {member.designation}
                          </p>

                          {/* All Icons in One Line */}
                          <div className="flex justify-center space-x-3 mb-4">
                            <a
                              href={`tel:${member.mobile}`}
                              className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
                              title={`Call ${member.mobile}`}
                            >
                              <span className="text-white text-sm">📞</span>
                            </a>
                            <a
                              href={`mailto:${member.email}`}
                              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                              title={`Email ${member.email}`}
                            >
                              <span className="text-white text-sm">✉️</span>
                            </a>
                            <a
                              href={member.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                            >
                              <span className="text-white text-sm font-bold">
                                f
                              </span>
                            </a>
                            <a
                              href={member.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center hover:from-orange-500 hover:to-pink-600 transition-colors duration-300"
                            >
                              <span className="text-white text-sm">📷</span>
                            </a>
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors duration-300"
                            >
                              <span className="text-white text-sm font-bold">
                                in
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
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
                Our Leadership Values
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                Guided by principles that strengthen our community
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Integrity */}
              <div
                className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">⚖️</span>
                </div>
                <h3
                  className={`${archivo.semibold600.className} text-2xl font-bold text-gray-900 mb-4`}
                >
                  Integrity
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We lead with honesty, transparency, and ethical
                  decision-making in all our actions.
                </p>
              </div>

              {/* Service */}
              <div
                className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">🤝</span>
                </div>
                <h3
                  className={`${archivo.semibold600.className} text-2xl font-bold text-gray-900 mb-4`}
                >
                  Service
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We are committed to serving our alumni community with
                  dedication and excellence.
                </p>
              </div>

              {/* Innovation */}
              <div
                className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">💡</span>
                </div>
                <h3
                  className={`${archivo.semibold600.className} text-2xl font-bold text-gray-900 mb-4`}
                >
                  Innovation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We embrace new ideas and approaches to better serve our
                  community's evolving needs.
                </p>
              </div>
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
          style={{ animationDelay: "2s" }}
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
              Ready to Connect?
            </h2>
            <p
              className={`text-xl mb-10 transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Get in touch with our leadership team and be part of our growing
              community.
            </p>
            <div
              className={`flex justify-center items-center transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamComponent;
