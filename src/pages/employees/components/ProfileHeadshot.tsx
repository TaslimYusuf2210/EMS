import { useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadHeadshot } from '../../../hooks/useMutation/useUploadHeadshot';
import { useRemoveHeadshot } from '../../../hooks/useMutation/useRemoveHeadshot';
import { useHeadshotImage } from '../../../hooks/useQuery/useHeadshotImage';
import { Dialog } from '../../../components/ui/dialog';
import type { Employee } from '../../../types/dashboard/employee';

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg'];

function isAllowedImage(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
}

interface ProfileHeadshotProps {
  employee: Employee;
}

export function ProfileHeadshot({ employee }: ProfileHeadshotProps) {
  const { mutateAsync: uploadHeadshot } = useUploadHeadshot(employee.id);
  const { mutateAsync: removeHeadshot, isPending: isRemoving } = useRemoveHeadshot(employee.id);
  const [uploading, setUploading] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [headshotVersion, setHeadshotVersion] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasHeadshot = !!(employee.professionalHeadshot || employee.photoUrl);
  const headshotUrl = useHeadshotImage(
    employee.professionalHeadshot ?? employee.photoUrl,
    headshotVersion,
  );
  const initials = `${employee.firstName[0] ?? ''}${employee.lastName[0] ?? ''}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    if (!isAllowedImage(file)) {
      toast.error('Only PNG, JPG, and JPEG images are allowed.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image is too large. Maximum size is 1 MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadHeadshot(formData);
      setHeadshotVersion((v) => v + 1);
    } catch {
      // Errors are already surfaced by useUploadHeadshot's onError.
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmRemove = async () => {
    try {
      await removeHeadshot();
      setShowRemoveDialog(false);
      setHeadshotVersion((v) => v + 1);
    } catch {
      // Errors are already surfaced by useRemoveHeadshot's onError.
    }
  };

  return (
    <div className="relative flex-none h-60 sm:h-72 w-52 xl:w-60 rounded-4xl overflow-hidden border border-neutral-200 bg-neutral-950/5">
      {headshotUrl ? (
        <img
          src={headshotUrl}
          alt={`${employee.firstName} ${employee.lastName}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-4xl font-black text-neutral-700">
          {initials}
        </div>
      )}

      {hasHeadshot && (
        <button
          type="button"
          onClick={() => setShowRemoveDialog(true)}
          disabled={isRemoving}
          title="Remove professional headshot"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        title="Upload professional headshot"
        className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-neutral-950/70 text-white flex items-center justify-center hover:bg-neutral-950 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
      </button>

      {/* Confirm remove headshot modal */}
      <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)} size="sm">
        <div className="text-center py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">Remove headshot?</h3>
          <p className="text-sm text-neutral-500 mt-1.5">
            Are you sure you want to remove the current professional headshot?
          </p>
          <div className="flex gap-2 justify-center pt-6">
            <button
              type="button"
              onClick={() => setShowRemoveDialog(false)}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {isRemoving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isRemoving ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
