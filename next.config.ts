import { validateEnv } from "@/lib/envManager";
import connectDB from "@/server/db/mongoose";
import type { NextConfig } from "next";

validateEnv();
connectDB();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
