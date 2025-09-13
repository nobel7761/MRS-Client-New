"use client";

import { useState, useEffect } from "react";
import { archivo } from "@/lib/fonts";
import faqBackgroundImage from "@/public/faqs/faqs-bg.svg";
import { blogCategories, blogPosts } from "@/resource-data/blog-data";
import Link from "next/link";
import Image from "next/image";
import { BlogCategory, BlogPost } from "@/types/blog";

const BlogComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Add transition effect
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      let filtered = blogPosts;

      // Filter by category
      if (selectedCategory !== "all") {
        filtered = filtered.filter(
          (post) => post.category.slug === selectedCategory
        );
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      setFilteredPosts(filtered);
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: BlogCategory) => {
    return category.color || "from-gray-500 to-gray-600";
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
                Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-600 to-red-800 animate-pulse">
                  Blog
                </span>
              </h1>

              {/* Main Content */}
              <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-lg">
                Discover inspiring stories, valuable insights, and the latest
                news from our alumni community. From career guidance to
                community service, our blog covers everything that matters to
                NICAA members.
              </p>

              {/* Stats */}
              <div className="flex items-center space-x-8 mb-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {blogPosts.length}
                  </div>
                  <div className="text-sm text-gray-600">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {blogCategories.length - 1}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {blogPosts
                      .reduce((sum, post) => sum + post.views, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
              </div>
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
                          📝
                        </span>
                      </div>
                      <h3
                        className={`${archivo.semibold600.className} text-3xl font-bold text-gray-900 mb-4`}
                      >
                        Latest Stories
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        Stay updated with the latest news, insights, and stories
                        from our community.
                      </p>
                    </div>

                    {/* Featured Post Preview */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 group-hover:scale-105 transition-transform duration-300">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        Featured Article
                      </div>
                      <div className="text-sm text-gray-600">
                        {blogPosts.find((post) => post.isFeatured)?.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "2s" }}
                >
                  <span className="text-white text-2xl">✨</span>
                </div>
                <div
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "4s" }}
                >
                  <span className="text-white text-xl">💡</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar - Categories */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                  {/* Search - Moved to top */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Search Articles
                    </h4>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:shadow-md"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <h3
                    className={`${archivo.semibold600.className} text-2xl font-bold text-gray-900 mb-6`}
                  >
                    Categories
                  </h3>

                  <div className="space-y-3">
                    {blogCategories.map((category, index) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg category-transition ${
                          selectedCategory === category.slug
                            ? `bg-gradient-to-r ${getCategoryColor(
                                category
                              )} text-white shadow-xl scale-105`
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md"
                        }`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`text-2xl transition-all duration-300 ${
                              selectedCategory === category.slug
                                ? "animate-bounce"
                                : "group-hover:scale-110"
                            }`}
                          >
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold transition-all duration-300">
                              {category.name}
                            </div>
                            <div className="text-sm opacity-80 transition-all duration-300">
                              {category.slug === "all"
                                ? `${blogPosts.length} posts`
                                : `${
                                    blogPosts.filter(
                                      (post) =>
                                        post.category.slug === category.slug
                                    ).length
                                  } posts`}
                            </div>
                          </div>
                          {selectedCategory === category.slug && (
                            <div className="text-white animate-pulse">
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content - Blog Posts */}
              <div className="lg:col-span-3">
                <div className="mb-8 transition-all duration-500">
                  <h2
                    className={`${
                      archivo.semibold600.className
                    } text-3xl font-bold text-gray-900 mb-4 transition-all duration-500 ${
                      isTransitioning ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {selectedCategory === "all"
                      ? "All Articles"
                      : blogCategories.find(
                          (cat) => cat.slug === selectedCategory
                        )?.name}
                  </h2>
                  <p
                    className={`text-gray-600 transition-all duration-500 ${
                      isTransitioning ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {filteredPosts.length} article
                    {filteredPosts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {isTransitioning ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse"
                      >
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-6">
                          <div className="h-4 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12 animate-fadeIn">
                    <div className="text-6xl mb-4 animate-bounce">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No articles found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or category filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    {filteredPosts.map((post, index) => (
                      <article
                        key={post.id}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden group blog-post-hover animate-slideInUp"
                        style={{
                          animationDelay: `${index * 150}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        {/* Featured Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span
                              className={`bg-gradient-to-r ${getCategoryColor(
                                post.category
                              )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                            >
                              {post.category.name}
                            </span>
                          </div>
                          {post.isFeatured && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                ⭐ Featured
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3
                            className={`${archivo.semibold600.className} text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2`}
                          >
                            {post.title}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Meta Information */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-4">
                              <span>👤 {post.author.name}</span>
                              <span>📅 {formatDate(post.publishedAt)}</span>
                              <span>⏱️ {post.readTime} min read</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>👁️ {post.views}</span>
                              <span>❤️ {post.likes}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Read More Button */}
                          <Link
                            href={`/blogs/${post.slug}`}
                            className="inline-flex items-center text-primary hover:text-red-600 font-semibold transition-colors duration-300 group-hover:translate-x-1"
                          >
                            Read More
                            <svg
                              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
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
              Stay Connected
            </h2>
            <p
              className={`text-xl mb-8 opacity-90 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Don't miss out on the latest stories and updates from our
              community. Subscribe to our newsletter and be the first to know
              about new articles.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl">
                Subscribe to Newsletter
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105">
                Follow Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogComponent;
