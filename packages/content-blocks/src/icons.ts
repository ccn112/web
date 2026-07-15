import {
  Boxes,
  Building2,
  Cloud,
  Database,
  Gauge,
  LayoutGrid,
  LineChart,
  type LucideIcon,
  MessagesSquare,
  Network,
  Server,
  Shield,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from 'lucide-react'

/** Maps the seed `icon` keys (and a few extras) to lucide icons. */
const ICONS: Record<string, LucideIcon> = {
  database: Database,
  workflow: Workflow,
  sparkles: Sparkles,
  cloud: Cloud,
  chart: LineChart,
  gauge: Gauge,
  grid: LayoutGrid,
  network: Network,
  server: Server,
  shield: Shield,
  users: Users,
  building: Building2,
  boxes: Boxes,
  chat: MessagesSquare,
  zap: Zap,
}

export function resolveIcon(name?: string): LucideIcon {
  return (name && ICONS[name]) || Sparkles
}
