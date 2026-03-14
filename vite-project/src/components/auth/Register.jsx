import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth'; 
import { User, Mail, Lock, Shield, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password, role }, {
      onSuccess: () => {
        setTimeout(() => navigate('/login'), 2000);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
          Setup your new staff or admin account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 dark:border-slate-800 transition-colors">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {registerMutation.isError && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 transition-colors">
                <AlertCircle className="text-red-500 dark:text-red-400 mt-0.5" size={18} />
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                  {registerMutation.error?.response?.data?.message || registerMutation.error.message}
                </p>
              </div>
            )}

            {registerMutation.isSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-md flex items-start gap-3 transition-colors">
                <CheckCircle2 className="text-green-500 dark:text-green-400 mt-0.5" size={18} />
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  Registration successful! Redirecting to login...
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Full Name</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 px-3 py-2.5 bg-transparent dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Email address</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 px-3 py-2.5 bg-transparent dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="admin@savior.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Role ID</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 px-3 py-2.5 bg-transparent dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="Paste MongoDB Role ID here"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Password</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 px-3 py-2.5 bg-transparent dark:bg-slate-950/50 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-offset-slate-900 disabled:opacity-70 transition-all"
            >
              {registerMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" /> Registering...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 transition-colors">Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;