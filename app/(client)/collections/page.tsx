"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { MOCK_COLLECTIONS, MOCK_VIDEOS } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CollectionsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex-1 flex flex-col" style={{ background: "#0F0F14" }}>
      <Navbar title="Your Collections" />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ background: "transparent" }}>
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_COLLECTIONS.map((collection) => {
              const collectionVideos = MOCK_VIDEOS.filter(v => v.collection_id === collection.id);
              const totalMinutes = collectionVideos.reduce((acc, v) => acc + v.duration_minutes, 0);
              const totalHours = (totalMinutes / 60).toFixed(1);

              return (
                <motion.div key={collection.id} variants={itemVariants}>
                  <Link href={`/explorer`} className="block group">
                    <div className="relative rounded-xl overflow-hidden bg-surface border border-border shadow-lg transition-all duration-300 transform group-hover:scale-[1.03] group-hover:shadow-primary/20">
                      
                      {/* Cover Image */}
                      <div className="aspect-video w-full relative">
                        <img 
                          src={collection.cover_image_url} 
                          alt={collection.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F14] via-[#0F0F14]/40 to-transparent" />
                        
                        {/* Tags */}
                        <div className="absolute top-4 left-4 flex gap-2 flex-wrap max-w-[80%]">
                          {collection.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border-white/10 uppercase tracking-wider text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                          {collection.title}
                        </h2>
                        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {collectionVideos.length} videos
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-500" />
                          <span className="flex items-center gap-1">
                            {totalHours} hrs
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
