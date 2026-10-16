# Launching Morne Studios on Cloudflare

The site is plain HTML/CSS/JS served as static assets by Cloudflare Workers
(`wrangler.jsonc`). There is no build step. Files listed in `.assetsignore`
(scripts, config, Markdown, the GitHub workflow) are never published.

## 1. Connect the repo to Cloudflare (one time)

1. Sign in at dash.cloudflare.com (free plan is enough).
2. **Workers & Pages → Create → Import a repository**, pick this site's GitHub repository.
   Name the project `mornestudio`: it must match `name` in `wrangler.jsonc`.
3. Build settings: leave the build command empty; deploy command `npx wrangler deploy`.
4. Deploy. The site is live at `https://mornestudio.<your-account>.workers.dev`.
   Every push to `main` redeploys automatically.

## 2. Buy and connect the domain

1. **Domains → Register domains** in Cloudflare (sold at cost, auto-renews).
   Domains Cloudflare doesn't sell (like `.dm`) can be bought elsewhere and
   pointed at Cloudflare's nameservers.
2. In the Worker: **Settings → Domains & Routes → Add → Custom domain**, enter
   the domain, and add `www.` as well. HTTPS is set up automatically.
3. Switch every absolute URL in the site to the new domain and push:

   ```
   node scripts/set-domain.mjs https://your-domain.com
   git commit -am "Switch to your-domain.com" && git push
   ```

## 3. Email

`hello@mornestudios.com` is set up (2026-10-16):

- **Receiving:** Cloudflare Email Routing forwards it to the business Gmail.
- **Sending:** Gmail "Send mail as" through Brevo's SMTP relay
  (`smtp-relay.brevo.com`), so mail is signed as mornestudios.com.
- **DNS:** SPF, DMARC (`p=none`), Brevo DKIM and the `em.` branded
  subdomain are in Cloudflare DNS.

The site and contact form use hello@. FormSubmit emails that address once to
confirm it after the first enquiry.

## 4. Before announcing

- [ ] Send a test enquiry through the live form; click FormSubmit's activation
      email; check you land on the thanks page and the email arrives.
- [ ] Add the site in Google Search Console and submit `/sitemap.xml`.
- [ ] Create a Google Business Profile and link the site.
- [ ] In Google Analytics, mark `generate_lead` as a key event.
- [ ] Turn off GitHub Pages (repo **Settings → Pages**) so there is one live copy.
      (The Pages workflow was removed on 2026-10-16.)

## Analytics events

| Event | When |
| --- | --- |
| `generate_lead` | Thanks page loads after a form send |
| `form_submit` | Contact form is submitted |
| `contact_click` (`method`: whatsapp, email, phone, phone_copy) | A contact link is clicked |
| `view_demo` (`demo`) | A concept demo is opened |
| `view_case_study` (`project`) | A case study is opened |

Google Analytics loads on the first scroll/tap or 3 seconds after load, to keep
the page fast; events before that are queued and still sent.

## Updating screenshots

Screenshots in `assets/work/` are static images. After changing a concept or
the ClearCoat pages, retake them at 2x (2880px wide desktop, 1170px phone) and
regenerate the `-1x.webp` half-size versions.
