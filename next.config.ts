import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // ------------------------------------------------------------------
    // cookinwithbeans.glazedweb.com: the pitch at the root, the site under
    // /demo. (Earlier drafts said beans.glazedweb.com; Kevin's call is the
    // full name, and that subdomain was never attached, so nothing breaks.)
    // The standard Glazed Web host split (see glaze/proposal.md): host-scoped
    // beforeFiles rewrites, NOT basePath, so the real domain serves the site
    // at its root with no pitch anywhere near it the day it exists.
    // beforeFiles is load-bearing: app/page.tsx answers "/", so an afterFiles
    // root rewrite would never fire.
    // DELETE the pitch file and these rewrites once Beans signs or passes.
    // ------------------------------------------------------------------
    const PITCH_HOST = "cookinwithbeans.glazedweb.com";
    const onPitchHost = [{ type: "host" as const, value: PITCH_HOST }];
    return {
      beforeFiles: [
        { source: "/", destination: "/pitch/beans.html", has: onPitchHost },
        { source: "/demo", destination: "/", has: onPitchHost },
        { source: "/demo/:path*", destination: "/:path*", has: onPitchHost },
      ],
      afterFiles: [
        // Path form, reachable on any host before the subdomain exists.
        { source: "/pitch/beans", destination: "/pitch/beans.html" },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        // The pitch host must not compete with the client's own name in
        // search, and neither should the pitch path on any other host.
        source: "/:path*",
        has: [{ type: "host", value: "cookinwithbeans.glazedweb.com" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/pitch/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
