'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle, Trash2, Crop, X } from 'lucide-react';
import { uploadMediaAction, deleteMediaFileAction } from '@/app/actions/media';
import { Button } from '@/components/ui/button';

import { getMediaUrl } from '@/lib/utils/media';

export interface MediaUploaderProps {
  value?: string;
  folder?: string;
  label?: string;
  onChange: (url: string) => void;
  onMultipleChange?: (urls: string[]) => void;
  multiple?: boolean;
  cropAspectRatio?: number; // kept as option, but we now support free aspect ratio adjustments
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  folder = 'general',
  label = 'Upload Media Asset',
  onChange,
  onMultipleChange,
  multiple = false,
  cropAspectRatio,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cropper states
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 20, y: 20, w: 200, h: 150 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ mouseX: 0, mouseY: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    // If single file and cropper is requested
    if (!multiple && files.length === 1 && cropAspectRatio && files[0].type.startsWith('image/')) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setRawImageSrc(reader.result as string);
        setOriginalFile(file);
        setCropOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const uploadedUrls: string[] = [];
    let uploadErrors = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await uploadMediaAction(formData);
      if (res.success && res.publicUrl) {
        uploadedUrls.push(res.publicUrl);
      } else {
        uploadErrors++;
      }
    }

    setIsUploading(false);
    e.target.value = '';

    if (uploadedUrls.length > 0) {
      if (onMultipleChange) {
        onMultipleChange(uploadedUrls);
      } else {
        uploadedUrls.forEach((url) => onChange(url));
      }
    }

    if (uploadErrors > 0) {
      setErrorMessage(`Failed to upload ${uploadErrors} file(s).`);
    }
  };

  const uploadFile = async (file: File) => {
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

  // Pointer-based Resize and Drag selection frame
  const handlePointerDown = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveHandle(handle);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.w,
      boxH: cropBox.h,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeHandle || !viewportRef.current || !imageRef.current) return;
    e.preventDefault();

    const dx = e.clientX - resizeStart.mouseX;
    const dy = e.clientY - resizeStart.mouseY;

    const maxW = viewportRef.current.clientWidth;
    const maxH = viewportRef.current.clientHeight;

    const newBox = { ...cropBox };

    // Get rendered bounds of the image to keep crop selection inside the photo itself
    const img = imageRef.current;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = maxW / maxH;

    let rw = maxW;
    let rh = maxH;
    if (imgAspect > containerAspect) {
      rh = maxW / imgAspect;
    } else {
      rw = maxH * imgAspect;
    }

    const minX = Math.max(0, (maxW - rw) / 2);
    const maxX = Math.min(maxW, minX + rw);
    const minY = Math.max(0, (maxH - rh) / 2);
    const maxY = Math.min(maxH, minY + rh);

    if (activeHandle === 'move') {
      newBox.x = Math.max(minX, Math.min(maxX - resizeStart.boxW, resizeStart.boxX + dx));
      newBox.y = Math.max(minY, Math.min(maxY - resizeStart.boxH, resizeStart.boxY + dy));
    } else {
      // Handles: 'nw', 'ne', 'sw', 'se'
      if (activeHandle.includes('e')) {
        newBox.w = Math.max(50, Math.min(maxX - resizeStart.boxX, resizeStart.boxW + dx));
      }
      if (activeHandle.includes('w')) {
        const potentialW = resizeStart.boxW - dx;
        if (potentialW >= 50) {
          const potentialX = resizeStart.boxX + dx;
          if (potentialX >= minX) {
            newBox.x = potentialX;
            newBox.w = potentialW;
          }
        }
      }
      if (activeHandle.includes('s')) {
        newBox.h = Math.max(50, Math.min(maxY - resizeStart.boxY, resizeStart.boxH + dy));
      }
      if (activeHandle.includes('n')) {
        const potentialH = resizeStart.boxH - dy;
        if (potentialH >= 50) {
          const potentialY = resizeStart.boxY + dy;
          if (potentialY >= minY) {
            newBox.y = potentialY;
            newBox.h = potentialH;
          }
        }
      }
    }

    setCropBox(newBox);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeHandle) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setActiveHandle(null);
    }
  };

  const handleCropSave = async () => {
    if (!imageRef.current || !viewportRef.current || !originalFile) return;

    const image = imageRef.current;
    const maxW = viewportRef.current.clientWidth;
    const maxH = viewportRef.current.clientHeight;

    const imgW = image.naturalWidth;
    const imgH = image.naturalHeight;
    const imgAspect = imgW / imgH;
    const containerAspect = maxW / maxH;

    let rw = maxW;
    let rh = maxH;
    if (imgAspect > containerAspect) {
      rh = maxW / imgAspect;
    } else {
      rw = maxH * imgAspect;
    }

    const offsetX = (maxW - rw) / 2;
    const offsetY = (maxH - rh) / 2;

    // Calculate crop frame bounds relative to target image pixels
    const cx = cropBox.x - offsetX;
    const cy = cropBox.y - offsetY;
    const cw = cropBox.w;
    const ch = cropBox.h;

    const sx = Math.max(0, cx * (imgW / rw));
    const sy = Math.max(0, cy * (imgH / rh));
    const sw = Math.min(imgW - sx, cw * (imgW / rw));
    const sh = Math.min(imgH - sy, ch * (imgH / rh));

    const canvas = document.createElement('canvas');
    // Save high quality copy (capped to 1920px max resolution)
    const maxDimension = 1920;
    let targetW = sw;
    let targetH = sh;
    if (sw > maxDimension || sh > maxDimension) {
      if (sw > sh) {
        targetW = maxDimension;
        targetH = maxDimension * (sh / sw);
      } else {
        targetH = maxDimension;
        targetW = maxDimension * (sw / sh);
      }
    }

    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      targetW,
      targetH
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], originalFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        setCropOpen(false);
        setRawImageSrc(null);
        await uploadFile(croppedFile);
      },
      'image/jpeg',
      0.9
    );
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
              <video src={getMediaUrl(value)} controls className="w-full h-full object-cover" />
            ) : (
              <Image unoptimized src={getMediaUrl(value)} alt="Uploaded preview" fill className="object-contain" />
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
        <label className="media-dropzone border-2 border-dashed border-slate-700/60 hover:border-amber-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/60">
          <UploadCloud className="w-7 h-7 text-amber-400 mb-2 pointer-events-none" />
          <span className="text-xs font-bold text-slate-200 block text-center">
            {multiple ? 'Click to Select Multiple Media Files' : 'Click to Select Media File'}
          </span>
          <span className="text-[11px] text-slate-400 block text-center mt-1.5 font-medium">
            {cropAspectRatio ? 'Adjust crop area freely after selection' : 'Images < 5MB | Videos/PDFs < 20MB'}
          </span>
          <input
            type="file"
            className="hidden"
            multiple={multiple}
            accept={cropAspectRatio ? "image/*" : "image/*,video/mp4,application/pdf"}
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

      {/* Dynamic Crop Overlay Dialog */}
      {cropOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Crop className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Adjust Hero Cover Image</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCropOpen(false);
                  setRawImageSrc(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Drag the crop box edges and corners to adjust the aspect ratio freely. Drag the center of the box to move it.
            </p>

            {/* Viewport Crop Frame */}
            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-4 select-none relative">
              <div
                ref={viewportRef}
                className="w-full relative overflow-hidden bg-slate-900 aspect-video max-h-[50vh] flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={rawImageSrc}
                  alt="Raw upload"
                  draggable={false}
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const containerW = viewportRef.current?.clientWidth || 400;
                    const containerH = viewportRef.current?.clientHeight || 300;

                    const imgAspect = img.naturalWidth / img.naturalHeight;
                    const containerAspect = containerW / containerH;

                    let rw = containerW;
                    let rh = containerH;
                    if (imgAspect > containerAspect) {
                      rh = containerW / imgAspect;
                    } else {
                      rw = containerH * imgAspect;
                    }

                    const startW = rw * 0.85;
                    const startH = rh * 0.85;
                    const startX = (containerW - startW) / 2;
                    const startY = (containerH - startH) / 2;

                    setCropBox({
                      x: startX,
                      y: startY,
                      w: startW,
                      h: startH,
                    });
                  }}
                />

                {/* Crop Box Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${cropBox.x}px`,
                    top: `${cropBox.y}px`,
                    width: `${cropBox.w}px`,
                    height: `${cropBox.h}px`,
                    touchAction: 'none',
                  }}
                  className="border-2 border-dashed border-amber-400 cursor-move"
                  onPointerDown={(e) => handlePointerDown(e, 'move')}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                >
                  {/* CSS Dimming Shadow */}
                  <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75)' }} />

                  {/* Corner Handles */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'nw')}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="absolute top-0 left-0 w-3.5 h-3.5 bg-amber-400 border border-white cursor-nwse-resize transform -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'ne')}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-400 border border-white cursor-nesw-resize transform translate-x-1/2 -translate-y-1/2 rounded-full z-10"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'sw')}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-amber-400 border border-white cursor-nesw-resize transform -translate-x-1/2 translate-y-1/2 rounded-full z-10"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'se')}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 border border-white cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 rounded-full z-10"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setCropOpen(false);
                  setRawImageSrc(null);
                }}
              >
                Cancel
              </Button>
              <Button type="button" variant="gold" size="sm" onClick={handleCropSave} className="font-semibold">
                <Crop className="w-3.5 h-3.5 mr-1" /> Crop &amp; Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
