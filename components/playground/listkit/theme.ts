import type { ThemeClasses } from "listkit";

/** A brand theme outside the eight built-ins, in the site's cyan. Arbitrary
 * Tailwind values work because this source is scanned by the site's build. */
export const cyanTheme: ThemeClasses = {
  focusRing: "focus:ring-[#0e7490]",
  focusBorder: "focus:border-[#0e7490]",
  primaryBg: "bg-[#0e7490]",
  primaryText: "text-white",
  primaryHover: "hover:bg-[#155e75]",
  paginationSpinnerBorder: "border-t-[#0e7490]",
  viewToggleActiveBg: "bg-[#0e7490]",
  viewToggleActiveText: "text-white",
  viewToggleActiveShadow: "shadow-sm",
  chipBg: "bg-[#ecfeff]",
  chipBorder: "border-[#a5f3fc]",
  chipText: "text-[#155e75]",
  softHoverBg: "hover:bg-[#ecfeff]",
  accentText: "text-[#0e7490]",
};
