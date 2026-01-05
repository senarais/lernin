"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");

  // Ambil data user saat komponen mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        if (res.status === 401) {
          setUsername(""); // user belum login
          return;
        }

        const data = await res.json();
        setUsername(data.user.username);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // supaya link tidak reload halaman

    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookie tetap dikirim
      });

      if (res.ok) {
        setUsername(""); // reset username setelah logout
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <h1>Lernin Demo</h1>
      {username ? <p>Welcome, {username}!</p> : <p>Please log in.</p>}
      <ul>
        <li>
          <a href="/register">Register</a>
        </li>
        <li>
          <a href="/login">Login</a>
        </li>
        <li>
          <a href="#" onClick={handleLogout}>
            Logout
          </a>
        </li>
        <li>
          <a href="/me">Me</a>
        </li>

        {/* ✅ Link ke Course */}
        <li>
          <a href="/course">Course</a>
        </li>
      </ul>
    </main>
  );
}
