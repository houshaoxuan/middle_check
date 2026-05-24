/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    // The demo pages are legacy JSX-heavy presentation code. Keep typecheck
    // separate and do not block production builds on style lint findings.
    ignoreDuringBuilds: true,
  },
};

export default config;
