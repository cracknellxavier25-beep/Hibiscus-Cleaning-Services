/**
 * Callback form delivery mode, resolved at build time.
 *
 *   endpoint → POST FormData to PUBLIC_FORM_ENDPOINT (Formspree, Web3Forms, own API)
 *   netlify  → Netlify Forms (POST to the page, url-encoded)
 *   preview  → full UI, explicit "not sent" result; for local testing only
 *   off      → no form; the contact section shows call / text alternatives
 */
export type FormMode = 'endpoint' | 'netlify' | 'preview' | 'off';

const provider = (import.meta.env.PUBLIC_FORM_PROVIDER ?? '').trim().toLowerCase();
const endpoint = (import.meta.env.PUBLIC_FORM_ENDPOINT ?? '').trim();

export const formEndpoint = endpoint;
export const formAccessKey = (import.meta.env.PUBLIC_FORM_ACCESS_KEY ?? '').trim();

export const formMode: FormMode =
  provider === 'endpoint' && endpoint
    ? 'endpoint'
    : provider === 'netlify'
      ? 'netlify'
      : import.meta.env.PUBLIC_FORM_PREVIEW === 'true'
        ? 'preview'
        : 'off';

export const formEnabled = formMode !== 'off';
