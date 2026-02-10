import { supabase } from './supabaseClient';

const BUCKET = 'product-images';

/**
 * Upload a product image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadProductImage(file, onProgress) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de imagen no soportado. Usa JPG, PNG, WebP o GIF.');
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen no puede pesar más de 5MB.');
    }

    // Generate unique filename
    const ext = file.name.split('.').pop().toLowerCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `product-${timestamp}-${random}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Delete a product image from Supabase Storage
 * @param {string} url - Public URL of the image to delete
 */
export async function deleteProductImage(url) {
    if (!url) return;

    // Extract file path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET}/`);
    if (pathParts.length < 2) return; // Not a Supabase storage URL

    const filePath = decodeURIComponent(pathParts[1]);

    const { error } = await supabase.storage
        .from(BUCKET)
        .remove([filePath]);

    if (error) console.warn('Error deleting image:', error.message);
}
