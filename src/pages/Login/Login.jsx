import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Logo.png";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://lifetrack-e2sm.onrender.com/api/auth/login",
        {
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
        "Login Failed"
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

         <div className="flex flex-col items-center justify-center mb-8">

  <img
    src={logo}
    alt="LifeTrack Logo"
    className="w-50 h-50 object-contain"
  />

</div>

         <p className="text-xl leading-9 max-w-md">
 Be a part in LifeTrack and Make your life in Track</p>

        </div>

      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 bg-slate-100 flex justify-center items-center">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-[430px]">

          <h2 className="text-3xl font-bold mb-2">
            Welcome Back 
          </h2>

          <p className="text-slate-500 mb-8">
            Login to your account
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                        <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center mt-8 text-slate-600">
            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
);
}

export default Login;