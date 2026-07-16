'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Video,
  Home,
  Grid,
  Image as ImageIcon,
  Trees,
  MapPin,
  Map,
  CheckCircle2,
  BedDouble,
  Bath,
  Maximize,
  Phone,
  MessageSquare,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  Project,
  PropertyConfiguration,
  GalleryItem,
  Landmark,
  Amenity,
  ProjectAmenity,
} from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { GalleryLightbox } from '@/components/public/GalleryLightbox';
import { ProjectVideoPlayer } from '@/components/public/ProjectVideoPlayer';
import { ProjectLandmarksPopup } from '@/components/public/ProjectLandmarksPopup';
import { ProjectLocationMapPopup } from '@/components/public/ProjectLocationMapPopup';
import { SiteVisitForm } from '@/components/forms/SiteVisitForm';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';

export interface ProjectAccordionSectionsProps {
  project: Project;
  villas: PropertyConfiguration[];
  plots: PropertyConfiguration[];
  amenities: ProjectAmenity[];
  landmarks: Landmark[];
  galleryItems: GalleryItem[];
  floorPlans: GalleryItem[];
  projectVideoUrl: string;
}

function parseFeatures(featureList: unknown): string[] {
  if (Array.isArray(featureList)) {
    return featureList.filter((f): f is string => typeof f === 'string' && f.trim().length > 0);
  }
  if (typeof featureList === 'string') {
    try {
      const parsed = JSON.parse(featureList);
      if (Array.isArray(parsed)) {
        return parsed.filter((f): f is string => typeof f === 'string' && f.trim().length > 0);
      }
    } catch {
      return [featureList];
    }
  }
  return [];
}

function parseGalleryImages(galleryImages: unknown): string[] {
  if (Array.isArray(galleryImages)) {
    return galleryImages.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
  }
  if (typeof galleryImages === 'string') {
    try {
      const parsed = JSON.parse(galleryImages);
      if (Array.isArray(parsed)) {
        return parsed.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
      }
    } catch {
      return [galleryImages];
    }
  }
  return [];
}

