'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SimpleImageLoader } from '@/components/ImageLoader';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

/**
 * URLInput Component (formerly ImageUpload)
 * Accepts image URLs instead of file uploads
 * Provides preview and validation
 */
export function ImageUpload({ value, onChange, label = 'Image URL', className = '' }: ImageUploadProps) {
  const [url, setUrl] = useState<string>(value || '');
  const [isValidUrl, setIsValidUrl] = useState(!!value);

  // Update when value prop changes (e.g., when editing existing entity)
  useEffect(() => {
    setUrl(value || '');
    setIsValidUrl(!!value);
  }, [value]);

  const validateUrl = (urlString: string): boolean => {
    if (!urlString) return false;
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (validateUrl(newUrl)) {
      setIsValidUrl(true);
      onChange(newUrl);
    } else if (newUrl === '') {
      setIsValidUrl(false);
      onChange('');
    } else {
      setIsValidUrl(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setIsValidUrl(false);
    onChange('');
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="space-y-3">
        {/* URL Input Field */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://example.com/image.jpg or https://via.placeholder.com/600x400"
            value={url}
            onChange={handleUrlChange}
            className={`
              flex-1 px-4 py-2 border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-sea_green-500
              ${!isValidUrl && url ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            `}
          />
          {url && (
            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              className="px-3"
              title="Clear URL"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}
        </div>

        {/* Error Message */}
        {url && !isValidUrl && (
          <p className="text-sm text-red-600">Please enter a valid URL starting with https://</p>
        )}

        {/* URL Preview */}
        {isValidUrl && url && (
          <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2 truncate">Preview: {url}</p>
            <SimpleImageLoader
              src={url}
              alt="Image preview"
              className="w-full h-64 rounded"
              fallbackSrc="/images/default.png"
            />
          </div>
        )}

        {/* Helper Text */}
        {!url && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>Enter an image URL. Best sources:</p>
            <ul className="list-disc list-inside">
              <li><code className="bg-gray-100 px-1 rounded">https://commons.wikimedia.org/wiki/Special:FilePath/[filename]</code></li>
              <li><code className="bg-gray-100 px-1 rounded">https://via.placeholder.com/600x400?text=...</code></li>
            </ul>
            <p className="pt-1">Note: Use <code className="bg-gray-100 px-1 rounded">commons.wikimedia.org</code> instead of <code className="bg-gray-100 px-1 rounded">upload.wikimedia.org</code> for better compatibility.</p>
          </div>
        )}
      </div>
    </div>
  );
}
