import { useHeadshotImage } from '../../hooks/useQuery/useHeadshotImage';

interface AvatarProps {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  professionalHeadshot?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-2xl',
};

export function Avatar({ firstName, lastName, photoUrl, professionalHeadshot, size = 'sm' }: AvatarProps) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`;
  const sizeClass = sizeClasses[size];
  // The headshot endpoint is auth-protected, so fetch it with the token and
  // render the resulting blob URL (falls back to the legacy photoUrl).
  const imageUrl = useHeadshotImage(professionalHeadshot ?? photoUrl);

  return (
    <div
      className={`rounded-full bg-neutral-100 text-neutral-950 font-bold flex items-center justify-center overflow-hidden shrink-0 ${sizeClass}`}
    >
      {imageUrl ? (
        <img className="w-full h-full object-cover" src={imageUrl} alt="" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
