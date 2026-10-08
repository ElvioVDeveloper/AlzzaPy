import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, Send } from 'lucide-react';
import { ReservationRequest } from '../../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredProduct?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  preferredProduct,
}) => {
  const [formData, setFormData] = useState<ReservationRequest>({
    fullName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 2,
    zone: 'Terraza Rooftop',
    specialRequests: preferredProduct ? `Interés en probar: ${preferredProduct}` : '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage = encodeURIComponent(
      `*SOLICITUD DE RESERVA - ELEVVA*\n` +
      `👤 *Nombre:* ${formData.fullName}\n` +
      `📱 *Teléfono:* ${formData.phone}\n` +
      `📅 *Fecha:* ${formData.date}\n` +
      `⏰ *Hora:* ${formData.time} hs\n` +
      `👥 *Comensales:* ${formData.guests} personas\n` +
      `📍 *Sector deseado:* ${formData.zone}\n` +
      (formData.specialRequests ? `📝 *Observaciones:* ${formData.specialRequests}\n` : '') +
      `\nEnviado desde la Web Elevva.`
    );

    window.open(`https://wa.me/595985100935?text=${formattedMessage}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#110d0b]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#1f1b18] border border-[#C89B7B]/40 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#231f1c] border-b border-[#584141]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#edbd9b] font-semibold">
              Shopping de Encarnación
            </span>
            <h3 className="font-serif text-2xl text-[#eae1dc] font-medium">Reservar Mesa</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#110d0b] border border-[#584141]/40 text-[#edbd9b] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Lucas Villalba"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
              Teléfono WhatsApp *
            </label>
            <input
              type="tel"
              required
              placeholder="+595 985 000 000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Fecha *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Hora *
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              >
                <option value="18:30">18:30 hs (After Office)</option>
                <option value="19:30">19:30 hs</option>
                <option value="20:30">20:30 hs</option>
                <option value="21:30">21:30 hs</option>
                <option value="22:30">22:30 hs</option>
                <option value="23:30">23:30 hs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Personas
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-2.5 rounded-lg bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Sector
              </label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-lg bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              >
                <option value="Terraza Rooftop">Terraza Rooftop</option>
                <option value="Salón Principal">Salón Principal</option>
                <option value="Barra Lounge">Barra Lounge</option>
                <option value="Sector VIP">Sector VIP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
              Peticiones especiales o conmemoración
            </label>
            <textarea
              rows={2}
              placeholder="Cumpleaños, aniversario, preferencia de mesa..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#9b1b30] text-white text-[12px] uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirmar Reserva por WhatsApp Concierge</span>
            </button>
            <p className="text-[10px] text-center text-[#e0bfbf]/70 mt-2">
              Se enviará la confirmación directamente a nuestro concierge de Elevva Encarnación.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
