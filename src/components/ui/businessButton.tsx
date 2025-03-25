"use client";

interface ButtonProps {
  onClick?: () => void;
  variant?: "default" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button = ({ onClick, variant = "default", size = "md", disabled, children }: ButtonProps) => {
  const variantClass = variant === "outline" ? "border border-gray-400 text-gray-800" : "bg-blue-500 text-white";
  const sizeClass = size === "sm" ? "py-1 px-3 text-sm" : size === "lg" ? "py-3 px-6 text-lg" : "py-2 px-4";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      className={`rounded ${variantClass} ${sizeClass} ${disabledClass} bg-blue-500 `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
