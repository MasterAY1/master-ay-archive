import React, { useState } from 'react';
import { 
  Search, Filter, Star, MapPin, Heart, 
  ChevronLeft, ChevronRight, Menu, UserCircle,
  Home, TreePine, Waves, Castle, Palmtree, Key
} from 'lucide-react';

// --- MOCK PROPERTY DATA ---
const CATEGORIES = [
  { id: 'All', icon: <Home size={20} /> },
  { id: 'Beachfront', icon: <Waves size={20} /> },
  { id: 'Cabins', icon: <TreePine size={20} /> },
  { id: 'Modern', icon: <Key size={20} /> },
  { id: 'Mansions', icon: <Castle size={20} /> },
  { id: 'Tropical', icon: <Palmtree size={20} /> }
];

const PROPERTIES = [
  { 
    id: 1, title: "Malibu Oceanfront Villa", location: "Malibu, California", rating: 4.96, price: 850, category: "Beachfront",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
    ]
  },
  { 
    id: 2, title: "A-Frame Forest Cabin", location: "Aspen, Colorado", rating: 4.85, price: 220, category: "Cabins",
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80"
    ]
  },
  { 
    id: 3, title: "Minimalist Desert Home", location: "Joshua Tree, California", rating: 4.92, price: 340, category: "Modern",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ]
  },
  { 
    id: 4, title: "Historic French Chateau", location: "Bordeaux, France", rating: 4.99, price: 1200, category: "Mansions",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    ]
  },
  { 
    id: 5, title: "Bali Jungle Treehouse", location: "Ubud, Indonesia", rating: 4.78, price: 180, category: "Tropical",
    images: [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80"
    ]
  },
  { 
    id: 6, title: "Glass House Retreat", location: "Portland, Oregon", rating: 4.88, price: 410, category: "Modern",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ]
  },
  { 
    id: 7, title: "Lakeside Log Cabin", location: "Lake Tahoe, Nevada", rating: 4.91, price: 290, category: "Cabins",
    images: [
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
    ]
  },
  { 
    id: 8, title: "Clifftop Infinity Pool", location: "Santorini, Greece", rating: 4.97, price: 950, category: "Beachfront",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

export default function HavenBooking() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // --- FILTERING ENGINE ---
  // This filters properties based on BOTH category AND the search text simultaneously
  const filteredProperties = PROPERTIES.filter(property => {
    const matchesCategory = activeCategory === 'All' || property.category === activeCategory;
    const matchesSearch = property.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          property.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 text-rose-500">
            <MapPin size={28} strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">Haven.</span>
          </div>

          {/* Search Pill (Interactive) */}
          <div className="flex-1 max-w-md mx-6">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow px-2 py-2">
              <input 
                type="text" 
                placeholder="Search destinations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 text-sm focus:outline-none"
              />
              <button className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors">
                <Search size={14} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium hidden md:block cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-full">List your home</p>
            <div className="flex items-center gap-3 border border-gray-300 rounded-full px-3 py-2 cursor-pointer hover:shadow-md transition-shadow">
              <Menu size={18} className="text-gray-600" />
              <UserCircle size={24} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* --- CATEGORY SLIDER --- */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 overflow-x-auto py-4 custom-scrollbar">
          {CATEGORIES.map(category => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center gap-2 min-w-max pb-2 border-b-2 transition-colors ${
                activeCategory === category.id 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className={activeCategory === category.id ? 'animate-bounce' : ''}>
                {category.icon}
              </div>
              <span className="text-xs font-medium">{category.id}</span>
            </button>
          ))}
          
          {/* Filters Button */}
          <div className="ml-auto sticky right-0 bg-white pl-4 py-1 flex items-center">
            <button className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium hover:border-gray-900 transition-colors bg-white">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>
      </header>

      {/* --- PROPERTY GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No exact matches</h3>
            <p className="text-gray-500">Try changing your filters or searching a different location.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Hide scrollbar for category slider */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// --- COMPLEX COMPONENT: PROPERTY CARD WITH INTERNAL IMAGE CAROUSEL ---
function PropertyCard({ property }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation(); // Prevents card click when clicking arrow
    setImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-gray-200">
        
        {/* Carousel Images */}
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${imageIndex * 100}%)` }}
        >
          {property.images.map((img, i) => (
            <img key={i} src={img} alt={property.title} className="w-full h-full object-cover shrink-0" />
          ))}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
        >
          <Heart size={24} className={isLiked ? "fill-rose-500 text-rose-500" : "fill-black/30 text-white"} strokeWidth={1.5} />
        </button>

        {/* Carousel Arrows (Only show on hover) */}
        {isHovered && property.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-900 shadow-md transition-all z-10">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-900 shadow-md transition-all z-10">
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Carousel Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {property.images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imageIndex ? 'bg-white scale-110' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Info Container */}
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900 truncate pr-4">{property.location}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} className="fill-gray-900 text-gray-900" />
            <span className="text-sm">{property.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 truncate">{property.title}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-semibold text-gray-900">${property.price}</span>
          <span className="text-sm text-gray-900">night</span>
        </div>
      </div>
      
    </div>
  );
}