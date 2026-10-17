import { useState, useEffect } from 'react';
import { Navbar } from './components/Navigation/Navbar';
import { HeroSection } from './components/Hero/HeroSection';
import { StatementSection } from './components/Statement/StatementSection';
import { FeaturesSection } from './components/Features/FeaturesSection';
import { UseCasesSection } from './components/UseCases/UseCasesSection';
import { VideoSection } from './components/Video/VideoSection';
import { PricingSection } from './components/Pricing/PricingSection';
import { DownloadSection } from './components/Download/DownloadSection';
import { GuidesSection } from './components/Guides/GuidesSection';
import { FaqSection } from './components/FAQs/FaqSection';
import { CtaSection } from './components/CTA/CtaSection';
import { FooterSection } from './components/Footer/FooterSection';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0d0d0d] font-sans antialiased selection:bg-black selection:text-white transition-colors duration-200">
      {/* 1. Fixed/Sticky Top Navigation */}
      <Navbar />

      <main>
        {/* 2. Hero Section with Live Desktop Bot Demo */}
        <HeroSection />

        {/* 3. "Message Bots like teammates" Statement Card with Pop-out Mascot */}
        <StatementSection />

        {/* 4. "Work with many Bots at once" 4-Card Feature Grid */}
        <FeaturesSection />

        {/* 5. "Give each Bot a job" Filter Pills and Dynamic Preview */}
        <UseCasesSection />

        {/* 6. "The SpaceXSI team runs on Grok Bot" Video Section */}
        <VideoSection />

        {/* 7. Pricing Section (Individual/Teams Toggle, Tier Cards, Eligibility Strip) */}
        <PricingSection />

        {/* 8. Download Section (Desktop & Mobile) */}
        <DownloadSection />

        {/* 9. Grok Bot Guides Teaser */}
        <GuidesSection />

        {/* 10. FAQs Accordions Section */}
        <FaqSection />

        {/* 11. Final "Meet your first Bot" CTA with Wireframe Mascot Arch */}
        <CtaSection />
      </main>

      {/* 12. Full 10-Column Footer */}
      <FooterSection isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
    </div>
  );
}
