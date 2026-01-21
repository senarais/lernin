import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
  faTiktok,
  faYoutube,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

// Daftar tautan untuk English Course
const englishCourseLinks = {
  "IELTS Preparation":
    "https://studyfirstindonesia.com/programs/program-bahasa-inggris/",
  "TOEFL ITP Preparation": "https://studyfirstindonesia.com/program-toefl/",
  "TOEFL IBT Preparation": "https://studyfirstindonesia.com/program-toefl/",
  Conversation:
    "https://studyfirstindonesia.com/programs/program-bahasa-inggris/conversation/",
  Grammar:
    "https://studyfirstindonesia.com/programs/program-bahasa-inggris/grammar/",
};

// Daftar tautan untuk English Specific Purposes
const espLinks = {
  "Academic English ": "#", // Belum ada tautan
  "General English ": "https://studyfirstindonesia.com/general-english/", 
  "English for Kids": "#", // Belum ada tautan
};

// Daftar tautan untuk Scholarship Preparation
const preparationLinks = {
  "Scholarship Mentoring (S1,S2,S3)":
    "https://studyfirstindonesia.com/programs/program-bahasa-inggris/",
  "Tes Bakat Skolastik": "https://studyfirstindonesia.com/cbt/",
  "Try Out Tes Bakat Skolastik": "https://studyfirstindonesia.com/cbt/",
  "Mock Up Interview": "https://studyfirstindonesia.com/cbt/",
};

// Daftar tautan untuk Support Services
const supportServicesLinks = {
  "VISA Aplication": "https://studyfirstindonesia.com/visa-application/",
  "University Admission": "https://studyfirstindonesia.com/university-admissions/",
  "Translation Services": "https://studyfirstindonesia.com/translation/",
};

// Daftar tautan untuk English for Corporation
const efcLinks = {
  "Business English": "https://studyfirstindonesia.com/page-business-english/",
};

// Daftar tautan untuk English Official Test
const eotLinks = {
  "IELTS Official Test": "https://studyfirstindonesia.com/course/ielts/",
  "TOEFL Official Test": "https://studyfirstindonesia.com/course/toefl/",
  "IELTS Simulation": "https://studyfirstindonesia.com/#", // Belum ada tautan
  "TOEFL Simulation": "https://studyfirstindonesia.com/#", // Belum ada tautan
};

// Daftar tautan untuk Halaman Kami
const ourpageLinks = {
  "Program Kami": "https://studyfirstindonesia.com/",
  "Learning Management System": "https://studyfirstindonesia.com/#",
  "Kalender Beasiswa": "https://kalender-beasiswa.studyfirstindonesia.com/",
  Partnership: "https://studyfirstindonesia.com/partnership/",
  "Tentang Kami": "https://studyfirstindonesia.com/tentang-kami/",
  "Artikel Kami": "https://studyfirstindonesia.com/blog-2/page/1/",
};

export default function Footer() {
  return (
    <footer className="text-white w-full pt-14 mt-20 pb-10 font-sans">
      <div className="container max-w-screen mx-auto px-6">
        {/* Footer Content */}
        <div className="flex flex-col lg:flex-row justify-evenly gap-14">
          {/* Column 1 */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-10">
            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 text-center lg:text-left">
                English Course
              </h3>
              <ul className="space-y-2 text-center text-xs md:text-sm lg:text-left">
                {Object.keys(englishCourseLinks).map((item) => (
                  <li key={item}>
                    <a
                      href={englishCourseLinks[item]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:ml-4 hover:text-[#F4D505] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 text-center lg:text-left">
                English for Specific Purposes
              </h3>
              <ul className="space-y-2 text-center text-xs md:text-sm lg:text-left">
                {Object.keys(espLinks).map((item) => (
                  <li key={item}>
                    <a
                      href={espLinks[item]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:ml-4 hover:text-[#F4D505] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-10">
            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 text-center lg:text-left">
                Scholarship Preparation
              </h3>
              <ul className="space-y-2 text-center text-xs md:text-sm lg:text-left">
                {Object.keys(preparationLinks).map((item) => (
                  <li key={item}>
                    <a
                      href={preparationLinks[item]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:ml-4 hover:text-[#F4D505] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 text-center lg:text-left">
                Scholarship Support Services
              </h3>
              <ul className="space-y-2 text-center text-xs md:text-sm lg:text-left">
                {Object.keys(supportServicesLinks).map((item) => (
                  <li key={item}>
                    <a
                      href={supportServicesLinks[item]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:ml-4 hover:text-[#F4D505] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-10">
            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 text-center lg:text-left">
                English for Corporation
              </h3>
              <ul className="space-y-2 text-center text-xs md:text-sm lg:text-left">
                {Object.keys(efcLinks).map((item) => (
                  <li key={item}>
                    <a
                      href={efcLinks[item]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:ml-4 hover:text-[#F4D505] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base md:text-lg mb-3 text-center lg:text-left">
                English Official Test
              </h3>
              <ul className="space-y-2 text-center text-xs md:text-sm lg:text-left">
                {Object.keys(eotLinks).map((item) => (
                  <li key={item}>
                    <a
                      href={eotLinks[item]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:ml-4 hover:text-[#F4D505] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-base md:text-lg mb-3 text-center lg:text-left">
              Halaman Kami
            </h3>
            <ul className="space-y-2 text-center text-xs md:text-sm lg:text-left">
              {Object.keys(ourpageLinks).map((item) => (
                <li key={item}>
                  <a
                    href={ourpageLinks[item]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lg:ml-4 hover:text-[#F4D505] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-24">
          <h5 className="font-semibold text-center text-lg md:text-xl">
            Connect with Us
          </h5>

          <div className="flex justify-center gap-4 mt-6">
            {[
              faWhatsapp,
              faInstagram,
              faTiktok,
              faYoutube,
              faLinkedin,
              faFacebook,
            ].map((icon, i) => (
              <FontAwesomeIcon
                key={i}
                icon={icon}
                className="w-6 h-6 cursor-pointer hover:text-[#F4D505] transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 px-6">
          <hr className="w-full h-px bg-white/40 border-0 mb-3" />
          <p className="text-center text-xs md:text-sm leading-5 opacity-90">
            PT Ankara Gala Wisesa (Study First) - Nomor Izin Berusaha Kemenkumham:
            1110230126914
          </p>
        </div>
      </div>
    </footer>
  );
}
