import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import TrustBar from '@/components/TrustBar';
import PromoStrip from '@/components/PromoStrip';
import Faq from '@/components/Faq';

export default function Home() {
  return (
    <main>
      <Header />

      {/* Dark hero band, like a road at dusk — headline only, card floats below */}
      <section className="relative overflow-hidden bg-asphalt-gradient pb-28 pt-14 text-white sm:pb-36 sm:pt-20">
        <HeroBackdrop />
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-route-green">
            ★ 4.9 · 161 GOOGLE REVIEWS · THANISANDRA, BENGALURU
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
            Rides across Bengaluru
            <br className="hidden sm:block" /> &amp; beyond — pay after your ride
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
            Airport transfers, local rentals, outstation trips &amp; tempo travellers. No advance payment —
            settle in cash or UPI once you reach.
          </p>
        </div>
      </section>

      {/* Booking card overlaps the hero, like Savaari's search widget */}
      <div id="book" className="relative z-10 mx-auto -mt-20 max-w-5xl scroll-mt-24 px-5 sm:-mt-24">
        <SearchForm />
      </div>

      <TrustBar />
      <PromoStrip />

      {/* Blue "what sets us apart" bar */}
      <section className="bg-route-teal text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-4">
          {[
            { t: 'Pay after ride', d: 'No advance, no card on file' },
            { t: 'Real people, fast replies', d: 'Call or WhatsApp a local team' },
            { t: 'Transparent billing', d: 'What you see is what you pay' },
            { t: 'Every trip type', d: 'Local, outstation & one-way' },
          ].map((f) => (
            <div key={f.t}>
              <div className="font-display text-base font-bold">{f.t}</div>
              <div className="mt-1 text-sm text-white/75">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <Faq />

      <Footer />
    </main>
  );
}

function HeroBackdrop() {
  // Simple SVG skyline + road silhouette so the hero reads as a place, not a
  // flat gradient, without depending on any external stock photo.
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-40 sm:h-56"
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect x="40" y="60" width="70" height="140" fill="#0B4A68" />
      <rect x="130" y="30" width="50" height="170" fill="#0B3A55" />
      <rect x="200" y="80" width="90" height="120" fill="#0B4A68" />
      <rect x="310" y="50" width="60" height="150" fill="#0B3A55" />
      <rect x="900" y="70" width="80" height="130" fill="#0B4A68" />
      <rect x="1000" y="40" width="55" height="160" fill="#0B3A55" />
      <rect x="1080" y="90" width="90" height="110" fill="#0B4A68" />
      <line x1="0" y1="196" x2="1200" y2="196" stroke="#12A6D6" strokeWidth="2" strokeDasharray="10 10" />
    </svg>
  );
}
