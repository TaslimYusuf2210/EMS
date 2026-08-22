import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';
import type { RegisterFormValues } from '../../schemas/registerSchema';
import celebrationSvg from '@/assets/celebration.svg';

<style>{`
  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes floatUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
`}</style>

export function SuccessStep() {
  const { getValues } = useFormContext<RegisterFormValues>();
  const data = getValues();
  return (
    <div className="flex flex-col items-center text-center relative">
      {/* Sparkle dots */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#ccd5ae]" style={{ animation: 'sparkle 2s ease-in-out 0.5s infinite' }} />
        <span className="absolute top-8 right-1/4 w-1 h-1 rounded-full bg-indigo-300" style={{ animation: 'sparkle 2s ease-in-out 1s infinite' }} />
        <span className="absolute bottom-12 left-8 w-1 h-1 rounded-full bg-amber-300" style={{ animation: 'sparkle 2s ease-in-out 1.5s infinite' }} />
        <span className="absolute bottom-8 right-8 w-1.5 h-1.5 rounded-full bg-[#ccd5ae]" style={{ animation: 'sparkle 2s ease-in-out 0.8s infinite' }} />
      </div>

      {/* Celebration illustration */}
      <div className="mb-4" style={{ animation: 'popIn 0.5s ease-out both' }}>
        <img src={celebrationSvg} alt="Celebration" className="w-32 h-32 object-contain" />
      </div>

      {/* Welcome text */}
      <div style={{ animation: 'floatUp 0.5s ease-out 0.15s both' }}>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Welcome, {data.companyName}!</h2>
      </div>

      {/* Subtext */}
      <div style={{ animation: 'floatUp 0.5s ease-out 0.3s both' }}>
        <p className="text-slate-500 text-sm max-w-xs">
          Your account has been created successfully. You can now log in and start managing your team.
        </p>
      </div>

      {/* Login CTA */}
      <div style={{ animation: 'floatUp 0.5s ease-out 0.6s both' }} className="mt-6">
        <Link
          to="/login"
          className="btn-brand inline-block px-6 py-2.5"
        >
          Login to your dashboard →
        </Link>
      </div>
    </div>
  );
}
