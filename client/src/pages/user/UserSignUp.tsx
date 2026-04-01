import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Users, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side: Branding & Features */}
      <div className="relative hidden flex-1 flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 p-12 text-white lg:flex">
        <div className="z-10">
          <span className="text-xl font-bold tracking-tight">(logo)</span>
        </div>

        <div className="z-10 max-w-md space-y-6">
          <h1 className="text-5xl font-bold leading-tight">Join Us Today</h1>
          <p className="text-lg text-indigo-100/80">
            Create your account and start your journey with us. Experience the
            next generation of our platform.
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

        {/* Subtle background glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50/50 px-6 py-12 lg:px-20">
        <div className="w-full max-w-xl space-y-8">
          <form className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputGroup label="First Name" placeholder="Radithupa" />
              <InputGroup label="Last Name" placeholder="Radithupa" />
            </div>

            <InputGroup
              label="Email Address"
              type="email"
              placeholder="radithupa@gmail.com"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InputGroup label="Phone Number" placeholder="+267 70000000" />
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-600">Gender</label>
                <select className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-gray-500 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none">
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <InputGroup label="Date of Birth" type="date" placeholder="dd/mm/yyyy" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="relative">
                <InputGroup
                  label="Create Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <InputGroup
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Helper Components for cleanliness */

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
        className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
      />
    </div>
  );
}