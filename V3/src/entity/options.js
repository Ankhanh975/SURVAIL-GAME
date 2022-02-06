const list= [
    "source-over",
    // This is the default setting and draws new shapes on top of the existing canvas content.
    "source-in",
    // The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.
    "source-out",
    // The new shape is drawn where it doesn't overlap the existing canvas content.
    "source-atop",
    // The new shape is only drawn where it overlaps the existing canvas content.
    "destination-over",
    // New shapes are drawn behind the existing canvas content.
    "destination-in",
    // The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent.
    "destination-out",
    // The existing content is kept where it doesn't overlap the new shape.
    "destination-atop",
    // The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.
    "lighter",
    // Where both shapes overlap the color is determined by adding color values.
    "copy",
    // Only the new shape is shown.
    "xor",
    // Shapes are made transparent where both overlap and drawn normal everywhere else.
    "multiply",
    // The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.
    "screen",
    // The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)
    "overlay",
    // A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.
    "darken",
    // Retains the darkest pixels of both layers.
    "lighten",
    // Retains the lightest pixels of both layers.
    "color-dodge",
    // Divides the bottom layer by the inverted top layer.
    "color-burn",
    // Divides the inverted bottom layer by the top layer, and then inverts the result.
    "hard-light",
    // A combination of multiply and screen like overlay, but with top and bottom layer swapped.
    "soft-light",
    // A softer version of hard-light. Pure black or white does not result in pure black or white.
    "difference",
    // Subtracts the bottom layer from the top layer or the other way round to always get a positive value.
    "exclusion",
    // Like difference, but with lower contrast.
    "hue",
    // Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
    "saturation",
    // Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
    "color",
    // Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
    "luminosity",
    // Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.
  ];
  ctx.globalCompositeOperation = list[0]