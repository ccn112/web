"use client";

import {
  BrainCircuit,
  Database,
  Megaphone,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import styles from "./SemanticHero.module.css";

const nodes = [
  { id: "marketing", label: "Marketing", Icon: Megaphone, className: styles.nodeLeftTop },
  { id: "customers", label: "Khách hàng", Icon: Users, className: styles.nodeLeftMiddle },
  { id: "analytics", label: "Phân tích", Icon: TrendingUp, className: styles.nodeLeftBottom },
  { id: "ai", label: "AI", Icon: BrainCircuit, className: styles.nodeRightTop },
  { id: "data", label: "Dữ liệu", Icon: Database, className: styles.nodeRightMiddle },
  { id: "operations", label: "Vận hành", Icon: Settings, className: styles.nodeRightBottom },
];

export function SemanticNodes() {
  return (
    <div className={styles.nodesLayer} aria-hidden="true">
      {nodes.map(({ id, label, Icon, className }, index) => (
        <div
          key={id}
          className={`${styles.semanticNode} ${className}`}
          style={{ "--node-delay": `${index * 80}ms` } as React.CSSProperties}
          title={label}
        >
          <Icon size={30} strokeWidth={1.65} />
        </div>
      ))}
    </div>
  );
}
