"use client";
import dynamic from "next/dynamic";

const FarmMap = dynamic(() => import("./FarmMap"), { ssr: false });

export default function FarmMapPage() {
  return <FarmMap />;
}
