import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FavIcon from "../../assets/fav-icon.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    // TODO:
    // Call your API here
    // loginAdmin(formData)
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center font-sans text-slate-700">
      <main className="w-full max-w-md px-4 flex flex-col items-center">
        {/* Logo Header */}
        <header className="mb-10 flex items-center gap-3">
          <div className="bg-[white] border-2 border-[#76c74b] p-2.5 rounded-xl shadow-lg shadow-green-200/50">
            <img src={FavIcon} alt="Careers Admin Logo" className="w-8 h-8" />
          </div>
        </header>

        {/* Login Card */}
        <section className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
Admin Portal            </h2>

            <p className="text-slate-500 text-sm">
              Sign in to manage your jobs and applications
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required
                placeholder="admin@careers.com"
                value={formData.email}
                onChange={handleChange}
                className="
                  w-full
                  pl-4
                  pr-4
                  py-3
                  bg-white
                  border-2
                  rounded-xl
                  focus:ring-2
                  focus:ring-green-100
                  focus:border-[#76c74b]
                  outline-none
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="
                  w-full
                  pl-4
                  pr-12
                  py-3
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-green-100
                  focus:border-[#76c74b]
                  outline-none
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            </div>



            {/* Submit */}
            <button
              type="submit"
              className="
                w-full
                py-4
                px-4
                rounded-xl
                font-bold
                text-white
                bg-[#76c74b]
                shadow-lg
                shadow-green-200/50
                hover:bg-green-600
                focus:outline-none
                focus:ring-4
                focus:ring-green-100
                transition-all
              "
            >
              Sign In
            </button>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Careers Admin Panel. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;