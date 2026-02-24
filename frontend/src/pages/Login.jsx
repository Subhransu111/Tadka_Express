function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff6ee] to-[#ffe2c6] px-4">
      
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Login to continue your meal subscription
        </p>

        <form className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button className="w-full bg-orange-500 text-white py-3 rounded-xl shadow-lg hover:scale-105 transition">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          Don’t have an account? Register
        </p>

      </div>
    </div>
  );
}

export default Login;