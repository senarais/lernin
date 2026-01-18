"use client";

import { useRef, useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FaqsCard = ({ faqsList, idx }: { faqsList: FaqItem; idx: number }) => {
  const answerElRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [answerH, setAnswerH] = useState("0px");

  const handleOpenAnswer = () => {
    const answerElH = answerElRef.current?.childNodes[0] as HTMLElement;
    if (answerElH) setAnswerH(`${answerElH.offsetHeight + 20}px`);
    setOpen(!open);
  };

  return (
    <div
      className="space-y-3 mt-5 overflow-hidden border-b border-border font-sans"
      key={idx}
      onClick={handleOpenAnswer}
    >
      <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-foreground font-medium">
        {faqsList.q}
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </h4>
      <div
        ref={answerElRef}
        className="duration-300"
        style={open ? { height: answerH } : { height: "0px" }}
      >
        <div>
          <p className="text-muted-foreground leading-relaxed font-sans">
            {faqsList.a}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function FaqSection() {
  const faqsList: FaqItem[] = [
    {
      q: "Apa itu Lernin?",
      a: "Lernin adalah platform belajar digital yang membantu pengguna memahami materi secara bertahap melalui video, kuis, dan sistem progress yang terstruktur.",
    },
    {
      q: "Bagaimana sistem belajar di Lernin bekerja?",
      a: "Pengguna memulai dari menonton video pembelajaran, lalu mengerjakan kuis untuk menguji pemahaman. Progress akan tercatat otomatis setelah semua tahapan diselesaikan.",
    },
    {
      q: "Apakah saya bisa melanjutkan belajar nanti?",
      a: "Bisa. Lernin menyimpan progres belajar kamu, jadi kamu bisa melanjutkan materi dari terakhir kali berhenti.",
    },
    {
      q: "Apakah semua materi di Lernin dilengkapi kuis?",
      a: "Sebagian besar modul dilengkapi kuis untuk memastikan pemahaman materi, namun beberapa modul pengantar hanya berisi video pembelajaran.",
    },
    {
      q: "Siapa saja yang cocok menggunakan Lernin?",
      a: "Lernin cocok untuk pelajar, mahasiswa, maupun siapa pun yang ingin belajar secara mandiri dengan alur yang jelas dan terukur.",
    },
    {
      q: "Apakah Lernin gratis?",
      a: "Lernin menyediakan akses gratis untuk materi dasar. Untuk fitur lanjutan dan modul premium, tersedia paket berlangganan.",
    },
  ];

  return (
    <section className="leading-relaxed max-w-7xl mt-20 mx-auto px-4 md:px-8 font-sans">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-foreground font-sans">
          Pertanyaan yang Sering Ditanyakan
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-lg font-sans">
          Jawaban atas pertanyaan umum seputar penggunaan Lernin dan sistem
          pembelajaran di dalamnya.
        </p>
      </div>
      <div className="mt-14 max-w-2xl mx-auto bg-card p-6 rounded-2xl border shadow-2xl">
        {faqsList.map((item, idx) => (
          <FaqsCard key={idx} idx={idx} faqsList={item} />
        ))}
      </div>
    </section>
  );
}
