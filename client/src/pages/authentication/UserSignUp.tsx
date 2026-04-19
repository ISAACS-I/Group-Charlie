import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <label htmlFor={name} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
          className={`w-full h-11 rounded-xl border border-gray-100 bg-white text-sm text-gray-900 shadow-sm placeholder:text-gray-300 transition-colors focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 px-4 ${rightElement ? "pr-11" : ""}`}
        />
        {rightElement && (
          <div className="absolute right-0 top-0 flex h-full items-center pr-3">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

function SelectField({ label, name, value, onChange, options, required = false }: SelectFieldProps) {
  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={name} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm text-gray-900 shadow-sm transition-colors focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 appearance-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="mt-0.5 text-sm text-indigo-100 leading-relaxed max-w-sm">{description}</p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return "First and last name are required.";
    if (!formData.email.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
    if (formData.password.length < 8) return "Password must be at least 8 characters long.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
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
      await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        password: formData.password,
      });
      navigate("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account. Please try again.";
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

  const genderOptions = [
    { value: "", label: "Select gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not", label: "Prefer not to say" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Column */}
      <div className="relative hidden flex-1 flex-col bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 text-white lg:flex overflow-hidden">
        <div className="pt-8 px-8">
          <img src={logoImage} alt="EventHub Logo" className="h-96 w-auto object-contain brightness-0 invert -mb-8 -mt-8" />
        </div>
        <div className="px-8 max-w-md -mt-16">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">Join Us Today</h1>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Create your account and start discovering events. Organiser access is granted by the platform team.
            </p>
          </div>
          <div className="mt-8 space-y-5">
            {features.map((item, i) => <FeatureItem key={i} {...item} />)}
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
      </div>

      {/* Right Column */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-6 lg:px-12">
        <div className="w-full max-w-[480px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-xs text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Thato" required />
              <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Matlhabaphiri" required />
            </div>

            <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />

            <div className="flex flex-col sm:flex-row gap-3">
              <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+267 70000000" />
              <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={genderOptions} />
            </div>

            <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />

            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                label="Create Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min. 8 characters"
                required
                rightElement={
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="text-gray-300 hover:text-gray-500 transition-colors" aria-label="Toggle password">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                rightElement={
                  <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="text-gray-300 hover:text-gray-500 transition-colors" aria-label="Toggle confirm password">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#6366f1] text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-[#4f46e5] focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            Organiser / admin rights are granted by the platform team after account creation.
          </p>
        </div>
      </div>
    </div>
  );
}