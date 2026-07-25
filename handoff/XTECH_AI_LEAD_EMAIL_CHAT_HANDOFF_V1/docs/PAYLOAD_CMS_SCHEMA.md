# Payload CMS Schema

Collections:
- `lead-devices`
- `leads`
- `lead-conversations`
- `lead-messages`
- `resume-tokens`
- `email-templates`
- `consultants`
- `consultant-assignments`
- `lead-activities`

Trường chính:

`lead-devices`
- deviceId
- contact
- firstSeenAt
- lastSeenAt
- consentStatus
- isTrusted

`leads`
- fullName, email, phone, company
- source, status, score
- primaryNeed
- currentSystems
- targetTimeline
- assignedConsultant
- lastConversation

`lead-conversations`
- lead
- publicId
- status
- channels
- devices
- qualificationSummary
- missingFields

`lead-messages`
- conversation
- channel
- direction
- role
- contentText/contentHtml
- emailMessageId

`resume-tokens`
- tokenHash
- lead
- conversation
- expectedDeviceId
- expiresAt
- usedAt
- revoked

`email-templates`
- templateKey
- subject
- preheader
- htmlBody
- textBody
- triggerStatus
- audience
- active
- version
