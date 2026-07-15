'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { submitContactEnquiryAction } from '@/app/actions/enquiries';
import { trackConversionEvent } from '@/lib/utils/analytics';
import { useToast } from '@/components/ui/toast';

export const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    consent: true,
    website_url: '', // Honeypot trap
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await submitContactEnquiryAction({
      ...formData,
      source_page: typeof window !== 'undefined' ? window.location.pathname : '/contact-us',
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      trackConversionEvent('contact_submitted');

      toast({
        type: 'success',
        title: 'Enquiry Submitted Successfully',
        message: 'Our sales advisor will call you back shortly.',
      });
    } else {
      toast({
        type: 'error',
        title: 'Submission Error',
        message: res.error || 'Failed to submit form. Please call us directly.',
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-white">Thank You!</h3>
        <p className="text-sm text-slate-300">
          Your message has been logged securely. A property representative will contact you shortly.
        </p>
        <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
      <h3 className="font-serif text-2xl font-bold text-white mb-2">Send Us a Direct Message</h3>

      {/* Honeypot Trap Field */}
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
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          required
          placeholder="Ramesh Kumar"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="phone" required>
          Mobile Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          required
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address (Optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="ramesh@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="message">Property Requirement / Message</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Specify plot dimensions, budget range, or villa requirements..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <div className="pt-1">
        <Checkbox
          id="contact-consent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          label="I agree to be contacted by Your Choice Properties regarding layout details"
        />
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        isLoading={isSubmitting}
        disabled={!formData.consent}
        className="w-full font-bold"
      >
        <Send className="w-4 h-4" />
        <span>Submit Property Enquiry</span>
      </Button>
    </form>
  );
};
