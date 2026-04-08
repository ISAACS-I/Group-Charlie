import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Assuming you have an authentication context, similar to your Dashboard code
import { useAuth } from "../../context/authContext"; 

// --- Input Component (Local to this file or reusable) ---
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  // Allows adding the Eye icon for passwords
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
    <div className="w-full space-y-2">
      <label
        htmlFor={name}
        className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
      >
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
          className="w-full h-14 rounded-xl border border-gray-100 bg-white px-5 text-base text-gray-900 shadow-sm placeholder:text-gray-300 transition-colors focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100"
        />
        {rightElement && (
          <div className="absolute right-0 top-0 flex h-full items-center pr-4">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Feature Item (Left Column) ---
interface FeatureItemProps {
  icon: string; // URL path or imported SVG module
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      {/* Icon Container with specific blue bg */}
      <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[#6366f1] text-white">
        <img src={icon} alt={`${title} icon`} className="h-6 w-6" />
      </div>
      <div>
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm text-indigo-100 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

// --- Main Login Page ---
export default function LoginPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth(); // Assuming this context exists in your app
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Assuming signIn expects email/username, but the design uses first/last name.
      // You may need to adapt your backend or use a username field instead.
      // For this implementation, we combine first and last name.
      const username = `${formData.firstName} ${formData.lastName}`.trim();
      
      if (!username) {
        throw new Error("First and Last name are required.");
      }

      await signIn(username, formData.password);
      // Redirect to dashboard upon success
      navigate("/home"); 
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureItems: FeatureItemProps[] = [
    {
      icon: "/assets/icons/ShieldCheck.svg", // replace with actual path
      title: "Secure & Private",
      description:
        "Your data is encrypted and stored securely following industry standards.",
    },
    {
      icon: "/assets/icons/Bolt.svg", // replace with actual path
      title: "Fast Setup",
      description:
        "Get your account up and running in less than two minutes.",
    },
    {
      icon: "/assets/icons/Users.svg", // replace with actual path
      title: "Community Driven",
      description:
        "Join thousands of other members building the future together.",
    },
  ];

  return (
    // 2-column layout. min-h-screen ensures it fills the viewport.
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* Left Column (Purple/Indigo Feature Area) */}
      <div className="flex flex-col justify-between w-full md:w-[45%] bg-[#4f46e5] text-white px-10 py-12 md:px-16 md:py-20">
        
        {/* Top Section */}
        <div className="space-y-12 md:space-y-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-indigo-100/60">
            (logo)
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Welcome Back
            </h1>
            <p className="text-base text-indigo-100 leading-relaxed max-w-lg">
              Sign in to your account and pick up right where you left off.
            </p>
          </div>
        </div>

        {/* Bottom Feature Section */}
        <div className="mt-16 md:mt-auto space-y-10">
          {featureItems.map((item, index) => (
            <FeatureItem key={index} {...item} />
          ))}
        </div>
      </div>

      {/* Right Column (White Form Area) */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-8 py-16 sm:px-12 md:px-20">
        
        {/* Form Container to maintain consistent width */}
        <div className="w-full max-w-[500px]">
          
          <form onSubmit={handleFormSubmit} className="space-y-10">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {/* First and Last Name in one row */}
            <div className="flex flex-col sm:flex-row gap-5">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Radithupa"
                required
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Radithupa"
                required
              />
            </div>

            {/* Password Field with Eye Toggle */}
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
                  <img
                    src={
                      showPassword
                        ? "/assets/icons/EyeSlash.svg" // Path to closed eye
                        : "/assets/icons/Eye.svg"      // Path to open eye
                    }
                    alt=""
                    className="h-6 w-6"
                  />
                </button>
              }
            />

            {/* Sign In Button with consistent blue and transition */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-xl bg-[#6366f1] text-white text-base font-semibold shadow-md transition-all duration-150 hover:bg-[#4f46e5] focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer Link (Matching Sidebar text style) */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup" // Adjust the signup route as needed
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