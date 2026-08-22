import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-center py-4 mt-auto" style={{ borderTop: '1px solid #632a30', background: '#3e181c' }}>
      <div className="container">
        <p className="small mb-1" style={{ color: '#cdb9ac' }}>
          &copy; 2026 <strong className="text-cream display-heading" style={{ color: '#f5efe9' }}>Itinera</strong> — Masterfully Planned Journeys.
        </p>
        <p className="extra-small mb-0" style={{ fontSize: '0.78rem', color: '#8c6a70' }}>
          Crafted with <Heart size={12} className="mx-1 fill-cream text-cream" style={{ color: '#f5efe9' }} /> for the Odoo Hackathon 2026
        </p>
      </div>
    </footer>
  );
}
