import React, { useState, useEffect } from "react";
import AccessGate, { isAlreadyUnlocked } from "./components/AccessGate.jsx";
import SogecaDashboard from "./App.jsx";

export default function Root() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(isAlreadyUnlocked());
  }, []);

  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />;
  }
  return <SogecaDashboard />;
}
