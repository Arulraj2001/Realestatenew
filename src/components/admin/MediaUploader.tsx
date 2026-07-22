'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle, Trash2, Crop, X, FastForward } from 'lucide-react';
import { uploadMediaAction, deleteMediaFileAction } from '@/app/actions/media';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils/media';

export interface MediaUploaderProps {
  id?: string;
  value?: string;
  folder?: string;
  label?: string;
  onChange: (url: string) => void;
  onMultipleChange?: (urls: string[]) => void;
  multiple?: boolean;
  enableCrop?: boolean; // Defaults to true for image uploads
  cropAspectRatio?: number; // Optional initial aspect ratio (e.g. 16/9, 4/3, 1/1, 9/16)
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  id,
  value,
  folder = 'general',
  label = 'Upload Media Asset',
  onChange,
  onMultipleChange,
  multiple = false,
  enableCrop = true,
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

  // Batch queue states for cropping multiple images sequentially
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [cropQueueIndex, setCropQueueIndex] = useState<number>(0);
  const [accumulatedUrls, setAccumulatedUrls] = useState<string[]>([]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Helper to load file into FileReader & open crop modal
  const loadFileForCropping = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    e.target.value = '';

    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    const nonImageFiles = files.filter((f) => !f.type.startsWith('image/'));

    setIsUploading(true);
    setErrorMessage(null);

    const uploadedUrls: string[] = [];

    // Directly upload non-image files (MP4, PDF, etc.)
    for (const file of nonImageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await uploadMediaAction(formData);
      if (res.success && res.publicUrl) {
        uploadedUrls.push(res.publicUrl);
      }
    }

    // If image files exist and enableCrop is true
    if (imageFiles.length > 0 && enableCrop) {
      setAccumulatedUrls(uploadedUrls);
      setCropQueue(imageFiles);
      setCropQueueIndex(0);
      loadFileForCropping(imageFiles[0]);
      setIsUploading(false);
      return;
    }

    // Direct upload for images if crop disabled
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await uploadMediaAction(formData);
      if (res.success && res.publicUrl) {
        uploadedUrls.push(res.publicUrl);
      }
    }

    setIsUploading(false);

