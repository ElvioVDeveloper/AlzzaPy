import React, { createContext, useContext, useEffect, useState } from 'react';
import { brandingService, BrandingConfig, DEFAULT_BRANDING } from '../services/brandingService';

interface BrandingContextType {
  branding: BrandingConfig;
  logoUrl: string;
  brandName: string;
  tagline: string;
  loading: boolean;
  updateBranding: (config: Partial<BrandingConfig>) => Promise<void>;
  resetBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType>({
  branding: DEFAULT_BRANDING,
  logoUrl: DEFAULT_BRANDING.logoUrl,
  brandName: DEFAULT_BRANDING.brandName,
  tagline: DEFAULT_BRANDING.tagline,
  loading: false,
  updateBranding: async () => {},
  resetBranding: async () => {},
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    brandingService.getBranding().then((cfg) => {
      if (mounted) {
        setBranding(cfg);
        setLoading(false);
        if (cfg.logoUrl) {
          const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
          if (favicon) {
            favicon.href = cfg.logoUrl;
          }
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const updateBranding = async (config: Partial<BrandingConfig>) => {
    const updated = await brandingService.updateBranding(config);
    setBranding(updated);
  };

  const resetBranding = async () => {
    const reset = await brandingService.resetToDefault();
    setBranding(reset);
  };

  return (
    <BrandingContext.Provider
      value={{
        branding,
        logoUrl: branding.logoUrl,
        brandName: branding.brandName,
        tagline: branding.tagline,
        loading,
        updateBranding,
        resetBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
