import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * CustomSelect — Modern, fully rounded dropdown replacing native rectangular OS select boxes.
 */
export default function CustomSelect({
    name,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder = 'Selecciona una opción...',
    disabled = false,
    className = ''
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Format options as normalized { value, label } array
    const normalizedOptions = options.map(opt => {
        if (typeof opt === 'object' && opt !== null) {
            return { value: opt.value ?? opt.id ?? '', label: opt.label ?? opt.name ?? opt.value ?? '' };
        }
        return { value: String(opt), label: String(opt) };
    });

    const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                if (isOpen) {
                    setIsOpen(false);
                    if (onBlur) onBlur();
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onBlur]);

    // Close on Escape key
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                if (onBlur) onBlur();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onBlur]);

    function handleSelect(optionValue) {
        if (disabled) return;
        setIsOpen(false);
        if (onChange) {
            onChange({
                target: {
                    name,
                    value: optionValue
                }
            });
        }
        if (onBlur) onBlur();
    }

    return (
        <div ref={dropdownRef} className={`relative flex-1 ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-2 text-left text-sm font-semibold outline-none transition-colors cursor-pointer bg-transparent py-0.5 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                <span className={`truncate ${selectedOption ? 'text-gray-950 font-bold' : 'text-gray-400 font-medium'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#0A2463]' : ''}`} />
            </button>

            {/* Hidden native input for form compatibility */}
            <input type="hidden" name={name} value={value || ''} />

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 max-h-60 overflow-y-auto animate-fadeIn divide-y divide-gray-50">
                    <div className="space-y-1">
                        {normalizedOptions.length === 0 ? (
                            <div className="px-3 py-2.5 text-xs text-gray-400 text-center font-medium">
                                No hay opciones disponibles
                            </div>
                        ) : (
                            normalizedOptions.map(opt => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-50 text-[#0A2463] font-black shadow-xs'
                                                : 'text-gray-700 hover:bg-slate-100 hover:text-gray-950'
                                        }`}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {isSelected && (
                                            <Check className="w-4 h-4 text-[#0A2463] shrink-0 ml-2" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}