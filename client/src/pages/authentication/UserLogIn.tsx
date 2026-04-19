import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Zap, Users, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoImage from '../../assets/logo.png';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  rightElement?: React.ReactNode;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
  rightElement,
}: InputFieldProps) {
  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-11 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none px-4 ${rightElement ? "pr-11" : ""}`}
        />
        {rightElement && (
          <div className="absolute right-0 top-0 flex h-full items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="mt-0.5 text-sm text-indigo-100 leading-relaxed max-w-sm">{description}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/home";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
    if (!formData.password) return "Password is required.";
    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Secure & Private", description: "Your data is encrypted and stored securely following industry standards." },
    { icon: <Zap className="h-5 w-5" />, title: "Fast Setup", description: "Get your account up and running in less than two minutes." },
    { icon: <Users className="h-5 w-5" />, title: "Community Driven", description: "Join thousands of other members building the future together." },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column */}
      <div className="relative hidden flex-1 flex-col justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 text-white lg:flex overflow-hidden px-12 py-12">
        <div className="z-10 max-w-md space-y-8">
          <img src={logoImage} alt="EventHub Logo" className="h-16 w-auto object-contain brightness-0 invert" />
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">Welcome Back</h1>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Sign in to your account and pick up right where you left off.
            </p>
          </div>
          <div className="space-y-5">
            {features.map((item, i) => <FeatureItem key={i} {...item} />)}
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
      </div>

      {/* Right Column */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-10 lg:px-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
            <p className="mt-1 text-sm text-gray-400">Welcome back.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
            />

            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex items-center justify-between">
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign up
              </Link>
            </p>
              <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}