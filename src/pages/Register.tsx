import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/constants';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser(data.email, data.password, data.fullName);
      navigate(ROUTES.WORKSPACES);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  // Password strength indicators
  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-sm bg-[#E80ADE] flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-[#F5F5F5]" style={{ fontFamily: 'var(--font-heading)' }}>
              Nexus Knowledge
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-[#666666] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Vault
            </p>
          </div>
          <hr className="vault-rule w-24" />
        </div>

        {/* Form Card */}
        <div className="bg-[#141414] rounded-sm border border-[#2A2A2A] p-8">
          <h2 className="text-lg font-medium tracking-wide text-[#F5F5F5] mb-2">Create an account</h2>
          <p className="text-[#666666] text-sm mb-6">Start building your knowledge base</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-950/50 border border-red-900 rounded-sm text-red-300 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              {/* Password strength indicators */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center gap-2 text-xs ${
                        check.valid ? 'text-emerald-400' : 'text-[#666666]'
                      }`}
                    >
                      {check.valid ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-current" />
                      )}
                      {check.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-[#666666] mt-6 text-sm">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-[#E80ADE] hover:text-[#D000CC]">
            Sign in
          </Link>
        </p>

        {/* Dev Account Note */}
        <div className="mt-6 p-4 bg-[#141414]/50 rounded-sm border border-[#2A2A2A]">
          <p className="text-xs text-[#666666] text-center" style={{ fontFamily: 'var(--font-mono)' }}>
            <strong className="text-[#A0A0A0]">Dev Account:</strong>{' '}
            dev@deepvibe.local / Dev123!
          </p>
        </div>
      </div>
    </div>
  );
}
