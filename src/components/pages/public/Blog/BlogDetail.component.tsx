"use client";

import { useState, useEffect } from "react";
import { archivo } from "@/lib/fonts";
import faqBackgroundImage from "@/public/faqs/faqs-bg.svg";
import { blogPosts, blogCategories } from "@/resource-data/blog-data";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types/blog";

interface BlogDetailProps {
  slug: string;
}

const BlogDetailComponent = ({ slug }: BlogDetailProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);

    // Find the post by slug
    const foundPost = blogPosts.find((p) => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);

      // Find related posts (same category, excluding current post)
      const related = blogPosts
        .filter(
          (p) =>
            p.category.slug === foundPost.category.slug && p.id !== foundPost.id
        )
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (categorySlug: string) => {
    const category = blogCategories.find((cat) => cat.slug === categorySlug);
    return category?.color || "from-gray-500 to-gray-600";
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/blogs"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="bg-[#FAFAFA] bg-cover bg-center bg-no-repeat overflow-hidden relative min-h-[60vh] flex items-center"
        style={{ backgroundImage: `url(${faqBackgroundImage.src})` }}
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/90 via-primary/5 to-blue-500/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-[1300px] mx-auto md:py-8 md:px-[15px] relative z-10">
          <div
            className={`transition-all duration-1500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    Blog
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <span className="text-primary font-semibold">
                    {post.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <span
                  className={`bg-gradient-to-r ${getCategoryColor(
                    post.category.slug
                  )} text-white px-4 py-2 rounded-full text-sm font-medium`}
                >
                  {post.category.name}
                </span>
                {post.isFeatured && (
                  <span className="ml-3 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    ⭐ Featured
                  </span>
                )}
              </div>

              <h1
                className={`${archivo.semibold600.className} text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight`}
              >
                {post.title}
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center space-x-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>By {post.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>👁️</span>
                  <span>{post.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>❤️</span>
                  <span>{post.likes} likes</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <article className="prose prose-lg max-w-none">
                  {/* Featured Image */}
                  <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Article Content */}
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Media Gallery */}
                  {post.media && post.media.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Media Gallery
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {post.media.map((media) => (
                          <div key={media.id} className="relative group">
                            {media.type === "image" ? (
                              <div className="relative h-64 rounded-xl overflow-hidden">
                                <Image
                                  src={media.url}
                                  alt={media.alt || ""}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {media.caption && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                                    <p className="text-sm">{media.caption}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-4xl mb-2">🎥</div>
                                  <p className="text-gray-600">Video Content</p>
                                  {media.caption && (
                                    <p className="text-sm text-gray-500 mt-2">
                                      {media.caption}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Author Bio */}
                  <div className="mt-12 bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-start space-x-6">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          About {post.author.name}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {post.author.bio}
                        </p>
                        <div className="flex space-x-4">
                          {post.author.social.facebook && (
                            <a
                              href={post.author.social.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                            >
                              <span className="text-white text-sm font-bold">
                                f
                              </span>
                            </a>
                          )}
                          {post.author.social.linkedin && (
                            <a
                              href={post.author.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors duration-300"
                            >
                              <span className="text-white text-sm font-bold">
                                in
                              </span>
                            </a>
                          )}
                          {post.author.social.instagram && (
                            <a
                              href={post.author.social.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
                            >
                              <span className="text-white text-sm">📷</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Table of Contents */}
                  <div className="bg-white rounded-2xl shadow-xl p-4 hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 whitespace-nowrap">
                      Table of Contents
                    </h3>
                    <div className="">
                      <a
                        href="#introduction"
                        className="block text-gray-600 hover:text-primary transition-colors duration-300 pb-1 px-1 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Introduction
                      </a>
                      <a
                        href="#main-content"
                        className="block text-gray-600 hover:text-primary transition-colors duration-300 pb-1 px-1 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Main Content
                      </a>
                      <a
                        href="#conclusion"
                        className="block text-gray-600 hover:text-primary transition-colors duration-300 pb-1 px-1 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Conclusion
                      </a>
                    </div>
                  </div>

                  {/* Share Article */}
                  <div className="bg-white rounded-2xl shadow-xl p-4 hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 whitespace-nowrap">
                      Share Article
                    </h3>
                    <div className="flex gap-x-2">
                      <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg">
                        <span className="text-white text-xs font-bold">f</span>
                      </button>
                      <button className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110 shadow-lg">
                        <span className="text-white text-xs font-bold">t</span>
                      </button>
                      <button className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-all duration-300 hover:scale-110 shadow-lg">
                        <span className="text-white text-xs font-bold">in</span>
                      </button>
                      <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-all duration-300 hover:scale-110 shadow-lg">
                        <span className="text-white text-sm">📱</span>
                      </button>
                    </div>
                  </div>

                  {/* Related Articles */}
                  {relatedPosts.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-4 hover:shadow-2xl transition-all duration-300">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 whitespace-nowrap">
                        Related Articles
                      </h3>
                      <div className="space-y-4">
                        {relatedPosts.map((relatedPost, index) => (
                          <Link
                            key={relatedPost.id}
                            href={`/blogs/${relatedPost.slug}`}
                            className="block group hover:bg-gray-50 py-2 rounded-xl transition-all duration-300"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                                <Image
                                  src={relatedPost.featuredImage}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 text-xs leading-tight">
                                  {relatedPost.title}
                                </h4>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-gray-500">
                                    {formatDate(relatedPost.publishedAt)}
                                  </p>
                                  <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    {relatedPost.category.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-red-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>

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
              Enjoyed This Article?
            </h2>
            <p
              className={`text-xl mb-8 opacity-90 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              Explore more stories, insights, and updates from our alumni
              community. There's always something new to discover on our blog.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Link
                href="/blogs"
                className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Explore More Articles
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105">
                Subscribe to Updates
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailComponent;
