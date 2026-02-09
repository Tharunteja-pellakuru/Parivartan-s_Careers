import React, { useState } from "react";

const Process = () => {
  const steps = [
    {
      id: 1,
      title: "Application Review",
      time: "2–3 days",
      desc: "We carefully review your portfolio/resume and assess your fit for the role.",
    },
    {
      id: 2,
      title: "Initial Screening",
      time: "30 minutes",
      desc: "Phone/video call with HR to discuss your experience and expectations.",
    },
    {
      id: 3,
      title: "Skills Assessment",
      time: "Varies by role",
      desc: "Complete a design task, coding challenge, or marketing assignment.",
    },
    {
      id: 4,
      title: "Team Interview",
      time: "1 hour",
      desc: "Meet your team lead for technical/creative evaluation and culture fit check.",
    },
    {
      id: 5,
      title: "Leadership Meeting",
      time: "30 minutes",
      desc: "Interact with our leadership team to align on values and goals.",
    },
    {
      id: 6,
      title: "Offer & Onboarding",
      time: "2–3 days",
      desc: "Receive your offer letter and begin your journey with Team Parivartan!",
    },
  ];

  return (
    <div className="bg-white min-h-screen pt-20 pb-32 animate-in fade-in duration-500">
      <div className="text-center mb-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading animate-fade-in-up">
          Our Hiring Process
        </h1>
        <div
          className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <p
          className="text-slate-500 mt-6 text-lg animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          From application to offer in 2–3 weeks
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border-l-2 border-brand-200 ml-6 md:ml-10 space-y-16">
          {steps.map((step) => (
            <div key={step.id} className="relative pl-12 md:pl-16 group">
              {/* Circle Number */}
              <div className="absolute left-[-21px] top-0 flex items-center justify-center w-11 h-11 rounded-full bg-white text-brand-500 font-bold shadow-md border-4 border-brand-500 z-10 group-hover:scale-110 transition-transform duration-300">
                {step.id}
              </div>

              {/* Content Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    {step.title}
                  </h3>
                  <span className="text-brand-500 text-sm font-bold uppercase tracking-wide bg-brand-50 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                    {step.time}
                  </span>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process;
