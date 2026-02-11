"use client";

export default function HeroDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {/* Top-left — image category warm square */}
      <div className="absolute left-[8%] top-[10%] h-7 w-7 rotate-12 rounded-md bg-cat-image/25" />
      {/* Top-right — video category circle */}
      <div className="absolute right-[10%] top-[8%] h-9 w-9 rounded-full bg-cat-video/20" />
      {/* Mid-left — youtube category dot */}
      <div className="absolute left-[5%] top-[50%] h-4 w-4 rounded-full bg-cat-youtube/20" />
      {/* Mid-right — text category diamond */}
      <div className="absolute right-[6%] top-[55%] h-5 w-5 rotate-45 rounded-sm bg-cat-text/20" />
      {/* Bottom-left — highlight dot */}
      <div className="absolute bottom-[15%] left-[14%] h-3 w-3 rounded-full bg-highlight/25" />
      {/* Right side — youtube triangle */}
      <div className="absolute right-[18%] top-[30%] h-4 w-4 rotate-45 bg-cat-youtube/15" />
      {/* Left side — text small dot */}
      <div className="absolute left-[20%] top-[35%] h-2.5 w-2.5 rounded-full bg-cat-text/15" />
    </div>
  );
}
