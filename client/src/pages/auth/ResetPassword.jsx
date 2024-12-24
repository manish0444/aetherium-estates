import { useState } from 'react';
import { Eye, EyeOff, Lock, Building, Home, Key, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const requirements = [
    { id: 1, text: 'At least 8 characters', met: password.length >= 8 },
    { id: 2, text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { id: 3, text: 'Contains number', met: /[0-9]/.test(password) },
    { id: 4, text: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
    { id: 5, text: 'Passwords match', met: password === confirmPassword && password !== '' }
  ];

  const strengthScore = requirements.filter(req => req.met).length;
  
  const getStrengthLabel = () => {
    if (strengthScore <= 1) return 'Weak';
    if (strengthScore <= 3) return 'Moderate';
    if (strengthScore <= 4) return 'Strong';
    return 'Very Strong';
  };

  const handleSubmit = () => {
    if (strengthScore === requirements.length) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {!isSuccess ? (
            <div className="relative space-y-6">
              {/* Header Section */}
              <div className="text-center space-y-2">
                <div className="flex justify-center items-center space-x-2">
                  <div className="relative">
                    <Building className="h-12 w-12 text-blue-600 animate-bounce" />
                    <div className="absolute -top-1 -right-1">
                      <Key className="h-6 w-6 text-blue-800 animate-pulse" />
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  NepalNiwas
                </h1>
                <p className="text-gray-600">Secure Your Dream Home Access</p>
              </div>

              {/* Password Input Fields */}
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl 
                             focus:border-blue-500 focus:ring-blue-500 focus:outline-none 
                             pr-10 bg-white/50 backdrop-blur-sm transition-all duration-300
                             group-hover:shadow-lg"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl 
                             focus:border-blue-500 focus:ring-blue-500 focus:outline-none 
                             pr-10 bg-white/50 backdrop-blur-sm transition-all duration-300
                             group-hover:shadow-lg"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                          i < strengthScore
                            ? strengthScore <= 1
                              ? 'bg-red-500'
                              : strengthScore <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Password Strength: </span>
                    <span className={`font-medium ${
                      strengthScore <= 1 ? 'text-red-500' :
                      strengthScore <= 3 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {getStrengthLabel()}
                    </span>
                  </p>
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-2">
                  {requirements.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      {req.met ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={strengthScore !== requirements.length}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 
                           text-white rounded-xl font-medium focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2 transform transition-all 
                           duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                           hover:shadow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Reset Password</span>
                  <Key className="h-5 w-5 transform group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            // Success State
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="inline-block">
                <div className="relative">
                  <Home className="h-16 w-16 text-green-500 animate-bounce" />
                  <div className="absolute -top-2 -right-2">
                    <Shield className="h-8 w-8 text-blue-500 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Password Reset Complete! 🎉</h2>
                <p className="text-gray-600">Your new key to NepalNiwas is ready.</p>
                <p className="text-sm text-gray-500">Time to explore your dream property!</p>
              </div>

              <button className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 
                             text-white rounded-xl font-medium focus:outline-none focus:ring-2 
                             focus:ring-green-500 focus:ring-offset-2 transform transition-all 
                             hover:scale-105 hover:shadow-lg flex items-center justify-center 
                             space-x-2 group"
              >
                <span>Continue to Login</span>
                <Building className="h-5 w-5 transform group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Security Badges */}
        <div className="flex justify-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock className="h-4 w-4" />
            <span>Secure Reset</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;