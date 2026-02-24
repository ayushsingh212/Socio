"use client";

import { Bookmark } from "lucide-react";

const savedPosts = [
  {
    id: 1,
    image: "https://picsum.photos/seed/save1/600",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/save2/600",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/save3/600",
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/save4/600",
  },
  {
    id: 5,
    image: "https://picsum.photos/seed/save5/600",
  },
  {
    id: 6,
    image: "https://picsum.photos/seed/save6/600",
  },
];

export default function SavedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="w-6 h-6 text-primary" />

        <h1 className="text-2xl font-bold">
          Saved Posts
        </h1>
      </div>

      {/* Empty State */}
      {savedPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">

          <Bookmark className="w-16 h-16 text-gray-400 mb-4" />

          <h2 className="text-xl font-semibold mb-2">
            No Saved Posts
          </h2>

          <p className="text-gray-500 max-w-sm">
            Save posts on Socioo to view them here later.
          </p>

        </div>
      )}

      {/* Saved Grid */}
      {savedPosts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">

          {savedPosts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer bg-gray-200"
            >
              <img
                src={post.image}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Bookmark className="w-7 h-7 text-white" />
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}