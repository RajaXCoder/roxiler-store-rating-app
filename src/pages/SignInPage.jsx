import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import SignInForm from '../components/auth/SignInForm';
import Cookies from 'js-cookie';

const SignInPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    console.log('Login successful:', data);
    Cookies.set('user-role', data.data.role, { expires: 7 });
    // Cookies.set('user-id', data.data.id, { expires: 7 });
    console.log(data.data.role);
    Cookies.set('token', data.data.accessToken, { expires: 7 });
    navigate('/');
  };

  if (Cookies.get('token')) {
    return <Navigate to="/" />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-3/4 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="w-full md:flex">
          {/* Left side - Illustration (visible on md screens and up) */}
          <div className="hidden md:block md:w-[30%] bg-gradient-to-b from-blue-500 to-indigo-600 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <h3 className="text-xl font-bold mb-2">Welcome Back!</h3>
              <p className="text-blue-100">Sign in to access your account</p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full p-8 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-600 mt-2">
                Enter your credentials to continue
              </p>
            </div>

            <SignInForm onSuccess={handleSuccess} />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
