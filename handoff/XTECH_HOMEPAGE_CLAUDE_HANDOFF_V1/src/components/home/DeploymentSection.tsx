import content from "../../data/home-content.json";
import {HomeIcon} from "./HomeIcon";
import styles from "./home.module.css";

export function DeploymentSection(){
 return <section className={styles.lightSectionAlt} aria-labelledby="deployment-title"><div className={styles.container}>
  <div className={styles.sectionCopyCenter}><span className={styles.kicker}>TRIỂN KHAI & VẬN HÀNH</span><h2 id="deployment-title">Triển khai phù hợp với mọi mô hình doanh nghiệp</h2><p>Linh hoạt với SaaS, Private Cloud, On-premise và Hybrid, đồng thời bảo đảm tích hợp, bảo mật và mở rộng dài hạn.</p></div>
  <div className={styles.deploymentHub}><div className={styles.deployCenter}>XTECH<span>Nền tảng dùng chung</span></div>{content.deployment.map((d,i)=><article key={d.id} style={{"--i":i} as React.CSSProperties}><HomeIcon name={d.icon} size={72}/><div><h3>{d.title}</h3><p>{d.description}</p></div></article>)}</div>
  <div className={styles.deliveryCapabilities}>{["Khảo sát kiến trúc","Integration","Migration","DevSecOps","Monitoring","Training","SLA","Hypercare"].map(x=><span key={x}>{x}</span>)}</div>
 </div></section>
}
