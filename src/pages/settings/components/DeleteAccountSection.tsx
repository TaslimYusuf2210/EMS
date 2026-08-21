import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../../components/ui/dialog';
import { useDeleteAccount } from '../../../hooks/useMutation/useDeleteAccount';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';

export default function DeleteAccountSection() {
  const navigate = useNavigate();
  const { mutateAsync: deleteAccountMutation, isPending: isDeleting } = useDeleteAccount();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setPassword('');
    setShowPassword(false);
    setError(null);
    setOpen(true);
  };

  const canSubmit = password.trim().length > 0;

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteAccountMutation({ password });
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete account. Please try again.');
    }
  };

  return (
    <section className="pt-6 border-t border-neutral-100 mt-6">
      <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
        Danger Zone
      </h3>

      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50/60 p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <p className="text-sm font-bold text-red-700">Delete account</p>
          <p className="text-xs text-red-500 mt-1">
            Permanently delete this account, your company, employees and all associated data. This can't be undone.
          </p>
        </div>
        <button
          type="button"
          onClick={openDialog}
          className="shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} size="sm">
        <div className="py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 text-center">Delete account?</h3>
          <p className="text-sm text-neutral-500 mt-1.5 text-center">
            This action is <span className="font-bold text-red-600">permanent and irreversible</span>. You'll lose your
            company, all employees, departments, documents, payroll history and settings. There is no undo and no
            recovery.
          </p>

          <label className="text-xs font-bold text-neutral-700 mt-4 block">Enter your password to confirm</label>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoFocus
              className="w-full py-2.5 px-3.5 pr-10 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-red-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}

          <div className="flex gap-2 justify-end pt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canSubmit || isDeleting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Hourglass size={16} /> Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
