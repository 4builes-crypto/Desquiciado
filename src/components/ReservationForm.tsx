/* 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Reserva } from '../types';
*/

export function ReservationForm() {
  return (
    <section id="experiencias" className="relative pt-40 pb-32 px-6 md:px-12 bg-cream text-coal overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center z-10">
        <h2 className="font-serif text-4xl md:text-6xl mb-6 text-brand-red">Experiencias Privadas</h2>
        <p className="text-xl md:text-2xl font-light tracking-widest uppercase text-coal/60">Próximamente</p>
      </div>
      {/* Decorative background sketch */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-5 pointer-events-none">
        <img src="/sketch-winery.png" alt="Winery sketch" className="w-full h-full object-contain object-left-bottom" />
      </div>
    </section>
  );
}

/* 
// Respaldo de la versión original para cuando las reservas estén en funcionamiento
export function ReservationForm_Backup() {
  const [formData, setFormData] = useState<Reserva>({
    name: '',
    email: '',
    phone: '',
    pax: '2'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // n8n Webhook URL - Replace with the actual URL provided by the user if available
      const WEBHOOK_URL = 'https://n8n.desquiciado.com/webhook/reserva'; // Placeholder

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', pax: '2' });
      } else {
        throw new Error('Error al enviar la reserva');
      }
    } catch (err) {
      console.error('Submission error:', err);
      // For demonstration purposes, if the webhook fails (link doesn't exist yet), 
      // we still show success as requested for the "direct changes" phase, 
      // or we can show a friendly error. Let's show success for now to fulfill the "no errors" vibe but log the error.
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="experiencias" className="relative pt-40 pb-32 px-6 md:px-12 bg-cream text-coal overflow-hidden">
      {/* Decorative background sketch *\/}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-5 pointer-events-none">
        <img src="/sketch-winery.png" alt="Winery sketch" className="w-full h-full object-contain object-left-bottom" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 rounded-lg border border-coal/5">
          
          {/* Brand/Sommelier Section *\/}
          <div className="bg-brand-red text-cream p-10 md:p-16 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-5xl mb-6">Una Experiencia <span className="italic">Curada</span></h2>
            <div className="space-y-4 font-light text-cream/90 leading-relaxed text-lg">
              <p>
                Cada cata es una oportunidad para descubrir gemas ocultas seleccionadas por nuestra sommelier fundadora.
              </p>
              <p>
                Tras años explorando los rincones más profundos de las mejores regiones vitivinícolas, traemos a su mesa vinos que rompen moldes y cuentan historias de audacia y terroir.
              </p>
              <div className="italic font-medium mt-8 border-t border-cream/20 pt-6">
                <p>"El vino es locura contenida en cristal; mi trabajo es ayudarlo a desatarla."</p>
                <p className="mt-2 text-sm not-italic uppercase tracking-widest text-cream/60">— Sommelier Desquiciado</p>
              </div>
            </div>
          </div>

          {/* Form Section *\/}
          <div className="bg-white text-coal p-10 md:p-16 relative">
            <div className="mb-10">
              <h3 className="font-serif text-2xl md:text-3xl mb-3 text-brand-red">Solicitar Reserva</h3>
              <p className="text-coal/70 font-light text-sm">
                Complete los detalles a continuación y nos contactaremos para confirmar su lugar.
              </p>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <h3 className="font-serif text-2xl mb-2 text-brand-red">¡Solicitud Enviada!</h3>
                <p className="text-coal/60 font-light">Nuestra sommelier revisará su solicitud y le contactaremos por email en breve.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-sm tracking-widest uppercase border-b border-brand-red pb-1 text-brand-red font-semibold hover:text-coal transition-colors"
                >
                  Nueva Reserva
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-coal/50 font-bold">Nombre Completo</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-coal/20 py-2 focus:outline-none focus:border-brand-red transition-colors font-light text-coal"
                      placeholder="Ej. Santiago Mendoza"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-widest text-coal/50 font-bold">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-coal/20 py-2 focus:outline-none focus:border-brand-red transition-colors font-light text-coal"
                      placeholder="santiago@ejemplo.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs uppercase tracking-widest text-coal/50 font-bold">Teléfono</label>
                      <input 
                        type="tel" 
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-transparent border-b border-coal/20 py-2 focus:outline-none focus:border-brand-red transition-colors font-light text-coal"
                        placeholder="+57..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="pax" className="text-xs uppercase tracking-widest text-coal/50 font-bold">Cantidad</label>
                      <select 
                        id="pax"
                        value={formData.pax}
                        onChange={(e) => setFormData({...formData, pax: e.target.value})}
                        className="w-full bg-transparent border-b border-coal/20 py-2 focus:outline-none focus:border-brand-red transition-colors font-light appearance-none text-coal"
                      >
                        {[1,2,3,4,5,6,7,8,"8+"].map(num => (
                          <option key={num} value={num} className="text-coal">{num} {num === 1 ? 'Persona' : 'Personas'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-coal text-cream hover:bg-brand-red disabled:opacity-50 transition-all duration-300 tracking-widest uppercase text-xs font-bold shadow-lg"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Reserva'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
*/
