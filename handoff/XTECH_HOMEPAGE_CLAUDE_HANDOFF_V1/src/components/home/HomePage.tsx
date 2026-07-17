import {HomeHero} from "./HomeHero";
import {TrustSection} from "./TrustSection";
import {SolutionsSection} from "./SolutionsSection";
import {ProductsSection} from "./ProductsSection";
import {PlatformSection} from "./PlatformSection";
import {SolutionSuitesSection} from "./SolutionSuitesSection";
import {ServicesSection} from "./ServicesSection";
import {DeploymentSection} from "./DeploymentSection";
import {BusinessValueSection} from "./BusinessValueSection";
import {CustomersInsightsSection} from "./CustomersInsightsSection";
import {FinalCTA} from "./FinalCTA";

export function HomePage(){
 return <main>
  <HomeHero/>
  <TrustSection/>
  <SolutionsSection/>
  <ProductsSection/>
  <PlatformSection/>
  <SolutionSuitesSection/>
  <ServicesSection/>
  <DeploymentSection/>
  <BusinessValueSection/>
  <CustomersInsightsSection/>
  <FinalCTA/>
 </main>
}
