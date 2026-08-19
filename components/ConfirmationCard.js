'use client';

import { formatINR } from '@/lib/pricing';

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917975630631';
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'networkingtoursandtravels@gmail.com';

function buildWhatsAppMessage(b) {
  const lines = [
    `*New Booking — Networking Tours & Travels*`,
    `Booking ID: ${b.id}`,
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Trip type: ${b.tripTypeLabel}`,
    `Vehicle: ${b.vehicleLabel}`,
    b.pickup ? `Pickup: ${b.pickup}` : null,
    b.drop ? `Drop: ${b.drop}` : null,
    b.date ? `Date: ${b.date} ${b.time || ''}` : null,
    b.tripType === 'outstation' ? `Days: ${b.days}` : null,
    b.km ? `Estimated distance: ${b.km} km` : null,
    b.price?.enquiryOnly ? `Fare: Enquiry — please share a quote` : `Estimated fare: ${formatINR(b.price?.total)} (incl. GST)`,
    `Payment: Pay after ride (Cash / UPI to driver)`,
    b.notes ? `Notes: ${b.notes}` : null,
  ].filter(Boolean);
  return encodeURIComponent(lines.join('\n'));
}

function buildMailto(b) {
  const subject = encodeURIComponent(`Booking ${b.id} — ${b.vehicleLabel}`);
  const body = encodeURIComponent(decodeURIComponent(buildWhatsAppMessage(b)).replace(/\*/g, ''));
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export default function ConfirmationCard({ booking, onReset }) {
  const wa = `https://wa.me/${WHATSAPP}?text=${buildWhatsAppMessage(booking)}`;

  return (
    <div className="ticket-notch rounded-2xl border border-black/5 bg-white p-8 shadow-ticket">
      <div className="route-line mb-6 rounded-full" />
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-route-teal">
        Booking request received
      </div>
      <h3 className="font-display text-2xl font-bold text-asphalt">Thank you, {booking.name}!</h3>
      <p className="mt-2 text-sm text-asphalt/70">
        Booking ID <span className="font-semibold text-asphalt">{booking.id}</span>. Our team will call you shortly
        to confirm. No advance payment needed — pay the driver by cash or UPI after your ride.
      </p>

      {!booking.price?.enquiryOnly && (
        <div className="mt-4 rounded-xl bg-mist p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-asphalt/70">Estimated fare (incl. GST)</span>
            <span className="font-display text-lg font-bold text-asphalt">{formatINR(booking.price?.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <a
          href={`tel:${PHONE}`}
          className="focus-ring flex items-center justify-center gap-2 rounded-full border-2 border-asphalt px-4 py-3 text-sm font-semibold text-asphalt hover:bg-asphalt hover:text-white"
        >
          📞 Call Us
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="focus-ring flex items-center justify-center gap-2 rounded-full bg-amber px-4 py-3 text-sm font-semibold text-white hover:bg-amber-dark"
        >
          💬 WhatsApp Details
        </a>
        <a
          href={buildMailto(booking)}
          className="focus-ring flex items-center justify-center gap-2 rounded-full border-2 border-black/10 px-4 py-3 text-sm font-semibold text-asphalt hover:border-asphalt"
        >
          ✉️ Email Us
        </a>
      </div>

      {onReset && (
        <button onClick={onReset} className="focus-ring mt-6 text-sm font-medium text-route-teal underline underline-offset-4">
          Make another booking
        </button>
      )}
    </div>
  );
}
