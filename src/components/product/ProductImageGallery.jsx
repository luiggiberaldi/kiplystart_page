/**
 * ProductImageGallery Component
 * @description
 * Displays main product image with thumbnail navigation and scarcity indicators
 */
export default function ProductImageGallery({ allImages, productName, viewersCount }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <div className="bg-white border-b border-gray-100">
            <div className="aspect-square w-full max-w-[500px] mx-auto overflow-hidden flex items-center justify-center p-6 relative">
                <img
                    src={allImages[currentImageIndex]}
                    alt={productName}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />

                {/* Image Navigation Dots */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                        {allImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-brand-blue w-4' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Floating Scarcity Pill */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-1.5 animate-bounce-subtle">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-soft-black">{viewersCount} personas viendo esto</span>
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
                <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-16 h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${currentImageIndex === idx ? 'border-brand-blue' : 'border-gray-200'
                                }`}
                        >
                            <img src={img} alt={`${productName} ${idx + 1}`} className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
