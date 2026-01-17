"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Testimonials() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    autoplay: false,
    autoplaySpeed: 4000,
    arrows: true,
    // dots: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section
      id="testimonials"
      className="relative w-full max-w-[960px] mx-auto px-4 sm:px-10 py-20 flex flex-col items-center justify-center text-center font-sans"
    >
      {/* 🧠 Title & Subtitle */}
      <h1 className="text-3xl md:text-4xl font-bold text-primary font-sans">
        Apa Kata Pengguna Lernin
      </h1>
      <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-lg font-sans">
        Ribuan siswa telah menggunakan Lernin untuk belajar UTBK secara terarah,
        konsisten, dan terukur.
      </p>

      {/* 💬 Testimonials */}
      <div className="w-full mt-16">
        <Slider {...settings}>
          {testimonials.map((t, i) => (
            <div key={i} className="px-3">
              <div
                className="
                  flex flex-col items-start
                  border border-border
                  p-5
                  rounded-2xl
                  bg-card
                  shadow-sm hover:shadow-md
                  transition-all duration-300
                  h-full
                  font-sans
                "
              >
                <QuoteIcon />
                <Stars />
                <p className="text-sm mt-3 text-muted-foreground font-sans">
                  {t.text}
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={t.image}
                    alt={`userImage${i}`}
                  />
                  <div className="text-left">
                    <h2 className="text-base text-primary font-medium font-sans">
                      {t.name}
                    </h2>
                    <p className="text-sm text-muted-foreground font-sans">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

/* ⭐ Testimonial data — LERNIN VERSION */
const testimonials = [
  {
    text: "Lernin ngebantu gue belajar UTBK jadi lebih terstruktur. Gak bisa lompat materi, jadi bener-bener paham.",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100",
    name: "Rizky Pratama",
    role: "Pejuang UTBK",
  },
  {
    text: "Yang paling gue suka, setelah nonton materi langsung ada quiz. Jadi tau beneran paham atau belum.",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
    name: "Nabila Aulia",
    role: "Siswa Kelas 12",
  },
  {
    text: "Progress belajarnya keliatan jelas. Ada motivasi sendiri buat nyelesain satu modul ke modul lain.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
    name: "Farhan Akbar",
    role: "Calon Mahasiswa",
  },
  {
    text: "Tryout UTBK-nya mirip banget sama asli. Ada timer, nilai, dan pembahasannya enak dipelajari.",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=100",
    name: "Alya Putri",
    role: "Peserta UTBK",
  },
  {
    text: "Lernin bikin gue lebih disiplin belajar. Gak bisa asal loncat-loncat materi lagi.",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
    name: "Dimas Saputra",
    role: "Siswa SMA",
  },
  {
    text: "Simple, fokus, dan gak ribet. Cocok banget buat persiapan UTBK tanpa distraksi.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
    name: "Siti Rahma",
    role: "Pejuang SNBT",
  },
];

/* ⭐ Star Icon Component */
function Stars() {
  return (
    <div className="flex items-center justify-center mt-3 gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 16 15"
          fill="currentColor"
          className="text-secondary"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z" />
        </svg>
      ))}
    </div>
  );
}

/* 💬 Quote Icon Component */
function QuoteIcon() {
  return (
    <svg
      width="40"
      height="36"
      viewBox="0 0 44 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
        fill="currentColor"
      />
    </svg>
  );
}
