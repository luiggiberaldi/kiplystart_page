import React from 'react';

/**
 * ProductDescription Component
 * @description
 * Renders product descriptions with Modern Premium typography.
 * Parses custom Markdown format defined in typography_design_system.md
 * 
 * Markdown Format:
 * # Headline (H1)
 * Price Tag Line
 * ## Section Title (H2)
 * - **Bold:** Description
 * Footer text
 */
export default function ProductDescription({ description }) {
    if (!description) {
        return <p className="text-gray-500">Descripción del producto no disponible.</p>;
    }

    const renderContent = () => {
        const lines = description.split('\n').filter(line => line.trim());
        const elements = [];
        let currentList = [];
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // H1 Headline
            if (line.startsWith('# ')) {
                if (inList) {
                    elements.push(renderBulletList(currentList));
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <h1 key={`h1-${i}`} className="text-[#1a202c] text-[22px] md:text-[36px] font-bold leading-tight mb-3 md:mb-4">
                        {line.substring(2)}
                    </h1>
                );
            }
            // H2 Section Title
            else if (line.startsWith('## ')) {
                if (inList) {
                    elements.push(renderBulletList(currentList));
                    currentList = [];
                    inList = false;
                }
                elements.push(
                    <h2 key={`h2-${i}`} className="text-[#4a5568] text-[18px] md:text-[20px] font-semibold mt-6 mb-3">
                        {line.substring(3)}
                    </h2>
                );
            }
            // Bullet Points
            else if (line.startsWith('- ')) {
                inList = true;
                currentList.push({ text: line.substring(2), index: i });
            }
            // Price Tag or Footer Text
            else if (line.length > 0) {
                if (inList) {
                    elements.push(renderBulletList(currentList));
                    currentList = [];
                    inList = false;
                }

                // Detect price tag pattern (contains numbers and $)
                const isPriceTag = line.includes('$') || /\d+/.test(line);
                const className = isPriceTag
                    ? "text-[#f56565] text-[20px] md:text-[24px] font-medium mb-6"
                    : "text-[#718096] text-[15px] md:text-[16px] font-light leading-relaxed mt-4";

                elements.push(
                    <p key={`p-${i}`} className={className}>
                        {renderInlineMarkdown(line)}
                    </p>
                );
            }
        }

        // Flush any remaining list
        if (inList) {
            elements.push(renderBulletList(currentList));
        }

        return elements;
    };

    const renderBulletList = (items) => {
        return (
            <ul key={`list-${items[0]?.index}`} className="space-y-3 mb-4">
                {items.map(({ text, index }) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="text-[#667eea] text-2xl leading-none mt-0.5 select-none">•</span>
                        <span className="text-[#2d3748] text-[15px] md:text-[16px] leading-relaxed flex-1">
                            {renderInlineMarkdown(text)}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    const renderInlineMarkdown = (text) => {
        // Parse **bold** syntax
        const parts = [];
        let currentIndex = 0;
        const regex = /\*\*(.*?)\*\*/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Add text before bold
            if (match.index > currentIndex) {
                parts.push(
                    <span key={`text-${currentIndex}`}>
                        {text.substring(currentIndex, match.index)}
                    </span>
                );
            }
            // Add bold text
            parts.push(
                <strong key={`bold-${match.index}`} className="font-semibold text-[#1a202c]">
                    {match[1]}
                </strong>
            );
            currentIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (currentIndex < text.length) {
            parts.push(
                <span key={`text-${currentIndex}`}>
                    {text.substring(currentIndex)}
                </span>
            );
        }

        return parts.length > 0 ? parts : text;
    };

    return (
        <div className="product-description border-t border-gray-100 pt-4 overflow-hidden break-words">
            {renderContent()}
        </div>
    );
}
