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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

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
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-foreground selection:text-background transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      <main>
        {/* 1. Hero Section with Interactive Live Bot Demo */}
        <HeroSection />

        {/* 2. Statement Section ("Message Bots like teammates") */}
        <StatementSection />

        {/* 3. Features Section (4 Interactive Cards) */}
        <FeaturesSection />

        {/* 4. Use Cases Section (Pills, Descriptions, Dynamic Preview) */}
        <UseCasesSection />

        {/* 5. SpaceX SI Team Video Section */}
        <VideoSection />

        {/* 6. Pricing Section (Individual/Teams toggle & Tier Cards) */}
        <PricingSection />

        {/* 7. Download Section (Desktop & Mobile) */}
        <DownloadSection />

        {/* 8. Guides Section */}
        <GuidesSection />

        {/* 9. FAQs Section */}
        <FaqSection />

        {/* 10. CTA Section ("Meet your first Bot") */}
        <CtaSection />
      </main>

      {/* 11. Footer Section */}
      <FooterSection isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
    </div>
  );
}
