import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, Users, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoImage from '../../assets/logo.png';

// --- Input Component ---
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
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
  icon,
}: InputFieldProps) {
  return (
    <div className="w-full space-y-1.5">
      <label
        htmlFor={name}
        className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-0 top-0 flex h-full items-center pl-4 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-11 rounded-xl border border-gray-100 bg-white text-sm text-gray-900 shadow-sm placeholder:text-gray-300 transition-colors focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 ${
            icon ? "pl-10 pr-4" : "px-4"
          } ${rightElement ? "pr-11" : ""}`}
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

// --- Feature Item Component ---
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="mt-0.5 text-sm text-indigo-100 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

// --- Main Login Page ---
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (!formData.password) {
      return "Password is required.";
    }
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
      navigate("/home");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureItems = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely following industry standards.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Fast Setup",
      description: "Get your account up and running in less than two minutes.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Driven",
      description: "Join thousands of other members building the future together.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Column (Purple/Indigo Feature Area) */}
      <div className="relative hidden flex-1 flex-col bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 text-white lg:flex overflow-hidden">
        {/* Logo Section */}
        <div className="pt-8 px-8">
          <img
            src={logoImage}
            alt="EventHub Logo"
            className="h-96 w-auto object-contain brightness-0 invert -mb-8 -mt-8"
          />
        </div>

        {/* Content Section - All moved up */}
        <div className="px-8 max-w-md -mt-16">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Sign in to your account and pick up right where you left off.
            </p>
          </div>

          {/* Feature Items - Also moved up directly after welcome text */}
          <div className="mt-8 space-y-5">
            {featureItems.map((item, index) => (
              <FeatureItem key={index} {...item} />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
      </div>

      {/* Right Column (White Form Area) */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-6 lg:px-12">
        <div className="w-full max-w-[480px]">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {/* Email Field */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="MatlhabaphiriT@example.com"
              required
            />

            {/* Password Field */}
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
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#6366f1] text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-[#4f46e5] focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}