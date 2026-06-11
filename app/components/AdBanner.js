"use client";

import { usePremium } from "../context/PremiumContext";

// The ads. Now it is a Client Component that consumes the PremiumContext
// to determine whether to hide the ads. To prevent hydration mismatches,
// it renders the ads by default on the server/initial render, and then hides
// them if the premium flag is set once mounted on the client.

const MARQUEE_ADS = [
  "🔥 MEGA DEAL: buy 1 cable, get 0 free!",
  "📣 You are visitor number 1,000,000, claim your prize!",
  "💸 Lower your mortgage with this ONE weird gadget!",
  "🚀 Download more RAM today (legally?!)",
  "🎁 A wild discount appeared! Act in the next 4 seconds!",
];

export default function AdBanner() {
  const { isPremium, hasMounted } = usePremium();

  // If the user has paid and the component has mounted on the client, hide the ads.
  // Before mounting, we must render the ads to match the server-rendered HTML and avoid hydration mismatch.
  if (hasMounted && isPremium) {
    return null;
  }

  return (
    <>
      {/* 1) Top marquee strip */}
      <div className="overflow-hidden border-y border-yellow-500/40 bg-yellow-300 text-sm font-bold text-black">
        <div className="ad-marquee flex w-max gap-12 py-2 pl-12">
          {/* doubled so the scroll loops seamlessly */}
          {[...MARQUEE_ADS, ...MARQUEE_ADS].map((text, i) => (
            <span key={i} className="whitespace-nowrap">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* 2) Floating, blinking corner ad */}
      <aside className="ad-blink fixed bottom-4 right-4 z-50 w-60 rounded-xl border-2 border-pink-500 bg-gradient-to-br from-fuchsia-500 to-orange-400 p-4 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-widest opacity-90">
          Advertisement
        </p>
        <p className="mt-1 text-lg font-black leading-tight">
          CONGRATULATIONS! 🎉
        </p>
        <p className="mt-1 text-sm">
          A surprise discount is waiting. Tap fast before it runs away!
        </p>
        <button className="mt-3 w-full rounded-md bg-white/90 py-1.5 text-sm font-bold text-fuchsia-700">
          CLAIM NOW
        </button>
      </aside>
    </>
  );
}
