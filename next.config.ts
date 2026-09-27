import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deploy como container standalone na VPS2 (ver Dockerfile/README) — só
  // copia o necessário pra rodar, sem precisar de node_modules completo.
  output: "standalone",

  images: {
    // next 16: `images.domains` foi descontinuado em favor de remotePatterns.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos", // só usado pelos dados de teste/seed em dev
      },
      {
        // Placeholder pro CDN real de imagem da Shopee — o W7 salva a URL
        // de foto capturada no scraping em `coupons.photo_url`. Ajustar
        // pro(s) domínio(s) real(is) assim que o W7 estiver rodando de
        // verdade (costuma ser algo como down-*.img.susercontent.com).
        protocol: "https",
        hostname: "*.susercontent.com",
      },
    ],
  },
};

export default nextConfig;
