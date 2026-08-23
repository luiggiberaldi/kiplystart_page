import { 
    CheckCircle2, Truck, ShieldCheck, Sparkles, 
    Zap, Coins, PackageCheck, Award, Star
} from 'lucide-react';

/**
 * ProductDescription Component
 * Renders high-converting, modern e-commerce product descriptions.
 * Converts raw Markdown into polished cards, benefit lists, and trust banners.
 */
export default function ProductDescription({ description }) {
    if (!description) {
        return (
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs text-center text-gray-400 font-medium text-sm">
                Descripción detallada no disponible para este producto.
            </div>
        );
    }

    const renderInlineMarkdown = (text) => {
        if (!text) return text;

        // Parse **bold** and *italic*
        const parts = [];
        let key = 0;
        
        // Regex matches **bold** or *italic*
        const tokenRegex = /(\*\*.*?\*\*|\*.*?\*)/g;
        const tokens = text.split(tokenRegex);

        tokens.forEach(token => {
            if (token.startsWith('**') && token.endsWith('**')) {
                parts.push(
                    <strong key={`b-${key++}`} className="font-extrabold text-gray-950">
                        {token.slice(2, -2)}
                    </strong>
                );
            } else if (token.startsWith('*') && token.endsWith('*')) {
                parts.push(
                    <em key={`i-${key++}`} className="italic text-gray-800">
                        {token.slice(1, -1)}
                    </em>
                );
            } else if (token) {
                parts.push(<span key={`t-${key++}`}>{token}</span>);
            }
        });

        return parts.length > 0 ? parts : text;
    };

    const cleanDescription = (description || '')
        .replace(/dropshipping|proveedor|bodega central|dropanas|aliexpress|importaci[oó]n directa|china|f[aá]brica/gi, '')
        .trim();

    const parseBlocks = () => {
        const rawLines = cleanDescription.split('\n');
        const blocks = [];
        let currentBulletGroup = [];
        let currentNumberGroup = [];

        const flushBullets = () => {
            if (currentBulletGroup.length > 0) {
                blocks.push({
                    type: 'bullets',
                    items: [...currentBulletGroup]
                });
                currentBulletGroup = [];
            }
        };

        const flushNumbers = () => {
            if (currentNumberGroup.length > 0) {
                blocks.push({
                    type: 'numbers',
                    items: [...currentNumberGroup]
                });
                currentNumberGroup = [];
            }
        };

        rawLines.forEach((rawLine, idx) => {
            const line = rawLine.trim();
            if (!line) return;

            // Dividers
            if (line === '---' || line === '***' || line === '___') {
                flushBullets();
                flushNumbers();
                blocks.push({ type: 'divider', key: idx });
                return;
            }

            // H1
            if (line.startsWith('# ')) {
                flushBullets();
                flushNumbers();
                blocks.push({ type: 'h1', text: line.substring(2).trim(), key: idx });
                return;
            }

            // H2
            if (line.startsWith('## ')) {
                flushBullets();
                flushNumbers();
                blocks.push({ type: 'h2', text: line.substring(3).trim(), key: idx });
                return;
            }

            // H3
            if (line.startsWith('### ')) {
                flushBullets();
                flushNumbers();
                blocks.push({ type: 'h3', text: line.substring(4).trim(), key: idx });
                return;
            }

            // Bullet list item (- or * or •)
            if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
                flushNumbers();
                const cleanText = line.replace(/^[-*•]\s+/, '');
                currentBulletGroup.push({ text: cleanText, key: idx });
                return;
            }

            // Numbered list item (1. 2. etc.)
            const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
            if (numMatch) {
                flushBullets();
                currentNumberGroup.push({
                    num: numMatch[1],
                    text: numMatch[2],
                    key: idx
                });
                return;
            }

            // Special Banner: Offer / COD / Free Shipping Callout
            const lower = line.toLowerCase();
            if (
                lower.includes('envío gratis') || 
                lower.includes('pago contra entrega') || 
                lower.includes('adquiérelo hoy') ||
                lower.includes('compra 100% segura')
            ) {
                flushBullets();
                flushNumbers();
                blocks.push({ type: 'callout', text: line, key: idx });
                return;
            }

            // Regular section header if starts with emoji like ✨, 🛡️, 📦, 🔥, 💡
            if (/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(line)) {
                flushBullets();
                flushNumbers();
                blocks.push({ type: 'emoji_header', text: line, key: idx });
                return;
            }

            // Normal paragraph
            flushBullets();
            flushNumbers();
            blocks.push({ type: 'p', text: line, key: idx });
        });

        flushBullets();
        flushNumbers();

        return blocks;
    };

    const blocks = parseBlocks();

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200/80 shadow-xs space-y-6 text-gray-800">
            {blocks.map((block, idx) => {
                switch (block.type) {
                    case 'divider':
                        return <div key={`div-${idx}`} className="my-6 border-t border-gray-100" />;

                    case 'h1':
                        return (
                            <h1 key={`h1-${idx}`} className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 tracking-tight leading-tight">
                                {block.text}
                            </h1>
                        );

                    case 'h2':
                    case 'emoji_header':
                        return (
                            <div key={`h2-${idx}`} className="flex items-center gap-2.5 pt-2">
                                <div className="w-1.5 h-5 bg-[#0A2463] rounded-full shrink-0" />
                                <h2 className="text-base sm:text-lg md:text-xl font-black text-gray-950 tracking-tight">
                                    {block.text}
                                </h2>
                            </div>
                        );

                    case 'h3':
                        return (
                            <h3 key={`h3-${idx}`} className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight pt-1">
                                {block.text}
                            </h3>
                        );

                    case 'callout':
                        return (
                            <div key={`callout-${idx}`} className="bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-blue-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
                                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                                        Beneficio Exclusivo
                                    </span>
                                    <p className="text-xs sm:text-sm font-bold text-gray-900 leading-relaxed">
                                        {renderInlineMarkdown(block.text)}
                                    </p>
                                </div>
                            </div>
                        );

                    case 'bullets':
                        return (
                            <div key={`bullets-${idx}`} className="grid grid-cols-1 gap-2.5">
                                {block.items.map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-gray-200/60 hover:bg-slate-50 transition-colors shadow-2xs"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-blue-100/90 text-[#0A2463] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1">
                                            {renderInlineMarkdown(item.text)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );

                    case 'numbers':
                        return (
                            <div key={`numbers-${idx}`} className="grid grid-cols-1 gap-3">
                                {block.items.map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/50 via-slate-50 to-slate-50 border border-emerald-200/60 shadow-2xs"
                                    >
                                        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs mt-0.5">
                                            {item.num}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-800 leading-relaxed flex-1">
                                            {renderInlineMarkdown(item.text)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );

                    case 'p':
                    default:
                        return (
                            <p key={`p-${idx}`} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                                {renderInlineMarkdown(block.text)}
                            </p>
                        );
                }
            })}
        </div>
    );
}
