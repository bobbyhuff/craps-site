// Supabase project connection. Both values are PUBLIC by design (they ship in the page
// HTML; row level security in supabase/schema.sql is what protects the data). While
// either is empty the site builds exactly as before: no login link, no wallet.
// Setup steps: docs/accounts-setup.md
//
// NEVER put the service_role key here or anywhere in this repo.
module.exports = {
  // e.g. "https://abcdefghijklmnop.supabase.co"
  url: "https://dntqvewhrmbldgbmrinr.supabase.co",
  // The "anon" / "publishable" key from Project Settings > API
  anonKey: "sb_publishable_bXINUCzbg2XesbmQw4Vuxg_NK2GPO4x",
};
