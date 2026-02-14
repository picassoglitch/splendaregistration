import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sweet & Smart 2026",
    short_name: "Sweet & Smart",
    description: "Your favorite companion app for any event.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5f7",
    theme_color: "#213b74",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

