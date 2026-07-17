"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { SemanticNodes } from "./SemanticNodes";
import styles from "./SemanticHero.module.css";

type SemanticHeroProps = {
  image: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
  overlay?: "medium" | "strong";
  showNodes?: boolean;
  children: ReactNode;
  className?: string;
};

export function SemanticHero({
  image,
  objectPosition = "center center",
  mobileObjectPosition = "center center",
  overlay = "medium",
  showNodes = false,
  children,
  className = "",
}: SemanticHeroProps) {
  const style = {
    "--hero-position": objectPosition,
    "--hero-mobile-position": mobileObjectPosition,
  } as CSSProperties;

  return (
    <section className={`${styles.hero} ${className}`} style={style}>
      <div className={styles.background} aria-hidden="true">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.backgroundImage}
        />
      </div>

      <div className={`${styles.overlay} ${styles[`overlay${overlay}`]}`} aria-hidden="true" />
      <div className={styles.centerSafeZone} aria-hidden="true" />
      <div className={styles.platformGlow} aria-hidden="true" />

      {showNodes ? <SemanticNodes /> : null}

      <div className={styles.content}>{children}</div>
    </section>
  );
}
