'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  imageUrl: string | null | undefined;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ imageUrl, alt, isOpen, onClose }: ImageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <Button
          onClick={onClose}
          variant="outline"
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
          size="sm"
        >
          ✕ Close
        </Button>
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

