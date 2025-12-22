import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Github } from 'lucide-react';
import type { MouseEvent } from 'react';

export const GithubButton = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLAnchorElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <a
      href="https://github.com/Tejaromalius/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-2 px-4 py-2 rounded-lg border border-black/10 bg-white/20 backdrop-blur-sm overflow-hidden transition-colors hover:border-black/20"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.8),
              transparent 80%
            )
          `,
        }}
      />
      <Github size={18} className="relative z-10 opacity-70 group-hover:opacity-100" />
      <span className="relative z-10 font-mono text-xs font-bold opacity-70 group-hover:opacity-100">GitHub</span>
    </a>
  );
};
