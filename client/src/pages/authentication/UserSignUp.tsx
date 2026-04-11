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

// --- Select Component ---
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
      <label
        htmlFor={name}
        className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm text-gray-900 shadow-sm transition-colors focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// --- Main Signup Page ---
export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return "First and last name are required.";
    }
    if (!formData.email.trim()) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
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
      console.log("Signup data:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRole("user");
      
      localStorage.setItem("userInfo", JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization || null,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null,
        role: "user",
      }));
      
      navigate("/home");
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Failed to create account. Please try again.");
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

  const genderOptions = [
    { value: "", label: "Select gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not", label: "Prefer not to say" },
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
              Join Us Today
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Create your account and start your journey with us. Whether you're an individual or representing an organization, we've got you covered.
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

            {/* First and Last Name */}
            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Thato"
                required
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Matlhabaphiri"
                required
              />
            </div>

            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="MatlhabaphiriT@example.com"
              required
            />

            {/* Organization (Optional) */}
            <InputField
              label="Organization / Company"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="optional"
            />

            {/* Phone and Gender */}
            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+267 70000000"
              />
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={genderOptions}
              />
            </div>

            {/* Date of Birth */}
            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />

            {/* Password Fields */}
            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                label="Create Password"
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
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-gray-300 hover:text-gray-500 transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#6366f1] text-white text-sm font-semibold shadow-md transition-all duration-150 hover:bg-[#4f46e5] focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}