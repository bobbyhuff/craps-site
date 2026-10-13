# Feedback form and 0Stakes Insider newsletter: setup

Both features read their settings from `src/_data/forms.js`. The Formspree endpoint is set; MailerLite is still empty. While a value is empty:

- `/feedback/` renders with a notice and a disabled Send button.
- Newsletter sections render "The Insider signup opens soon."

Nothing in the repo contains an API key. A Formspree endpoint and MailerLite account/form IDs are public identifiers.

## 1. Feedback form (Formspree)

1. Create a form at formspree.io. Copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. Paste it into `formspreeEndpoint` in `src/_data/forms.js`.
3. In the Formspree dashboard: set the notification email, and optionally turn on reCAPTCHA or other spam filtering. The form already includes the `_gotcha` honeypot Formspree supports.
4. Deploy, submit a real test message from `/feedback/`, and confirm it arrives. Only then treat the form as working.

Fields sent: `topic`, `message` (max 5000), `email` (optional), `page_url` (originating page or "Direct visit (no originating page)"). Nothing is sent to analytics, and feedback never subscribes anyone to the newsletter.

Entry points: footer link (`/feedback/?from=<current page>`) and a "Report a bug" link under each game (`?topic=bug&from=/games/<name>/`).

## 2. Newsletter (MailerLite)

1. In MailerLite: Forms > Embedded forms > Create form. Keep it minimal (email field plus a button, button text e.g. "Join the Insider - Free"). The headline, benefits, and "No spam" line are rendered by the site around it, so leave them out of the MailerLite form.
2. In the form's settings, enable **double opt-in** (Settings > Signup forms, or per form) and keep MailerLite's built-in anti-spam/reCAPTCHA on. Unsubscribe links are added to every campaign automatically.
3. From the "Copy universal script" step, take two values:
   - `ml('account', '1234567')` -> `mailerliteAccountId`
   - `data-form="aBc1De"` -> `mailerliteFormId`
4. Put both in `src/_data/forms.js`, build, and subscribe a test address end to end (confirm the double opt-in email arrives).

The MailerLite script loads lazily, only when the signup section nears the viewport. The homepage section has `id="insider"`, which the footer's "0Stakes Insider" link targets via `/#insider` (works from any page). Strategy articles get the compact version automatically through `post.njk`; add `noNewsletter: true` to an article's frontmatter to opt out.

## 3. Suggested welcome automation (not enabled)

In MailerLite: Automations > Create workflow > trigger "Subscriber joins a group" (the group your form adds people to) > Send email. Nothing sends until you build and enable it.

**Subject:** Welcome to the 0Stakes Insider

> Welcome to the 0Stakes Insider!
>
> You're now on the list for original casino strategy breakdowns, simulations, and updates from 0Stakes.
>
> Our goal is simple: help you understand the math, make smarter decisions, and have fun exploring casino games without risking real money.
>
> Keep an eye out for new articles, interesting experiments, and exclusive strategy resources.
>
> Thanks for joining!
> The 0Stakes Team
> https://0stakes.com
