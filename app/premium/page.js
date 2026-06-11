"use client";

import { useState } from "react";
import { usePremium } from "../context/PremiumContext";

export default function PremiumPage() {
  const { isPremium, plan, buyPremium, cancelPremium, hasMounted } = usePremium();

  // Selected plan state
  const [selectedPlan, setSelectedPlan] = useState("lifetime");

  // Form input states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [email, setEmail] = useState("");

  // Validation & Loading states
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-format Card Number: xxxx xxxx xxxx xxxx
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // numbers only
    const limited = value.slice(0, 16); // limit to 16 digits
    const formatted = limited.replace(/(\d{4})(?=\d)/g, "$1 "); // add spaces
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  // Auto-format Expiry Date: MM/YY
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // numbers only
    const limited = value.slice(0, 4); // limit to 4 digits
    let formatted = limited;
    if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    setExpiry(formatted);
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: "" }));
    }
  };

  // Handle CVC: numbers only, max 4 digits
  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // numbers only
    setCvc(value.slice(0, 4));
    if (errors.cvc) {
      setErrors((prev) => ({ ...prev, cvc: "" }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!cardName.trim()) {
      tempErrors.cardName = "Cardholder name is required.";
    }

    const digitsOnlyCard = cardNumber.replace(/\s/g, "");
    if (digitsOnlyCard.length !== 16) {
      tempErrors.cardNumber = "Card number must be exactly 16 digits.";
    }

    if (!expiry) {
      tempErrors.expiry = "Expiry date is required.";
    } else {
      const parts = expiry.split("/");
      if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
        tempErrors.expiry = "Use MM/YY format.";
      } else {
        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10);
        if (month < 1 || month > 12) {
          tempErrors.expiry = "Invalid month (01-12).";
        } else {
          const now = new Date();
          const currentYear = now.getFullYear() % 100; // last 2 digits
          const currentMonth = now.getMonth() + 1;
          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            tempErrors.expiry = "Date is in the past.";
          }
        }
      }
    }

    if (cvc.length < 3 || cvc.length > 4) {
      tempErrors.cvc = "CVC must be 3 or 4 digits.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    // Simulate transaction delay
    setTimeout(() => {
      setIsProcessing(false);
      buyPremium(selectedPlan);
    }, 1500);
  };

  // Wait until mounted on client before rendering to avoid layout hydration flicker
  if (!hasMounted) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-64 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
      </main>
    );
  }

  if (isPremium) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 flex flex-col items-center justify-center">
        <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900 transition-all">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 animate-bounce">
            ✓
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Payment Complete!
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Welcome to <span className="font-extrabold text-indigo-600 dark:text-indigo-400">TechCart Premium</span>. All ads have been removed from your experience.
          </p>

          <div className="mt-8 rounded-2xl bg-zinc-50 p-6 text-left dark:bg-zinc-800/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Subscription Details
            </h2>
            <div className="mt-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-700">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Plan type</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-white capitalize">
                {plan === "lifetime" ? "👑 Lifetime Ad-Free" : "⚡ Monthly Access"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Active (Ad-Free)
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
            <a
              href="/"
              className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-indigo-500/20 active:scale-95 text-center"
            >
              Continue Shopping
            </a>
            <button
              onClick={cancelPremium}
              className="rounded-full border border-zinc-300 bg-white px-8 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all active:scale-95"
            >
              Restore Ads (Cancel)
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Plan benefits & Live Card Preview */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Upgrade to Premium
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Tired of flashing congratulations cards and banners cluttering your screen? Take control of your browsing experience.
          </p>
        </div>

        {/* Dynamic Credit Card Preview */}
        <div className="relative h-52 w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 text-white shadow-2xl p-6 flex flex-col justify-between border border-indigo-800/40">
          {/* Glowing orb effects */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl"></div>

          <div className="flex justify-between items-start z-10">
            {/* Card chip */}
            <div className="h-10 w-12 rounded-lg bg-amber-400/80 bg-gradient-to-br from-amber-300 to-amber-500 border border-amber-300/40"></div>
            {/* Logo */}
            <div className="text-right">
              <span className="text-xl font-black tracking-widest italic text-indigo-300">
                TECH<span className="text-white">CARD</span>
              </span>
              <p className="text-[9px] uppercase tracking-widest opacity-60">Premium Access</p>
            </div>
          </div>

          <div className="z-10">
            {/* Card number */}
            <p className="text-xl font-mono tracking-widest text-zinc-100">
              {cardNumber || "•••• •••• •••• ••••"}
            </p>
          </div>

          <div className="flex justify-between items-end z-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-indigo-300">Cardholder</p>
              <p className="font-mono text-sm font-semibold truncate max-w-[200px]">
                {cardName.toUpperCase() || "YOUR NAME"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-indigo-300">Expires</p>
              <p className="font-mono text-sm font-semibold">{expiry || "MM/YY"}</p>
            </div>
          </div>
        </div>

        {/* Benefits list */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Included features</h2>
          <ul className="space-y-3">
            {[
              "🚀 100% Ad-Free browsing (instant removal)",
              "⚡ Faster page loading speeds (no heavy ad assets)",
              "🔒 Improved privacy (no mock trackers)",
              "💎 Premium badge on your TechCart profile",
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column: Payment form */}
      <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Selector */}
          <div>
            <label className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              Select Your Plan
            </label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Monthly option */}
              <label
                onClick={() => setSelectedPlan("monthly")}
                className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === "monthly"
                    ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value="monthly"
                  checked={selectedPlan === "monthly"}
                  onChange={() => {}}
                  className="sr-only"
                />
                <span className="text-sm font-bold text-zinc-900 dark:text-white">Monthly Access</span>
                <span className="mt-1 text-2xl font-black text-zinc-950 dark:text-white">$4.99<span className="text-xs font-normal text-zinc-500">/mo</span></span>
                <span className="mt-2 text-xs text-zinc-500">Billed monthly. Cancel anytime.</span>
              </label>

              {/* Lifetime option */}
              <label
                onClick={() => setSelectedPlan("lifetime")}
                className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === "lifetime"
                    ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <span className="absolute -top-3 right-3 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                  Best Value
                </span>
                <input
                  type="radio"
                  name="plan"
                  value="lifetime"
                  checked={selectedPlan === "lifetime"}
                  onChange={() => {}}
                  className="sr-only"
                />
                <span className="text-sm font-bold text-zinc-900 dark:text-white">Lifetime Ad-Free</span>
                <span className="mt-1 text-2xl font-black text-zinc-950 dark:text-white">$19.99<span className="text-xs font-normal text-zinc-500">/one-time</span></span>
                <span className="mt-2 text-xs text-zinc-500">Pay once, ad-free forever.</span>
              </label>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Payment Information</h3>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Cardholder name */}
              <div>
                <label htmlFor="cardholderName" className="block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Cardholder Name
                </label>
                <input
                  id="cardholderName"
                  type="text"
                  placeholder="Jane Doe"
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                    if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: "" }));
                  }}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.cardName
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                />
                {errors.cardName && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.cardName}</p>
                )}
              </div>

              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    id="cardNumber"
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm tracking-widest transition-all focus:outline-none focus:ring-2 ${
                      errors.cardNumber
                        ? "border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.cardNumber}</p>
                  )}
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm tracking-wider transition-all focus:outline-none focus:ring-2 ${
                      errors.expiry
                        ? "border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  />
                  {errors.expiry && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-xs font-bold uppercase tracking-wide text-zinc-500">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="password"
                    placeholder="•••"
                    value={cvc}
                    onChange={handleCvcChange}
                    className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm tracking-widest transition-all focus:outline-none focus:ring-2 ${
                      errors.cvc
                        ? "border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  />
                  {errors.cvc && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.cvc}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-4 dark:bg-zinc-800/50 text-xs text-zinc-500 text-center">
            🔒 This is a simulated checkout. Do NOT enter actual sensitive card details. No real money will be charged.
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex justify-center items-center rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              `Pay $${selectedPlan === "lifetime" ? "19.99" : "4.99"} & Remove Ads`
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
