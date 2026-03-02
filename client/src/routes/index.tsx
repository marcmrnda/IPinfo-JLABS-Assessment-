// Main login page component - handles user authentication
import { createFileRoute, redirect, useRouter, useNavigate } from '@tanstack/react-router';
import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import axios, { AxiosError } from "axios";

// Interface for user login credentials
interface User {
  email: string;
  password: string;
}

// Route configuration - redirects authenticated users to geo page, protects from unauthorized access
export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    // Redirect already authenticated users to geolocation page
    if (context.user) {
      throw redirect({ to: "/geo" });
    }
  },
  component: RouteComponent,
});

// Login page component
function RouteComponent() {
  
  const router = useRouter()
  const navigate = useNavigate()
  const { refetchUser } = Route.useRouteContext()

  // State to toggle password visibility (eye icon)
  const [typePassword, setTypePassword] = useState<boolean>(false);
  // State for storing user input (email and password)
  const [users, setUsers] = useState<User>({
    email: "",
    password: "",
  });
  // Error message state for displaying login failures
  const [errM, setErrM] = useState<string>("");

  // Toggles password input visibility between text and password types
  const handlePassword = () => {
    setTypePassword((prev) => !prev);
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("api/auth/login", users, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      await refetchUser();        // ✅ updates user state in main.tsx
      await router.invalidate();  // ✅ re-runs beforeLoad with fresh user
      await navigate({ to: '/geo' });

    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      if (axiosErr.response) {
        setErrM(axiosErr.response.data.message);
      } else {
        setErrM("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      {/* Main container with gradient background */}
      <div className="min-h-screen w-full bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 flex justify-center items-center p-4">
        {/* Login card - responsive container for form */}
        <div className="w-full max-w-[400px] min-h-[500px] bg-zinc-500 shadow-md rounded-3xl p-6 sm:p-10 flex flex-col justify-center">
          {/* Form header section */}
          <main className="flex flex-col items-center gap-1">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-Orbitron font-semibold text-amber-50 text-center mt-4 mb-1.5">
              Open Command Center
            </h2>
            {/* Subtitle/Description */}
            <p className="text-xs sm:text-sm w-full max-w-[320px] text-center font-QuickSand text-amber-50 mb-6">
              Access your dashboard to monitor IP and geolocation data in real
              time.
            </p>

            {/* Login form container */}
            <article className="w-full">
              <form
                onSubmit={(e) => handleSubmit(e)}
                method="post"
                className="flex flex-col w-full"
              >
                {/* Email input field */}
                <label
                  htmlFor="email"
                  className="text-amber-50 font-Poppins mb-1.5 text-sm"
                >
                  Email Address:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-amber-50 w-full h-10 mb-4 font-Poppins p-2 rounded-sm"
                  onChange={(e) =>
                    setUsers((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />

                {/* Password input field with visibility toggle */}
                <label
                  htmlFor="pass"
                  className="text-amber-50 font-Poppins mb-1.5 text-sm"
                >
                  Password:
                </label>
                <div className="relative w-full">
                  {/* Password input - type changes based on typePassword state */}
                  <input
                    type={typePassword ? "text" : "password"}
                    name="pass"
                    id="pass"
                    className="bg-amber-50 w-full h-10 font-Poppins p-2 rounded-sm"
                    onChange={(e) =>
                      setUsers((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                  {/* Eye icon button to toggle password visibility */}
                  <button
                    type="button"
                    onClick={handlePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-zinc-600"
                  >
                    {!typePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>

                {/* Error message display */}
                {errM && (
                  <p className="text-sm font-Outfit text-red-300 mt-2 min-h-[1.25rem]">
                    {errM}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-yellow-200 w-full h-12 mt-8 font-Orbitron shadow-md rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                >
                  Launch Console
                </button>
              </form>
            </article>
          </main>
        </div>
      </div>
    </>
  );
}