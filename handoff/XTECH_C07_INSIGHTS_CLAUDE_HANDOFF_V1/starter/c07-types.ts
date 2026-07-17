export type InsightCategorySeed = {
  slug: string;
  title: string;
  description: string;
};

export type InsightArticleSeed = {
  slug: string;
  title: string;
  summary: string;
  categorySlug: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'review' | 'published';
  relatedSolutions?: string[];
  relatedProducts?: string[];
};
