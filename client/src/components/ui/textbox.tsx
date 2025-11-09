// src/components/TextBox.tsx
import { cn } from "@/lib/utils"; // utility to merge class names

type TextBoxProps = {
  title: string;
  subtitle?: string;
  height?: string;       // e.g., "h-50"
  className?: string;    // container
  className2?: string;   // h1
  className3?: string;   // h4
};

type SmallTextBoxProps = {
    title: string;
    subtitle?: string;
    subtext?: string;
    height?: string;       // e.g., "h-50"
    className?: string;    // container
    className2?: string;   // h2
    className3?: string;   // h4
    className4?: string;   // h5
  };

export function TextBox({ title, subtitle, height = "h-50", className, className2, className3 }: TextBoxProps) {
  return (
    <div
      className={cn(
        "border-2 rounded-2xl flex flex-col justify-center items-center",
        height,
        "bg-white", // default background
        className  // container overrides
      )}
    >
      <h1 className={cn("text-center text-3xl font-bold", className2)}>
        {title}
      </h1>
      {subtitle && (
        <h4 className={cn("text-center text-gray-500 mt-2", className3)}>
          {subtitle}
        </h4>
      )}
    </div>
  );
}

export function SmallTextBox({ title, subtitle, subtext, height = "h-50", className, className2, className3, className4 }: SmallTextBoxProps) {
    return (
      <div
        className={cn(
          "border-2 rounded-2xl flex flex-col justify-center items-center",
          height,
          "bg-white", // default background
          className  // container overrides
        )}
      >
        <h2 className={cn("text-center text-3xl font-bold", className2)}>
          {title}
        </h2>
        {subtitle && (
          <h4 className={cn("text-center text-gray-500 mt-2", className3)}>
            {subtitle}
          </h4>
        )}
        {subtext && (
          <h5 className={cn("text-center text-gray-500 mt-2", className4)}>
            {subtitle}
          </h5>
        )}
      </div>
    );
  }