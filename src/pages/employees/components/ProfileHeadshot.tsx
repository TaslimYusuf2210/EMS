import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateEmployee } from '../../../hooks/useMutation/useUpdateEmployee';
import { uploadImageToCloudinary } from '../../../services/cloudinary';
import type { Employee } from '../../../types/dashboard/employee';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

interface ProfileHeadshotProps {
  employee: Employee;
}

export function ProfileHeadshot({ employee }: ProfileHeadshotProps) {
  const { mutateAsync: updateEmployee } = useUpdateEmployee(employee.id);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headshot = employee.professionalHeadshot ?? employee.photoUrl;
  const initials = `${employee.firstName[0] ?? ''}${employee.lastName[0] ?? ''}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (JPG, PNG, etc.).');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image is too large. Maximum size is 5 MB.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      await updateEmployee({ professionalHeadshot: url });
    } catch (err: any) {
      // Mutation errors are already surfaced by useUpdateEmployee's onError.
      if (!err || err.name !== 'ApiError') {
        toast.error(err?.message || 'Failed to upload headshot.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex-none h-60 sm:h-72 w-full sm:w-52 xl:w-60 rounded-4xl overflow-hidden border border-neutral-200 bg-neutral-950/5">
      {headshot ? (
        <img
          src={headshot}
          alt={`${employee.firstName} ${employee.lastName}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-4xl font-black text-neutral-700">
          {initials}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
    </div>
  );
}
