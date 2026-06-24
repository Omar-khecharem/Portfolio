const DEFAULT_ITEMS = [
  'React', 'Node.js', 'MongoDB', 'TypeScript', 'Python',
  'Tailwind CSS', 'Express', 'AI / ML', 'Git', 'REST APIs',
  'Framer Motion', 'JavaScript', 'Cloudflare', 'UI / UX',
];

export default function MarqueeBar({ items = DEFAULT_ITEMS, speed = 35 }) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden backdrop-blur-sm bg-white/[0.03] border-t border-white/[0.06] py-2.5 sm:py-3">
      {/* Edge fade overlays */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#0a0a23] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#0a0a23] to-transparent pointer-events-none" />

      <div
        className="flex whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {duplicated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-0 mx-4 sm:mx-7 text-white/30 font-medium text-[12px] sm:text-[13px] tracking-wider uppercase">
            <span className="w-1 h-1 rounded-full bg-white/15 flex-shrink-0 mr-2" />
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333333%); }
        }
      `}</style>
    </div>
  );
}
