"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt?: string;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  variant?: "grid" | "masonry" | "carousel";
  columns?: 2 | 3 | 4;
}

export function ImageGallery({
  images,
  className,
  variant = "grid",
  columns = 3,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const columnClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  if (variant === "masonry") {
    return (
      <>
        <div className={cn("columns-2 md:columns-3 gap-4 space-y-4", className)}>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt || ""}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          ))}
        </div>
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </>
    );
  }

  // Default grid variant
  return (
    <>
      <div className={cn(`grid ${columnClass[columns]} gap-4`, className)}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.src}
              alt={image.alt || ""}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {image.title && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <p className="text-white font-medium">{image.title}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      <Lightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}

interface LightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
}

function Lightbox({ image, onClose }: LightboxProps) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.img
            src={image.src}
            alt={image.alt || ""}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          />
          <motion.button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            onClick={onClose}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface HoverImageCardProps {
  image: string;
  title: string;
  description?: string;
  className?: string;
  variant?: "zoom" | "slide" | "blur" | "tilt";
}

export function HoverImageCard({
  image,
  title,
  description,
  className,
  variant = "zoom",
}: HoverImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === "tilt") {
    return (
      <motion.div
        className={cn("relative rounded-xl overflow-hidden cursor-pointer", className)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ rotateY: 5, rotateX: -5 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {description && <p className="text-sm text-zinc-300 mt-1">{description}</p>}
        </motion.div>
      </motion.div>
    );
  }

  if (variant === "slide") {
    return (
      <div
        className={cn("relative rounded-xl overflow-hidden cursor-pointer group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-black/0 p-6"
          initial={{ y: "100%" }}
          animate={{ y: isHovered ? 0 : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {description && <p className="text-sm text-zinc-300 mt-1">{description}</p>}
        </motion.div>
      </div>
    );
  }

  if (variant === "blur") {
    return (
      <div
        className={cn("relative rounded-xl overflow-hidden cursor-pointer group", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          animate={{ filter: isHovered ? "blur(4px)" : "blur(0px)" }}
        />
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          {description && <p className="text-sm text-zinc-300 mt-2">{description}</p>}
        </motion.div>
      </div>
    );
  }

  // Default zoom variant
  return (
    <div
      className={cn("relative rounded-xl overflow-hidden cursor-pointer group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.4 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {description && <p className="text-sm text-zinc-300 mt-1">{description}</p>}
      </div>
    </div>
  );
}
