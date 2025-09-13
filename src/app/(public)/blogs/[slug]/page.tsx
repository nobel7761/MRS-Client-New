import BlogDetailComponent from "@/components/pages/public/Blog/BlogDetail.component";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

const BlogDetailPage = ({ params }: BlogDetailPageProps) => {
  return <BlogDetailComponent slug={params.slug} />;
};

export default BlogDetailPage;
