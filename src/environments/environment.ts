export const environment = {
  production: false,
  PANEL_URL: import.meta.env['NGX_PANEL_URL'],
  SUPABASE_URL: import.meta.env['NGX_SUPABASE_URL'],
  SUPABASE_ANON_KEY: import.meta.env['NGX_SUPABASE_ANON_KEY'],
  NGX_STORAGE_RESOURCES: import.meta.env['NGX_STORAGE_RESOURCES'],
  NGX_TURNSTILE_KEY: import.meta.env['NGX_TURNSTILE_KEY'],
  NGX_MP_WEBHOOK_SECRET_KEY: import.meta.env['NGX_MP_WEBHOOK_SECRET_KEY'],
  NGX_MP_ACCESS_TOKEN: import.meta.env['NGX_MP_ACCESS_TOKEN'],
};
