import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext.jsx";
import authService from "../../services/authService.js";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault(); // stop page reload

        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        setLoading(true); // What is it for

        try {
            const { token, user } = await authService.login(email, password);
            console.log("Successfull")

            login(token, user);
            console.log(token)

            toast.success("Logged in successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Failed to login");
        } finally {
            setLoading(false);   //here also explain
        }
    };

   return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

    {/* Card animation */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
    >

      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4"
        >
          <Brain strokeWidth={2} className="text-slate-700" />
        </motion.div>

        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to continue your journey
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-medium
          hover:bg-slate-700 transition
          flex items-center justify-center gap-2
          disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-slate-500 mt-6"
      >
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-slate-800 font-medium hover:underline"
        >
          Sign up
        </Link>
      </motion.p>

    </motion.div>
  </div>
);

}

export default LoginPage;
