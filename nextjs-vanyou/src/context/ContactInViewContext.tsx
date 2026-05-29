"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ContactInViewContextValue = {
  contactInView: boolean;
  setContactInView: (inView: boolean) => void;
};

const ContactInViewContext = createContext<ContactInViewContextValue | null>(null);

export function ContactInViewProvider({ children }: { children: ReactNode }) {
  const [contactInView, setContactInView] = useState(false);
  return (
    <ContactInViewContext.Provider value={{ contactInView, setContactInView }}>
      {children}
    </ContactInViewContext.Provider>
  );
}

export function useContactInView() {
  const ctx = useContext(ContactInViewContext);
  if (!ctx) return { contactInView: false, setContactInView: () => {} };
  return ctx;
}
