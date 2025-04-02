import React, { useState } from 'react';
import { signUp } from '../../api/auth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  HomeIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

const roles = ['Store Owner', 'Normal User', 'System Administrator'];

const SignUpForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    address: '',
    role: roles[0],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (formData.password !== formData.rePassword) {
      setErrors({ rePassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      const { rePassword, ...userData } = formData;
      const data = await signUp(userData);
      onSuccess(data);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({
          general: error.message || 'Registration failed. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="john_doe"
          icon={UserIcon}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="your@email.com"
          icon={EnvelopeIcon}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            icon={LockClosedIcon}
            required
          />
          <button
            type="button"
            className="absolute right-3 bottom-3 text-sm text-blue-600 hover:text-blue-800"
            onClick={() => setShowPassword(!showPassword)}
          ></button>
        </div>

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          name="rePassword"
          value={formData.rePassword}
          onChange={handleChange}
          error={errors.rePassword}
          placeholder="••••••••"
          icon={LockClosedIcon}
          required
        />
      </div>

      <Input
        label="Address"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        placeholder="123 Main St, City"
        icon={HomeIcon}
        required
      />

      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Role
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IdentificationIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            required
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="mt-6">
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
