// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

export { default } from "next-auth/middleware";

export const config = {
  // Protege el dashboard y la carga de fotos (que está en la raíz)
  matcher: ["/", "/dashboard/:path*"],
};
