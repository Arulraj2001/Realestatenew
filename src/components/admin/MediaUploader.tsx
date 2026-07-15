'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle, Trash2 } from 'lucide-react';
import { uploadMediaAction, deleteMediaFileAction } from '@/app/actions/media';
import { Button } from '@/components/ui/button';

export interface MediaUploaderProps {
  value?: string;
  folder?: string;
  label?: string;
  onChange: (url: string) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  folder = 'general',
  label = 'Upload Media Asset',
  onChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await uploadMediaAction(formData);
    setIsUploading(false);

    if (res.success && res.publicUrl) {
      onChange(res.publicUrl);
    } else {
      setErrorMessage(res.error || 'Failed to upload media.');
    }
  };

  const handleClear = async () => {
    if (value && value.includes('public-media')) {
      const storagePath = value.split('public-media/').pop();
      if (storagePath) {
        await deleteMediaFileAction(storagePath);
      }
    }
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">{label}</label>

      {errorMessage && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-[11px] text-red-400">
          {errorMessage}
        </div>
      )}

      {value ? (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950">
            {value.endsWith('.mp4') ? (
              <video src={value} controls className="w-full h-full object-cover" />
            ) : (
              <Image src={value} alt="Uploaded preview" fill className="object-contain" />
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400 font-mono truncate">{value}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-red-400 border-red-900 hover:bg-red-950"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40">
          <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
          <span className="text-xs font-semibold text-slate-200">Click to Select Media File</span>
          <span className="text-[10px] text-slate-500 mt-1">Images &lt; 5MB | Videos/PDFs &lt; 20MB</span>
          <input
            type="file"
            className="hidden"
            accept="image/*,video/mp4,application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="mt-2 text-xs font-semibold text-amber-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 animate-spin" /> Uploading to Supabase...
            </div>
          )}
        </label>
      )}
    </div>
  );
};
