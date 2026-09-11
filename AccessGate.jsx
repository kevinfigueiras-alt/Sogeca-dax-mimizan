import React, { useState } from "react";
import { Lock, AlertTriangle } from "lucide-react";

const SESSION_KEY = "sogeca-access-granted";
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || "";

export function isAlreadyUnlocked() {
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export default function AccessGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!ACCESS_CODE) {
      setError("Aucun code d'accès n'est configuré côté serveur (VITE_ACCESS_CODE).");
      return;
    }
    if (code === ACCESS_CODE) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError("Code incorrect.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F4F9] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-md border border-[#E1E4EE] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#233368]">
            <Lock size={16} className="text-[#99FFCC]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8E96B3]">SOGECA</p>
            <h1 className="text-[16px] font-semibold text-[#1B2545]">Accès protégé</h1>
          </div>
        </div>
        <label className="mb-1 block text-[12.5px] font-medium text-[#5C6584]">Code d'accès</label>
        <input
          type="password"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mb-3 w-full rounded border border-[#D8D3C6] px-3 py-2 text-[14px] outline-none focus:border-[#233368] focus:ring-1 focus:ring-[#233368]"
          placeholder="••••••"
        />
        {error && (
          <p className="mb-3 flex items-center gap-1.5 text-[12.5px] text-[#C0472E]">
            <AlertTriangle size={14} /> {error}
          </p>
        )}
        <button type="submit" className="w-full rounded bg-[#233368] py-2 text-[13.5px] font-medium text-white hover:bg-[#182448]">
          Entrer
        </button>
      </form>
    </div>
  );
}
