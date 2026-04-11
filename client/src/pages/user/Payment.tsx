import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Booking {
  id: string;
  eventName: string;
  price: number;
  quantity: number;
  date: string;
  [key: string]: any;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`http://localhost:5000/api/booking/${bookingId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch booking");
        }
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load booking");
      }
    }

    if (bookingId) fetchBooking();
  }, [bookingId]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, method })
      });

      if (!res.ok) {
        throw new Error("Payment failed");
      }

      const data = await res.json();

      if (data.success) {
        navigate("/success");
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Payment error occurred");
    }
    setLoading(false);
  };

  if (error) {
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  }

  if (!booking) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
        <p className="text-sm text-gray-500">Complete your booking securely</p>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left - Payment Details */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Method</h2>

          <div className="grid grid-cols-2 gap-4">
            {["card", "mobile"].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`rounded-xl border p-4 text-sm font-medium transition ${
                  method === m
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {m === "card" ? "Card Payment" : "Mobile Money"}
              </button>
            ))}
          </div>

          {/* Conditional Inputs */}
          {method === "card" && (
            <div className="mt-6 grid gap-3">
              <input className="rounded-xl border p-3" placeholder="Card Number" />
              <input className="rounded-xl border p-3" placeholder="Expiry Date" />
              <input className="rounded-xl border p-3" placeholder="CVV" />
            </div>
          )}

          {method === "mobile" && (
            <div className="mt-6">
              <input
                className="w-full rounded-xl border p-3"
                placeholder="Mobile Number"
              />
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        {/* Right - Summary */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-indigo-600 p-6 text-white">
            <span className="text-xs uppercase tracking-widest text-indigo-200">
              Booking Summary
            </span>
            <h3 className="mt-2 text-lg font-bold">{booking.eventName || 'Event Payment'}</h3>
            <p className="mt-2 text-sm text-indigo-200">
              Complete your payment to confirm your booking.
            </p>

            <div className="mt-6 border-t border-indigo-500 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-indigo-200">Quantity:</span>
                <span className="font-semibold">{booking.quantity || 1}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-indigo-200">${booking.price?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900">Secure Payment</h4>
            <p className="mt-1 text-xs text-gray-500">
              Your payment information is processed securely. We do not store card details.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
