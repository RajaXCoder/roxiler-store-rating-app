import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import SignUpForm from '../components/auth/SignUpForm';
import Cookies from 'js-cookie';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    console.log('Registration successful:', data);
    navigate('/signin');
  };

  if (Cookies.get('token')) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="w-full md:flex md:flex-row-reverse">
          {/* Right side - Illustration (visible on md screens and up) */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-b from-indigo-500 to-purple-600 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <h3 className="text-xl font-bold mb-2">Join Us!</h3>
              <p className="text-indigo-100">Create your account in seconds</p>
            </div>
          </div>

          {/* Left side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Account
              </h2>
              <p className="text-gray-600 mt-2">
                Fill in your details to get started
              </p>
            </div>

            <SignUpForm onSuccess={handleSuccess} />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a
                  onclick={() => navigate('/signin')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
