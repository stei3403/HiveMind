# HiveMind Project

This project is a platform for sharing and collaborating on ideas.

## Landing Page Update (Based on Figma Design)

- A new landing page has been implemented based on the Figma design provided in the user query.
- The new landing page is located at `src/pages/LandingPage.tsx`.
- It is now the default route (`/`) for the application.
- The existing `Navbar` and `Footer` components are an integral part of the new `LandingPage.tsx` and are no longer rendered separately in `App.tsx` for the main landing page view.

### Image Placeholders

The new landing page currently uses placeholder images. You will need to manually download the following images from the Figma design and place them in the `public` folder (or your project's designated public asset folder):

1.  `placeholder-share.png` (corresponds to Figma node `8:382` - share 1)
2.  `placeholder-discover.png` (corresponds to Figma node `8:391` - discover 1)
3.  `placeholder-build.png` (corresponds to Figma node `8:400` - build 1)
4.  `placeholder-trash.png` (corresponds to Figma node `8:418` - trash 1)

Update the `src` attribute of the `<img>` tags in `src/pages/LandingPage.tsx` to point to the correct image paths once they are added to your project (e.g., `/share_1.png` if `share_1.png` is in the `public` root).

### Font Dependencies

The Figma design uses the "Playfair Display" font. Ensure this font is included in your project. You can add it via:

1.  **Google Fonts:** Add the following to your `index.html` `<head>`:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    ```
2.  **Tailwind CSS Configuration:** If you are using Tailwind CSS, you can add it to your `tailwind.config.js`:
    ```javascript
    // tailwind.config.js
    module.exports = {
      // ... other configurations
      theme: {
        extend: {
          fontFamily: {
            'playfair-display': ['\'Playfair Display\'', 'serif'],
            'inter': ['\'Inter\'', 'sans-serif'],
          },
        },
      },
      plugins: [],
    }
    ```
    Then you can use classes like `font-playfair-display` in your components.
The new `LandingPage.tsx` already uses `font-playfair-display` for relevant text elements.

## Running the Project

(Instructions on how to run the project - you can fill this in)

```bash
npm install
npm run dev
``` 