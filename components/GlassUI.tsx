import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', intensity = 'medium', ...props }) => {
  // Using warm white/cream tints for the glass
  const bgOpacity = intensity === 'low' ? 'bg-sasambo-cream/5' : intensity === 'medium' ? 'bg-sasambo-cream/10' : 'bg-sasambo-cream/20';
  
  return (
    <motion.div
      className={`${bgOpacity} backdrop-blur-xl border border-sasambo-cream/20 shadow-xl rounded-3xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  fullWidth?: boolean;
}

export const LiquidButton: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', fullWidth, ...props }) => {
  const baseStyle = "py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden";
  const widthStyle = fullWidth ? "w-full" : "";
  
  let variantStyle = "";
  if (variant === 'primary') {
    // Gold/Brown Gradient
    variantStyle = "bg-gradient-to-r from-sasambo-primary to-sasambo-accent text-white shadow-lg shadow-black/20 border border-white/10";
  } else if (variant === 'secondary') {
    // Cream Light
    variantStyle = "bg-sasambo-cream text-sasambo-dark shadow-lg hover:bg-white";
  } else if (variant === 'success') {
    // Green (for submit)
    variantStyle = "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg border border-white/10";
  } else {
    // Ghost
    variantStyle = "bg-transparent text-sasambo-cream border border-sasambo-cream/30 hover:bg-sasambo-cream/10";
  }

  return (
    <button className={`${baseStyle} ${widthStyle} ${variantStyle} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2 justify-center w-full">{children}</span>
    </button>
  );
};