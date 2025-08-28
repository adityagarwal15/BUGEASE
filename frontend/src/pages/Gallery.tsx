import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Grid3X3,
  Grid2X2,
  Image,
  PlayCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

// Mock image data
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=1470&auto=format&fit=crop",
    alt: "Electric campus buggy",
    category: "vehicles",
    description: "Our new eco-friendly electric buggies",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1486&auto=format&fit=crop",
    alt: "Campus buggy station",
    category: "stations",
    description: "Main campus buggy station with charging ports",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1660341502110-c49eed38cbf5?q=80&w=1471&auto=format&fit=crop",
    alt: "Students boarding buggy",
    category: "people",
    description: "Students getting on a campus buggy between classes",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1637410153214-df95bc1e5d57?q=80&w=1470&auto=format&fit=crop",
    alt: "Night time buggy service",
    category: "vehicles",
    description: "Safe night transportation with our illuminated buggies",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1541805874-325c8761e4b1?q=80&w=1470&auto=format&fit=crop",
    alt: "Campus map with routes",
    category: "campus",
    description: "Detailed campus map showing all buggy routes",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1384&auto=format&fit=crop",
    alt: "Buggy maintenance team",
    category: "people",
    description: "Our dedicated maintenance crew ensuring safe rides",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1522246043532-5bfa87f7e3eb?q=80&w=1470&auto=format&fit=crop",
    alt: "Aerial view of campus",
    category: "campus",
    description: "Bird's eye view of our beautiful campus",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1543269866-487350d6fa5e?q=80&w=1470&auto=format&fit=crop",
    alt: "Charging station",
    category: "stations",
    description: "Solar-powered buggy charging stations",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop",
    alt: "Students using the app",
    category: "people",
    description: "Students using the CampusBuggy app to book rides",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1469&auto=format&fit=crop",
    alt: "Buggy driver",
    category: "people",
    description: "One of our professional and friendly buggy drivers",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1537123547273-e59f4f437f1b?q=80&w=1470&auto=format&fit=crop",
    alt: "Buggy fleet",
    category: "vehicles",
    description: "Our growing fleet of campus buggies",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1627312912157-976060bc61b4?q=80&w=1470&auto=format&fit=crop",
    alt: "Campus at sunset",
    category: "campus",
    description: "Sunset view with buggies in service",
  },
];

// Mock videos
const galleryVideos = [
  {
    id: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1579261456554-f8091a9aca7a?q=80&w=1470&auto=format&fit=crop",
    title: "How to Book a Buggy",
    duration: "2:45",
    category: "tutorials",
  },
  {
    id: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1567609313456-8c105a69e75d?q=80&w=1470&auto=format&fit=crop",
    title: "Meet Our Drivers",
    duration: "3:20",
    category: "people",
  },
  {
    id: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1593765921772-de7cf35eaf29?q=80&w=1405&auto=format&fit=crop",
    title: "Campus Buggy Tour",
    duration: "4:50",
    category: "campus",
  },
  {
    id: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1593698054009-35b887fee95f?q=80&w=1470&auto=format&fit=crop",
    title: "Sustainable Transportation Initiative",
    duration: "5:15",
    category: "campus",
  },
];

const Gallery = () => {
  const [gridView, setGridView] = useState<"grid3x3" | "grid2x2">("grid3x3");
  const [filter, setFilter] = useState<
    "all" | "vehicles" | "people" | "stations" | "campus"
  >("all");
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);

  const filteredImages =
    filter === "all"
      ? galleryImages
      : galleryImages.filter(img => img.category === filter);

  const openLightbox = (image: (typeof galleryImages)[0]) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedImage) return;

    const currentIndex = filteredImages.findIndex(
      img => img.id === selectedImage.id
    );
    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex =
        currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(filteredImages[newIndex]);
  };

  // Handle keyboard navigation for the lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === "ArrowLeft") {
        navigateImage("prev");
      } else if (e.key === "ArrowRight") {
        navigateImage("next");
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredImages]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Campus Buggy Gallery</h1>
        <p className="text-muted-foreground">
          Explore photos and videos of our campus transportation system
        </p>
      </div>

      <Tabs defaultValue="photos" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="photos" className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              <span>Photos</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="mr-2">
              <Button
                variant={filter === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="text-xs h-8"
              >
                All
              </Button>
              <Button
                variant={filter === "vehicles" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("vehicles")}
                className="text-xs h-8 ml-1"
              >
                Vehicles
              </Button>
              <Button
                variant={filter === "people" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("people")}
                className="text-xs h-8 ml-1"
              >
                People
              </Button>
              <Button
                variant={filter === "stations" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("stations")}
                className="text-xs h-8 ml-1"
              >
                Stations
              </Button>
              <Button
                variant={filter === "campus" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter("campus")}
                className="text-xs h-8 ml-1"
              >
                Campus
              </Button>
            </div>

            <div className="bg-muted rounded-md flex">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${gridView === "grid3x3" ? "bg-secondary text-secondary-foreground" : ""}`}
                onClick={() => setGridView("grid3x3")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${gridView === "grid2x2" ? "bg-secondary text-secondary-foreground" : ""}`}
                onClick={() => setGridView("grid2x2")}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="photos" className="mt-0">
          <div
            className={`grid ${gridView === "grid3x3" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"} gap-4`}
          >
            {filteredImages.map(image => (
              <Card
                key={image.id}
                className="overflow-hidden glass-panel hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                onClick={() => openLightbox(image)}
              >
                <CardContent className="p-0 relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`object-cover w-full ${gridView === "grid3x3" ? "h-52" : "h-72"} group-hover:scale-105 transition-transform duration-500`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-sm text-white">{image.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryVideos.map(video => (
              <Card
                key={video.id}
                className="overflow-hidden glass-panel hover:border-primary/20 transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-0 relative">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-56 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                        <PlayCircle className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {video.category}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                const currentIndex = filteredImages.findIndex(
                  img => img.id === selectedImage.id
                );
                alert(
                  `Image ${currentIndex + 1} of ${filteredImages.length}: ${selectedImage.description}`
                );
              }}
            >
              <Info className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            onClick={() => navigateImage("prev")}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-h-[85vh] max-w-[85vw] object-contain"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            onClick={() => navigateImage("next")}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-white text-lg">{selectedImage.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
