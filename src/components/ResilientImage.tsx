import { useState } from 'react';
import { Cpu } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#11151B] via-[#0F172A] to-[#090B0E] p-6 text-center ${className}`}
      >
        <Cpu className="mb-3 h-8 w-8 text-sky-400/80" aria-hidden="true" />
        <p className="font-display text-sm font-medium text-slate-300">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
