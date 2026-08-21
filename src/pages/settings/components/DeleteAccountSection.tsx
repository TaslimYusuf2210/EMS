import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '../../../components/ui/dialog';
import { useDeleteAccount } from '../../../hooks/useMutation/useDeleteAccount';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';

/**
 * Generates a random 8-character confirmation code containing at least one
 * letter, one number and one special character, then shuffles the order.
 */
function generateDeleteCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const specials = '!@#$%&*+=?';
  const all = letters + numbers + specials;
  const pick = (set: string) => set[Math.floor(Math.random() * set.length)];

  const code = [
    pick(letters),
    pick(numbers),
    pick(specials),
    pick(all),
    pick(all),
    pick(all),
    pick(all),
    pick(all),
  ];

  // Fisher–Yates shuffle so the guaranteed types aren't always at the front
  for (let i = code.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [code[i], code[j]] = [code[j], code[i]];
  }

  return code.join('');
}

export default function DeleteAccountSection() {
  const navigate = useNavigate();
  const { mutateAsync: deleteAccountMutation, isPending: isDeleting } = useDeleteAccount();
  const [open, setOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [typedCode, setTypedCode] = useState('');

  const openDialog = () => {
    setConfirmCode(generateDeleteCode());
    setTypedCode('');
    setOpen(true);
  };

  const matches = typedCode === confirmCode;

  const handleDelete = async () => {
    try {
      await deleteAccountMutation();
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      navigate('/login');
    } catch {
      // Error toast is handled by the mutation hook
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
            company, all employees, departments, documents, payroll history and settings — there is no undo and no
            recovery.
          </p>

          <p className="text-xs font-bold text-neutral-700 mt-4">Type this code to confirm:</p>
          <div className="mt-1.5 bg-neutral-100 border border-neutral-200 rounded-xl py-2.5 text-center font-mono text-lg font-bold tracking-[0.3em] text-neutral-900 select-all">
            {confirmCode}
          </div>
          <input
            type="text"
            value={typedCode}
            onChange={(e) => setTypedCode(e.target.value)}
            placeholder="Enter the 8-character code"
            maxLength={8}
            autoFocus
            className="w-full mt-3 py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm font-mono text-center tracking-widest focus:outline-none focus:border-red-400"
          />
          {typedCode.length > 0 && !matches && (
            <p className="text-red-500 text-[10px] mt-1">Code doesn't match — double-check and try again.</p>
          )}

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
              disabled={!matches || isDeleting}
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
