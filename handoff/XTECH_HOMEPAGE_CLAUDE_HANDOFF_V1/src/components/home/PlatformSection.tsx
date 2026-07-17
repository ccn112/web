import content from "../../data/home-content.json";
import { HomeIcon } from "./HomeIcon";
import styles from "./home.module.css";

export function PlatformSection(){
  return <section className={styles.lightSection} aria-labelledby="platform-title"><div className={styles.container}>
    <div className={styles.platformGrid}>
      <div className={styles.sectionCopy}><span className={styles.kicker}>NỀN TẢNG DÙNG CHUNG XTECH</span><h2 id="platform-title">Một nền tảng dùng chung cho dữ liệu, quy trình và trí tuệ doanh nghiệp</h2><p>Dữ liệu, workflow, định danh, tích hợp và AI được thiết kế để kết nối toàn bộ hệ sinh thái XTECH.</p>
      <div className={styles.benefitList}><article><HomeIcon name="data"/><div><h3>Dữ liệu thống nhất</h3><p>Chuẩn hóa, kết nối và khai thác dữ liệu toàn hệ sinh thái.</p></div></article><article><HomeIcon name="workflow"/><div><h3>Quy trình liên thông</h3><p>Liên kết quy trình giữa các sản phẩm, giảm thao tác thủ công.</p></div></article><article><HomeIcon name="ai"/><div><h3>AI dùng chung</h3><p>AI, mô hình và insight dùng chung, tối ưu trên dữ liệu hợp nhất.</p></div></article><article><HomeIcon name="security"/><div><h3>Bảo mật & kiểm soát</h3><p>Phân quyền, giám sát và tuân thủ ở cấp doanh nghiệp.</p></div></article></div></div>
      <div className={styles.layerStack}>{content.platformLayers.map((l,i)=><div className={styles.layer} key={l.id}><span>{String(i+1).padStart(2,"0")}</span><strong>{l.label}</strong><div>{l.items.map(x=><em key={x}>{x}</em>)}</div></div>)}</div>
    </div></div></section>
}
