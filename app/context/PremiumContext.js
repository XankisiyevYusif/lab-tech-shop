"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const PremiumContext = createContext();

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState(null); // 'monthly' | 'lifetime' | null
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage once mounted on the client
    const storedPremium = localStorage.getItem("techcart_premium");
    const storedPlan = localStorage.getItem("techcart_premium_plan");
    
    if (storedPremium === "true") {
      setIsPremium(true);
      setPlan(storedPlan || "monthly");
    }
    setHasMounted(true);
  }, []);

  const buyPremium = (selectedPlan) => {
    localStorage.setItem("techcart_premium", "true");
    localStorage.setItem("techcart_premium_plan", selectedPlan);
    setIsPremium(true);
    setPlan(selectedPlan);
  };

  const cancelPremium = () => {
    localStorage.removeItem("techcart_premium");
    localStorage.removeItem("techcart_premium_plan");
    setIsPremium(false);
    setPlan(null);
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        plan,
        hasMounted,
        buyPremium,
        cancelPremium,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
}
