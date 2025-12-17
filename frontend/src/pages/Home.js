import React, { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../services/api';
import AnnouncementCard from '../components/AnnouncementCard.js';
import { Church, Menu, PlayCircle, ArrowRight, MapPin, Mail, Youtube, Facebook, Twitter } from 'lucide-react';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    const getVerse = async () => {
      try {
        // Fetching the specific verse from the design for consistency
        const response = await fetch('https://bible-api.com/hebrews%2013:8');
        const data = await response.json();
        setVerse({
          text: `“${data.text.trim()}”`,
          reference: `${data.reference}`,
          amharic_text: "“ኢየሱስ ክርስቶስ ትናንትና ዛሬ እንዲሁም ለዘላለም አንድ ነው።”",
          amharic_ref: "ዕብራውያን 13፥8"
        });
      } catch (error) {
        console.error("Failed to fetch verse:", error);
        // Fallback verse in case of API failure
        setVerse({
          text: "“Jesus Christ is the same yesterday and today and forever.”",
          reference: "Hebrews 13:8",
          amharic_text: "“ኢየሱስ ክርስቶስ ትናንትና ዛሬ እንዲሁም ለዘላለም አንድ ነው።”",
          amharic_ref: "ዕብራውያን 13፥8"
        });
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([getAnnouncements(), getVerse()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Define colors based on the design reference for easy reuse
  const colors = {
    primary: '#19c3e6',
    backgroundLight: '#f6f8f8',
    backgroundDark: '#111e21',
    textMain: '#111718',
    textMuted: '#638288',
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-white font-body">

      {/* --- Header --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f0f4f4] dark:bg-background-dark/95 dark:border-gray-800">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 md:px-10">
          <div className="flex items-center gap-3">
            <Church className="text-primary" size={32} />
            <h2 className="hidden md:block text-lg font-bold">Kerabu Full Gospel Church</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Ministries</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Sermons</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Give</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-lg h-9 px-3 bg-primary/10 hover:bg-primary/20 text-sm font-bold">
              EN | አማ
            </button>
            <button className="md:hidden">
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="w-full">
          <div className="mx-auto max-w-[1280px] px-4 md:px-10 py-6 md:py-10">
            <div
              className="relative overflow-hidden rounded-xl min-h-[500px] flex flex-col items-center justify-center text-center p-6 md:p-12 gap-8 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(rgba(17, 30, 33, 0.4) 0%, rgba(17, 30, 33, 0.7) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3T9CfnmZFfXyWfhjoQShuvSBI9_u7gJkTMIM2MF2Qbr268LX1ETxNyQyh3mFpacwwlvlO8wZQ17JDZ9GpRg26isrLyvUgzyJjFe2opGMw1Kxq_IHdQq6VmJFoK2vF_TsF4vUm9FMaRF7vVyyFukhoq-h08HN3zVZaF12qRcYz6dL2ujdenVXctDjnPwvk6F_4_oCLbCyUbCTwj2Ufyw3_SfhSWwtLgEeqin5qkwenRgY4myNSO2qSb3xNekevCEBTyRORy1IdBsQ')` }}
            >
              <div className="max-w-[900px] flex flex-col gap-4 z-10">
                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-[1.2] tracking-tight font-display">
                  Welcome to Kerabu Full Gospel Believers Church
                  <span className="font-normal text-2xl md:text-4xl mt-2 block opacity-90">እንኳን ወደ ከራቡ ሙሉ ወንጌል አማኞች ቤተክርስቲያን በደህና መጡ</span>
                </h1>
                <p className="text-gray-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  A place of faith, hope, and community where everyone is welcome.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center z-10 mt-4">
                <button className="flex min-w-[140px] items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-[#15a3c0] text-text-main font-bold text-base transition-colors shadow-lg shadow-cyan-500/20">
                  Join Us This Sunday
                </button>
                <button className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-base transition-colors">
                  <PlayCircle size={20} />
                  Watch Sermons
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Scripture of the Day --- */}
        <section className="w-full py-10">
          <div className="mx-auto max-w-[960px] w-full px-4 md:px-10">
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl p-8 md:p-12 shadow-sm border border-[#f0f4f4] dark:border-gray-800 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-primary/50"></span>
                <p className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest">Scripture of the Day | የዕለቱ ቃል</p>
                <span className="h-px w-8 bg-primary/50"></span>
              </div>
              {verse ? (
                <>
                  <h2 className="text-text-main dark:text-gray-100 text-2xl md:text-3xl font-bold leading-relaxed mb-4 font-display">{verse.text}</h2>
                  <h3 className="text-text-muted dark:text-gray-300 text-xl md:text-2xl font-normal leading-relaxed mb-6 font-display">{verse.amharic_text}</h3>
                  <p className="text-sm font-bold text-text-muted dark:text-gray-400 bg-background-light dark:bg-background-dark px-4 py-2 rounded-full">
                    {verse.reference} | {verse.amharic_ref}
                  </p>
                </>
              ) : (
                 <div className="h-32 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* --- Upcoming Events --- */}
        <section className="w-full py-12 bg-white dark:bg-background-dark">
          <div className="mx-auto max-w-[1280px] w-full px-4 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-[#f0f4f4] dark:border-gray-800 pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-text-main dark:text-white text-3xl font-bold tracking-tight">Upcoming Events</h2>
                <p className="text-text-muted dark:text-gray-400 text-lg">የቤተክርስቲያን መርሐ ግብሮች</p>
              </div>
              <a href="#" className="text-primary font-bold hover:underline flex items-center gap-1 group">
                View All Events
                <ArrowRight className="text-lg transition-transform group-hover:translate-x-1" size={18} />
              </a>
            </div>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-text-muted">Loading Events...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map(announcement => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- Newsletter CTA --- */}
        <section className="w-full bg-primary/10 dark:bg-primary/5 border-y border-primary/20">
          <div className="mx-auto max-w-[1280px] w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-10 py-12">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-text-main dark:text-white">Stay Connected with Kerabu</h3>
              <p className="text-text-muted dark:text-gray-400">Get updates on services, events, and prayer requests.</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <input className="flex-1 h-12 rounded-lg border-transparent bg-white dark:bg-background-dark dark:text-white px-4 focus:border-primary focus:ring-0 shadow-sm" placeholder="Enter your email address" type="email" />
              <button className="h-12 px-6 rounded-lg bg-primary text-text-main font-bold hover:bg-[#15a3c0] transition-colors">Subscribe</button>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-background-light dark:bg-[#0d1618] pt-16 pb-8 border-t border-[#f0f4f4] dark:border-gray-800">
        <div className="mx-auto max-w-[1280px] w-full px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-text-main dark:text-white">
                <Church className="text-primary" size={32} />
                <span className="text-lg font-bold">Kerabu Full Gospel</span>
              </div>
              <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                Proclaiming the gospel, serving the community, and building a family of believers.
              </p>
              <div className="flex gap-4 mt-2">
                  <a href="#" className="text-text-muted hover:text-primary"><Facebook size={20} /></a>
                  <a href="#" className="text-text-muted hover:text-primary"><Twitter size={20} /></a>
                  <a href="#" className="text-text-muted hover:text-primary"><Youtube size={20} /></a>
                  <a href="#" className="text-text-muted hover:text-primary"><Mail size={20} /></a>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="flex flex-col gap-2 text-sm text-text-muted dark:text-gray-400">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Our Beliefs</a></li>
                <li><a href="#" className="hover:text-primary">Ministries</a></li>
                <li><a href="#" className="hover:text-primary">Give Online</a></li>
              </ul>
            </div>
            {/* Service Times */}
            <div>
              <h4 className="font-bold mb-4">Service Times</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-muted dark:text-gray-400">
                  <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                      <span>Sunday Worship</span>
                      <span className="font-medium text-text-main dark:text-gray-200">10:00 AM</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                      <span>Wednesday Prayer</span>
                      <span className="font-medium text-text-main dark:text-gray-200">6:00 PM</span>
                  </li>
                  <li className="flex justify-between pb-2">
                      <span>Friday Youth</span>
                      <span className="font-medium text-text-main dark:text-gray-200">5:00 PM</span>
                  </li>
              </ul>
            </div>
            {/* Visit Us */}
            <div>
                <h4 className="font-bold mb-4">Visit Us</h4>
                <div className="h-32 w-full rounded-lg bg-gray-200 overflow-hidden relative cursor-pointer group">
                    <img alt="Map Location" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIpRj2umDRPLKsYL80hBhhpY9tLLDZ_8sfE1CBErNZYMNZYy32LCTVsN9_rCvfeZ4mu45Enwz5H2oBA_oz51a3MSw75HglqC083Xdfbygj_elNP599C1T__jgl5mM8O6uesZTw1xHAKpzucdLaq6MlzOtSqGVU2c-BQV6zmMPizjNtMk3foYj8DaMOEinyKfdrNnMy6dOY8M7JjcKlkLXFrzGCgOX7ceJLE9B8gLGlqKgTsXanmmQNuroFB4nazddv08VdGLZsZO8" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <span className="bg-white text-text-main text-xs font-bold px-3 py-1.5 rounded shadow group-hover:scale-105 transition-transform">Get Directions</span>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 mt-2">
                    <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>Addis Ababa, Ethiopia<br/>Kerabu Full Gospel Church</span>
                </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted dark:text-gray-500">
              <p>© 2024 Kerabu Full Gospel Believers Church. All rights reserved.</p>
              <div className="flex gap-6">
                  <a href="#" className="hover:text-primary">Privacy Policy</a>
                  <a href="#" className="hover:text-primary">Terms of Service</a>
              </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
