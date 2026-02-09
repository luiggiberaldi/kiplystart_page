import React from 'react';

/**
 * KiplyStart Logo (PNG Version)
 * @description
 * Renders the brand logo from a PNG file as requested by the user.
 * 
 * Note: 'isotypeOnly' prop is currently ignored as we are serving a static raster image of the full logo.
 */
const Logo = ({ className = "h-10 w-auto" }) => {
    return (
        <img
            src="/logo.webp"
            alt="KiplyStart Logo"
            className={`${className} object-contain`}
        />
    );
};

export default Logo;
