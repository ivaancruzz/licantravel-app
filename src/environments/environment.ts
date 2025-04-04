export const environment = {
  production: false,
  MP_PUBLIC_KEY: import.meta.env['NGX_MP_PUBLIC_KEY'],
  PANEL_URL: import.meta.env['NGX_PANEL_URL'],
  SUPABASE_URL: import.meta.env['NGX_SUPABASE_URL'],
  SUPABASE_ANON_KEY: import.meta.env['NGX_SUPABASE_ANON_KEY'],
  NGX_STORAGE_RESOURCES: import.meta.env['NGX_STORAGE_RESOURCES'],
  NGX_TURNSTILE_KEY: import.meta.env['NGX_TURNSTILE_KEY'],
};
