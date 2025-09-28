"use client";

import { useState, useEffect } from "react";
import CustomDotTitle from "@/components/shared/custom-components/dot-title";
import { archivo } from "@/lib/fonts";
import faqBackgroundImage from "@/public/faqs/faqs-bg.svg";
import { BsInstagram } from "react-icons/bs";

const ContactUsComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
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
                Get in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-600 to-red-800 animate-pulse">
                  Touch
                </span>
              </h1>

              {/* Main Content */}
              <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-lg">
                Have questions about NICAA? Want to get involved? We'd love to
                hear from you. Reach out to us and let's build our community
                together.
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
                          📞
                        </span>
                      </div>
                      <h3
                        className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-4`}
                      >
                        Quick Contact
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        Send us a message and we'll get back to you within 24
                        hours.
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        Phone
                      </div>
                      <div className="text-sm text-gray-600">
                        +880 1314-416026
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "2s" }}
                >
                  <span className="text-white text-2xl">💬</span>
                </div>
                <div
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "4s" }}
                >
                  <span className="text-white text-xl">📧</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Breadcrumb
          <div className="absolute top-8 right-8">
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
                  <span className="text-primary font-semibold">contact us</span>
                </li>
              </ol>
            </nav>
          </div> */}
        </div>
      </section>

      {/* Contact Form Section */}
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
                    Get In Touch
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
                Send Us a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Message
                </span>
              </h2>
              <p
                className={`text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed transition-all duration-1500 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
              >
                Fill out the form below and we'll get back to you as soon as
                possible. We're here to help with any questions about NICAA.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Contact Form */}
              <div
                className={`group relative transition-all duration-1500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/10 rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/50 group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-600/20 rounded-full blur-xl"></div>

                  <h3
                    className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-8 group-hover:text-primary transition-colors duration-500`}
                  >
                    Contact Form
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-500 hover:scale-105 shadow-xl relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        Send Message
                        <svg
                          className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
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

                  <h3
                    className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-8 group-hover:text-green-600 transition-colors duration-500`}
                  >
                    Contact Information
                  </h3>

                  <div className="space-y-8">
                    {/* Email */}
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xl">📧</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          Email Us
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Send us an email anytime
                        </p>
                        <a
                          href="mailto:nic.alumniassociation.official@gmail.com"
                          className="text-primary hover:text-red-600 transition-colors duration-300 font-medium"
                        >
                          nic.alumniassociation.official@gmail.com
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xl">📞</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          Call Us
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Available for calls
                        </p>
                        <a
                          href="tel:+8801314416026"
                          className="text-primary hover:text-red-600 transition-colors duration-300 font-medium"
                        >
                          +880 1314-416026
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xl">📍</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          Visit Us
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Our office location
                        </p>
                        <p className="text-primary hover:text-red-600 transition-colors duration-300 font-medium">
                          National Ideal College building number 1
                        </p>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex items-start group/item">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                        <span className="text-white text-xl">🌐</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          Follow Us
                        </h4>
                        <p className="text-gray-600 mb-3">
                          Stay connected on social media
                        </p>
                        <div className="flex space-x-4">
                          <a
                            href="https://www.facebook.com/NationalIdealCollegeAlumniAssociation"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 group-hover:scale-110"
                            title="Facebook Page"
                          >
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                          <a
                            href="https://www.instagram.com/nic_alumni_association"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors duration-300 group-hover:scale-110"
                            title="Instagram"
                          >
                            <BsInstagram className="w-5 h-5 text-white" />
                          </a>
                          <a
                            href="https://www.youtube.com/@nationalidealcollegealumni9865"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300 group-hover:scale-110"
                            title="YouTube"
                          >
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
              Ready to Connect?
            </h2>
            <p
              className={`text-xl mb-8 opacity-90 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Join our community and be part of something bigger. We're excited
              to hear from you!
            </p>
            <div
              className={`flex justify-center items-center transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsComponent;
