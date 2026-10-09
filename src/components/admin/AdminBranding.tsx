import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';

interface AdminBrandingProps {
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

export const AdminBranding: React.FC<AdminBrandingProps> = ({ onNotify }) => {
  const { branding, logoUrl, updateBranding, resetBranding } = useBranding();
  const [currentLogo, setCurrentLogo] = useState(logoUrl);
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onNotify?.('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP o SVG)', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onNotify?.('La imagen supera los 2MB. Te sugerimos optimizarla para una carga más rápida.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCurrentLogo(result);
        setSavedSuccess(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setCurrentLogo(urlInput.trim());
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBranding({
        logoUrl: currentLogo,
      });
      setSavedSuccess(true);
      onNotify?.('¡Logo guardado correctamente! Se ha sincronizado en la base de datos y en Vercel.');
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      onNotify?.('Ocurrió un error al guardar el logo. Inténtalo de nuevo.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('¿Deseas restaurar el logo oficial predeterminado de Elevva?')) {
      setSaving(true);
      try {
        await resetBranding();
        setCurrentLogo('/elevva-logo.jpg');
        setUrlInput('');
        setSavedSuccess(true);
        onNotify?.('Logo restaurado al emblema oficial de Elevva.');
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch {
        onNotify?.('Error al restaurar el logo.', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#584141]/30 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#eae1dc] tracking-wide">
              Gestión de Logo e Identidad
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#9b1b30]/30 text-[#edbd9b] border border-[#9b1b30]/50">
              Persistencia Cloud
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#e0bfbf] mt-1 font-light">
            Actualiza el logo de Elevva. Los cambios se guardan permanentemente en Firestore y se sincronizan al instante en Vercel.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#e0bfbf] hover:text-[#eae1dc] bg-[#231f1c] hover:bg-[#2e2926] border border-[#584141]/40 transition-all cursor-pointer w-full sm:w-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar original
        </button>
      </div>

      {/* Cloud & Vercel Sync Status Box */}
      <div className="p-4 rounded-2xl bg-[#1f1b18] border border-[#584141]/40 flex items-start sm:items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#2e2926] border border-[#C89B7B]/30 text-[#edbd9b] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-[#eae1dc]">
            Guardado automático para Vercel y Producción
          </p>
          <p className="text-[#a89696] font-light">
            Al presionar <strong>Guardar Logo</strong>, la imagen se almacena en la base de datos Firestore y en la memoria del navegador. Toda visita a tu web desplegada en Vercel cargará este logo sin requerir un nuevo deploy de código.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#1f1b18] border border-[#584141]/40 shadow-xl space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#edbd9b] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Cambiar Logo
            </h2>

            {/* Mode switch */}
            <div className="flex p-1 rounded-xl bg-[#171310] border border-[#584141]/40">
              <button
                type="button"
                onClick={() => setActiveMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === 'upload'
                    ? 'bg-[#9b1b30] text-white shadow-md'
                    : 'text-[#e0bfbf] hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Subir Archivo
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === 'url'
                    ? 'bg-[#9b1b30] text-white shadow-md'
                    : 'text-[#e0bfbf] hover:text-white'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Enlace / URL Externa
              </button>
            </div>

            {/* Upload Mode */}
            {activeMode === 'upload' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#584141]/60 hover:border-[#edbd9b]/60 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[#171310]/60 hover:bg-[#171310] group"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#2e2926] border border-[#C89B7B]/30 flex items-center justify-center text-[#edbd9b] group-hover:scale-105 transition-transform mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-[#eae1dc]">
                    Haz clic aquí para seleccionar una imagen
                  </p>
                  <p className="text-xs text-[#a89696] mt-1">
                    Formatos recomendados: PNG transparente o JPG cuadrado (máx. 2MB)
                  </p>
                </div>
              </div>
            )}

            {/* URL Mode */}
            {activeMode === 'url' && (
              <div className="space-y-4">
                <label className="block text-xs font-medium text-[#e0bfbf]">
                  URL de la imagen del logo:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://ejemplo.com/logo-elevva.png"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/60 text-xs text-[#eae1dc] focus:outline-none focus:border-[#edbd9b]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2.5 rounded-xl bg-[#2e2926] hover:bg-[#3d332d] border border-[#C89B7B]/40 text-xs text-[#edbd9b] font-semibold cursor-pointer"
                  >
                    Cargar
                  </button>
                </div>
                <p className="text-[11px] text-[#a89696]">
                  Asegúrate de que la URL sea pública (HTTPS) y accesible desde cualquier navegador.
                </p>
              </div>
            )}

            {/* Save Action */}
            <div className="pt-4 border-t border-[#584141]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Guardado con éxito!
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#9b1b30] hover:bg-[#b01e37] text-white text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-[#9b1b30]/30 transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto text-center"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando en Vercel & Firestore...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Guardar Logo Definitivo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#1f1b18] border border-[#584141]/40 shadow-xl space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#edbd9b] flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Vista Previa en Tiempo Real
            </h2>

            {/* Main Preview Card */}
            <div className="p-5 rounded-2xl bg-[#171310] border border-[#584141]/40 text-center">
              <div className="inline-block p-2 rounded-2xl bg-[#1f1b18] border border-[#C89B7B]/40 shadow-2xl mb-3">
                <img
                  src={currentLogo}
                  alt="Elevva Logo Previsualización"
                  className="w-24 h-24 rounded-xl object-cover ring-2 ring-[#edbd9b]/30 mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/elevva-logo.jpg';
                  }}
                />
              </div>
              <h3 className="font-serif text-lg text-[#eae1dc] font-semibold">Elevva</h3>
              <p className="text-xs text-[#a89696] font-light">Gastronomía & Coctelería de Altura</p>
            </div>

            {/* Contextual mockups */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#e0bfbf]">
                Cómo se ve en diferentes secciones:
              </p>

              {/* Navbar Mockup */}
              <div className="p-3 rounded-xl bg-[#171310] border border-[#584141]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentLogo}
                    alt="Logo Navbar"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#edbd9b]/40"
                  />
                  <span className="font-serif text-sm font-bold text-[#edbd9b] tracking-wider">
                    Elevva
                  </span>
                </div>
                <span className="text-[10px] text-[#a89696] bg-[#231f1c] px-2 py-0.5 rounded">
                  Navbar
                </span>
              </div>

              {/* Mobile bar mockup */}
              <div className="p-3 rounded-xl bg-[#171310] border border-[#584141]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={currentLogo}
                    alt="Logo Admin"
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#edbd9b]/30"
                  />
                  <span className="text-xs font-serif text-[#edbd9b]">Elevva Admin</span>
                </div>
                <span className="text-[10px] text-[#a89696] bg-[#231f1c] px-2 py-0.5 rounded">
                  Panel Móvil
                </span>
              </div>

              {/* Browser tab mockup */}
              <div className="p-3 rounded-xl bg-[#171310] border border-[#584141]/30 flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-[#edbd9b]/40">
                  <img src={currentLogo} alt="Favicon" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 truncate text-xs text-[#eae1dc]">
                  Elevva | Gastronomía & Coctelería...
                </div>
                <span className="text-[10px] text-[#a89696] bg-[#231f1c] px-2 py-0.5 rounded">
                  Pestaña
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
