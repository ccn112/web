"use client";
import Link from "next/link";
import content from "../../data/home-content.json";
import { HomeIcon } from "./HomeIcon";
import styles from "./home.module.css";

export function ProductsSection() {
  return (
    <section className={styles.lightSectionAlt} aria-labelledby="products-title">
      <div className={styles.container}>
        <div className={styles.productLayout}>
          <div>
            <span className={styles.kicker}>HỆ SINH THÁI XTECH</span>
            <h2 id="products-title">5 sản phẩm cốt lõi trong hệ sinh thái XTECH</h2>
            <p>Mỗi sản phẩm giải quyết một nhóm nghiệp vụ riêng, đồng thời kết nối trên một nền tảng dữ liệu, quy trình và AI dùng chung.</p>
            <div className={styles.productList}>
              {content.products.map(p=><article key={p.id} className={styles.productCard}><HomeIcon name={p.icon}/><div><h3>{p.title}</h3><p>{p.description}</p></div><Link href={p.href}>Tìm hiểu thêm →</Link></article>)}
            </div>
          </div>
          <div className={styles.productOrbit} aria-label="Sơ đồ kết nối năm sản phẩm XTECH">
            <div className={styles.orbitCenter}>XTECH<span>Nền tảng chung</span></div>
            {content.products.map((p,i)=><div key={p.id} className={styles.orbitNode} style={{"--i":i} as React.CSSProperties}><HomeIcon name={p.icon} size={72}/><strong>{p.title}</strong></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
