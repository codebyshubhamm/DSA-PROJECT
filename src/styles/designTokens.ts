/**
 * Design Tokens — White & Brown Editorial Theme
 * Warm, tactile, print-inspired palette with high legibility and zero AI-slop
 */

export const DESIGN_TOKENS = {
  colors: {
    bg: '#FBF9F5',
    paper: '#FFFFFF',
    subtle: '#F5EFEB',
    card: '#FFFFFF',
    cardHover: '#FAF6F1',
    border: '#E6DDD4',
    borderHover: '#C8B9A9',
    espresso: '#28170D',
    walnut: '#3E271B',
    mocha: '#6E5648',
    sand: '#A08C7D',
    latte: '#DFD3C6',
    terracotta: '#C25E2E',
    amber: '#B45309',
    honey: '#D49A24',
    sage: '#3B694F',
    brick: '#B91C1C',
    unvisited: '#8C7E74',
    visited: '#3B694F',
    frontier: '#B45309',
    current: '#C25E2E',
    path: '#D49A24',
  },
  springs: {
    snappy: {
      type: 'spring' as const,
      stiffness: 420,
      damping: 32,
    },
    gentle: {
      type: 'spring' as const,
      stiffness: 240,
      damping: 26,
    },
    layoutId: {
      type: 'spring' as const,
      stiffness: 380,
      damping: 30,
    },
  },
  easings: {
    editorial: [0.22, 1, 0.36, 1],
  },
};
