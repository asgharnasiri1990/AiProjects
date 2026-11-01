"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import type { User } from "@/lib/types";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";

import { FavoritesProvider } from "@/context/favorites-context";

export function Providers({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider initialUser={initialUser}>
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
