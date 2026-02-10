import { useState } from 'react';

/**
 * ProductImageGallery Component
 * @description
 * Displays main product image with thumbnail navigation and scarcity indicators.
 * Fully responsive from 320px to desktop.
 */
export default function ProductImageGallery({ allImages, productName, viewersCount }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <div className="bg-white border-b border-gray-100">
            <div className="aspect-square w-full max-w-[500px] mx-auto overflow-hidden flex items-center justify-center p-4 md:p-6 relative">
                <img
                    src={allImages[currentImageIndex]}
                    alt={productName}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />

                {/* Image Navigation Dots */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2 bg-white/90 backdrop-blur-sm px-2.5 md:px-3 py-1.5 md:py-2 rounded-full">
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
                <div className="absolute top-3 md:top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-1 md:gap-1.5 animate-bounce-subtle max-w-[90%]">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                    <span className="text-[10px] md:text-xs font-bold text-soft-black whitespace-nowrap">{viewersCount} personas viendo esto</span>
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
                <div className="px-4 md:px-6 pb-3 md:pb-4 flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${currentImageIndex === idx ? 'border-brand-blue' : 'border-gray-200'
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
