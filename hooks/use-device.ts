"use client";

import { useLayoutEffect, useState, useEffect } from "react";

export function useDevice() {
  const getDeviceSize = () => {
    if (typeof window === "undefined") return "lg"; // Default for SSR
    const width = window.innerWidth;
    if (width < 768) {
      return "sm";
    } else if (width >= 768 && width < 992) {
      return "md";
    } else {
      return "lg";
    }
  };

  const [device, setDevice] = useState(getDeviceSize());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setDevice(getDeviceSize());
    };

    window.addEventListener("resize", handleResize);
    // Call once on mount to handle hydration mismatch if any
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return device;
}
