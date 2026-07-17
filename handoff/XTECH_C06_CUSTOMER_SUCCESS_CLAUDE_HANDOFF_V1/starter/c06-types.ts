export type EvidenceType = 'verified' | 'estimated' | 'qualitative' | 'hidden';

export type CustomerOutcome = {
  title: string;
  value?: string;
  description: string;
  evidenceType: EvidenceType;
  sourceNote?: string;
};

export type CustomerStorySeed = {
  slug: string;
  title: string;
  anonymized: boolean;
  anonymousLabel?: string;
  summary: string;
  challenges: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  beforeState: string[];
  afterState: string[];
  products: Array<{
    productSlug: string;
    role: 'core' | 'supporting';
  }>;
  services: string[];
  implementationPhases: Array<{
    order: number;
    title: string;
    description: string;
  }>;
  outcomes: CustomerOutcome[];
  nextRoadmap: Array<{
    phase: number;
    title: string;
    description: string;
  }>;
};
