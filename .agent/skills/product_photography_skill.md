---
name: Product Photography Generator
description: Generate high-conversion product photography prompts and images based on input photos or descriptions using the "5 Pillars" methodology.
---

# Product Photography Generator Skill

This skill allows you to transform basic product photos or descriptions into high-converting e-commerce imagery.

## Methodology: The 5 Pillars of Conversion

1.  **Hero Shot (Studio)**: Builds authority and trust. Pure white background, perfect lighting.
2.  **Problem/Solution (Before & After)**: Visualizes the value. High contrast between the "pain" and the "relief".
3.  **Action Shot (Process)**: Demonstrates efficacy. Macro shots of the product working (e.g., fizzing, cleaning).
4.  **Infographic (Benefits)**: Overcomes objections. Uses icons and text to reassure (e.g., "Safe for pipes").
5.  **Lifestyle (Context)**: Creates desire. Shows the product in a premium, aspirational environment.

## Instructions

1.  **Analyze the Product**:
    *   Identify the physical characteristics (color, shape, material, label details).
    *   Determine the core "Problem" it solves and the "Solution" state.
    *   *Self-Correction*: If the image is low quality, infer the intended high-quality look.

2.  **Generate Prompts**:
    Create the following 5 prompts using the templates below. Replace `[PRODUCT]` with the specific product description and `[PROBLEM_SCENE]` with the relevant context.

    *   **Prompt 1 (Hero)**: `[Product Photography Style] A hyperrealistic, high-end studio product shot of [PRODUCT]. The [LABEL_DETAILS] are perfectly sharp and legible. The product is centered on a seamless, pure white background (RGB 255,255,255). [Lighting] Professional commercial studio lighting, softbox reflections to define shape, no harsh shadows. [Details] 8k resolution, incredibly detailed textures, slightly low angle looking up to give it dominance.`

    *   **Prompt 2 (Before/After)**: `[Split Screen Comparison Style] A photorealistic "Before and After" composition split vertically down the middle. [Left Side - BEFORE] A close-up shot of [PROBLEM_SCENE_DIRTY]. The lighting is dull and warm. Text overlay at top: "ANTES". [Right Side - AFTER] The exact same scene, but now [SOLUTION_SCENE_CLEAN]. The lighting is bright, cool, and clinical. The [PRODUCT] is sitting neatly next to the scene. Text overlay at top: "DESPUÉS". 8k resolution, highly detailed textures.`

    *   **Prompt 3 (Action)**: `[Macro Action Photography] A detailed, dynamic close-up shot of [PRODUCT_ACTION_SCENE]. [The Reaction] The [PRODUCT] is vigorously reacting with [TARGET_SURFACE], creating [VISUAL_EFFECT] that is [ACTION_VERBS]. The focus is sharp on the action. High shutter speed to freeze the motion.`

    *   **Prompt 4 (Infographic)**: `[Infographic Style] A clean, professional graphic featuring [PRODUCT] on a soft [COLOR] background. Surrounding the product are floating 3D icons representing: [BENEFIT_1], [BENEFIT_2], and [BENEFIT_3]. Text labels are minimal and modern.`

    *   **Prompt 5 (Lifestyle)**: `[Interior Lifestyle Photography] A photorealistic scene in a [PREMIUM_ENVIRONMENT]. The [PRODUCT] is placed neatly on a [SURFACE] next to [RELEVANT_PROPS]. [Lighting] Bright, natural morning light, creating a clean, fresh atmosphere. The product looks like an essential part of a well-maintained home. Shallow depth of field, focus sharp on the product.`

3.  **Generate Images**:
    *   Use the `generate_image` tool for each of the 5 prompts.
    *   Save them with descriptive names (e.g., `hero_shot_[product_name]`, `before_after_[product_name]`, etc.).
