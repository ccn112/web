import content from "../../data/home-content.json";
import {HomeIcon} from "./HomeIcon";
import styles from "./home.module.css";

export function ServicesSection(){
 return <section className={styles.lightSection} aria-labelledby="services-title"><div className={styles.container}>
  <div className={styles.sectionCopy}><span className={styles.kicker}>DỊCH VỤ CHUYỂN ĐỔI SỐ XTECH</span><h2 id="services-title">Từ chiến lược đến vận hành số</h2><p>XTECH đồng hành end-to-end từ đánh giá hiện trạng đến triển khai, đào tạo và tối ưu liên tục.</p></div>
  <div className={styles.serviceTimeline}>{content.services.map(s=><article key={s.order}><span>{s.order}</span><HomeIcon name={s.icon} size={72}/><h3>{s.title}</h3><p>{s.description}</p></article>)}</div>
  <div className={styles.capabilityGrid}><article><HomeIcon name="workflow"/><h3>Business Process</h3><p>Tối ưu quy trình và nâng cao hiệu suất tổ chức.</p></article><article><HomeIcon name="data"/><h3>Data Architecture</h3><p>Xây dựng kiến trúc dữ liệu hiện đại.</p></article><article><HomeIcon name="integration"/><h3>Enterprise Applications</h3><p>Ứng dụng linh hoạt, tích hợp và mở rộng.</p></article><article><HomeIcon name="ai"/><h3>AI & Automation</h3><p>Tự động hóa và hỗ trợ quyết định.</p></article><article><HomeIcon name="cloud"/><h3>Cloud & Security</h3><p>Hạ tầng an toàn và tuân thủ.</p></article><article><HomeIcon name="connected-enterprise"/><h3>Change Management</h3><p>Đồng hành để chuyển đổi bền vững.</p></article></div>
 </div></section>
}
