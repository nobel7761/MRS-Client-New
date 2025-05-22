import Link from "next/link";
import BrandLogo from "../brand-logo/brand-logo";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarker,
} from "react-icons/fa";

const FooterBottomPart = () => {
  return (
    <div>
      {/* 1st part */}
      <div className="border-b border-white/70 pb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative overflow-hidden">
            <Link href="/" className="flex items-center relative z-10">
              <BrandLogo imageClassName="w-20 h-20" textClassName="hidden" />
            </Link>
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
          </div>

          <p className={`text-4xl font-medium text-white`}>NICAA</p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-white text-2xl font-bold">Follow our socials</p>
          <div className="flex items-center gap-2">
            <Link
              href="https://www.facebook.com/NationalIdealCollegeAlumniAssociation"
              target="_blank"
            >
              <div className="bg-white rounded-full flex items-center justify-center w-10 h-10 text-primary hover:text-black hover:bg-secondary transition-colors duration-300">
                <FaFacebookF />
              </div>
            </Link>
            <Link
              href="https://www.instagram.com/nic_alumni_association"
              target="_blank"
            >
              <div className="bg-white rounded-full flex items-center justify-center w-10 h-10 text-primary hover:text-black hover:bg-secondary transition-colors duration-300">
                <FaInstagram />
              </div>
            </Link>
            <Link
              href="https://www.youtube.com/@nationalidealcollegealumni9865"
              target="_blank"
            >
              <div className="bg-white rounded-full flex items-center justify-center w-10 h-10 text-primary hover:text-black hover:bg-secondary transition-colors duration-300">
                <FaYoutube />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 2nd part */}
      <div className="border-b border-white/70 flex justify-between items-center gap-x-10 py-10">
        <div className="w-1/2 flex justify-between items-center gap-x-10">
          {/* 1st column */}
          <div className="w-1/3">
            <p className="text-white text-2xl font-bold">Quick Links</p>
            <ul className="flex flex-col h-full gap-y-2 py-5 text-white">
              <li>
                <Link href="/" className="hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-secondary">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* 2nd column */}
          <div className="w-1/3">
            <p className="text-white text-2xl font-bold">Support</p>
            <ul className="flex flex-col h-full gap-y-2 py-5 text-white">
              <li>
                <Link href="/" className="hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-secondary">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* 3rd column */}
          <div className="w-1/3">
            <p className="text-white text-2xl font-bold">Services</p>
            <ul className="flex flex-col h-full gap-y-2 py-5 text-white">
              <li>
                <Link href="/" className="hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-secondary">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-1/2 flex justify-between items-center gap-x-10">
          {/* 4th column */}
          <div className="w-3/5">
            <p className="text-white text-2xl font-bold">Get In Touch</p>
            <div className="flex flex-col h-full gap-y-2 py-5 text-white">
              <div className="flex items-center gap-x-2">
                <div className="border border-white rounded-full p-2">
                  <FaPhone />
                </div>
                <p className="text-white">+880 1314-416026</p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="border border-white rounded-full p-2">
                  <FaEnvelope />
                </div>
                <p className="text-white">
                  nic.alumniassociation.official@gmail.com
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="border border-white rounded-full p-2">
                  <FaMapMarker />
                </div>
                <p className="text-white">National Ideal College Main Campus</p>
              </div>
            </div>
          </div>
          {/* 5th column */}
          <div className="w-2/5">
            <p className="text-white text-2xl font-bold">Stay Updated</p>
            <div className="flex flex-col h-full gap-y-2 py-5 text-white">
              <div className="flex items-center gap-x-2">
                <Link
                  href="https://www.facebook.com/NationalIdealCollegeAlumniAssociation"
                  target="_blank"
                  className="border border-white rounded-full p-2"
                >
                  <FaFacebookF />
                </Link>
                <p className="text-white">Facebook</p>
              </div>
              <div className="flex items-center gap-x-2">
                <Link
                  href="https://www.instagram.com/nic_alumni_association"
                  target="_blank"
                  className="border border-white rounded-full p-2"
                >
                  <FaInstagram />
                </Link>
                <p className="text-white">Instagram</p>
              </div>
              <div className="flex items-center gap-x-2">
                <Link
                  href="https://www.youtube.com/@nationalidealcollegealumni9865"
                  target="_blank"
                  className="border border-white rounded-full p-2"
                >
                  <FaYoutube />
                </Link>
                <p className="text-white">Youtube</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3rd part */}
      <div className="flex justify-center items-center mt-20">
        <p className="text-white">
          &copy; {new Date().getFullYear()} NICAA. All rights reserved. This
          website was voluntarily developed by{" "}
          <Link
            href="https://www.facebook.com/habibur.rahaman.nobel"
            target="_blank"
          >
            <span className="text-secondary">Habibur Nobel (2015)</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FooterBottomPart;
