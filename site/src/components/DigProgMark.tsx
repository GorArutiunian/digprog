/** DigProg dp monogram — navy d + orange p (brand sheet) */
type Props = {
  size?: number;
  variant?: "light" | "dark";
};

export function DigProgMark({ size = 32, variant = "light" }: Props) {
  const dFill = variant === "dark" ? "#FFFFFF" : "#102A56";
  const pFill = "#FF8A3D";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* d — navy bowl + stem up */}
      <circle cx="24" cy="30" r="15" fill={dFill} />
      <rect x="35.5" y="8" width="6" height="30" rx="1.5" fill={dFill} />
      {/* p — orange bowl overlapping + stem down */}
      <circle cx="40" cy="34" r="15" fill={pFill} />
      <rect x="22.5" y="34" width="6" height="22" rx="1.5" fill={pFill} />
    </svg>
  );
}
