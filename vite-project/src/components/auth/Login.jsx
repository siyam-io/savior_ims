import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth'; 
import useAuthStore from '../../store/authStore'; // 🔥 স্টোর ইমপোর্ট করুন
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();
  
  const { login } = useAuthStore(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }, {
      onSuccess: (response) => {
       
        const userData = response?.data?.user || response?.user || response;
        
        login(userData); 
        
        navigate('/'); 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
          <span className="text-blue-600 dark:text-blue-500">SAVIOR</span> IMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-slate-800 transition-colors">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {loginMutation.isError && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 transition-colors">
                <AlertCircle className="text-red-500 dark:text-red-400 mt-0.5" size={18} />
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                  {loginMutation.error?.response?.data?.message || loginMutation.error.message}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Email address</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 px-4 py-3 bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="admin@savior.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 transition-colors">Password</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-11 pr-12 px-4 py-3 bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-70 transition-all active:scale-[0.98]"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" /> Verifying...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 transition-colors">Need an account? </span>
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;