function getLandmarkImage(lm: Landmark): string {
  if (lm.image_url) return lm.image_url;
  const name = lm.name.toLowerCase();
  if (name.includes('school') || name.includes('college') || name.includes('vidyalaya') || name.includes('academy')) {
    return 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('hospital') || name.includes('medical') || name.includes('clinic') || name.includes('health')) {
    return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('bus') || name.includes('station') || name.includes('stand') || name.includes('terminal')) {
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('railway') || name.includes('train')) {
    return 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('highway') || name.includes('nh') || name.includes('road') || name.includes('bypass') || name.includes('junction')) {
    return 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80';
}

function buildEmbeddedMapUrl(project: Project): string {
  if (project.map_url && project.map_url.includes('pb=')) {
    return project.map_url;
  }
  const addressQuery = encodeURIComponent(
    project.address || `${project.name}, ${project.location?.name || 'Namakkal'}, Tamil Nadu, India`
  );
  return `https://maps.google.com/maps?q=${addressQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

export const ProjectAccordionSections: React.FC<ProjectAccordionSectionsProps> = ({
  project,
  villas,
  plots,
  amenities,
  landmarks,
  galleryItems,
  floorPlans,
  projectVideoUrl,
}) => {
  // Collapsible Accordion Panels Below Villas & Plots
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    video: true,
    amenities: false,
    gallery: false,
    landmarks: false,
    location: true,
  });

  // Active Selected Thumbnail for Villa/Plot cards
  const [activeImageMap, setActiveImageMap] = useState<Record<string, string>>({});

  // Fullscreen Image Lightbox Slider State
  const [sliderState, setSliderState] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  // Contact form modal context state
  const [selectedPropertyContext, setSelectedPropertyContext] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Handle Keyboard Arrows for Lightbox Slider
  useEffect(() => {
    if (!sliderState) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSliderState((prev) =>
          prev ? { ...prev, index: prev.index > 0 ? prev.index - 1 : prev.images.length - 1 } : null
        );
      } else if (e.key === 'ArrowRight') {
        setSliderState((prev) =>
          prev ? { ...prev, index: prev.index < prev.images.length - 1 ? prev.index + 1 : 0 } : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sliderState]);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const expandAll = () => {
    setOpenSections({
      video: true,
      amenities: true,
      gallery: true,
      landmarks: true,
      location: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      video: false,
      amenities: false,
      gallery: false,
      landmarks: false,
      location: false,
    });
  };

  const prevSlide = () => {
    if (!sliderState) return;
    setSliderState({
      ...sliderState,
      index: sliderState.index > 0 ? sliderState.index - 1 : sliderState.images.length - 1,
    });
  };

  const nextSlide = () => {
    if (!sliderState) return;
    setSliderState({
      ...sliderState,
      index: sliderState.index < sliderState.images.length - 1 ? sliderState.index + 1 : 0,
    });
  };

  const embeddedMapUrl = buildEmbeddedMapUrl(project);

  return (
    <div className="space-y-12">

      {/* ── 1. DIRECT VILLAS DISPLAY (NO ACCORDION TOGGLE WRAP) ──────── */}
      {villas.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Home className="w-5 h-5 pointer-events-none" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Available Family Villas ({villas.length} Layout Designs)
                </h2>
                <p className="text-xs text-slate-400">Click photo to slide images · Built-up areas, specs &amp; instant pricing</p>
              </div>
            </div>
            <Badge variant="gold" className="text-xs">{villas.length} Villa Choices</Badge>
          </div>

          <div className="space-y-8">
            {villas.map((villa) => {
              const features = parseFeatures(villa.feature_list);
              const extraImages = parseGalleryImages(villa.gallery_images);

              const defaultMainImg =
                villa.hero_image_path ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

              const allVillaImages = Array.from(
                new Set([
                  defaultMainImg,
                  ...extraImages,
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
                  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
                ])
              ).filter(Boolean);

              const activeImg = activeImageMap[villa.id] || allVillaImages[0];
              const activeIndex = allVillaImages.indexOf(activeImg) >= 0 ? allVillaImages.indexOf(activeImg) : 0;

              return (
                <div
                  key={villa.id}
                  className="bg-slate-900 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl space-y-0"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Villa Main Image Showcase (Left 6 cols) */}
                    <div className="lg:col-span-6 p-4 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between space-y-3">
                      <div
                        onClick={() =>
                          setSliderState({
                            images: allVillaImages,
                            index: activeIndex,
                            title: `${villa.name} Photo Showcase`,
                          })
                        }
                        className="group relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer shadow-lg"
                      >
                        <Image
                          src={activeImg}
                          alt={villa.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center z-10">
                          <span className="px-3.5 py-2 bg-slate-950/90 text-amber-400 rounded-full border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-2xl opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                            <ZoomIn className="w-4 h-4 pointer-events-none" /> Click to Expand &amp; Slide Photos ({allVillaImages.length})
                          </span>
                        </div>

                        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
                          <Badge variant="amber">
                            {villa.bhk > 0 ? `${villa.bhk} BHK Villa` : 'Villa'}
                          </Badge>
                          {villa.availability_status && (
                            <Badge
                              variant={
                                villa.availability_status === 'Sold Out'
                                  ? 'red'
                                  : villa.availability_status === 'Fast Filling'
                                  ? 'amber'
                                  : 'emerald'
                              }
                            >
                              {villa.availability_status}
                            </Badge>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                          <div className="bg-slate-950/90 backdrop-blur-sm border border-amber-500/30 rounded-xl px-3 py-1.5">
                            <p className="text-[9px] uppercase font-bold text-slate-400">Starting Price</p>
                            <div className="text-xl font-extrabold text-amber-400 font-serif">
                              {villa.starting_price
                                ? `₹ ${villa.starting_price.toLocaleString('en-IN')}`
                                : 'Pricing On Request'}
                            </div>
                          </div>
                          <span className="text-[10px] bg-slate-900/90 text-slate-200 border border-slate-700 font-mono font-bold px-2.5 py-1 rounded-lg shadow-md">
                            {activeIndex + 1} / {allVillaImages.length}
                          </span>
                        </div>
                      </div>

                      {/* Multi-Image Thumbnails Slider Trigger Bar */}
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {allVillaImages.map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={() =>
                              setActiveImageMap((prev) => ({ ...prev, [villa.id]: imgUrl }))
                            }
                            className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              activeImg === imgUrl
                                ? 'border-amber-400 scale-105 shadow-md'
                                : 'border-slate-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <Image src={imgUrl} alt="Villa thumbnail" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Villa Specs Content (Right 6 cols) */}
                    <div className="lg:col-span-6 p-6 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                          <div>
                            <h3 className="font-serif text-xl font-bold text-white leading-tight">
                              {villa.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {project.name} · {project.location?.name || 'Namakkal'}
                            </p>
                          </div>
                          {villa.built_up_area && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 uppercase font-bold block">Built-Up</span>
                              <span className="text-sm font-extrabold text-white font-mono">{villa.built_up_area}</span>
                            </div>
                          )}
                        </div>

                        {/* Spec Badges Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {villa.bhk > 0 && (
                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                              <BedDouble className="w-4 h-4 text-amber-400 mx-auto mb-1 pointer-events-none" />
                              <span className="text-xs font-bold text-white block">{villa.bhk} BHK</span>
                            </div>
                          )}
                          {villa.bedrooms > 0 && (
                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                              <BedDouble className="w-4 h-4 text-emerald-400 mx-auto mb-1 pointer-events-none" />
                              <span className="text-xs font-bold text-white block">{villa.bedrooms} Beds</span>
                            </div>
                          )}
                          {villa.bathrooms > 0 && (
                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                              <Bath className="w-4 h-4 text-emerald-400 mx-auto mb-1 pointer-events-none" />
                              <span className="text-xs font-bold text-white block">{villa.bathrooms} Baths</span>
                            </div>
                          )}
                          {villa.plot_area && (
                            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                              <Maximize className="w-4 h-4 text-amber-400 mx-auto mb-1 pointer-events-none" />
                              <span className="text-xs font-bold text-white block truncate">{villa.plot_area}</span>
                            </div>
                          )}
                        </div>

                        {/* Feature Checklist */}
                        {features.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                              Included Villa Highlights
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                              {features.map((feat, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 pointer-events-none" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-800">
                        <Button
                          variant="gold"
                          size="md"
                          className="w-full sm:flex-1 font-bold text-xs"
                          onClick={() => setSelectedPropertyContext({ id: villa.id, name: villa.name })}
                        >
                          <Phone className="w-4 h-4 mr-1.5 pointer-events-none" /> Contact Us for {villa.name}
                        </Button>
                        <a
                          href={buildWhatsAppUrl({
                            customMessage: `Hi Your Choice Properties team, I am interested in ${villa.name} at ${project.name}.`,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            size="md"
                            className="w-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-950 font-bold text-xs"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5 pointer-events-none" /> WhatsApp
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 2. DIRECT PLOTS DISPLAY (NO ACCORDION WRAP) ──────────────── */}
      {plots.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Grid className="w-5 h-5 pointer-events-none" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Available House Sites ({plots.length} Layout Sizes)
                </h2>
                <p className="text-xs text-slate-400">Click photo to slide images · DTCP &amp; RERA approved house site dimensions</p>
              </div>
            </div>
            <Badge variant="emerald" className="text-xs">{plots.length} Plot Sizes</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plots.map((plot) => {
              const plotFeatures = parseFeatures(plot.feature_list);
              const extraPlotImages = parseGalleryImages(plot.gallery_images);

              const defaultPlotImg =
                plot.hero_image_path ||
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80';

              const allPlotImages = Array.from(
                new Set([
                  defaultPlotImg,
                  ...extraPlotImages,
                  'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=800&q=80',
                ])
              ).filter(Boolean);

              const activePlotImg = activeImageMap[plot.id] || allPlotImages[0];
              const activePlotIdx = allPlotImages.indexOf(activePlotImg) >= 0 ? allPlotImages.indexOf(activePlotImg) : 0;

              return (
                <div
                  key={plot.id}
                  className="bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between space-y-3"
                >
                  <div className="p-3.5 bg-slate-950 space-y-2.5">
                    <div
                      onClick={() =>
                        setSliderState({
                          images: allPlotImages,
                          index: activePlotIdx,
                          title: `${plot.name} Site Photo Showcase`,
                        })
                      }
                      className="group relative aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden cursor-pointer shadow-md border border-slate-800"
                    >
                      <Image
                        src={activePlotImg}
                        alt={plot.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center z-10">
                        <span className="px-3.5 py-2 bg-slate-950/90 text-amber-400 rounded-full border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-2xl opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                          <ZoomIn className="w-4 h-4 pointer-events-none" /> Click to Expand &amp; Slide Photos ({allPlotImages.length})
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 z-20">
                        <Badge variant="emerald">DTCP Approved Site</Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-20">
                        <h3 className="font-bold text-white text-base font-serif drop-shadow-md">{plot.name}</h3>
                        <span className="text-sm font-extrabold text-amber-400 font-serif drop-shadow-md">
                          {plot.starting_price ? `₹ ${plot.starting_price.toLocaleString('en-IN')}` : 'On Request'}
                        </span>
                      </div>
                    </div>

                    {allPlotImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pt-0.5">
                        {allPlotImages.map((pImg, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() =>
                              setActiveImageMap((prev) => ({ ...prev, [plot.id]: pImg }))
                            }
                            className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                              activePlotImg === pImg
                                ? 'border-amber-400 scale-105 shadow-sm'
                                : 'border-slate-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <Image src={pImg} alt="Plot thumbnail" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-5 pb-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">Plot Footprint</span>
                          <span className="font-bold text-white">{plot.plot_area || plot.name}</span>
                        </div>
                        <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">Access Road</span>
                          <span className="font-bold text-amber-400">40ft &amp; 30ft Blacktop</span>
                        </div>
                      </div>

                      {plotFeatures.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            Key Highlights
                          </span>
                          <div className="space-y-1 text-xs text-slate-300">
                            {plotFeatures.slice(0, 4).map((f, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 pointer-events-none" />
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <Button
                        variant="gold"
                        size="sm"
                        className="flex-1 font-bold text-xs"
                        onClick={() => setSelectedPropertyContext({ id: plot.id, name: plot.name })}
                      >
                        <Phone className="w-3.5 h-3.5 mr-1 pointer-events-none" /> Contact Us
                      </Button>
                      <a
                        href={buildWhatsAppUrl({
                          customMessage: `Hi Your Choice Properties team, I am interested in ${plot.name} at ${project.name}.`,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-950 font-bold text-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 pointer-events-none" /> WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 3. COLLAPSIBLE ACCORDION DROPDOWNS BELOW VILLAS & PLOTS ──── */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between px-1 text-xs mb-1">
          <span className="text-slate-400 font-bold font-mono uppercase tracking-wider">
            Project Media, Infrastructure &amp; Connectivity Dropdowns
          </span>
          <div className="flex gap-3">
            <button
              onClick={expandAll}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
            >
              Expand All ▾
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={collapseAll}
              className="text-slate-400 hover:text-slate-200 font-bold hover:underline cursor-pointer"
            >
              Collapse All ▴
            </button>
          </div>
        </div>

        {/* ── PROJECT VIDEO ACCORDION ──────────────────────────────── */}
        {projectVideoUrl && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('video')}
              className={`w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer ${
                openSections.video
                  ? 'bg-amber-500/10 border-b border-amber-500/30 text-white'
                  : 'bg-slate-900 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Video className="w-5 h-5 pointer-events-none" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Project Walkthrough Video</h3>
                  <p className="text-xs text-slate-400">Watch layout views &amp; road infrastructure tour</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-amber-400 transition-transform duration-300 pointer-events-none ${
                  openSections.video ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.video && (
              <div className="p-6 bg-slate-950 space-y-4">
                <ProjectVideoPlayer videoUrl={projectVideoUrl} title={`${project.name} Video Tour`} />
              </div>
            )}
          </div>
        )}

        {/* ── AMENITIES ACCORDION ──────────────────────────────────── */}
        {amenities.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('amenities')}
              className={`w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer ${
                openSections.amenities
                  ? 'bg-amber-500/10 border-b border-amber-500/30 text-white'
                  : 'bg-slate-900 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Trees className="w-5 h-5 pointer-events-none" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Township Infrastructure &amp; Amenities ({amenities.length})
                  </h3>
                  <p className="text-xs text-slate-400">Roads, lighting, water line, security wall &amp; parks</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-amber-400 transition-transform duration-300 pointer-events-none ${
                  openSections.amenities ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.amenities && (
              <div className="p-6 bg-slate-950 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {amenities.map((item) => {
                    const am = item.amenity || item;
                    return (
                      <div
                        key={item.amenity_id || (am as Amenity).id}
                        className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4 pointer-events-none" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{(am as Amenity).name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {item.custom_description || (am as Amenity).description || 'Included in layout'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PHOTO GALLERY ACCORDION ──────────────────────────────── */}
        {(galleryItems.length > 0 || floorPlans.length > 0) && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('gallery')}
              className={`w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer ${
                openSections.gallery
                  ? 'bg-amber-500/10 border-b border-amber-500/30 text-white'
                  : 'bg-slate-900 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ImageIcon className="w-5 h-5 pointer-events-none" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Township Photo Gallery ({galleryItems.length + floorPlans.length})
                  </h3>
                  <p className="text-xs text-slate-400">Entrance arches, asphalt roads, floor plans &amp; villa photos</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-amber-400 transition-transform duration-300 pointer-events-none ${
                  openSections.gallery ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.gallery && (
              <div className="p-6 bg-slate-950 space-y-4">
                <GalleryLightbox items={[...galleryItems, ...floorPlans]} />
              </div>
            )}
          </div>
        )}

        {/* ── NEARBY LANDMARKS ACCORDION DROPDOWN ─────────────────── */}
        {landmarks.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('landmarks')}
              className={`w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer ${
                openSections.landmarks
                  ? 'bg-amber-500/10 border-b border-amber-500/30 text-white'
                  : 'bg-slate-900 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <MapPin className="w-5 h-5 pointer-events-none" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Nearby Landmarks &amp; Connectivity Matrix ({landmarks.length})
                  </h3>
                  <p className="text-xs text-slate-400">Photos &amp; driving distances to schools, bus stands &amp; hospitals</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-amber-400 transition-transform duration-300 pointer-events-none ${
                  openSections.landmarks ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.landmarks && (
              <div className="p-6 bg-slate-950 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {landmarks.map((lm) => {
                    const photo = getLandmarkImage(lm);

                    return (
                      <div
                        key={lm.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-3 hover:border-amber-500/40 transition-all group"
                      >
                        {/* Real Landmark Photo Banner */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                          <Image
                            src={photo}
                            alt={lm.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          <div className="absolute top-2.5 right-2.5">
                            <Badge variant="amber" className="text-[10px]">
                              {lm.distance_label}
                            </Badge>
                          </div>
                        </div>

                        {/* Title & Specs */}
                        <div className="px-4 pb-4 space-y-1">
                          <h4 className="font-bold text-white text-sm leading-tight group-hover:text-amber-300 transition-colors">
                            {lm.name}
                          </h4>
                          {lm.travel_time_label && (
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <span>⏱</span> {lm.travel_time_label}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── KNOW THE LOCATION ACCORDION DROPDOWN ─────────────────── */}
        {(project.map_url || project.address) && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('location')}
              className={`w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer ${
                openSections.location
                  ? 'bg-amber-500/10 border-b border-amber-500/30 text-white'
                  : 'bg-slate-900 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Map className="w-5 h-5 pointer-events-none" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Know the Location &amp; Interactive Map</h3>
                  <p className="text-xs text-slate-400">Interactive Google Maps view &amp; site GPS address</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-amber-400 transition-transform duration-300 pointer-events-none ${
                  openSections.location ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.location && (
              <div className="p-6 bg-slate-950 space-y-4">
                {/* Compact Centered Interactive Google Map Iframe */}
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                    <iframe
                      title={`${project.name} Google Map Location`}
                      src={buildEmbeddedMapUrl(project)}
                      className="w-full h-full border-0 filter contrast-110 brightness-95 hover:filter-none transition-all duration-300"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>

                  {/* Address Box Compact */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Project Site Location:</h4>
                      <p className="text-xs text-slate-300">
                        {project.address || `${project.name}, Main Layout Road, ${project.location?.name || 'Namakkal'}, Tamil Nadu.`}
                      </p>
                    </div>
                    {project.map_url && (
                      <a
                        href={project.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 mx-auto sm:mx-0"
                      >
                        <Button variant="gold" size="sm" className="font-bold text-xs">
                          Google Maps App <ExternalLink className="w-3.5 h-3.5 ml-1 pointer-events-none" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── FULLSCREEN PHOTO LIGHTBOX SLIDER DIALOG MODAL ────────────── */}
      <Dialog
        isOpen={Boolean(sliderState)}
        onClose={() => setSliderState(null)}
        title={sliderState?.title || 'Photo Gallery'}
        description={
          sliderState
            ? `Photo ${sliderState.index + 1} of ${sliderState.images.length} · Use arrows or buttons to slide`
            : undefined
        }
      >
        {sliderState && (
          <div className="space-y-4">
            {/* Main Active Image Showcase with Prev / Next Arrow Controls */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
              <Image
                src={sliderState.images[sliderState.index]}
                alt={sliderState.title}
                fill
                priority
                className="object-contain"
              />

              {/* Slide Counter Overlay */}
              <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-amber-400">
                {sliderState.index + 1} / {sliderState.images.length}
              </div>

              {/* Prev / Next Controls (If multiple images exist) */}
              {sliderState.images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 p-2.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-2xl cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 pointer-events-none" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 p-2.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-2xl cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 pointer-events-none" />
                  </button>
                </>
              )}
            </div>

            {/* Slider Thumbnail Bar */}
            {sliderState.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 justify-center">
                {sliderState.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSliderState({ ...sliderState, index: idx })}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      sliderState.index === idx
                        ? 'border-amber-400 scale-105 shadow-lg'
                        : 'border-slate-800 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={imgUrl} alt="Thumbnail preview" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button variant="gold" size="sm" onClick={() => setSliderState(null)} className="font-bold">
                Close Photo Viewer
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* ── CONTACT US PREFILLED DIALOG MODAL ───────────────────────── */}
      <Dialog
        isOpen={Boolean(selectedPropertyContext)}
        onClose={() => setSelectedPropertyContext(null)}
        title={`Contact Us for ${selectedPropertyContext?.name || project.name}`}
        description={`Our sales advisors will assist you with pricing, layout map copy, and guided site visits for ${selectedPropertyContext?.name || project.name}.`}
      >
        <SiteVisitForm
          projectId={project.id}
          propertyId={selectedPropertyContext?.id}
          projectName={project.name}
          propertyName={selectedPropertyContext?.name}
          locationName={project.location?.name}
          onSuccess={() => setSelectedPropertyContext(null)}
        />
      </Dialog>
    </div>
  );
};
