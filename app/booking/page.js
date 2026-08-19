'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConfirmationCard from '@/components/ConfirmationCard';
import { TRIP_TYPES, calculatePrice, formatINR } from '@/lib/pricing';

function BookingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [rates, setRates] = useState(null);

  const tripType = params.get('tripType') || 'airport';
  const vehicleId = params.get('vehicleId') || '';
  const pickup = params.get('pickup') || '';
  const drop = params.get('drop') || '';
  const date = params.get('date') || '';
  const time = params.get('time') || '';
  const returnDate = params.get('returnDate') || '';
  const km = Number(params.get('km')) || 0;
  const localPackageIdx = Number(params.get('localPackageIdx')) || 0;

  const days = (() => {
    if (tripType !== 'outstation' || !date || !returnDate) return 1;
    const diff = Math.round((new Date(returnDate) - new Date(date)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff + 1 : 1;
  })();

  useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then(setRates);
  }, []);

  const price = useMemo(() => {
    if (!rates) return null;
    return calculatePrice({ vehicles: rates.vehicles, vehicleId, tripType, km, days, localPackageIdx, gstRate: rates.settings?.gstRate });
  }, [rates, vehicleId, tripType, km, days, localPackageIdx]);

  const vehicle = rates?.vehicles?.[vehicleId];
  const tripTypeLabel = TRIP_TYPES.find((t) => t.id === tripType)?.label || tripType;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    setSubmitting(true);

    const booking = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      tripType,
      tripTypeLabel,
      vehicleId,
      vehicleLabel: vehicle?.label || vehicleId,
      pickup,
      drop,
      date,
      time,
      days,
      km,
      notes,
      price,
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.booking);
    } catch (err) {
      setError(err.message + ' — please call or WhatsApp us directly instead.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!rates) {
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-3xl px-5 py-16 text-sm text-asphalt/50">Loading…</div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-10">
        {result ? (
          <ConfirmationCard booking={result} onReset={() => router.push('/')} />
        ) : (
          <>
            <button onClick={() => router.back()} className="focus-ring text-sm font-semibold text-route-teal hover:underline">
              ← Back to cabs
            </button>

            <div className="mt-4 rounded-2xl border border-black/5 bg-white p-6 shadow-ticket sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Review your booking</div>
              <h1 className="mt-1 font-display text-2xl font-bold text-asphalt">
                {pickup}
                {drop ? ` → ${drop}` : ''}
              </h1>
              <p className="mt-1 text-sm text-asphalt/60">
                {vehicle?.label} · {tripTypeLabel} · {date} {time} {tripType === 'outstation' ? `· ${days} day(s)` : ''}
              </p>

              {!price?.enquiryOnly && price?.breakdown && (
                <div className="mt-4 rounded-xl bg-mist p-4">
                  <ul className="space-y-1 text-sm text-asphalt/80">
                    {price.breakdown.map((b, i) => (
                      <li key={i} className="flex items-center justify-between gap-4">
                        <span>{b.label}</span>
                        {b.amount !== null && <span className="font-medium">{formatINR(b.amount)}</span>}
                      </li>
                    ))}
                    <li className="flex items-center justify-between gap-4">
                      <span>GST ({Math.round((price.gstRate || 0) * 100)}%)</span>
                      <span className="font-medium">{formatINR(price.gst)}</span>
                    </li>
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
                    <span className="font-display font-semibold text-asphalt">Total estimate</span>
                    <span className="font-display text-xl font-bold text-asphalt">{formatINR(price.total)}</span>
                  </div>
                  <div className="mt-2 text-xs text-asphalt/50">Pay after the ride — cash or UPI to the driver.</div>
                </div>
              )}

              {price?.enquiryOnly && (
                <div className="mt-4 rounded-xl bg-mist p-4 text-sm text-asphalt/70">
                  Price on request — our team will call you with a quote for this group trip.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
                </Field>
                <Field label="Phone number">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="10-digit mobile number" className="input" required />
                </Field>
                <Field label="Email (optional)">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" />
                </Field>
                <Field label="Notes (optional)">
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Flight number, luggage, etc." className="input" />
                </Field>

                {error && <p className="text-sm font-medium text-amber-dark sm:col-span-2">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring mt-2 w-full rounded-full bg-amber py-4 text-center font-display text-base font-bold uppercase tracking-wide text-white transition hover:bg-amber-dark disabled:opacity-60 sm:col-span-2 sm:w-auto sm:px-12"
                >
                  {submitting ? 'Confirming…' : 'Confirm Booking — Pay After Ride'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      <Footer />

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 2px solid rgba(11, 31, 42, 0.1);
          background: white;
          padding: 0.65rem 0.9rem;
          font-size: 0.9rem;
          color: #0b1f2a;
        }
        .input:focus {
          outline: none;
          border-color: #0b84c4;
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-asphalt/50">{label}</span>
      {children}
    </label>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingInner />
    </Suspense>
  );
}
