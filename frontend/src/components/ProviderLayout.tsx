"use client";
import React from "react";
import ProviderHeader from "./ProviderHeader";

interface ProviderLayoutProps {
  children: React.ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}