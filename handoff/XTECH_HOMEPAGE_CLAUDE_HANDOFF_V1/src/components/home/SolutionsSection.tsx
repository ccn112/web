"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import content from "../../data/home-content.json";
import { HomeIcon } from "./HomeIcon";
import { homeMotion } from "./motion";
import styles from "./home.module.css";

export function SolutionsSection() {
  return (
    <section className={styles.lightSection} aria-labelledby="solutions-title">
      <div className={styles.container}>
        <div className={styles.sectionCopy}>
          <span className={styles.kicker}>GIẢI PHÁP XTECH</span>
          <h2 id="solutions-title">Bắt đầu từ bài toán của doanh nghiệp</h2>
          <p>XTECH kết hợp tư vấn, nền tảng sản phẩm và năng lực triển khai để giải quyết bài toán chuyển đổi số theo từng mức độ trưởng thành.</p>
        </div>
        <div className={styles.splitLayout}>
          <motion.div className={styles.stackList} variants={homeMotion.stagger} initial="hidden" whileInView="show" viewport={{once:true,amount:.2}}>
            {content.solutions.map((item, index) => (
              <motion.article variants={homeMotion.item} className={styles.stackCard} key={item.id}>
                <HomeIcon name={item.icon} size={64}/>
                <span className={styles.number}>{String(index+1).padStart(2,"0")}</span>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
                <Link href={item.href} aria-label={`Tìm hiểu ${item.title}`}>→</Link>
              </motion.article>
            ))}
          </motion.div>
          <div className={styles.hubVisual} aria-hidden="true">
            <ImageFallback/>
          </div>
        </div>
      </div>
    </section>
  );
}
function ImageFallback(){return <div className={styles.radialHub}><span>XTECH</span>{content.solutions.map((s,i)=><i key={s.id} style={{"--i":i} as React.CSSProperties}><HomeIcon name={s.icon} size={58}/></i>)}</div>}
