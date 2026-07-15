import React from 'react';
import Image from 'next/image';
import { FileVideo, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface MediaPreviewProps {
  src?: string | null;
  alt?: string;
  type?: 'image' | 'video';
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  src,
  alt = 'Media preview',
  type = 'image',
  className,
  aspectRatio = 'video',
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  };

  if (!src) {
    return (
      <div
        className={cn(
          'w-full bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 p-6',
          aspectClasses[aspectRatio],
          className
        )}
      >
        {type === 'video' ? <FileVideo className="w-8 h-8 mb-2" /> : <ImageIcon className="w-8 h-8 mb-2" />}
        <span className="text-xs font-medium">No media provided</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-slate-900 border border-slate-800 rounded-xl',
        aspectClasses[aspectRatio],
        className
      )}
    >
      {type === 'video' ? (
        <video src={src} controls className="w-full h-full object-cover" />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
    </div>
  );
};
