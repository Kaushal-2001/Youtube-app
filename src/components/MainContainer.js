import React from "react";
import HeroSection from "./HeroSection";
import ButtonList from "./ButtonList";
import VideoContainer from "./VideoContainer";
import Footer from "./Footer";

const SectionHeader = ({ num, title, accent, subtitle }) => (
  <div className="flex items-baseline gap-4 mb-6">
    <span className="text-[11px] text-white/25 tracking-[0.22em] font-medium pt-3 font-mono tabular-nums">
      — {num}
    </span>
    <div>
      <h2 className="text-[32px] font-serif text-white leading-tight font-normal">
        {title}{" "}
        <span className="italic text-[#d8a86a] font-normal">{accent}</span>
      </h2>
      {subtitle && (
        <p className="text-[13px] text-white/40 mt-1.5">{subtitle}</p>
      )}
    </div>
  </div>
);

const MainContainer = () => (
  <div className="max-w-[1400px] mx-auto px-6 py-6">
    <HeroSection />

    {/* 01 — Browse by mood */}
    <section className="mt-20">
      <SectionHeader
        num="01"
        title="Browse"
        accent="by mood"
        subtitle="Tastefully curated channels, updated hourly"
      />
      <ButtonList />
    </section>

    {/* 02 — Fresh on your radar */}
    <section className="mt-16">
      <SectionHeader
        num="02"
        title="Fresh on"
        accent="your radar"
        subtitle={
          <>
            Because you watched{" "}
            <span className="font-serif italic text-white/55">
              The Quiet Cities
            </span>{" "}
            and three architecture essays
          </>
        }
      />
      <VideoContainer />
    </section>

    <Footer />
  </div>
);

export default MainContainer;
