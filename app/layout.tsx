import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AntiCapture } from "../components/security/AntiCapture";

export const metadata: Metadata = {
  title: "ASONAPAQ — Asociación Nacional de Pacientes de Quimioterapia",
  description: "Fe · Esperanza · Vida. Plataforma de apoyo integral a pacientes oncológicos en Panamáá.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body>
        <AntiCapture />
        {children}
      </body>
    </html>
  );
}
