import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

/**
 * Los datos que se escriben acá van del navegador directo a /api/lead y de ahí
 * a tu correo. No pasan por el modelo.
 */
export function LeadForm({
  conversacion,
  onListo,
}: {
  conversacion: { role: 'user' | 'assistant'; content: string }[];
  onListo: () => void;
}) {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [trampa, setTrampa] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setError(null);

    try {
      const respuesta = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, contacto, mensaje, conversacion, sitioWeb: trampa }),
      });
      const datos = await respuesta.json().catch(() => null);
      if (!respuesta.ok) throw new Error(datos?.error ?? 'No pudimos enviar tus datos.');
      setEnviado(true);
      setTimeout(onListo, 2600);
    } catch (fallo) {
      setError((fallo as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Check size={28} className="text-gold" strokeWidth={1.5} />
        <p className="font-serif text-xl text-cream">Listo, quedaste anotado.</p>
        <p className="font-sans text-sm text-humo">Te escribimos muy pronto.</p>
      </div>
    );
  }

  const campo =
    'w-full bg-transparent border border-humo/40 rounded-sm px-3 py-2.5 text-sm font-sans ' +
    'text-cream placeholder:text-humo focus:border-gold focus:outline-none transition-colors';

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3 py-2">
      <p className="font-sans text-sm text-cream/80 leading-relaxed">
        Déjanos tus datos y te escribimos.
      </p>

      <input
        className={campo}
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        maxLength={120}
        required
        autoComplete="name"
      />
      <input
        className={campo}
        placeholder="Correo o WhatsApp"
        value={contacto}
        onChange={(e) => setContacto(e.target.value)}
        maxLength={200}
        required
        autoComplete="email"
      />
      <textarea
        className={`${campo} resize-none`}
        placeholder="Qué estás buscando (opcional)"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        maxLength={1500}
        rows={2}
      />

      {/* Campo trampa: invisible para las personas, irresistible para los robots. */}
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={trampa}
        onChange={(e) => setTrampa(e.target.value)}
        aria-hidden="true"
      />

      {error && <p className="font-sans text-xs text-ambar">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="flex items-center justify-center gap-2 bg-gold text-coal px-5 py-3 rounded-sm
                   font-sans font-semibold tracking-[0.15em] uppercase text-xs
                   hover:bg-cream transition-colors disabled:opacity-60"
      >
        {enviando ? <Loader2 size={14} className="animate-spin" /> : null}
        {enviando ? 'Enviando' : 'Enviar mis datos'}
      </button>

      <p className="font-sans text-[11px] text-humo leading-relaxed">
        Usamos tus datos solo para responderte sobre vino. Nada más.
      </p>
    </form>
  );
}
