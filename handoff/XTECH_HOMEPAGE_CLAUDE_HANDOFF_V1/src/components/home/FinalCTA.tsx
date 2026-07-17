import Link from "next/link";
import styles from "./home.module.css";
export function FinalCTA(){return <section className={styles.ctaWrap}><div className={styles.cta}><div><h2>Bắt đầu hành trình chuyển đổi số cùng XTECH</h2><p>Trao đổi với đội ngũ chuyên gia để xác định bài toán ưu tiên, kiến trúc phù hợp và lộ trình triển khai khả thi.</p></div><div><Link href="/lien-he">Đặt lịch tư vấn</Link><Link href="/dat-lich-demo">Yêu cầu demo</Link></div></div></section>}
