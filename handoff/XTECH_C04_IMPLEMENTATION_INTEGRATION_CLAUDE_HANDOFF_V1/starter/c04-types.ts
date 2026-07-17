export type ImplementationItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type ImplementationSection = {
  sectionId: string;
  route: string[];
  eyebrow?: string;
  title: string;
  description: string;
  layout: 'visual-left' | 'visual-right' | 'full-width';
  items: ImplementationItem[];
  cta?: { label: string; href: string };
};
