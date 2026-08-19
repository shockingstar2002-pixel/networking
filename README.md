# Networking Tours & Travels — Booking Website

A Next.js 14 (App Router) booking site for a taxi/cab business, built around a
**"pay after ride" (cash / UPI to driver)** model — no online payment gateway.

## What's included

- **Home page** — a simple search form (trip type, pickup/drop, date/time,
  estimated km). No prices or vehicle picking here — just like a real
  aggregator's homepage. Ends in an **"Explore Cabs"** button.
- **`/select-cars`** — shows every vehicle available for that trip type as a
  priced card (live-calculated from current admin-set rates + GST), with a
  package picker for Local trips. "Select Car" moves to the next step.
- **`/booking`** — review screen (route, vehicle, full fare breakdown) +
  contact form + **"Confirm Booking"**. This is the only step that actually
  creates the booking.
- **Call / WhatsApp / Email integration** — after confirming, the customer
  gets one-tap buttons to call, WhatsApp (pre-filled message with booking
  details), or email the team. The server also tries to email the owner
  automatically if you configure SMTP (optional).
- **Admin panel** (`/admin`) — password-protected, with two tabs:
  - **Bookings** — every booking, filterable by status, with one-tap
    call/WhatsApp per row and a status dropdown (Pending → Confirmed →
    Completed / Cancelled).
  - **Rates & Fleet** — full CRUD over every vehicle and its pricing.
    Add a new vehicle, edit any rate (airport/local/outstation/one-way,
    including local package rows), toggle "enquiry only", or delete a
    vehicle entirely. There's also a single GST-rate field that applies
    everywhere. **No rates are hardcoded in the UI anymore** — the public
    site always reflects whatever is saved here.
- **User panel** (`/my-bookings`) — a simple "track my booking" page where a
  customer can look up their bookings by phone number. No account/signup
  needed, kept intentionally simple per your request.

## Rates & pricing

Rates now live in `data/rates.json` and are only ever edited through
`/admin/rates` (or by directly editing that JSON file before first run).
`lib/default-rates.js` holds the original numbers you gave us — it's only
used once, to seed `data/rates.json` the very first time the app starts.
After that, the seed file is irrelevant; everything is driven from the
admin-editable JSON.

`lib/pricing.js` is now a pure calculator: given a `vehicles` map, a trip
type, and some trip details, it returns a fare breakdown + GST + total. Both
`/select-cars` and `/booking` fetch the current rates from `GET /api/rates`
and run this calculator client-side, so price changes made in the admin
panel show up immediately without a deploy.

A couple of judgment calls were needed to turn your original shorthand into
exact math — still documented at the top of `lib/pricing.js`.


## Getting started

```bash
npm install
cp .env.example .env.local   # then edit values inside
npm run dev
```

Open http://localhost:3000

- Booking form: `/`
- Admin panel: `/admin` (default password `admin123` — **change this** via
  `ADMIN_PASSWORD` in `.env.local`)
- Customer "my bookings" lookup: `/my-bookings`

## Configuration (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_BUSINESS_PHONE` | Used for the "Call Us" buttons (`tel:` links) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Used for WhatsApp buttons (digits only, with country code, no `+`) |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Used for `mailto:` links |
| `ADMIN_PASSWORD` | Password to log into `/admin` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_TO` | Optional — if filled in, the server automatically emails your team on every new booking. If left blank, email sending is skipped silently (booking + WhatsApp/Call still work fine). Any SMTP provider works (Gmail app password, Zoho Mail, SendGrid SMTP, etc.) |

## How bookings & rates are stored

Both bookings and rates are saved to simple JSON files on the server
(`data/bookings.json` and `data/rates.json`, via `lib/db.js` and
`lib/rates-store.js`) — no database setup needed to try this out locally.

**Important for production hosting:** if you deploy to a serverless platform
like Vercel, the filesystem is read-only/ephemeral, so `data/bookings.json`
and `data/rates.json` won't persist. For a real production deployment, swap
`lib/db.js` and `lib/rates-store.js` for a real database (Postgres via
Supabase/Neon, MongoDB Atlas, etc.) — the rest of the app (API routes, admin
panel, pricing calculator) doesn't need to change, only the handful of
functions in those two files. Alternatively, deploy on a regular Node.js
server (a VPS, Railway, Render) where the filesystem does persist.

**Also worth knowing:** the fare shown to a customer on `/booking` is
calculated in the browser and sent to the server as-is when they confirm —
there's no server-side re-check of the math. That's fine for this "pay
after ride" model (the driver/your team always verifies the final amount in
person), but if you ever add online payment, you'd want to recompute the
price server-side before charging anything.

## Customizing

- **Rates:** don't edit code — use `/admin/rates`. (For a fresh install
  before you've run it yet, you can also hand-edit `lib/default-rates.js`,
  which only affects the very first `data/rates.json` seed.)
- **Branding/colors:** edit `tailwind.config.js` (the `asphalt` / `route` /
  `amber` / `paper` / `mist` palette) and `app/globals.css`.
- **Business info:** edit `.env.local` plus the address text in
  `components/Footer.js`.
- **Admin password:** `ADMIN_PASSWORD` in `.env.local`. For a second admin
  panel or role-based access later, you'd want a real auth provider
  (NextAuth, Clerk, etc.) instead of the single shared password used here —
  fine for a single-owner business to start with, but worth upgrading if
  multiple staff need separate logins.

## Next steps you may want later

- A real database instead of the JSON file (see above).
- SMS notifications (e.g. via Twilio) in addition to email.
- Multiple admin logins with roles.
- Payment gateway integration, if you ever want an "optional advance"
  option alongside pay-after-ride.
# networking
