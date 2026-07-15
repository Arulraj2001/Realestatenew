'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { submitSiteVisitBookingAction } from '@/app/actions/enquiries';
import { trackConversionEvent } from '@/lib/utils/analytics';
import { useToast } from '@/components/ui/toast';

export interface SiteVisitFormProps {
  locationId?: string;
  projectId?: string;
  propertyId?: string;
  locationName?: string;
  projectName?: string;
  propertyName?: string;
  onSuccess?: () => void;
}

export const SiteVisitForm: React.FC<SiteVisitFormProps> = ({
  locationId,
  projectId,
  propertyId,
  locationName,
  projectName,
  propertyName,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferred_visit_date: '',
    preferred_visit_time: 'Morning',
    message: '',
    consent: true,
    website_url: '', // Honeypot trap
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await submitSiteVisitBookingAction({
      ...formData,
      location_id: locationId,
      project_id: projectId,
      property_configuration_id: propertyId,
      source_page: typeof window !== 'undefined' ? window.location.pathname : '/site-visit',
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      trackConversionEvent('site_visit_submitted', {
        location: locationName,
        project: projectName,
        property: propertyName,
      });

      toast({
        type: 'success',
        title: 'Site Visit Appointment Submitted',
        message: 'Our coordinator will call you to confirm transport timing.',
      });

      if (onSuccess) onSuccess();
    } else {
      toast({
        type: 'error',
        title: 'Booking Error',
        message: res.error || 'Failed to schedule appointment. Please call us directly.',
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-bold text-white">Appointment Logged</h3>
        <p className="text-xs text-slate-300">
          Your free site visit pickup appointment request has been recorded. Our coordinator will contact you shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
          Book Another Visit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Context Badge if Launched from Detail Page */}
      {(projectName || locationName || propertyName) && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
          <span className="font-bold block uppercase tracking-wider text-[10px] text-slate-400">Visiting Context:</span>
          <span>
            {propertyName ? `${propertyName} at ` : ''}
            {projectName || ''}
            {locationName ? ` (${locationName})` : ''}
          </span>
        </div>
      )}

      {/* Honeypot Trap Field (Hidden from standard users) */}
      <div className="hidden aria-hidden:true">
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website_url}
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="sv-name" required>
          Full Name
        </Label>
        <Input
          id="sv-name"
          type="text"
          required
          placeholder="Ramesh Kumar"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="sv-phone" required>
          Mobile Phone Number
        </Label>
        <Input
          id="sv-phone"
          type="tel"
          required
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sv-date" required>
            Preferred Visit Date
          </Label>
          <Input
            id="sv-date"
            type="date"
            required
            value={formData.preferred_visit_date}
            onChange={(e) => setFormData({ ...formData, preferred_visit_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="sv-time" required>
            Time Slot
          </Label>
          <select
            id="sv-time"
            value={formData.preferred_visit_time}
            onChange={(e) => setFormData({ ...formData, preferred_visit_time: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-sm focus:border-amber-500 outline-none"
          >
            <option value="Morning">Morning (9 AM - 12 PM)</option>
            <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
            <option value="Evening">Evening (4 PM - 7 PM)</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="sv-notes">Additional Notes (Optional)</Label>
        <Textarea
          id="sv-notes"
          rows={2}
          placeholder="Pickup location or family size..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <div className="pt-1">
        <Checkbox
          id="sv-consent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          label="I agree to receive site visit updates via phone / SMS / WhatsApp"
        />
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        isLoading={isSubmitting}
        disabled={!formData.consent}
        className="w-full font-bold mt-2"
      >
        <Calendar className="w-4 h-4" />
        <span>Confirm Site Visit Appointment</span>
      </Button>
    </form>
  );
};
