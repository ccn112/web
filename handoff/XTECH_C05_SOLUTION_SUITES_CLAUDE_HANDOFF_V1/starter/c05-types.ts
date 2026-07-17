export type SuiteRole = 'core' | 'recommended' | 'optional' | 'not-applicable';

export type SolutionSuite = {
  slug: string;
  title: string;
  summary: string;
  businessJourney: Array<{
    order: number;
    title: string;
    description?: string;
  }>;
  products: Array<{
    productSlug: string;
    role: SuiteRole;
    note?: string;
  }>;
  platformCapabilities: string[];
  services: Array<{
    serviceSlug: string;
    role: Exclude<SuiteRole, 'not-applicable'>;
  }>;
  deploymentModels: Array<'saas' | 'private-cloud' | 'on-premise' | 'hybrid'>;
  outcomes: Array<{
    title: string;
    description: string;
  }>;
  roadmap: Array<{
    phase: number;
    title: string;
    description: string;
  }>;
};
