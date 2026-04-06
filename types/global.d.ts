export {};

declare global {
  interface Window {
    startAppTour?: () => void;
  }
}
