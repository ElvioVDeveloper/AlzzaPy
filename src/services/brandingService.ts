import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import defaultLogoAsset from '../assets/images/elevva_logo_emblem_1791482529055.jpg';

export interface BrandingConfig {
  logoUrl: string;
  brandName: string;
  tagline: string;
  updatedAt?: string;
}

export const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: defaultLogoAsset || '/elevva-logo.jpg',
  brandName: 'Elevva',
  tagline: 'Gastronomía & Coctelería de Altura',
};

const LOCAL_STORAGE_KEY = 'elevva_custom_branding';

export const brandingService = {
  /**
   * Returns branding configuration from Firestore or localStorage fallback
   */
  async getBranding(): Promise<BrandingConfig> {
    // Check localStorage cache first for instant rendering
    let cached: BrandingConfig | null = null;
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        cached = JSON.parse(local);
      }
    } catch {
      // Ignore localStorage errors
    }

    try {
      const docRef = doc(db, 'settings', 'branding');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<BrandingConfig>;
        const merged: BrandingConfig = {
          logoUrl: data.logoUrl || cached?.logoUrl || DEFAULT_BRANDING.logoUrl,
          brandName: data.brandName || cached?.brandName || DEFAULT_BRANDING.brandName,
          tagline: data.tagline || cached?.tagline || DEFAULT_BRANDING.tagline,
          updatedAt: data.updatedAt,
        };
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // Ignore storage quota
        }
        return merged;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'settings/branding');
    }

    return cached || DEFAULT_BRANDING;
  },

  /**
   * Persists custom branding to Firestore and localStorage
   */
  async updateBranding(config: Partial<BrandingConfig>): Promise<BrandingConfig> {
    const current = await this.getBranding();
    const updated: BrandingConfig = {
      ...current,
      ...config,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage immediately
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    // Update Favicon dynamically
    if (updated.logoUrl) {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = updated.logoUrl;
      }
    }

    // Persist to Firestore
    try {
      const docRef = doc(db, 'settings', 'branding');
      await setDoc(docRef, updated, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/branding');
      // Even if Firestore fails, local changes were saved
    }

    return updated;
  },

  /**
   * Resets branding back to default Elevva emblem
   */
  async resetToDefault(): Promise<BrandingConfig> {
    const resetConfig: BrandingConfig = {
      ...DEFAULT_BRANDING,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resetConfig));
    } catch {
      // Ignore
    }

    try {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = '/favicon.jpg';
      }
    } catch {
      // Ignore
    }

    try {
      const docRef = doc(db, 'settings', 'branding');
      await setDoc(docRef, resetConfig, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/branding');
    }

    return resetConfig;
  },
};
