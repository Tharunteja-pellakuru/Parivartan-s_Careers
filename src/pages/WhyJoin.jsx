import React, { useState } from "react";
import {
  BookOpen,
  Briefcase,
  Gift,
  TrendingUp,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  Heart,
  ShieldCheck,
} from "lucide-react";

// Import CheckCircle locally for the benefits list
import { CheckCircle } from "lucide-react";

const WhyJoin = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Do you hire freshers?",
      a: "Yes, we hire freshers who demonstrate strong potential, a learning attitude, and basic skills in their respective fields. We provide mentorship to help you grow.",
    },
    {
      q: "Is remote work available?",
      a: "Our culture thrives on collaboration. While we are primarily office-based to foster teamwork, we offer flexible hybrid options for senior roles or specific circumstances.",
    },
    {
      q: "What's the work culture like?",
      a: "We are a family. We work hard, play hard, and treat everyone with respect. No corporate politics, just passion for quality work.",
    },
    {
      q: "What technologies do you work with?",
      a: "We work across the stack: React, Node.js, PHP, WordPress, native mobile apps, Adobe Creative Suite, Figma, and more.",
    },
    {
      q: "How long is the hiring process?",
      a: "Typically 2-3 weeks from application to offer. We respect your time and try to move as fast as possible.",
    },
    {
      q: "Do you provide training?",
      a: "Absolutely. We believe in continuous learning. You will have access to courses, mentorship, and paid time for skill development.",
    },
  ];

  return (
    <div className="bg-white animate-in fade-in duration-500">
      {/* Header */}
      <div className="pt-20 pb-14 text-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 animate-fade-in-up font-heading">
            Why Join Team Parivartan?
          </h1>
          <div
            className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <p
            className="text-xl text-slate-600 mt-6 max-w-2xl mx-auto animate-fade-in-up leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            Discover what makes eParivartan the perfect place to grow your
            career.
          </p>
        </div>
      </div>

      {/* Philosophy & Uniqueness */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18 grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          {
            icon: <Zap />,
            title: "The Parivartan Philosophy",
            bg: "bg-brand-500",
            items: [
              '"Parivartan" means change for the better',
              "We love to take risks and push boundaries",
              "Constant evolution with everlasting vigor",
              "Not bound by job titles, united by passion",
            ],
          },
          {
            icon: <Users />,
            title: "What Makes Us Unique",
            bg: "bg-blue-500",
            items: [
              "Boutique studio environment (not a corporate factory)",
              "Direct exposure to leadership team",
              "Work on diverse, high-impact projects",
              "From startups to established enterprises",
            ],
          },
          {
            icon: <TrendingUp />,
            title: "Growth & Learning",
            bg: "bg-purple-500",
            items: [
              "20 years of industry expertise to learn from",
              "Work with latest technologies",
              "Exposure to full project lifecycle",
              "Mentorship from experienced leadership team",
            ],
          },
          {
            icon: <BookOpen />,
            title: "Creative Freedom",
            bg: "bg-pink-500",
            items: [
              "Encouraged to experiment with latest technologies",
              '"We believe in change and that is what we deliver"',
              "Design-first culture with pixel-perfect standards",
            ],
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group h-full"
          >
            <div
              className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg`}
            >
              {card.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
              {card.title}
            </h3>
            <ul className="space-y-4 text-base text-slate-600">
              {card.items.map((item, j) => (
                <li key={j} className="flex gap-3 items-start">
                  <span className="mt-1 h-1.5 w-1.5 bg-brand-500 rounded-full flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Benefits Grid Title */}
      <div className="text-center py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-heading">
          Benefits & Perks
        </h2>
        <div className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full"></div>
      </div>

      {/* Benefits Grid */}
      <div className="bg-white pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Professional Growth",
              icon: <BookOpen className="text-brand-500 h-8 w-8" />,
              items: [
                "Work on 5000+ types of projects",
                "Diverse industry exposure",
                "Latest technology experimentation",
                "Learning from 20-year expertise",
              ],
            },
            {
              title: "Work Environment",
              icon: <Briefcase className="text-brand-500 h-8 w-8" />,
              items: [
                "Boutique studio setting",
                "Prime Hyderabad location",
                "Collaborative atmosphere",
                "Direct access to leadership",
              ],
            },
            {
              title: "Project Exposure",
              icon: <Zap className="text-brand-500 h-8 w-8" />,
              items: [
                "Government projects (ESTIC 2025)",
                "Corporate clients (BCG, HDFC)",
                "Celebrity clients",
                "Startups and enterprise solutions",
              ],
            },
            {
              title: "Additional Benefits",
              icon: <Gift className="text-brand-500 h-8 w-8" />,
              items: [
                "Competitive salary",
                "Health insurance",
                "Professional development budget",
                "Team outings and celebrations",
              ],
            },
          ].map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-slate-200 group h-full"
            >
              <div className="mb-6 p-4 bg-brand-50 rounded-2xl w-fit group-hover:bg-brand-50 group-hover:text-white transition-colors duration-300">
                {/* We clone the element to change color on hover via CSS if needed, or just rely on parent group hover */}
                <div className="group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-heading">
                {benefit.title}
              </h3>
              <ul className="space-y-3">
                {benefit.items.map((it, i) => (
                  <li
                    key={i}
                    className="text-slate-600 flex items-center gap-3"
                  >
                    <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Culture Section (Merged) */}
      <div className="pt-14 pb-16 text-center relative z-10 bg-white">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-heading">
          Life at eParivartan
        </h1>
        <div className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 bg-white pb-24">
        {/* Top Row: Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {[
            {
              icon: <Zap className="h-8 w-8 text-white" />,
              title: "Never-Say-Die Attitude",
              desc: "Perseverance even with tight deadlines. Our 'Yes, Boss!' mentality supports each other unconditionally.",
              bgIcon: "bg-brand-500",
            },
            {
              icon: <Heart className="h-8 w-8 text-white" />,
              title: "Family Environment",
              desc: "A close-knit team atmosphere where we celebrate wins together and support each other always.",
              bgIcon: "bg-red-500",
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-white" />,
              title: "Quality Over Everything",
              desc: "Pixel-perfect designs where client satisfaction is the #1 priority. Excellence is our standard.",
              bgIcon: "bg-blue-500",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-10 text-center shadow-lg border border-slate-100 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group"
            >
              <div
                className={`rounded-2xl p-5 ${item.bgIcon} mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Row: Gallery Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Team Photos at Work",
              img: "/src/assets/TeamImage.jpeg",
            },
            {
              label: "Office Space",
              img: "/src/assets/OfficeSpace.webp",
            },
            {
              label: "Team Celebrations",
              img: "/src/assets/TeamCollaboration.webp",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Text Label */}
              <div className="absolute bottom-0 left-0 w-full p-4 text-white text-lg font-semibold font-heading tracking-wide">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12 font-heading">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none"
              >
                <span
                  className={`text-lg font-bold transition-colors font-heading ${openFaq === index ? "text-brand-500" : "text-slate-900"}`}
                >
                  {faq.q}
                </span>
                {openFaq === index ? (
                  <ChevronUp className="text-brand-500" />
                ) : (
                  <ChevronDown className="text-slate-400" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-8 pb-8 text-slate-600 leading-relaxed border-t border-slate-100 pt-6 animate-fade-in-up">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyJoin;
