export const sippyMedia = "/images/sippy/";
export const sippyParts = {
  sensing: { label: "Weight Sensing", images: ["load-cell"], alt: ["Representative beam load cell"] },
  amplifier: { label: "Load Cell Amplifier", images: ["adc"], alt: ["Representative Makerverse amplifier board; source photograph marked HX710"] },
  control: { label: "ESP32 Control", images: ["esp32"], alt: ["Adafruit Feather ESP32 V2 catalogue reference"] },
  driver: { label: "Motor Driver", images: ["motor-driver"], alt: ["Makerverse two-channel motor driver catalogue reference"] },
  power: { label: "Power", images: ["battery-pack", "lipo"], alt: ["Source-based illustration of three blue 18650 batteries installed in one holder", "Source-based LiPo battery illustration; printed rating not verified for Sippy"] },
  movement: { label: "Motorised Movement", images: ["motor", "wheel", "caster"], alt: ["Source-based DC gear motor illustration", "Source-based wheel illustration", "Source-based ball caster illustration"] },
  structure: { label: "Structure", images: ["chassis"], alt: ["Representative circular chassis plate, supplied source-based illustration"] },
} as const;
export type SippyPart = keyof typeof sippyParts;
