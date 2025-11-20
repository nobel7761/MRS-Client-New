import dynamic from "next/dynamic";
import { NextPage } from "next";

const ShronikaSubmission = dynamic(
  () =>
    import("@/components/pages/public/ShronikaSubmission/ShronikaSubmission"),
  { ssr: false }
);

const SouvenirContentSubmissionPage: NextPage = () => {
  return <ShronikaSubmission />;
};

export default SouvenirContentSubmissionPage;
