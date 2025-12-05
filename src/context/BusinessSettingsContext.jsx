import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "business-settings";

const defaultSettings = {
  whatsappPhone: "5491123456789",
  supportEmail: "contacto@chicytech.com",
  footerText: "© Chic & Tech",
  catalogDefaults: {
    category: "",
    sort: "",
    min: "",
    max: "",
  },
};

const BusinessSettingsContext = createContext({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export function BusinessSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setSettings({
        ...defaultSettings,
        ...parsed,
        catalogDefaults: {
          ...defaultSettings.catalogDefaults,
          ...(parsed.catalogDefaults || {}),
        },
      });
    } catch {
      // Ignorar errores de parseo y usar defaults
    }
  }, []);

  const updateSettings = (patch) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        ...patch,
        catalogDefaults: {
          ...prev.catalogDefaults,
          ...(patch.catalogDefaults || {}),
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Si falla el localStorage, simplemente no persistimos
      }
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar errores de storage
    }
  };

  return (
    <BusinessSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export function useBusinessSettings() {
  return useContext(BusinessSettingsContext);
}

