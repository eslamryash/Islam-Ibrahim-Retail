# Islam Ibrahim Retail LLC — Storefront

A mobile-friendly dark luxury fashion storefront with a shopping cart, WhatsApp order handoff, and an optional Stripe Checkout backend.

## Included
- Responsive fashion storefront
- Category filters and sample catalogue
- Shopping bag with quantity controls
- WhatsApp order handoff
- Cloudflare Pages Function that creates a Stripe-hosted Checkout Session
- Stripe secret key stays server-side

## 1. Customize the store
Edit `config.js`:
- Replace `REPLACE_WITH_YOUR_WHATSAPP_NUMBER` with your WhatsApp number in international format, digits only (for example `201001234567`).
- Set `currency` to `USD` or another currency supported by Stripe.
  **Important:** The included Stripe backend currently uses USD cents and sample USD prices. If you change currency, update the backend's `currency` and amounts too.
Edit `products.js` to change names, descriptions, images and display prices.
Update the `CATALOG` in `functions/api/create-checkout-session.js` to match the same product IDs and prices. Prices are in the smallest currency unit (e.g. 4800 = $48.00 USD).

The sample product list and prices are demo content. Replace them with your real inventory and verify image rights and product details before launch.

## 2. Publish free with Cloudflare Pages
1. Create a free account at https://dash.cloudflare.com/
2. Create a GitHub repository and upload all files in this project, keeping the `functions` folder.
3. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
4. Select your repository. Use:
   - Framework preset: **None**
   - Build command: leave blank
   - Build output directory: `/` (or `.` if the dashboard requires it)
5. Deploy. Cloudflare will give you a `*.pages.dev` address and HTTPS.

You can also use Cloudflare Pages Direct Upload for a static preview, but Git integration is recommended so the `/functions` API route deploys correctly.

## 3. Enable Stripe card checkout
1. Create/sign in to your Stripe account and complete its business verification and payout setup.
2. In Stripe Dashboard, use **test mode** first and copy the test secret key (`sk_test_...`).
3. In Cloudflare Pages → your project → Settings → Variables and Secrets, add:
   - `STRIPE_SECRET_KEY` = your Stripe test secret key (mark as secret)
   - `SITE_URL` = your deployed `https://your-project.pages.dev` address
4. Redeploy the project.
5. Test a card payment using Stripe's official test card `4242 4242 4242 4242`, any future expiry date, any CVC and postal code.
6. Only after testing, add your live secret key (`sk_live_...`) as a secret and redeploy.

Never paste your Stripe secret key into `config.js`, `app.js`, GitHub, or a public chat. Use Cloudflare's secret variable interface only.

**Before accepting live orders:** implement and test Stripe webhooks for reliable fulfillment, shipping/tax rules, inventory checks, refund handling, and order records. A successful redirect alone is not proof that payment has settled. The included starter creates a Stripe-hosted payment session but does not yet persist orders or validate fulfillment.

## 4. WhatsApp checkout
Add your WhatsApp number to `config.js`. WhatsApp checkout opens a prefilled order message. The customer sends it to you; confirm stock, shipping, and final amount with them before taking payment.

## 5. Important launch checklist
- Replace demo products, prices, photos, and descriptions.
- Add your real WhatsApp number.
- Set a currency and make frontend/backend prices match.
- Add return, shipping, privacy and terms pages appropriate to your business.
- Test on a phone.
- Test Stripe in test mode before live mode.
- Do not collect card details directly on this site.
