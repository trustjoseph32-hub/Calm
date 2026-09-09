with open('src/components/Logo.tsx', 'w') as f:
    f.write("""import React from 'react';
import { motion } from 'motion/react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      animate={{ 
        color: ['#818cf8', '#ef4444', '#818cf8'] 
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    </motion.svg>
  );
}
""")
print("Logo updated")
