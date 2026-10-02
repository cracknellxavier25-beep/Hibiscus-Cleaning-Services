/**
 * Lightweight analytics hook. Nothing is sent anywhere by default.
 * Events: call_link_click, callback_form_start, callback_submit_success, reveal_interaction.
 *
 * To connect a provider later, listen for the `hibiscus:track` event, or load a
 * tag manager that defines window.dataLayer. Never pass form contents here.
 */
type EventName = 'call_link_click' | 'callback_form_start' | 'callback_submit_success' | 'reveal_interaction';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: EventName, detail: Record<string, string> = {}) {
  try {
    const payload = { event, ...detail };
    window.dispatchEvent(new CustomEvent('hibiscus:track', { detail: payload }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
  } catch {
    /* analytics must never break the page */
  }
}
