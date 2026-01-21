#!/bin/bash
# Create simple placeholder icons using ImageMagick
# Replace with professional icons before publishing

sizes=(16 32 48 128)

for size in "${sizes[@]}"; do
  # Create a simple gradient circle as placeholder
  convert -size ${size}x${size} xc:none \
    -draw "fill '#667eea' circle $((size/2)),$((size/2)) $((size/2)),5" \
    -gravity center -pointsize $((size/2)) -fill white -annotate +0+0 "U" \
    icon${size}.png 2>/dev/null || echo "ImageMagick not available, icons need to be created manually"
done

echo "Icon placeholders created (or skipped if ImageMagick unavailable)"
