import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

/** Derive the API origin (scheme + host) from the configured API base. */
function getApiOrigin(): string {
  return API_BASE.replace(/\/api\/?$/, '');
}

/** Resolve a headshot value (full URL or server-relative path) to an absolute URL. */
export function resolveHeadshotUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${getApiOrigin()}${path.startsWith('/') ? path : `/${path}`}`;
}

function getToken(): string | null {
  return localStorage.getItem('token') ?? sessionStorage.getItem('token');
}

/**
 * Fetches the employee headshot image with the auth token (the serve endpoint
 * is auth-protected) and returns a blob object URL for <img>.
 * Pass a `refreshKey` to force a re-fetch after upload/remove.
 */
export function useHeadshotImage(
  professionalHeadshot?: string | null,
  refreshKey = 0,
): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const fullUrl = resolveHeadshotUrl(professionalHeadshot);
    if (!fullUrl) {
      setImageUrl(null);
      return;
    }

    const token = getToken();

    (async () => {
      try {
        const res = await fetch(fullUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`Failed to load headshot (${res.status})`);
        const blob = await res.blob();
        if (blob.size === 0) throw new Error('Empty headshot');
        objectUrl = URL.createObjectURL(blob);
        if (active) setImageUrl(objectUrl);
      } catch {
        if (active) setImageUrl(null);
      }
    })();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [professionalHeadshot, refreshKey]);

  return imageUrl;
}
