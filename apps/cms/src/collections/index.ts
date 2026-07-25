import { CaseStudies } from './CaseStudies'
import { FAQs } from './FAQs'
import { Forms } from './Forms'
import { FormSubmissions } from './FormSubmissions'
import { Media } from './Media'
import { Menus } from './Menus'
import { Pages } from './Pages'
import { Posts } from './Posts'
import { Products } from './Products'
import { PromptSets } from './PromptSets'
import { Redirects } from './Redirects'
import { ServiceSections } from './ServiceSections'
import { Sites } from './Sites'
import { Solutions } from './Solutions'
import { Users } from './Users'
import { ChatSessions } from './ChatSessions'
import { ChatUsers } from './ChatUsers'
import { ChatUsage } from './ChatUsage'
import { Leads } from './Leads'
import { LeadDevices } from './LeadDevices'
import { LeadConversations } from './LeadConversations'
import { LeadMessages } from './LeadMessages'
import { ResumeTokens } from './ResumeTokens'
import { EmailTemplates } from './EmailTemplates'
import { Consultants } from './Consultants'
import { ConsultantAssignments } from './ConsultantAssignments'
import { LeadActivities } from './LeadActivities'

export const collections = [
  Users,
  Sites,
  Media,
  Pages,
  Posts,
  ServiceSections,
  Products,
  Solutions,
  CaseStudies,
  FAQs,
  Menus,
  Forms,
  FormSubmissions,
  PromptSets,
  Redirects,
  ChatSessions,
  ChatUsers,
  ChatUsage,
  // Lead qualification: web-chat + email + consultant handoff (one thread).
  Leads,
  LeadDevices,
  LeadConversations,
  LeadMessages,
  ResumeTokens,
  EmailTemplates,
  Consultants,
  ConsultantAssignments,
  LeadActivities,
]