    if (uploadedUrls.length > 0) {
      if (multiple && onMultipleChange) {
        onMultipleChange(uploadedUrls);
      } else {
        onChange(uploadedUrls[0]);
      }
    }
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await uploadMediaAction(formData);
    setIsUploading(false);
    return res.success && res.publicUrl ? res.publicUrl : null;
  };

  // Process the current image in the queue (either cropped or original)
  const processNextInQueue = async (fileToUpload: File) => {
    const url = await uploadSingleFile(fileToUpload);
    const updatedUrls = url ? [...accumulatedUrls, url] : [...accumulatedUrls];
    setAccumulatedUrls(updatedUrls);

    const nextIndex = cropQueueIndex + 1;
    if (nextIndex < cropQueue.length) {
      setCropQueueIndex(nextIndex);
      loadFileForCropping(cropQueue[nextIndex]);
    } else {
      // Done with all images in batch queue
      setCropOpen(false);
      setRawImageSrc(null);
      setCropQueue([]);
      setCropQueueIndex(0);

      if (updatedUrls.length > 0) {
        if (multiple && onMultipleChange) {
          onMultipleChange(updatedUrls);
        } else {
          onChange(updatedUrls[0]);
        }
      }
    }
  };

  const handleSkipCrop = async () => {
    const currentFile = cropQueue[cropQueueIndex];
    if (currentFile) {
      await processNextInQueue(currentFile);
    }
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

  const applyPresetRatio = (aspectRatio: number | null) => {
    if (!viewportRef.current || !imageRef.current) return;
    const containerW = viewportRef.current.clientWidth;
    const containerH = viewportRef.current.clientHeight;

    const img = imageRef.current;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerW / containerH;

    let rw = containerW;
    let rh = containerH;
    if (imgAspect > containerAspect) {
      rh = containerW / imgAspect;
    } else {
      rw = containerH * imgAspect;
    }

    let targetW = rw * 0.8;
    let targetH = rh * 0.8;

    if (aspectRatio) {
      if (targetW / targetH > aspectRatio) {
        targetW = targetH * aspectRatio;
      } else {
        targetH = targetW / aspectRatio;
      }
    }

    const startX = (containerW - targetW) / 2;
    const startY = (containerH - targetH) / 2;

    setCropBox({ x: startX, y: startY, w: targetW, h: targetH });
  };

  const handleCropSave = async () => {
    if (!imageRef.current || !viewportRef.current) return;
    const currentFile = cropQueue[cropQueueIndex];
    if (!currentFile) return;

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

    const cx = cropBox.x - offsetX;
    const cy = cropBox.y - offsetY;
    const cw = cropBox.w;
    const ch = cropBox.h;

    const sx = Math.max(0, cx * (imgW / rw));
    const sy = Math.max(0, cy * (imgH / rh));
    const sw = Math.min(imgW - sx, cw * (imgW / rw));
    const sh = Math.min(imgH - sy, ch * (imgH / rh));

    const canvas = document.createElement('canvas');
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

    canvas.width = Math.max(1, targetW);
    canvas.height = Math.max(1, targetH);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, targetW, targetH);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], currentFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        await processNextInQueue(croppedFile);
      },
      'image/jpeg',
      0.92
    );
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
        <label className="media-dropzone border-2 border-dashed border-slate-700/60 hover:border-amber-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/60">
          <UploadCloud className="w-6 h-6 text-amber-400 mb-1.5 pointer-events-none" />
          <span className="text-xs font-bold text-slate-200 block text-center">
            {multiple ? 'Select Multiple Files (Interactive Cropper)' : 'Select Photo / Media File'}
          </span>
          <span className="text-[11px] text-slate-400 block text-center mt-1 font-medium">
            Interactive photo cropper opens before upload
          </span>
          <input
            id={id}
            type="file"
            className="hidden"
            multiple={multiple}
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

      {/* Interactive Crop Modal Overlay */}
      {cropOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl p-5 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Crop className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Adjust &amp; Crop Photo {cropQueue.length > 1 ? `(${cropQueueIndex + 1} of ${cropQueue.length})` : ''}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCropOpen(false);
                  setRawImageSrc(null);
                  setCropQueue([]);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Preset Aspect Ratio Selector */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Aspect Presets:</span>
              <button
                type="button"
                onClick={() => applyPresetRatio(null)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-colors border border-slate-700"
              >
                Free Form
              </button>
              <button
                type="button"
                onClick={() => applyPresetRatio(16 / 9)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-bold rounded-lg transition-colors border border-slate-700"
              >
                16:9 Landscape
              </button>
              <button
                type="button"
                onClick={() => applyPresetRatio(4 / 3)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-colors border border-slate-700"
              >
                4:3 Standard
              </button>
              <button
                type="button"
                onClick={() => applyPresetRatio(1)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition-colors border border-slate-700"
              >
                1:1 Square
              </button>
              <button
                type="button"
                onClick={() => applyPresetRatio(9 / 16)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-pink-400 text-[11px] font-bold rounded-lg transition-colors border border-slate-700"
              >
                9:16 Reel
              </button>
            </div>

            {/* Viewport Crop Frame */}
            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-3 select-none relative">
              <div
                ref={viewportRef}
                className="w-full relative overflow-hidden bg-slate-900 aspect-video max-h-[48vh] flex items-center justify-center"
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

                    const ratio = cropAspectRatio || null;
                    let startW = rw * 0.85;
                    let startH = rh * 0.85;

                    if (ratio) {
                      if (startW / startH > ratio) {
                        startW = startH * ratio;
                      } else {
                        startH = startW / ratio;
                      }
                    }

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
                  {/* Dimming overlay outside crop box */}
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
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSkipCrop}
                className="text-slate-300 border-slate-700 hover:bg-slate-800 text-xs"
              >
                <FastForward className="w-3.5 h-3.5 mr-1" /> Skip &amp; Upload Original
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCropOpen(false);
                    setRawImageSrc(null);
                    setCropQueue([]);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="button" variant="gold" size="sm" onClick={handleCropSave} className="font-semibold text-xs">
                  <Crop className="w-3.5 h-3.5 mr-1" /> Crop &amp; Upload Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
