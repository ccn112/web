"use client";
import {useState} from "react";
import Link from "next/link";
import content from "../../data/home-content.json";
import {HomeIcon} from "./HomeIcon";
import styles from "./home.module.css";

export function SolutionSuitesSection(){
 const [active,setActive]=useState(0); const suite=content.solutionSuites[active];
 return <section className={styles.lightSectionAlt} aria-labelledby="suites-title"><div className={styles.container}>
  <div className={styles.sectionCopy}><span className={styles.kicker}>BỘ GIẢI PHÁP XTECH</span><h2 id="suites-title">Bộ giải pháp X theo bài toán doanh nghiệp</h2><p>XTECH đóng gói sản phẩm, dịch vụ và năng lực triển khai thành các bộ giải pháp phù hợp với từng mô hình doanh nghiệp.</p></div>
  <div className={styles.tabs} role="tablist">{content.solutionSuites.map((s,i)=><button role="tab" aria-selected={i===active} key={s.id} onClick={()=>setActive(i)}><HomeIcon name={s.icon} size={48}/>{s.title}</button>)}</div>
  <div className={styles.suitePanel}><div><span>BỘ GIẢI PHÁP NỔI BẬT</span><h3>{suite.title}</h3><p>{suite.description}</p><Link className={styles.primaryButton} href={suite.href}>Khám phá chi tiết giải pháp</Link></div><div className={styles.journeyRing}>{content.workflow.map((x,i)=><span key={x} style={{"--i":i} as React.CSSProperties}>{String(i+1).padStart(2,"0")}<b>{x}</b></span>)}</div></div>
 </div></section>
}
