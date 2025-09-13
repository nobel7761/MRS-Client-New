import { BlogCategory, BlogPost, BlogAuthor } from "@/types/blog";

export const blogCategories: BlogCategory[] = [
  {
    id: "1",
    name: "All Posts",
    slug: "all",
    description: "View all blog posts",
    color: "from-gray-500 to-gray-600",
    icon: "📝",
  },
  {
    id: "2",
    name: "Alumni Stories",
    slug: "alumni-stories",
    description: "Inspiring stories from our alumni community",
    color: "from-blue-500 to-blue-600",
    icon: "👥",
  },
  {
    id: "3",
    name: "Events & News",
    slug: "events-news",
    description: "Latest events and news from NICAA",
    color: "from-green-500 to-green-600",
    icon: "🎉",
  },
  {
    id: "4",
    name: "Career Guidance",
    slug: "career-guidance",
    description: "Career advice and professional development",
    color: "from-purple-500 to-purple-600",
    icon: "💼",
  },
  {
    id: "5",
    name: "College Life",
    slug: "college-life",
    description: "Memories and experiences from college days",
    color: "from-pink-500 to-pink-600",
    icon: "🎓",
  },
  {
    id: "6",
    name: "Community Service",
    slug: "community-service",
    description: "Our humanitarian efforts and community impact",
    color: "from-red-500 to-red-600",
    icon: "🤝",
  },
];

