import { FaEnvelope, FaPhone, FaYoutube } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

const TopBar = () => {
  return (
    <div className="text-white font-[var(--default-font)] text-sm leading-none py-4 border-b border-white/10">
      <div className="max-w-[1300px] px-[15px] mx-auto">
        <div className="flex justify-between items-center">
          {/* Topbar Contact Information Start */}
          <div className="md:w-1/2 hidden md:block">
            <ul className="flex items-center gap-4 font-normal">
              <li>
                <p className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <FaEnvelope /> nic.alumniassociation.official@gmail.com
                </p>
              </li>
              <li>
                <p className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <FaPhone /> +880 1314-416026
                </p>
              </li>
            </ul>
          </div>
          {/* Topbar Contact Information End */}

          <div className="md:w-1/2 w-full">
            {/* Topbar Social Links Start */}

            <ul className="flex justify-between md:pl-32 items-center gap-4 font-medium text-xs md:text-sm">
              <li>
                <Link
                  href="https://www.facebook.com/NationalIdealCollegeAlumniAssociation"
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                  target="_blank"
                >
                  <FaFacebookF /> Facebook Page
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/groups/936848456437550"
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                  target="_blank"
                >
                  <FaFacebookF /> Facebook Group
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="https://www.instagram.com/nic_alumni_association"
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                  target="_blank"
                >
                  <BsInstagram /> Instagram
                </Link>
              </li>

              <li>
                <Link
                  href="https://www.youtube.com/@nationalidealcollegealumni9865"
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                  target="_blank"
                >
                  <FaYoutube /> Youtube
                </Link>
              </li>
            </ul>

            {/* Topbar Social Links End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
