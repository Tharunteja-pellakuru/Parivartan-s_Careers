import React, { useState } from "react";
import {
  ArrowRight,
  Code,
  Palette,
  Rocket,
  Star,
  Users,
  Video,
  MapPin,
  Trophy,
  Car,
  CheckCircle,
  Mail,
  Phone,
  Leaf,
  Coffee,
} from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationModal from "../components/ApplicationModal";
import CountUpAnimation from "../components/CountUpAnimation";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToStory = () => {
    const element = document.getElementById("story");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="animate-in fade-in duration-700 selection:bg-brand-100 selection:text-brand-900">
      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-10 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

        {/* Animated Background Blobs - REMOVED */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center items-center gap-2 text-sm font-bold text-brand-500 mb-8 animate-fade-in-up tracking-wider uppercase">
            <span className="px-3 py-1 bg-brand-50 rounded-full border border-brand-100 flex items-start gap-2 text-xs sm:text-sm text-left">
              <Rocket size={14} className="shrink-0 mt-0.5" /> Vision-Perfect
              Concepts. Pixel-Perfect Designs.
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 tracking-tight mb-6 animate-fade-in-up font-heading leading-[1.1]">
            Join the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">
              Change.
            </span>{" "}
            <br />
            Build the <span className="text-slate-800">Future.</span>
          </h1>

          <p
            className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 animate-fade-in-up font-light leading-relaxed text-center"
            style={{ animationDelay: "0.2s" }}
          >
            Parivartan means change. At eParivartan, we don't just adapt to
            change—we create it. Join our team of passionate designers,
            developers, and digital strategists.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center gap-5 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to="/positions"
              className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-lg font-bold transition-all shadow-xl hover:shadow-brand-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 group text-base md:text-lg"
            >
              View Current Openings
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Stats Row */}
          <div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              {
                icon: <Trophy className="h-6 w-6" />,
                end: 20,
                suffix: "+",
                label: "Years of Excellence",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                end: 5.0,
                suffix: "K+",
                decimals: 1,
                label: "Projects Delivered",
              },
              {
                icon: <Star className="h-6 w-6" />,
                end: 4.8,
                suffix: "/5",
                decimals: 1,
                label: "Client Rating",
              },
              {
                icon: <Users className="h-6 w-6" />,
                end: 30,
                suffix: "+",
                label: "Team Members",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm p-4 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center hover:-translate-y-2 group"
              >
                <div className="mb-5 mt-2 p-4 bg-brand-50 rounded-full text-brand-500 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 font-heading">
                  <CountUpAnimation
                    end={stat.end}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <div className="text-sm text-slate-500 font-medium mt-2 mb-5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="pb-10 pt-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Our Location
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-100 rounded-full text-brand-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    Hyderabad Office
                  </h3>
                  <p className="text-brand-500 font-medium">Headquarters</p>
                </div>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                <strong>Parivartan Software & Multimedia Pvt. Ltd.</strong>
                <br />
                Flat no 201, Vasudha Avenue, Road Number 10, Kavuri Hills,
                Hyderabad - 500033 Telangana State
              </p>
              <ul className="space-y-5">
                {[
                  {
                    icon: <Users size={20} />,
                    text: "Modern collaborative work areas",
                  },
                  {
                    icon: <Car size={20} />,
                    text: "Easy public transport access",
                  },
                  {
                    icon: <Coffee size={20} />,
                    text: "Surrounded by cafes & amenities",
                  },
                  {
                    icon: <CheckCircle size={20} />,
                    text: "Ample parking facilities",
                  },
                ].map((itm, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-slate-700 font-medium"
                  >
                    <span className="text-brand-500 bg-brand-50 p-1.5 rounded-full">
                      {itm.icon}
                    </span>
                    {itm.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl flex items-center justify-center h-full min-h-[300px] md:min-h-[400px] relative overflow-hidden shadow-inner border border-slate-200">
              {/* Placeholder for Map */}
              {/* <div className="text-center z-10 relative">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                           <MapPin className="h-10 w-10 text-brand-500" />
                        </div>
                        <p className="font-bold text-lg text-slate-600">Map Integration</p>
                        <p className="text-sm text-slate-400">Hyderabad, Telangana</p>
                     </div> */}

              {/* Decorative Circles */}
              <div className="absolute inset-0">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-brand-500/20 rounded-full animate-ping"
                  style={{ animationDuration: "3s" }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-brand-500/10 rounded-full animate-ping"
                  style={{ animationDuration: "4s", animationDelay: "1s" }}
                ></div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15225.19098656789!2d78.3975591!3d17.4454575!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xe0ce6ff63d856fff!2seParivartan!5e0!3m2!1sen!2sin!4v1671609496367!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="py-16 md:py-28 bg-brand-500 text-center relative overflow-hidden">
        {/* CTA Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float mix-blend-overlay"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white/5 rounded-full animate-float-delayed mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float backdrop-blur-sm border border-white/20">
            <img src="../assets/fav-icon.png" alt="" />{" "}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-heading">
            Ready to Create Change?
          </h2>
          <p className="text-brand-50 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Join Team Parivartan and build your career with a company that
            values innovation, creativity, and growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            {/* <Link
              to="/positions"
              className="bg-white text-brand-700 hover:bg-brand-50 px-10 py-4 rounded-lg font-bold transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              View Current Openings
            </Link> */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 md:px-10 md:py-4 rounded-lg font-bold transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-base md:text-lg"
              aria-label="Apply General Application"
            >
              <Mail size={20} /> General Application
            </button>
          </div>
        </div>
      </section>

      {}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Email */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=careers@eparivartan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 md:p-8 hover:bg-slate-50 rounded-2xl transition-all group block"
          >
            <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-brand-500 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Mail />
            </div>

            <h4 className="font-bold text-lg text-slate-900 mb-1 font-heading">
              Email Us
            </h4>
            <p className="text-slate-500">careers@eparivartan.com</p>
          </a>

          {/* Phone */}
          <a
            href="tel:+919849165443"
            className="p-6 md:p-8 border-l-0 border-r-0 md:border-l md:border-r border-slate-100 hover:bg-slate-50 rounded-2xl transition-all group block"
          >
            <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-brand-500 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Phone />
            </div>

            <h4 className="font-bold text-lg text-slate-900 mb-1 font-heading">
              Call Us
            </h4>
            <p className="text-slate-500">+91 98491 65443</p>
          </a>

          {/* Connect */}
          <a
            href="https://www.linkedin.com/company/eparivartan"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 md:p-8 hover:bg-slate-50 rounded-2xl transition-all group block"
          >
            <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-brand-500 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <Users />
            </div>

            <h4 className="font-bold text-lg text-slate-900 mb-1 font-heading">
              Connect
            </h4>
            <p className="text-slate-500">Follow us on LinkedIn</p>
          </a>
        </div>
      </section>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        positionTitle="General Application"
      />
    </div>
  );
};

export default Home;