export const blogAuthors: BlogAuthor[] = [
  {
    id: "1",
    name: "ABCDEF",
    avatar:
      "https://img.lovepik.com/png/20231125/man-avatar-image-for-profile-child-diverse-guy_693690_wh860.png",
    bio: "President of NICAA, passionate about community building and alumni engagement.",
    social: {
      facebook: "https://facebook.com/abcdef",
      linkedin: "https://linkedin.com/in/abcdef",
      instagram: "https://instagram.com/abcdef",
    },
  },
  {
    id: "2",
    name: "XYZ",
    avatar:
      "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
    bio: "General Secretary of NICAA, dedicated to organizing impactful events and programs.",
    social: {
      facebook: "https://facebook.com/xyz",
      linkedin: "https://linkedin.com/in/xyz",
    },
  },
  {
    id: "3",
    name: "Mahfuz Ahmed",
    avatar:
      "https://img.lovepik.com/png/20231125/man-avatar-image-for-profile-child-diverse-guy_693690_wh860.png",
    bio: "Treasurer of NICAA, ensuring transparent financial management and accountability.",
    social: {
      facebook: "https://facebook.com/mahfuz",
      linkedin: "https://linkedin.com/in/mahfuz",
    },
  },
  {
    id: "4",
    name: "Farhana Akter",
    avatar:
      "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
    bio: "Event Coordinator of NICAA, creating memorable experiences for our community.",
    social: {
      facebook: "https://facebook.com/farhana",
      instagram: "https://instagram.com/farhana",
    },
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "NICAA 2024 Annual Reunion: A Grand Success",
    slug: "nicaa-2024-annual-reunion-grand-success",
    excerpt:
      "Our biggest reunion yet brought together over 1,000 alumni from different batches, creating unforgettable memories and strengthening our community bonds.",
    content: `
      <p>The 2024 Annual Reunion was nothing short of spectacular! Held at the prestigious Radisson Blu Water Garden Hotel, we welcomed over 1,000 alumni from various graduating classes, making it our largest gathering to date.</p>
      
      <h2>Highlights of the Event</h2>
      <p>The evening was filled with nostalgia, laughter, and new connections. Alumni from the 1980s to the 2020s came together to share stories, celebrate achievements, and reconnect with old friends.</p>
      
      <h3>Special Moments</h3>
      <ul>
        <li>Welcome speech by our President, ABCDEF</li>
        <li>Musical performance by alumni band</li>
        <li>Award ceremony for outstanding alumni contributions</li>
        <li>Photo sessions and memory lane walkthrough</li>
        <li>Networking dinner and cultural performances</li>
      </ul>
      
      <p>The event was graced by the presence of our Chief Guest, Honorable MP Saber Hossain Chawdhury, who praised NICAA's efforts in community building and social service.</p>
      
      <h2>Impact and Future</h2>
      <p>This reunion not only strengthened existing bonds but also created new partnerships and opportunities for collaboration. We're already planning for an even bigger 2025 reunion!</p>
    `,
    featuredImage:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/blog-header-youtube-thumbnail-%281%29-design-template-0a4f82afe5ab9f9a5289a87dde86a70d_screen.jpg?ts=1693603853",
    category: blogCategories[2], // Events & News
    author: blogAuthors[0],
    publishedAt: "2024-12-15T10:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z",
    readTime: 5,
    tags: ["reunion", "alumni", "community", "celebration"],
    media: [
      {
        id: "1",
        type: "image",
        url: "https://powder.gg/blog/content/images/2023/08/youtube-thumbnails.png",
        alt: "NICAA 2024 Reunion Group Photo",
        caption: "Group photo of alumni at the 2024 Annual Reunion",
      },
      {
        id: "2",
        type: "video",
        url: "https://www.youtube.com/watch?v=GbUkr2BVFOc&list=RDGbUkr2BVFOc&start_radio=1",
        thumbnail:
          "https://www.techsmith.com/wp-content/uploads/2021/02/TSC-thumbnail-example-1024x576.png",
        caption: "Highlights from the 2024 Annual Reunion",
      },
    ],
    views: 1250,
    likes: 89,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "2",
    title: "From Student to CEO: The Journey of Dr. Ahmed Rahman",
    slug: "from-student-to-ceo-ahmed-rahman-journey",
    excerpt:
      "Discover the inspiring journey of Dr. Ahmed Rahman, a 1995 graduate who went on to become a successful entrepreneur and now serves as our Chief Advisor.",
    content: `
      <p>Dr. Ahmed Rahman's story is one of determination, hard work, and unwavering commitment to excellence. A 1995 graduate of National Ideal College, he has built an impressive career that spans academia, business, and community service.</p>
      
      <h2>Early Years and Education</h2>
      <p>Born and raised in Dhaka, Dr. Rahman was always an exceptional student. His teachers remember him as someone who asked the right questions and never settled for mediocrity. After graduating from National Ideal College, he pursued higher education in the United States.</p>
      
      <h2>Academic Achievements</h2>
      <ul>
        <li>Ph.D. in Computer Science from MIT</li>
        <li>M.S. in Engineering from Stanford University</li>
        <li>B.S. in Computer Science from University of California, Berkeley</li>
        <li>Published over 50 research papers in top-tier journals</li>
      </ul>
      
      <h2>Entrepreneurial Journey</h2>
      <p>In 2005, Dr. Rahman founded TechNova Solutions, a software company that has grown to become one of Bangladesh's leading IT companies. The company now employs over 500 people and serves clients across Asia and North America.</p>
      
      <h2>Return to Roots</h2>
      <p>Despite his international success, Dr. Rahman never forgot his roots. He returned to Bangladesh in 2018 and immediately got involved with NICAA, eventually becoming our Chief Advisor in 2020.</p>
      
      <h2>Words of Wisdom</h2>
      <blockquote>
        "Success is not just about personal achievement; it's about lifting others up and creating opportunities for the next generation. That's what NICAA represents to me."
      </blockquote>
    `,
    featuredImage:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/how-to-earn-money-online-youtube-thumbnail-te-design-template-ed90a8c73291dc629aff54cdc2a8ded5_screen.jpg?ts=1661615959",
    category: blogCategories[1], // Alumni Stories
    author: blogAuthors[1],
    publishedAt: "2024-12-10T14:30:00Z",
    updatedAt: "2024-12-10T14:30:00Z",
    readTime: 8,
    tags: ["alumni", "success-story", "entrepreneurship", "inspiration"],
    media: [
      {
        id: "3",
        type: "image",
        url: "https://img.freepik.com/premium-psd/game-youtube-thumbnail-banner-design_641978-60.jpg?semt=ais_hybrid&w=740&q=80",
        alt: "Dr. Ahmed Rahman portrait",
        caption: "Dr. Ahmed Rahman, Chief Advisor of NICAA",
      },
    ],
    views: 890,
    likes: 67,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "3",
    title: "Career Tips for Recent Graduates: A Comprehensive Guide",
    slug: "career-tips-recent-graduates-comprehensive-guide",
    excerpt:
      "Navigate your career journey with confidence using these proven strategies and insights from successful alumni who have walked the same path.",
    content: `
      <p>Starting your career can be both exciting and overwhelming. As recent graduates, you're stepping into a world full of opportunities and challenges. Here's a comprehensive guide to help you navigate this important phase of your life.</p>
      
      <h2>1. Define Your Career Goals</h2>
      <p>Before diving into job applications, take time to reflect on what you truly want to achieve in your career. Consider your interests, values, and long-term aspirations.</p>
      
      <h2>2. Build a Strong Professional Network</h2>
      <p>Networking is crucial for career success. Attend industry events, join professional associations, and connect with alumni who work in your field of interest.</p>
      
      <h2>3. Develop Essential Skills</h2>
      <ul>
        <li><strong>Technical Skills:</strong> Stay updated with the latest tools and technologies in your field</li>
        <li><strong>Soft Skills:</strong> Communication, teamwork, and problem-solving are highly valued</li>
        <li><strong>Digital Literacy:</strong> Proficiency in digital tools and platforms</li>
        <li><strong>Leadership:</strong> Even in entry-level positions, leadership qualities set you apart</li>
      </ul>
      
      <h2>4. Create a Compelling Resume and Portfolio</h2>
      <p>Your resume is your first impression. Make it count by highlighting relevant experiences, achievements, and skills. Include a portfolio showcasing your best work.</p>
      
      <h2>5. Prepare for Interviews</h2>
      <p>Research the company, practice common interview questions, and prepare thoughtful questions to ask the interviewer. Remember, interviews are a two-way conversation.</p>
      
      <h2>6. Embrace Continuous Learning</h2>
      <p>The job market is constantly evolving. Stay curious, take online courses, attend workshops, and never stop learning.</p>
      
      <h2>7. Seek Mentorship</h2>
      <p>Find mentors who can guide you through your career journey. NICAA's mentorship program connects recent graduates with experienced alumni.</p>
    `,
    featuredImage:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/blog-header-youtube-thumbnail-%281%29-design-template-0a4f82afe5ab9f9a5289a87dde86a70d_screen.jpg?ts=1693603853",
    category: blogCategories[3], // Career Guidance
    author: blogAuthors[2],
    publishedAt: "2024-12-05T09:15:00Z",
    updatedAt: "2024-12-05T09:15:00Z",
    readTime: 6,
    tags: ["career", "guidance", "graduates", "professional-development"],
    media: [
      {
        id: "4",
        type: "image",
        url: "https://powder.gg/blog/content/images/2023/08/youtube-thumbnails.png",
        alt: "Career guidance illustration",
        caption: "Building a successful career starts with the right guidance",
      },
    ],
    views: 2100,
    likes: 156,
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "4",
    title: "NICAA Flood Relief 2024: Rebuilding Lives in Cumilla",
    slug: "nicaa-flood-relief-2024-rebuilding-lives-cumilla",
    excerpt:
      "Our humanitarian efforts during the 2024 floods helped over 1,500 families in Cumilla, Feni, and Laxmipur, demonstrating the power of community solidarity.",
    content: `
      <p>When devastating floods hit Cumilla, Feni, and Laxmipur in 2024, NICAA immediately sprang into action. Our community's response showcased the true spirit of solidarity and compassion that defines our alumni association.</p>
      
      <h2>The Crisis</h2>
      <p>Heavy monsoon rains caused severe flooding in several districts, displacing thousands of families and causing extensive damage to homes, crops, and infrastructure. Many families lost everything they owned.</p>
      
      <h2>NICAA's Response</h2>
      <p>Within 48 hours of the disaster, NICAA launched a comprehensive relief operation. Our team of volunteers, including medical professionals, engineers, and social workers, traveled to the affected areas to provide immediate assistance.</p>
      
      <h2>What We Accomplished</h2>
      <ul>
        <li><strong>Medical Aid:</strong> Provided free medical treatment and medicines to over 1,500 flood victims</li>
        <li><strong>Emergency Relief:</strong> Distributed food, clean water, and essential supplies to affected families</li>
        <li><strong>Housing Support:</strong> Rebuilt 6 homes for families who lost everything</li>
        <li><strong>Educational Support:</strong> Provided school supplies and uniforms for children</li>
        <li><strong>Livelihood Restoration:</strong> Helped families restart their businesses and farming activities</li>
      </ul>
      
      <h2>Community Impact</h2>
      <p>Our efforts were recognized by local media, with coverage on Jamuna TV and Desh TV. The local community expressed deep gratitude for our support during their time of need.</p>
      
      <h2>How You Can Help</h2>
      <p>Disaster relief is an ongoing effort. You can contribute to our emergency fund or volunteer for future relief operations. Every contribution, no matter how small, makes a difference.</p>
      
      <blockquote>
        "In times of crisis, we see the true strength of our community. NICAA's response to the floods shows what we can achieve when we work together." - Local Community Leader
      </blockquote>
    `,
    featuredImage:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/how-to-earn-money-online-youtube-thumbnail-te-design-template-ed90a8c73291dc629aff54cdc2a8ded5_screen.jpg?ts=1661615959",
    category: blogCategories[5], // Community Service
    author: blogAuthors[3],
    publishedAt: "2024-11-28T16:45:00Z",
    updatedAt: "2024-11-28T16:45:00Z",
    readTime: 7,
    tags: ["flood-relief", "community-service", "humanitarian", "solidarity"],
    media: [
      {
        id: "5",
        type: "image",
        url: "https://img.freepik.com/premium-psd/game-youtube-thumbnail-banner-design_641978-60.jpg?semt=ais_hybrid&w=740&q=80",
        alt: "Flood relief volunteers",
        caption: "NICAA volunteers providing medical aid during flood relief",
      },
      {
        id: "6",
        type: "video",
        url: "https://www.youtube.com/watch?v=_AbFXuGDRTs&t=253s",
        thumbnail:
          "https://www.techsmith.com/wp-content/uploads/2021/02/TSC-thumbnail-example-1024x576.png",
        caption: "Documentary: NICAA Flood Relief 2024",
      },
    ],
    views: 3200,
    likes: 234,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "5",
    title: "Memories of College Days: A Nostalgic Journey",
    slug: "memories-college-days-nostalgic-journey",
    excerpt:
      "Take a walk down memory lane as we revisit the golden days of National Ideal College, from the bustling corridors to the unforgettable friendships.",
    content: `
      <p>There's something magical about college memories that never fades. The friendships, the laughter, the late-night study sessions, and the countless moments that shaped who we are today.</p>
      
      <h2>The Campus That Shaped Us</h2>
      <p>National Ideal College wasn't just a place of learning; it was a home where dreams were nurtured and friendships were forged. The red-brick buildings, the sprawling campus, and the vibrant atmosphere created the perfect environment for growth.</p>
      
      <h2>Unforgettable Moments</h2>
      <ul>
        <li><strong>First Day:</strong> The nervous excitement of stepping into college for the first time</li>
        <li><strong>Friendships:</strong> Bonds that have lasted decades and continue to grow stronger</li>
        <li><strong>Teachers:</strong> Educators who not only taught subjects but life lessons</li>
        <li><strong>Cultural Events:</strong> Annual functions, debates, and sports competitions</li>
        <li><strong>Study Groups:</strong> Late-night cramming sessions before exams</li>
        <li><strong>Graduation Day:</strong> The bittersweet moment of moving to the next chapter</li>
      </ul>
      
      <h2>Stories from Alumni</h2>
      <p>We reached out to alumni from different decades to share their most cherished college memories. Here are some of their stories:</p>
      
      <h3>Sarah Ahmed (Class of 2010)</h3>
      <p>"I remember the debate competitions where we would spend hours preparing arguments. The English department's annual drama was always a highlight. I still have the costume I wore in 'Romeo and Juliet'!"</p>
      
      <h3>Rahim Khan (Class of 1995)</h3>
      <p>"The library was my second home. I spent countless hours there, not just studying but also discovering new worlds through books. The librarian, Mr. Karim, became like a father figure to many of us."</p>
      
      <h3>Fatima Begum (Class of 2015)</h3>
      <p>"The canteen was where all the real conversations happened. Over cups of tea and samosas, we discussed everything from politics to our future dreams. Those conversations shaped my worldview."</p>
      
      <h2>Keeping the Spirit Alive</h2>
      <p>While we've all moved on to different paths, the spirit of National Ideal College lives on in everything we do. Through NICAA, we continue to honor those memories and create new ones together.</p>
    `,
    featuredImage:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/blog-header-youtube-thumbnail-%281%29-design-template-0a4f82afe5ab9f9a5289a87dde86a70d_screen.jpg?ts=1693603853",
    category: blogCategories[4], // College Life
    author: blogAuthors[0],
    publishedAt: "2024-11-20T11:20:00Z",
    updatedAt: "2024-11-20T11:20:00Z",
    readTime: 6,
    tags: ["memories", "college-life", "nostalgia", "friendship"],
    media: [
      {
        id: "7",
        type: "image",
        url: "https://powder.gg/blog/content/images/2023/08/youtube-thumbnails.png",
        alt: "College campus memories",
        caption: "The beautiful campus of National Ideal College",
      },
    ],
    views: 1800,
    likes: 145,
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "6",
    title: "Building Professional Networks: A Guide for Alumni",
    slug: "building-professional-networks-guide-alumni",
    excerpt:
      "Learn how to leverage your NICAA connections to advance your career and create meaningful professional relationships.",
    content: `
      <p>Professional networking is one of the most valuable skills you can develop. As NICAA members, we have access to a diverse network of successful professionals across various industries.</p>
      
      <h2>Why Networking Matters</h2>
      <p>Studies show that 85% of jobs are filled through networking. More than just job opportunities, professional networks provide mentorship, industry insights, and collaborative opportunities.</p>
      
      <h2>Leveraging NICAA's Network</h2>
      <p>Our alumni association includes professionals from:</p>
      <ul>
        <li>Technology and IT</li>
        <li>Healthcare and Medicine</li>
        <li>Business and Finance</li>
        <li>Education and Academia</li>
        <li>Government and Public Service</li>
        <li>Media and Communications</li>
        <li>Engineering and Manufacturing</li>
      </ul>
      
      <h2>Networking Best Practices</h2>
      <h3>1. Be Genuine</h3>
      <p>Authentic relationships are built on mutual respect and genuine interest. Focus on how you can help others, not just what you can get from them.</p>
      
      <h3>2. Attend Events</h3>
      <p>NICAA regularly organizes networking events, workshops, and seminars. These are perfect opportunities to meet fellow alumni and expand your network.</p>
      
      <h3>3. Use Social Media Wisely</h3>
      <p>LinkedIn is particularly valuable for professional networking. Connect with alumni, share industry insights, and engage with their content thoughtfully.</p>
      
      <h3>4. Offer Value</h3>
      <p>Share your expertise, provide referrals, or offer to help with projects. Being helpful builds strong professional relationships.</p>
      
      <h2>Success Stories</h2>
      <p>Many NICAA members have found career opportunities, business partners, and mentors through our network. These connections often lead to long-term professional relationships and personal friendships.</p>
    `,
    featuredImage:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/how-to-earn-money-online-youtube-thumbnail-te-design-template-ed90a8c73291dc629aff54cdc2a8ded5_screen.jpg?ts=1661615959",
    category: blogCategories[3], // Career Guidance
    author: blogAuthors[1],
    publishedAt: "2024-11-15T13:10:00Z",
    updatedAt: "2024-11-15T13:10:00Z",
    readTime: 5,
    tags: ["networking", "career", "professional-development", "alumni"],
    media: [
      {
        id: "8",
        type: "image",
        url: "https://img.freepik.com/premium-psd/game-youtube-thumbnail-banner-design_641978-60.jpg?semt=ais_hybrid&w=740&q=80",
        alt: "Professional networking",
        caption: "Building meaningful professional connections",
      },
    ],
    views: 1650,
    likes: 98,
    isPublished: true,
    isFeatured: false,
  },
];
