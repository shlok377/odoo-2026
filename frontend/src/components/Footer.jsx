import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-center py-4 mt-auto" style={{ borderTop: '1px solid #572227', background: '#3b1417' }}>
      <div className="container">
        <p className="small mb-1 text-cream-muted">
          &copy; 2026 <strong className="text-cream display-heading">Itinera</strong> — Masterfully Planned Journeys.
        </p>
        <p className="extra-small mb-0 text-cream-muted" style={{ fontSize: '0.78rem' }}>
          Crafted with <Heart size={12} className="mx-1 text-cream" style={{ color: '#f5efe9' }} /> for the Odoo Hackathon 2026
        </p>
      </div>
    </footer>
  );
}
