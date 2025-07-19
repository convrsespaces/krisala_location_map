"use client";

import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
}
