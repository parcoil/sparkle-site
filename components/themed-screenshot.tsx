import Image from "next/image";

import { cn } from "@/lib/utils";

type ThemedScreenshotProps = {
  lightSrc: string;
  darkSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  bloom?: boolean;
};

/**
 * A screenshot that swaps between light and dark assets with the active theme,
 * framed by a soft Windows 11-style bloom wallpaper.
 */
export function ThemedScreenshot({
  lightSrc,
  darkSrc,
  alt,
  width = 1380,
  height = 760,
  className,
  imageClassName,
  bloom = true,
}: ThemedScreenshotProps) {
  return (
    <div className={cn("relative isolate", className)}>
      {bloom && (
        <div
          aria-hidden="true"
          className="absolute -inset-4 -z-10 overflow-hidden rounded-3xl bg-linear-to-br from-sky-100 via-blue-200 to-blue-400 sm:-inset-8 dark:from-[#040d20] dark:via-[#0a2350] dark:to-[#123a78]"
        >
          <div className="absolute -top-1/4 left-[8%] h-64 w-72 rotate-[-18deg] rounded-[45%_55%_60%_40%] bg-sky-300/80 blur-[70px] sm:h-80 sm:w-96 dark:bg-blue-500/45" />
          <div className="absolute right-[4%] top-[6%] h-64 w-72 rotate-12 rounded-[55%_45%_40%_60%] bg-indigo-300/60 blur-[80px] sm:h-80 sm:w-96 dark:bg-indigo-500/35" />
          <div className="absolute -bottom-1/3 left-[30%] h-64 w-[60%] rounded-full bg-cyan-200/70 blur-[80px] sm:h-80 dark:bg-cyan-400/25" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[60px] dark:bg-sky-300/20" />
        </div>
      )}

      <div
        className={cn(
          "relative z-10 overflow-hidden rounded-md border-2 border-primary shadow-lg transition-all duration-300 dark:border-accent",
          imageClassName,
        )}
      >
        {darkSrc ? (
          <>
            <Image
              src={lightSrc}
              alt={`${alt} in light mode`}
              width={width}
              height={height}
              className="h-auto w-full dark:hidden"
            />
            <Image
              src={darkSrc}
              alt={`${alt} in dark mode`}
              width={width}
              height={height}
              className="hidden h-auto w-full dark:block"
            />
          </>
        ) : (
          <Image
            src={lightSrc}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full"
          />
        )}
      </div>
    </div>
  );
}
