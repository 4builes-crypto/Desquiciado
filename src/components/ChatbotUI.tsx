import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function ChatbotUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'assistant', text: 'Bienvenido a Desquiciado. ¿En qué puedo asesorarle hoy sobre nuestra selección de vinos?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setConversation(prev => [...prev, { role: 'user', text: message }]);
    
    // Preparación para integración con API Brain externa
    const fetchBrainResponse = async () => {
      try {
        const BRAIN_API_URL = 'https://abuiles.app.n8n.cloud/webhook/06ef0af5-93b2-4bd0-968e-e169985c52a1';
        const response = await fetch(BRAIN_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // n8n webhooks can return text directly or JSON. We try to parse as JSON first.
        let botReply = '';
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          // Intentamos encontrar la respuesta en estructuras comunes de n8n o genéricas
          botReply = data.output || data.reply || data.text || data.message || 
                     (Array.isArray(data) && data[0] ? (data[0].output || data[0].reply || data[0].text || data[0].message) : '') || 
                     JSON.stringify(data);
        } else {
          botReply = await response.text();
        }

        setConversation(prev => [...prev, { 
          role: 'assistant', 
          text: botReply || 'Recibí una respuesta vacía.'
        }]);

      } catch (error) {
        console.error('Error contacting Brain API:', error);
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          text: 'Lo siento, el sommelier virtual no está disponible en este momento. Por favor intente más tarde.'
        }]);
      }
    };

    fetchBrainResponse();

    setMessage('');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-coal text-cream p-4 rounded-full shadow-2xl hover:bg-brand-red transition-colors z-40"
        aria-label="Asistente Virtual"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-[90vw] md:w-[380px] h-[500px] bg-white shadow-2xl z-50 flex flex-col border border-cream/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-coal text-cream p-4 flex justify-between items-center">
              <div>
                <h4 className="font-serif text-lg leading-none">Sommelier Virtual</h4>
                <span className="text-[10px] uppercase tracking-widest text-cream/60">Brain Connection Ready</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-cream/80 hover:text-cream">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-cream/30">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 text-sm font-light leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-coal text-cream rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                      : 'bg-white text-coal border border-coal/5 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-coal/10 flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Consulte sobre vinos o maridajes..."
                className="flex-grow px-3 py-2 text-sm font-light bg-cream/30 focus:outline-none focus:bg-cream/50 transition-colors"
              />
              <button 
                type="submit"
                className="p-2 bg-coal text-cream hover:bg-brand-red transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
