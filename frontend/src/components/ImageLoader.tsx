'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageLoaderProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  onLoadComplete?: () => void;
}

/**
 * ImageLoader Component
 * Handles async loading of images with loading state, error handling, and fade-in effect
 * Fetches images from URLs in realtime without pausing the website
 *
 * Features:
 * - Loading skeleton while image fetches
 * - Error handling with fallback image support
 * - Smooth fade-in animation on load complete
 * - Lazy loading for images below the fold
 * - Handles external URLs from Wikipedia Commons, Wikimedia, and placeholders
 */
export function ImageLoader({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
  fallbackSrc,
  onLoadComplete,
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState<string | null>(src || null);

  useEffect(() => {
    setDisplaySrc(src || null);
    setIsLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);

    // Fallback to secondary image if provided
    if (fallbackSrc && displaySrc !== fallbackSrc) {
      setDisplaySrc(fallbackSrc);
      setError(false);
      setIsLoading(true);
    }
  };

  // If no image source is available, show placeholder
  if (!displaySrc) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}

      {/* Error state with fallback */}
      {error && !isLoading && (
        <div
          className={`bg-gray-100 flex items-center justify-center text-center text-gray-400 text-sm ${className}`}
          style={{ width, height }}
        >
          <span>Failed to load image</span>
        </div>
      )}

      {/* Main image */}
      {!error && (
        <img
          src={displaySrc}
          alt={alt}
          width={width}
          height={height}
          className={`
            object-cover transition-opacity duration-500
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            ${className}
          `}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          // Allow external URLs from commons.wikimedia.org and via.placeholder.com
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}

/**
 * SimpleImageLoader - Minimal version for simple use cases
 * Perfect for admin interfaces where functionality matters more than UX
 */
export function SimpleImageLoader({
  src,
  alt,
  className = '',
  fallbackSrc,
}: Omit<ImageLoaderProps, 'width' | 'height' | 'onLoadComplete'>) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(src || null);
  const [error, setError] = useState(false);

  const handleError = () => {
    // Log error for debugging CORS issues
    console.error(`Failed to load image: ${displaySrc}`);

    if (fallbackSrc && displaySrc !== fallbackSrc) {
      console.log(`Attempting fallback image: ${fallbackSrc}`);
      setDisplaySrc(fallbackSrc);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!displaySrc || error) {
    return (
      <div className={`bg-gray-200 text-gray-400 text-sm flex items-center justify-center ${className}`}>
        No image
      </div>
    );
  }

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      crossOrigin="anonymous"
    />
  );
}
