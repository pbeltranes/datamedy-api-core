export enum STATUS_USER {
    DRAFT,
    ACTIVE,
    DESACTIVE,
    PENDING,
  }
  
  export const TEMPLATE_ID = 'd-ef606227ce774bb98904316276dec908';
  export const NEWSLETTER_ID = 'd-ef606227ce774bb98904316276dec908';
  export const CONTACT_ID = 'd-a7e9c382a5f240b78010f004d701d5ac';
  export const LAUNCH_ID = 'd-3af0e91d757049a6b71d725f0ad0206c';
  export const INTERNAL_CONTACT_ID = 'd-865c7a1eb9134684b4655db3003c0e66';
  
  export enum TEMPLATE_TYPES {
    TEMPLATE = 'TEMPLATE',
    NEWSLETTER = 'NEWSLETTER',
    CONTACT = 'CONTACT',
    LAUNCH = 'LAUNCH',
    INTERNAL_CONTACT = 'INTERNAL_CONTACT',
  }
  

export { default as CHILE } from "./data/countries/chile.json"
export { default as LOINC_DATA } from "./data/loinc_data.json"
export  { default as SERVICES  } from "./data/services.json"
export  { default as ISAPRES  } from "./data/isapres.json"
export  { default as SPECIALTIES  } from "./data/specialties.json"
