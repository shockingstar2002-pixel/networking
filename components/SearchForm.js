'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRIP_TYPES } from '@/lib/pricing';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function SearchForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState('airport');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(todayStr());
  const [km, setKm] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!pickup.trim()) {
      setError('Please enter a pickup location.');
      return;
    }
    if (tripType !== 'local' && tripType !== 'group' && !drop.trim()) {
      setError('Please enter a drop location.');
      return;
    }
    setError('');

    const params = new URLSearchParams({
      tripType,
      pickup,
      drop,
      date,
      time,
      returnDate: tripType === 'outstation' ? returnDate : '',
      km: km || '',
    });
    router.push(`/select-cars?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/5 bg-white p-6 shadow-ticket sm:p-8">
      {/* Trip type tabs, segmented-control style */}
      <div className="flex flex-wrap gap-1 rounded-full bg-mist p-1 sm:inline-flex">
        {TRIP_TYPES.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => {
              setTripType(t.id);
              setError('');
            }}
            className={`focus-ring rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition sm:text-sm ${
              tripType === t.id ? 'bg-route-teal text-white shadow-sm' : 'text-asphalt/60 hover:text-asphalt'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Pickup location">
          <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="e.g. Kempegowda Airport" className="input" required />
        </Field>

        {tripType !== 'local' && (
          <Field label={tripType === 'group' ? 'Destination (optional)' : tripType === 'outstation' ? 'Destination' : 'Drop location'}>
            <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="e.g. Thanisandra, Bengaluru" className="input" required={tripType !== 'group'} />
          </Field>
        )}

        <Field label={tripType === 'outstation' ? 'Start date' : 'Date'}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" required />
        </Field>

        {tripType === 'outstation' ? (
          <Field label="Return date">
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input" required />
          </Field>
        ) : (
          <Field label="Pickup time">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input" required />
          </Field>
        )}

        {tripType !== 'group' && (
          <Field label="Estimated km (optional)">
            <input type="number" min="0" value={km} onChange={(e) => setKm(e.target.value)} placeholder="e.g. 45" className="input" />
          </Field>
        )}
      </div>

      {error && <p className="mt-4 text-sm font-medium text-amber-dark">{error}</p>}

      <button
        type="submit"
        className="focus-ring mt-6 w-full rounded-full bg-amber py-4 text-center font-display text-base font-bold uppercase tracking-wide text-white transition hover:bg-amber-dark sm:w-auto sm:px-12"
      >
        Explore Cabs
      </button>

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
    </form>
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
