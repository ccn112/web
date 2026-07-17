import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SemanticHero } from "./SemanticHero";
import { semanticBackgrounds } from "./semantic-backgrounds";

export function HomeHeroExample() {
  const bg = semanticBackgrounds.home;

  return (
    <SemanticHero
      image={bg.image}
      objectPosition={bg.objectPosition}
      mobileObjectPosition={bg.mobileObjectPosition}
      overlay={bg.overlay}
      showNodes={bg.showNodes}
    >
      <div style={{ maxWidth: 900 }}>
        <div className="heroEyebrow">X TECHNOLOGY</div>

        <h1>
          Hệ sinh thái chuyển đổi số và AI toàn diện cho ngành bất động sản
        </h1>

        <p>
          Từ marketing, bán hàng, quản trị nội bộ đến vận hành bất động sản,
          dữ liệu và AI — linh hoạt triển khai SaaS hoặc On-premise.
        </p>

        <div className="heroActions">
          <Link href="/lien-he" className="primaryButton">
            Đặt lịch tư vấn <ArrowRight size={18} />
          </Link>
          <Link href="/giai-phap" className="secondaryButton">
            Khám phá giải pháp
          </Link>
        </div>
      </div>
    </SemanticHero>
  );
}
