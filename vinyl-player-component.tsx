import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, Play, Pause } from 'lucide-react';

const VinylPlayer = ({ isPlaying: globalIsPlaying }) => {
  const [selectedVinyl, setSelectedVinyl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);

  const vinyls = [
    { id: 1, title: 'Project 1', color: 'bg-blue-500' },
    { id: 2, title: 'Project 2', color: 'bg-purple-500' },
    { id: 3, title: 'Project 3', color: 'bg-pink-500' },
  ];

  useEffect(() => {
    let animationFrame;
    if (isPlaying && globalIsPlaying) {
      const animate = () => {
        setRotation(prev => (prev + 1) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, globalIsPlaying]);

  return (
    <div className="relative w-64 h-96">
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Vinyl Collection */}
        <div className="grid gap-4">
          {vinyls.map((vinyl, index) => (
            <motion.div
              key={vinyl.id}
              className={`w-48 h-48 rounded-full ${vinyl.color} cursor-pointer relative`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedVinyl(vinyl)}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Disc size={24} className="text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Selected Vinyl Player */}
      <AnimatePresence>
        {selectedVinyl && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                className={`w-64