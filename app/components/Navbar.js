"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePremium } from "../context/PremiumContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isPremium, hasMounted } = usePremium();

  const isHomeActive = pathname === "/";
  const isPremiumActive = pathname === "/premium";

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-lg font-black tracking-tight text-zinc-900 dark:text-white hover:opacity-90"
          >
            <span className="text-indigo-600 dark:text-indigo-400">⚡</span>
            <span>TechCart</span>
          </Link>
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              isHomeActive
                ? "font-semibold text-indigo-600 dark:text-indigo-400"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Shop
          </Link>
        </div>

        <div>
          {hasMounted && isPremium ? (
            <Link
              href="/premium"
              className={`inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-700 shadow-sm transition-all hover:bg-amber-500/20 dark:text-amber-400 ${
                isPremiumActive ? "ring-2 ring-amber-500/50" : ""
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              Premium ✓
            </Link>
          ) : (
            <Link
              href="/premium"
              className={`rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 ${
                isPremiumActive ? "ring-2 ring-indigo-500 ring-offset-2" : ""
              }`}
            >
              Go Premium
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
