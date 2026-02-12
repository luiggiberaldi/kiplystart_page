---
description: Generate high-conversion product photography
---

# Generate Product Photography

1.  **Read Skill**: Read the instructions in the Product Photography Skill file:
    `C:\Users\luigg\Desktop\kiplystar pagina\.agent\skills\product_photography_skill.md`
    (Use `view_file` to read it).

2.  **Input Analysis**:
    -   If the user provided an image, analyze it based on the "Analyze the Product" section.
    -   If no image is provided, ask the user for a product description or image.

3.  **Prompt Generation**:
    -   Follow the "Generate Prompts" section in the skill file.
    -   Create 5 specific prompts (Hero, Before/After, Action, Infographic, Lifestyle) tailored to the product.

4.  **Image Generation**:
    -   Call the `generate_image` tool for each of the 5 prompts.
    -   Review the results.

5.  **Completion**:
    -   Present the generated images and the prompts to the user.
