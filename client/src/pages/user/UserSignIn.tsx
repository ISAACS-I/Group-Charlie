import React, { useState } from "react";
import { Link } from "react-router-dom";
// Using the same consistent icons from Lucide
import { ShieldCheck, Zap, Users, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Reusing the 50/50 split-screen layout
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      
      {/* --- Left Side: Branding & Features (Copied from Signup) --- */}
      <div className="relative hidden flex-1 flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 p-12 text-white lg:flex">
        <div className="z-10">
          {/* Your actual logo component will go here */}
          <span className="text-xl font-bold tracking-tight">(logo)</span>
        </div>

        <div className="z-10 max-w-md space-y-6">
          {/* --- The New Text --- */}
          <h1 className="text-5xl font-bold leading-tight">Welcome Back</h1>
          <p className="text-lg text-indigo-100/80">
            Sign in to your account and pick up right where you left off.
          </p>

          <div className="mt-12 space-y-8">
            <FeatureItem
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Secure & Private"
              desc="Your data is encrypted and stored securely following industry standards."
            />
            <FeatureItem
              icon={<Zap className="h-6 w-6" />}
              title="Fast Setup"
              desc="Get your account up and running in less than two minutes."
            />
            <FeatureItem
              icon={<Users className="h-6 w-6" />}
              title="Community Driven"
              desc="Join thousands of other members building the future together."
            />
          </div>
        </div>

        {/* Subtle background glow effect (for polish) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
      </div>

      {/* --- Right Side: The Sign-In Form (Simplified) --- */}
      <div className="flex flex-1 items-center justify-center bg-gray-50/50 px-6 py-12 lg:px-20">
        <div className="w-full max-w-xl space-y-8">
          <form className="space-y-6">
            
            {/* --- Name fields are removed; only login creds here --- */}
            
            <InputGroup
              label="Email Address"
              type="email"
              placeholder="radithupa@gmail.com"
            />

            {/* Password input with toggle */}
            <div className="relative">
              <InputGroup
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Reusing the Eye icons we added */}
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* --- Optional: You might want a "Forgot Password?" link here, even if not in the design --- */}

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              Sign In
            </button>

            {/* Bottom link: Points to your existing Signup page */}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* --- Reusable Helper Components (Exactly as before) --- */

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-indigo-200">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-indigo-100/60 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        // Consistent inputs: border-gray-100, shadow-sm, focus ring
        className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
      />
    </div>
  );
}