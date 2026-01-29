import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext.jsx";
import authService from "../../services/authService.js";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const navigate = useNavigate();
    const handleSubmit = async  (e) => {
        e.preventDefault()
        if (!email && !password && !username) {
            toast.error("All field are mandetary");
        }
        if (password.length < 6) {
            toast.error("Passwoard at lest 6 charaters");
        }

        setLoading(true);
        try{
            await authService.register(email, password, username);
            toast.success("Registration successful go to login")
            
            navigate("/login")

            

        }catch(error){
            toast.error(error.message || "Failed to Register");
        }finally {
            setLoading(false);   
        }
    }
return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
    
    {/* Page animation */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
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
          Create your account
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Start your learning journey with us
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <div className="relative">
            <Brain className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your username"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.5 }}
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
              placeholder="Minimum 6 characters"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </motion.div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-medium
          hover:bg-slate-700 transition
          flex items-center justify-center gap-2
          disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-sm text-slate-500 mt-6"
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-slate-800 font-medium hover:underline"
        >
          Sign in
        </Link>
      </motion.p>

    </motion.div>
  </div>
);


}
export default RegisterPage;