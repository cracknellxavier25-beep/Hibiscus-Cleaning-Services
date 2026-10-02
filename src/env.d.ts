/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** 'netlify' | 'endpoint'. Unset = form delivery not configured. */
  readonly PUBLIC_FORM_PROVIDER?: string;
  /** POST endpoint for provider 'endpoint' (e.g. Formspree, Web3Forms, own API). */
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Public access key some providers require (e.g. Web3Forms). Never a secret. */
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
  /** 'true' renders the form in an explicit preview-only state (nothing is sent). */
  readonly PUBLIC_FORM_PREVIEW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
