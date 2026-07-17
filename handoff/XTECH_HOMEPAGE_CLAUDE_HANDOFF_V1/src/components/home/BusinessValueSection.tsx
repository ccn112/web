import content from "../../data/home-content.json";
import {HomeIcon} from "./HomeIcon";
import styles from "./home.module.css";

export function BusinessValueSection(){
 return <section className={styles.lightSection} aria-labelledby="value-title"><div className={styles.container}>
  <div className={styles.valueHero}><div><span className={styles.kicker}>VÌ SAO DOANH NGHIỆP CHỌN XTECH</span><h2 id="value-title">Công nghệ tạo ra kết quả kinh doanh</h2><p>XTECH giúp doanh nghiệp chuyển đổi số theo cách rõ mục tiêu, có lộ trình và đo được giá trị.</p></div><div className={styles.growthVisual}>X<span>Kết quả</span></div></div>
  <div className={styles.valueCards}>{content.businessValues.map(v=><article key={v.title}><HomeIcon name={v.icon} size={64}/><h3>{v.title}</h3><p>{v.description}</p></article>)}</div>
  <div className={styles.whyGrid}>{content.whyXtech.map(w=><article key={w.title}><HomeIcon name={w.icon}/><div><h3>{w.title}</h3><p>{w.description}</p></div></article>)}</div>
 </div></section>
}
