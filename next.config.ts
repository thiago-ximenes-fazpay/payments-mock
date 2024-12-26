import { validateEnv } from "@/lib/envManager";
import type { NextConfig } from "next";

validateEnv();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
