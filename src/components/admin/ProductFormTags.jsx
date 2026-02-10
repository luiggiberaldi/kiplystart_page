import { useState } from 'react';

/**
 * ProductFormTags - Interactive tag chips with add/remove
 */
export default function ProductFormTags({ tags, onTagsChange }) {
    const [tagInput, setTagInput] = useState('');
    const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    function addTag(tag) {
        const trimmed = tag.trim();
        if (trimmed && !parsedTags.includes(trimmed)) {
            onTagsChange([...parsedTags, trimmed].join(', '));
        }
        setTagInput('');
    }

    function removeTag(tag) {
        onTagsChange(parsedTags.filter(t => t !== tag).join(', '));
    }

    return (
        <section className="bg-white rounded-xl p-5 border border-gray-200 space-y-3">
            <h3 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">sell</span>
                Tags
            </h3>

            {/* Tag chips */}
            <div className="flex flex-wrap gap-2">
                {parsedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-brand-blue text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                    </span>
                ))}
            </div>

            {/* Add tag input */}
            <div className="flex gap-2">
                <input
                    type="text" value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                    placeholder="Agregar tag y presionar Enter..." />
                <button type="button" onClick={() => addTag(tagInput)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
            </div>
        </section>
    );
}
