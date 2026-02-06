import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ROUTES } from '../config/constants';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#1C1C1C]" style={{ fontFamily: 'var(--font-heading)' }}>404</h1>
        <h2 className="text-2xl font-medium tracking-wide text-[#F5F5F5] mt-4 mb-2">Page Not Found</h2>
        <p className="text-[#666666] mb-8 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => navigate(ROUTES.WORKSPACES)}
            leftIcon={<Home className="h-4 w-4" />}
          >
            Go to Workspaces
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
