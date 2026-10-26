// Central version numbers for the site's legal documents. Bumping a version
// here is a deliberate signal that the document's terms materially changed —
// it's what lets a stored consent (e.g. Contact.smsConsentVersion) be told
// apart from consent given under earlier wording. Bump the relevant version
// whenever /privacy, /terms, or the SMS consent checkbox's own text changes
// in a way that matters, not on typo fixes.
export const PRIVACY_POLICY_VERSION = "1.1.0";
export const TERMS_VERSION = "1.1.0";
export const SMS_CONSENT_VERSION = "1.1.0";

export const LEGAL_LAST_UPDATED = "October 26, 2026";
