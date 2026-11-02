import { useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { HowItWorksSection } from './components/howitworks/HowItWorksSection';
import { LabWorkspace } from './components/lab/LabWorkspace';
import { ComplexitySection } from './components/complexity/ComplexitySection';
import { Footer } from './components/ui/Footer';

export function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] text-[#28170D] flex flex-col selection:bg-warm-terracotta/20 selection:text-warm-espresso font-sans">
      <Navbar />

      <main className="flex-1 space-y-16">
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-warm-terracotta font-mono">Loading 3D Visualizer...</div>}>
          <HeroSection />
        </Suspense>

        <HowItWorksSection />

        <Suspense fallback={<div className="h-[600px] flex items-center justify-center text-warm-terracotta font-mono">Initializing Lab...</div>}>
          <LabWorkspace />
        </Suspense>

        <div id="complexity">
          <ComplexitySection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
