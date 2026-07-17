"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import content from "../../data/home-content.json";
import styles from "./home.module.css";

export function HomeHero() {
  const reduce = useReducedMotion();
  const hero = content.hero;
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <Image src="/images/backgrounds/home/hero-ecosystem.webp" alt="" fill priority sizes="100vw" className={styles.heroImage}/>
      <div className={styles.heroOverlay} aria-hidden="true"/>
      <motion.div className={styles.heroContent}
        initial={reduce ? false : {opacity:0,y:24}}
        animate={{opacity:1,y:0}}
        transition={{duration:.72,ease:[.22,1,.36,1]}}>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 id="home-hero-title">{hero.title}</h1>
        <p>{hero.description}</p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
          <Link className={styles.secondaryButton} href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
        </div>
        <div className={styles.capabilityStrip}>
          {hero.capabilities.map((item) => <span key={item}>{item}</span>)}
        </div>
      </motion.div>
      <div className={styles.heroVisual} aria-hidden="true">
        <Image src="/images/visuals/home/platform-glow.svg" alt="" width={800} height={320}/>
      </div>
    </section>
  );
}
