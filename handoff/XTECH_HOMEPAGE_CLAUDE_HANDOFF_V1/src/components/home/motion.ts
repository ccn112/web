export const homeMotion = {
  ease: [0.22, 1, 0.36, 1] as const,
  reveal: {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.22 },
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
  },
  stagger: {
    hidden: {},
    show: { transition: { staggerChildren: 0.075 } }
  },
  item: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  }
};
