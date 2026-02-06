import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/constants';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate(ROUTES.WORKSPACES);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
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
          <h2 className="text-lg font-medium tracking-wide text-[#F5F5F5] mb-2">Welcome back</h2>
          <p className="text-[#666666] text-sm mb-6">Sign in to your account</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-950/50 border border-red-900 rounded-sm text-red-300 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </div>

        {/* Register Link */}
        <p className="text-center text-[#666666] mt-6 text-sm">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-[#E80ADE] hover:text-[#D000CC]">
            Sign up
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
