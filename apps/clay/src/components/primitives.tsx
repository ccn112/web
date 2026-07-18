import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container-x", className)}>{children}</div>;
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

const accentText: Record<"violet" | "blue" | "cyan", string> = {
  violet: "text-violet",
  blue: "text-blue",
  cyan: "text-cyan",
};
const accentBg: Record<"violet" | "blue" | "cyan", string> = {
  violet: "bg-violet/10 text-violet",
  blue: "bg-blue/10 text-blue",
  cyan: "bg-cyan/10 text-cyan",
};

export function accentClasses(accent: "violet" | "blue" | "cyan") {
  return { text: accentText[accent], badge: accentBg[accent] };
}
