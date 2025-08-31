"use client";


import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";

export function openAuthModal(mode: 'login' | 'signup' = 'login') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
  }
}

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login'|'signup'>("login");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: any) => {
      setMode(e.detail?.mode || 'login');
      setOpen(true);
    };
    window.addEventListener('open-auth-modal', handler);
    return () => window.removeEventListener('open-auth-modal', handler);
  }, []);

  const modal = open ? (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-0 min-w-[350px] max-w-[95vw] relative flex flex-col items-center">
        <button onClick={() => setOpen(false)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <div className="w-full px-8 pt-8 pb-4">
          {mode === 'login' ? (
            <>
              <LoginForm onSuccess={() => setOpen(false)} />
              <div className="text-center mt-4 text-sm">
                Don't have an account? <button className="text-green-600 underline" onClick={() => setMode('signup')}>Sign up</button>
              </div>
            </>
          ) : (
            <>
              <SignupForm onSuccess={() => setOpen(false)} />
              <div className="text-center mt-4 text-sm">
                Already have an account? <button className="text-green-600 underline" onClick={() => setMode('login')}>Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return mounted && typeof window !== 'undefined' ? ReactDOM.createPortal(modal, document.body) : null;
}
