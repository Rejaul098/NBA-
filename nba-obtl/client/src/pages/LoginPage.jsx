import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="glass-panel grid max-w-5xl overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-slate-900 px-8 py-12 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200">NBA Accreditation</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Criterion 2 outcome-based teaching portal.</h1>
          <p className="mt-5 max-w-md text-sm text-slate-300">
            Teachers can submit evidence section by section, while admins monitor completion, marks, and reports out of 120.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Welcome Back</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Login</h2>
          </div>

          <div>
            <label className="label-base">Email</label>
            <input
              className="input-base"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label-base">Password</label>
            <input
              className="input-base"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" disabled={loading} className="button-primary w-full">
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-sm text-slate-500">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-brand">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
