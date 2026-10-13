// Third-party form integrations. Both are intentionally empty until configured --
// see docs/feedback-and-newsletter-setup.md. While a value is empty, the matching
// UI renders an honest "not live yet" state instead of a fake working form.
//
// None of these values are secrets: a Formspree endpoint and a MailerLite
// account/form ID are public by design (they ship in the page HTML). Never put a
// MailerLite API key anywhere in this repo.
const forms = {
  // Formspree form endpoint, e.g. "https://formspree.io/f/abcdwxyz"
  formspreeEndpoint: "https://formspree.io/f/mgaonzrq",

  // MailerLite embedded form (Forms > Embedded forms > "Copy universal script")
  mailerliteAccountId: "2709585", // the number in ml('account', '1234567')
  mailerliteFormId: "5kYV2B",    // the code in data-form="aBc1De"
};

if (!forms.formspreeEndpoint) {
  console.warn("[forms] formspreeEndpoint is empty: /feedback/ will build with the submit button disabled.");
}
if (!forms.mailerliteAccountId || !forms.mailerliteFormId) {
  console.warn("[forms] MailerLite IDs are empty: newsletter sections will build in their 'coming soon' state.");
}

module.exports = forms;
