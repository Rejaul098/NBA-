import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "teacher"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="glass-panel w-full max-w-2xl p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">NBA Criterion 2</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Use teacher accounts for submissions and admin accounts for review/reporting.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label-base">Full Name</label>
            <input
              className="input-base"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
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
            <label className="label-base">Department</label>
            <input
              className="input-base"
              value={form.department}
              onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label-base">Role</label>
            <select
              className="input-base"
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
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

          {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}

          <button type="submit" disabled={loading} className="button-primary md:col-span-2">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
