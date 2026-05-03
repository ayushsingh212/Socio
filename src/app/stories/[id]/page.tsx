"use client";

import { useParams } from "next/navigation";

export default function StoryPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <p className="text-gray-400 text-sm">Story viewer coming soon</p>
      </div>
    </div>
  );
}
