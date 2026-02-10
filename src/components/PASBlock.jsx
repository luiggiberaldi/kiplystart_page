/**
 * PASBlock Component - Product Bible 2026 Standard
 * @description
 * Implements PAS (Problem-Agitation-Solution) framework.
 * Fully responsive from 320px to desktop.
 */
export default function PASBlock({ product }) {
    // Only render PAS block if the product has its own PAS data
    // Without this check, ALL products would show hardcoded Pomo LED content
    if (!product.pas_headline) return null;

    const pasContent = {
        problem: {
            headline: product.pas_headline,
            description: product.pas_problem || ""
        },
        agitation: {
            text: product.pas_agitation || ""
        },
        solution: {
            benefits: product.pas_benefits || []
        }
    };

    return (
        <div className="pas-block max-w-3xl mx-auto py-6 md:py-8">
            {/* Problema */}
            <div className="problem mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3 leading-snug">
                    {pasContent.problem.headline}
                </h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {pasContent.problem.description}
                </p>
            </div>

            {/* Agitación */}
            <div className="agitation mb-6 md:mb-8 pl-4 md:pl-6 border-l-4 border-yellow-400 bg-yellow-50 py-3 md:py-4 px-3 md:px-4 rounded-r-lg">
                <p className="text-sm md:text-base text-gray-800 italic leading-relaxed">
                    {pasContent.agitation.text}
                </p>
            </div>

            {/* Solución */}
            <div className="solution">
                <h4 className="text-lg md:text-xl font-bold text-green-600 mb-3 md:mb-4 flex items-center gap-2">
                    <span>✅</span>
                    <span className="leading-snug">Solución: {product.name}</span>
                </h4>
                <ul className="space-y-2.5 md:space-y-3">
                    {pasContent.solution.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 md:gap-3">
                            <span className="text-green-600 font-bold text-lg md:text-xl leading-none mt-0.5 shrink-0">→</span>
                            <span className="text-sm md:text-base text-gray-700 flex-1 leading-relaxed">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
