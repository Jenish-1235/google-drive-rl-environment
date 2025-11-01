import { keyframes } from '@mui/material';

// Fade in animation
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Slide in from left
export const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Slide in from right
export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Scale in
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Pulse animation
export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Slide down
export const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Slide up
export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Common animation props
export const animations = {
  fadeIn: {
    animation: `${fadeIn} 0.3s ease-out`,
  },
  slideInLeft: {
    animation: `${slideInLeft} 0.3s ease-out`,
  },
  slideInRight: {
    animation: `${slideInRight} 0.3s ease-out`,
  },
  scaleIn: {
    animation: `${scaleIn} 0.2s ease-out`,
  },
  slideDown: {
    animation: `${slideDown} 0.2s ease-out`,
  },
  slideUp: {
    animation: `${slideUp} 0.2s ease-out`,
  },
};

// Stagger animation helper
export const getStaggerDelay = (index: number, baseDelay = 30) => ({
  animationDelay: `${index * baseDelay}ms`,
});
