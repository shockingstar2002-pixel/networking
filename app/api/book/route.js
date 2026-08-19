import { NextResponse } from 'next/server';
import { addBooking, getBookings, makeBookingId } from '@/lib/db';
import { sendBookingEmail } from '@/lib/mailer';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const booking = {
      id: makeBookingId(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      paymentMode: 'Pay after ride (Cash / UPI to driver)',
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      tripType: body.tripType,
      tripTypeLabel: body.tripTypeLabel,
      vehicleId: body.vehicleId,
      vehicleLabel: body.vehicleLabel,
      pickup: body.pickup || '',
      drop: body.drop || '',
      date: body.date || '',
      time: body.time || '',
      days: body.days || 1,
      km: body.km || 0,
      notes: body.notes || '',
      price: body.price || null,
    };

    addBooking(booking);

    // Fire-and-forget email; never block the booking on this.
    sendBookingEmail(booking).catch(() => {});

    return NextResponse.json({ ok: true, booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong. Please call us instead.' }, { status: 500 });
  }
}

export async function GET(req) {
  const isAdmin = cookies().get('ntt_admin')?.value === '1';
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  const all = getBookings();

  if (isAdmin) {
    return NextResponse.json({ bookings: all });
  }

  if (phone) {
    const mine = all.filter((b) => b.phone.replace(/\D/g, '').endsWith(phone.replace(/\D/g, '')));
    return NextResponse.json({ bookings: mine });
  }

  return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
}
