import { useState } from 'react';
import { Flame, Eye, Package } from 'lucide-react';

export default function ProductImageGallery({ allImages = [], productName, viewersCount = 24 }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const activeImage = allImages[currentImageIndex] || allImages[0];

    return (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col">
            {/* Main Image Frame */}
            <div className="aspect-square w-full bg-gradient-to-b from-gray-50/50 to-gray-100/60 rounded-2xl overflow-hidden flex items-center justify-center p-6 relative border border-gray-100">
                {activeImage ? (
                    <img
                        src={activeImage}
                        alt={productName}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
                        width="500"
                        height="500"
                    />
                ) : (
                    <Package className="w-16 h-16 text-gray-300" />
                )}

                {/* Scarcity / Live Viewers Pill */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-gray-200/60 flex items-center gap-2 z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] sm:text-xs font-bold text-gray-900 whitespace-nowrap flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{viewersCount} personas viendo esto</span>
                    </span>
                </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
                <div className="pt-4 flex gap-2.5 overflow-x-auto no-scrollbar">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 rounded-2xl p-1 bg-white overflow-hidden transition-all cursor-pointer ${
                                currentImageIndex === idx
                                    ? 'border-[#0A2463] ring-2 ring-[#0A2463]/20 scale-105'
                                    : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                            }`}
                        >
                            <img src={img} alt={`${productName} ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
