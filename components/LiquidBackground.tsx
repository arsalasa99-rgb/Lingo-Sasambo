
import React from 'react';

const LiquidBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-sasambo-dark to-[#3E2723] text-sasambo-cream">
      {/* Animated Earthy Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sasambo-primary mix-blend-overlay filter blur-3xl opacity-60 animate-blob rounded-full"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-sasambo-accent mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-2000 rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-[#6D4C41] mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 rounded-full"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div> {/* Optional texture feel */}
      </div>
      
      {/* Tenun / Wood Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(circle, #D4A373 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default LiquidBackground;
