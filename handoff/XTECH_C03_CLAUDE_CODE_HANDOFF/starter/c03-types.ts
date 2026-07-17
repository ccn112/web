export type ProductItem = {
  id: string
  title: string
  description: string
  href?: string
  badges?: string[]
  icon?: string
  illustration?: string
}

export type ProductOutcome = {
  title: string
  description: string
  icon?: string
}

export type ProductSection = {
  sectionId: string
  route: string[]
  eyebrow?: string
  title: string
  subtitle?: string
  intro?: string
  layout: 'orbit' | 'hub-spoke' | 'stack' | 'journey' | 'showcase'
  items: ProductItem[]
  outcomes?: ProductOutcome[]
  platformChips?: string[]
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}
