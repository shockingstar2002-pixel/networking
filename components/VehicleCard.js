'use client';

import { useMemo, useState } from 'react';
import { calculatePrice, formatINR } from '@/lib/pricing';

export default function VehicleCard({ vehicle, vehicles, tripType, km, days, gstRate, onSelect }) {
  const [localPackageIdx, setLocalPackageIdx] = useState(0);

  const price = useMemo(
    () =>
      calculatePrice({
        vehicles,
        vehicleId: vehicle.id,
        tripType,
        km,
        days,
        localPackageIdx,
        gstRate,
      }),
    [vehicles, vehicle.id, tripType, km, days, localPackageIdx, gstRate]
  );

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-asphalt">{vehicle.label}</span>
          <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-route-teal">
            {vehicle.seats} seats
          </span>
        </div>
        <div className="text-sm text-asphalt/50">{vehicle.subLabel}</div>

        {tripType === 'local' && vehicle.local?.packages?.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {vehicle.local.packages.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLocalPackageIdx(idx)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  localPackageIdx === idx
                    ? 'border-route-teal bg-route-teal/10 text-route-teal'
                    : 'border-black/10 text-asphalt/60 hover:border-asphalt/30'
                }`}
              >
                {p.hrs} hrs / {p.km} km
              </button>
            ))}
          </div>
        )}

        {price?.error && <p className="mt-2 text-xs font-medium text-amber-dark">{price.error}</p>}
      </div>

      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        {price?.enquiryOnly ? (
          <span className="text-sm font-semibold text-asphalt/60">Price on request</span>
        ) : price?.total !== undefined ? (
          <>
            <span className="font-display text-2xl font-extrabold text-asphalt">{formatINR(price.total)}</span>
            <span className="text-[11px] text-asphalt/40">incl. GST · pay after ride</span>
          </>
        ) : null}
        <button
          type="button"
          disabled={!!price?.error}
          onClick={() => onSelect({ vehicleId: vehicle.id, localPackageIdx, price })}
          className="focus-ring rounded-full bg-amber px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-dark disabled:opacity-40"
        >
          {price?.enquiryOnly ? 'Request Quote' : 'Select Car'}
        </button>
      </div>
    </div>
  );
}
