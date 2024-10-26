import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Phone, Disc, Camera, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

// Lazy loaded components
const VinylPlayer = lazy(() => import('./VinylPlayer'));
const ClosetSection = lazy(() => import('./ClosetSection'));
const ContactForm = lazy(() => import('./ContactForm'));

const BrooklynRoom = () => {
  const [isEntering, setIsEntering] = useState(true);
  const [currentSection, setCurrentSection] = useState('main');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Handle window resize and mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Preload critical assets
    const criticalAssets = [
      '/room-background.webp',
      '/brick-texture.webp',
      '/vinyl-texture.webp',
      '/closet-texture.webp'
    ];

    Promise.all(
      criticalAssets.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      })
    ).then(() => {
      setIsLoading(false);
      setTimeout(() => setIsEntering(false), 1500);
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle zoom functionality
  const handleZoom = useCallback((scale) => {
    setCurrentScale(scale);
  }, []);

  // Loading screen with animated door
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-neutral-900 flex items-center justify-center">
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="w-64 h-96 bg-stone-700 rounded-t-lg relative"
        >
          <motion.div 
            className="w-8 h-8 bg-yellow-600 rounded-full absolute right-4 top-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    );
  }

  // Entry animation
  if (isEntering) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-4xl font-bold"
        >
          Welcome to AJ Spykez's Space
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-900">
      {/* Room background with dynamic lighting */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: `url('/api/placeholder/1920/1080')`,
          filter: `brightness(${audioEnabled ? 1.1 : 1})`
        }}
      >
        {/* Animated brick overlay */}
        <motion.div 
          className="absolute inset-0 opacity-50 bg-repeat"
          style={{
            backgroundImage: `url('/api/placeholder/200/200')`
          }}
          animate={{
            opacity: [0.4, 0.5, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Ambient particles */}
        {audioEnabled && <ParticleEffect />}
      </motion.div>

      {/* Audio toggle */}
      <button
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
      >
        {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {isMobile ? (
        // Mobile vertical scroll layout with zoom
        <div className="h-full overflow-y-auto snap-y snap-mandatory">
          <MobileLayout 
            currentScale={currentScale}
            handleZoom={handleZoom}
            showContact={showContact}
            setShowContact={setShowContact}
          />
        </div>
      ) : (
        // Desktop interactive room layout
        <div className="relative w-full h-full">
          {/* Custom AJ Spykez Beanbag */}
          <motion.div 
            onClick={() => setCurrentSection('about')}
            className="absolute left-20 bottom-32 w-32 h-32 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BeanbagComponent />
          </motion.div>

          {/* Vinyl Collection Area */}
          <motion.div 
            className="absolute left-1/4 top-1/2 transform -translate-y-1/2"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Suspense fallback={<LoadingSection />}>
              <VinylPlayer isPlaying={audioEnabled} />
            </Suspense>
          </motion.div>

          {/* Closet Area */}
          <motion.div 
            className="absolute right-1/4 top-1/2 transform -translate-y-1/2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Suspense fallback={<LoadingSection />}>
              <ClosetSection />
            </Suspense>
          </motion.div>

          {/* Vintage Phone for Contact */}
          <motion.div 
            onClick={() => setShowContact(!showContact)}
            className="absolute right-32 top-32 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Phone size={32} className="text-white" />
          </motion.div>

          {/* Contact Form */}
          <AnimatePresence>
            {showContact && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute right-32 top-48"
              >
                <Suspense fallback={<LoadingSection />}>
                  <ContactForm onClose={() => setShowContact(false)} />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Error Boundary */}
      <ErrorBoundary>
        {currentSection === 'error' && (
          <Alert variant="destructive">
            <AlertDescription>
              Something went wrong. Please refresh the page.
            </AlertDescription>
          </Alert>
        )}
      </ErrorBoundary>
    </div>
  );
};

// Subcomponents
const BeanbagComponent = () => (
  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="text-white text-sm font-bold tracking-wider">
        {Array.from('AJ SPYKEZ').map((letter, i) => (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              transform: `rotate(${i * 30}deg) translateY(-20px)`,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  </div>
);

const ParticleEffect = () => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0
        }}
        animate={{
          y: [null, -20],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          repeatType: "loop",
          delay: Math.random() * 2
        }}
      />
    ))}
  </div>
);

const LoadingSection = () => (
  <motion.div 
    className="w-32 h-32 bg-neutral-800 rounded-lg"
    animate={{
      opacity: [0.5, 1, 0.5]
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity
    }}
  />
);

const MobileLayout = ({ currentScale, handleZoom, showContact, setShowContact }) => (
  <>
    <div className="snap-start h-screen flex items-center justify-center">
      <motion.div
        style={{ scale: currentScale }}
        className="relative"
      >
        <BeanbagComponent />
      </motion.div>
    </div>
    <div className="snap-start h-screen flex items-center justify-center">
      <Suspense fallback={<LoadingSection />}>
        <VinylPlayer isPlaying={false} />
      </Suspense>
    </div>
    <div className="snap-start h-screen flex items-center justify-center">
      <Suspense fallback={<LoadingSection />}>
        <ClosetSection />
      </Suspense>
    </div>
  </>
);

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Alert variant="destructive">
        <AlertDescription>
          Something went wrong. Please refresh the page.
        </AlertDescription>
      </Alert>;
    }

    return this.props.children;
  }
}

export default BrooklynRoom;
