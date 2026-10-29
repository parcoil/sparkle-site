"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ReleaseInfo } from "@/lib/releases";

const defaultReleaseInfo: ReleaseInfo = {
  version: "",
  downloads: "",
  exeUrl: "https://github.com/Parcoil/Sparkle/releases/latest",
  zipUrl: "https://github.com/Parcoil/Sparkle/releases/latest",
};

const ReleaseContext = createContext<ReleaseInfo>(defaultReleaseInfo);

export function ReleaseProvider({
  value,
  children,
}: {
  value: ReleaseInfo;
  children: ReactNode;
}) {
  return (
    <ReleaseContext.Provider value={value}>{children}</ReleaseContext.Provider>
  );
}

export function useRelease() {
  return useContext(ReleaseContext);
}
