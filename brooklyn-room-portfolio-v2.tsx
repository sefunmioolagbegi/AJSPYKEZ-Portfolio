import { useState, useEffect, lazy, Suspense } from 'react';
import { Phone, Mail, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

// Lazy load room sections for better initial load performance
const VinylSection = lazy(() => import('./VinylSection'));
const ClosetSection = lazy(() => import('./ClosetSection'));

const BrooklynRoom = () => {
  const [isEntering, setIsEntering] = useState(true);
  const [currentSection, setCurrentSection] = useState('main');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate door opening animation
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsEntering(false), 1000);
    }, 2000);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading screen with door animation
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-neutral-900 flex items-center justify-center">
        <div className="w-64 h-96 bg-stone-700 rounded-t-lg animate-pulse">
          <div className="w-8 h-8 bg-yellow-600 rounded-full absolute right-4 top-1/2" />
        </div>
      </div>
    );
  }

  // Entry animation
  if (isEntering) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
        <div className="text-white text-2xl animate-fade-in">
          Welcome to AJ Spykez's Space
        </div>
      </div>
    );
  }

  const ContactForm = () => (
    <Card className="absolute bottom-20 right-20 p-6 bg-white/90 backdrop-blur-sm transform transition-all duration-300">
      <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Message"
          className="w-full p-2 border rounded h-24"
        />
        <button
          type="submit"
          className="w-full bg-neutral-900 text-white p-2 rounded hover:bg-neutral-700 transition-colors"
        >
          Send Message
        </button>
      </form>
    </Card>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-900">
      {/* Room background with brick texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/api/placeholder/1920/1080')`,
          maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
        }}
      >
        {/* Brick overlay */}
        <div className="absolute inset-0 opacity-50 bg-[url('/api/placeholder/200/200')] bg-repeat" />
      </div>

      {isMobile ? (
        // Mobile vertical scroll layout
        <div className="h-full overflow-y-auto snap-y snap-mandatory">
          <div className="snap-start h-screen flex items-center justify-center">
            <AboutSection />
          </div>
          <div className="snap-start h-screen flex items-center justify-center">
            <Suspense fallback={<LoadingSection />}>
              <VinylSection />
            </Suspense>
          </div>
          <div className="snap-start h-screen flex items-center justify-center">
            <Suspense fallback={<LoadingSection />}>
              <ClosetSection />
            </Suspense>
          </div>
        </div>
      ) : (
        // Desktop interactive room layout
        <div className="relative w-full h-full">
          {/* Custom AJ Spykez Beanbag */}
          <div 
            onClick={() => setCurrentSection('about')}
            className="absolute left-20 bottom-32 w-32 h-32 cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-sm font-bold" style={{ transform: 'rotate(-30deg)' }}>
                  AJ Spykez
                </div>
              </div>
            </div>
          </div>

          {/* Vintage Phone for Contact */}
          <div 
            onClick={() => setShowContact(!showContact)}
            className="absolute right-32 top-32 cursor-pointer transform hover:scale-110 transition-transform"
          >
            <Phone size={32} className="text-white" />
          </div>

          {/* Interactive Areas */}
          <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
            <Suspense fallback={<LoadingSection />}>
              <VinylSection />
            </Suspense>
          </div>

          <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
            <Suspense fallback={<LoadingSection />}>
              <ClosetSection />
            </Suspense>
          </div>

          {showContact && <ContactForm />}
        </div>
      )}

      {/* Error Boundary Fallback */}
      {currentSection === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            Something went wrong. Please refresh the page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const LoadingSection = () => (
  <div className="w-32 h-32 animate-pulse bg-neutral-800 rounded-lg" />
);

const AboutSection = () => (
  <Card className="max-w-lg p-6 bg-white/90 backdrop-blur-sm">
    <h2 className="text-2xl font-bold mb-4">About AJ Spykez</h2>
    <p className="text-neutral-700">
      Creative director in music and fashion spaces...
      {/* Add your about content here */}
    </p>
  </Card>
);

export default BrooklynRoom;
