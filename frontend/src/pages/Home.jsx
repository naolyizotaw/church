import React, { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../services/api';
import AnnouncementCard from '../components/AnnouncementCard.jsx';
import { Church, Menu, PlayCircle, ArrowRight, MapPin, Mail, Youtube, Facebook, Twitter, X } from 'lucide-react';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          text: `"${data.text.trim()}"`,
          reference: `${data.reference}`,
          amharic_text: '"ኢየሱስ ክርስቶስ ትናንትና ዛሬ እንዲሁም ለዘላለም አንድ ነው።"',
          amharic_ref: "ዕብራውያን 13፥8"
        });
      } catch (error) {
        console.error("Failed to fetch verse:", error);
        // Fallback verse in case of API failure
        setVerse({
          text: '"Jesus Christ is the same yesterday and today and forever."',
          reference: "Hebrews 13:8",
          amharic_text: '"ኢየሱስ ክርስቶስ ትናንትና ዛሬ እንዲሁም ለዘላለም አንድ ነው።"',
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-background-dark text-text-main dark:text-white font-body">

      {/* --- Header --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f0f4f4] dark:bg-background-dark/95 dark:border-gray-800 shadow-sm">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <Church className="text-primary" size={32} strokeWidth={2} />
            <h2 className="hidden md:block text-lg font-bold text-text-main dark:text-white">Kerabu Full Gospel Church</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#ministries" className="text-sm font-medium hover:text-primary transition-colors">Ministries</a>
            <a href="#sermons" className="text-sm font-medium hover:text-primary transition-colors">Sermons</a>
            <a href="#give" className="text-sm font-medium hover:text-primary transition-colors">Give</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-lg h-9 px-3 bg-primary/10 hover:bg-primary/20 text-sm font-bold text-text-main dark:text-white transition-colors">
              EN | አማ
            </button>
            <button 
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col px-4 py-4 gap-2">
              <a href="#home" className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">Home</a>
              <a href="#about" className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">About</a>
              <a href="#ministries" className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">Ministries</a>
              <a href="#sermons" className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">Sermons</a>
              <a href="#give" className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">Give</a>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow" id="home">
        {/* --- Hero Section --- */}
        <section className="w-full bg-white dark:bg-background-dark">
          <div className="mx-auto max-w-[1280px] px-4 md:px-10 py-6 md:py-10">
            <div
              className="relative overflow-hidden rounded-2xl min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center text-center p-8 md:p-16 gap-8 bg-cover bg-center shadow-xl"
              style={{ backgroundImage: `linear-gradient(rgba(17, 30, 33, 0.5) 0%, rgba(17, 30, 33, 0.7) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3T9CfnmZFfXyWfhjoQShuvSBI9_u7gJkTMIM2MF2Qbr268LX1ETxNyQyh3mFpacwwlvlO8wZQ17JDZ9GpRg26isrLyvUgzyJjFe2opGMw1Kxq_IHdQq6VmJFoK2vF_TsF4vUm9FMaRF7vVyyFukhoq-h08HN3zVZaF12qRcYz6dL2ujdenVXctDjnPwvk6F_4_oCLbCyUbCTwj2Ufyw3_SfhSWwtLgEeqin5qkwenRgY4myNSO2qSb3xNekevCEBTyRORy1IdBsQ')` }}
            >
              <div className="max-w-[950px] flex flex-col gap-6 z-10">
                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight font-display">
                  Welcome to Kerabu Full Gospel Believers Church
                </h1>
                <p className="text-white/95 text-xl md:text-3xl lg:text-4xl font-normal font-display">
                  እንኳን ወደ ከራቡ ሙሉ ወንጌል አማኞች ቤተክርስቲያን በደህና መጡ
                </p>
                <p className="text-gray-100 text-lg md:text-xl font-normal max-w-3xl mx-auto mt-2">
                  A place of faith, hope, and community where everyone is welcome.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center z-10 mt-2">
                <button className="flex min-w-[160px] items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-primary-dark text-text-main font-bold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105">
                  Join Us This Sunday
                </button>
                <button className="flex min-w-[160px] items-center justify-center gap-2 rounded-lg h-12 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-base transition-all hover:scale-105">
                  <PlayCircle size={20} />
                  Watch Sermons
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Scripture of the Day --- */}
        <section className="w-full py-12 md:py-16 bg-background-light dark:bg-background-dark">
          <div className="mx-auto max-w-[960px] w-full px-4 md:px-10">
            <div className="bg-white dark:bg-[#1a2c32] rounded-2xl p-8 md:p-14 shadow-md border border-[#e8eded] dark:border-gray-800 flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-primary/40"></span>
                <p className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest">Scripture of the Day | የዕለቱ ቃል</p>
                <span className="h-px w-10 bg-primary/40"></span>
              </div>
              {verse ? (
                <>
                  <h2 className="text-text-main dark:text-gray-100 text-2xl md:text-4xl font-bold leading-relaxed mb-5 font-display max-w-[800px]">{verse.text}</h2>
                  <h3 className="text-text-muted dark:text-gray-300 text-lg md:text-2xl font-normal leading-relaxed mb-7 font-display max-w-[800px]">{verse.amharic_text}</h3>
                  <p className="text-xs md:text-sm font-bold text-text-muted dark:text-gray-400 bg-background-light dark:bg-background-dark px-5 py-2.5 rounded-full">
                    {verse.reference} | {verse.amharic_ref}
                  </p>
                </>
              ) : (
                 <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* --- Upcoming Events --- */}
        <section className="w-full py-12 md:py-16 bg-white dark:bg-background-dark" id="events">
          <div className="mx-auto max-w-[1280px] w-full px-4 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 pb-6 border-b border-[#e8eded] dark:border-gray-800">
              <div className="flex flex-col gap-2">
                <h2 className="text-text-main dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Upcoming Events</h2>
                <p className="text-text-muted dark:text-gray-400 text-base md:text-lg">የቤተክርስቲያን መርሐ ግብሮች</p>
              </div>
              <a href="#events" className="text-primary font-bold hover:underline flex items-center gap-2 group text-base">
                View All Events
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
              </a>
            </div>
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-text-muted dark:text-gray-400">Loading Events...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {announcements.map(announcement => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- Newsletter CTA --- */}
        <section className="w-full bg-gradient-to-br from-primary/8 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/5 dark:to-primary/8 border-y border-primary/15">
          <div className="mx-auto max-w-[1280px] w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-10 py-14 md:py-16">
            <div className="flex flex-col gap-2 text-center md:text-left max-w-md">
              <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Stay Connected with Kerabu</h3>
              <p className="text-text-muted dark:text-gray-400 text-base">Get updates on services, events, and prayer requests.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-lg gap-3">
              <input 
                className="flex-1 h-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark dark:text-white px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all" 
                placeholder="Enter your email address" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit"
                className="h-12 px-8 rounded-lg bg-primary text-text-main font-bold hover:bg-primary-dark transition-all shadow-sm hover:shadow-md hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-background-light dark:bg-[#0d1618] pt-16 pb-8 border-t border-[#e8eded] dark:border-gray-800">
        <div className="mx-auto max-w-[1280px] w-full px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {/* Brand Column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-text-main dark:text-white">
                <Church className="text-primary" size={36} strokeWidth={2} />
                <div className="flex flex-col">
                  <span className="text-lg font-bold leading-tight">Kerabu</span>
                  <span className="text-lg font-bold leading-tight">Full Gospel</span>
                </div>
              </div>
              <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                Proclaiming the gospel, serving the community, and building a family of believers.
              </p>
              <div className="flex gap-3 mt-2">
                  <a href="#" className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all">
                    <Youtube size={20} />
                  </a>
                  <a href="#" className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all">
                    <Mail size={20} />
                  </a>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-5 text-text-main dark:text-white text-base">Quick Links</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-text-muted dark:text-gray-400">
                <li><a href="#about" className="hover:text-primary transition-colors hover:underline">About Us</a></li>
                <li><a href="#beliefs" className="hover:text-primary transition-colors hover:underline">Our Beliefs</a></li>
                <li><a href="#ministries" className="hover:text-primary transition-colors hover:underline">Ministries</a></li>
                <li><a href="#give" className="hover:text-primary transition-colors hover:underline">Give Online</a></li>
              </ul>
            </div>
            {/* Service Times */}
            <div>
              <h4 className="font-bold mb-5 text-text-main dark:text-white text-base">Service Times</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-muted dark:text-gray-400">
                  <li className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                      <span>Sunday Worship</span>
                      <span className="font-semibold text-text-main dark:text-gray-200">10:00 AM</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
                      <span>Wednesday Prayer</span>
                      <span className="font-semibold text-text-main dark:text-gray-200">6:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                      <span>Friday Youth</span>
                      <span className="font-semibold text-text-main dark:text-gray-200">5:00 PM</span>
                  </li>
              </ul>
            </div>
            {/* Visit Us */}
            <div>
                <h4 className="font-bold mb-5 text-text-main dark:text-white text-base">Visit Us</h4>
                <div className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      alt="Map Location" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIpRj2umDRPLKsYL80hBhhpY9tLLDZ_8sfE1CBErNZYMNZYy32LCTVsN9_rCvfeZ4mu45Enwz5H2oBA_oz51a3MSw75HglqC083Xdfbygj_elNP599C1T__jgl5mM8O6uesZTw1xHAKpzucdLaq6MlzOtSqGVU2c-BQV6zmMPizjNtMk3foYj8DaMOEinyKfdrNnMy6dOY8M7JjcKlkLXFrzGCgOX7ceJLE9B8gLGlqKgTsXanmmQNuroFB4nazddv08VdGLZsZO8" 
                      className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <span className="bg-white text-text-main text-xs font-bold px-4 py-2 rounded-lg shadow-md group-hover:scale-105 transition-transform">
                          Get Directions
                        </span>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 mt-4">
                    <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">Addis Ababa, Ethiopia</span>
                      <span>Kerabu Full Gospel Church</span>
                    </div>
                </div>
            </div>
          </div>
          <div className="mt-14 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted dark:text-gray-500">
              <p>© 2024 Kerabu Full Gospel Believers Church. All rights reserved.</p>
              <div className="flex gap-6">
                  <a href="#privacy" className="hover:text-primary transition-colors hover:underline">Privacy Policy</a>
                  <a href="#terms" className="hover:text-primary transition-colors hover:underline">Terms of Service</a>
              </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

