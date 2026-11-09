// EmailJS identifiers are *public* client-side values by design: they are sent
// from the browser on every request and cannot be kept secret. The committed
// defaults keep the existing contact form working; override them with VITE_*
// env vars (see .env.example) if the EmailJS account changes.
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ctyayi3',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_28g8p3s',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'jThJ11wIKTUp6lWtw',
} as const;
