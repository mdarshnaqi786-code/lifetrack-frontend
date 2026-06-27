import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.fullname ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://lifetrack-e2sm.onrender.com/api/auth/register",
        {
          fullname: form.fullname,
          email: form.email,
          password: form.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white items-center justify-center p-12">

        <div>

          <h1 className="text-6xl font-bold mb-6">
            LifeTrack
          </h1>

          <p className="text-xl leading-9 max-w-md">
            Create your account and start managing your
            tasks, notes, finances and health in one place.
          </p>

        </div>

      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 bg-slate-100 flex justify-center items-center">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-[430px]">

          <h2 className="text-3xl font-bold mb-2">
            Create Account
          </h2>

          <p className="text-slate-500 mb-8">
            Register to get started
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
                      <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-600"
              />
            </div>
                        <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

          <p className="text-center mt-8 text-slate-600">
            Already have an account?

            <Link
              to="/"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
    );
};

export default Register;