<?php
// Set headers
header('Content-Type: image/png');

// Create image
$size = 512;
$img = imagecreatetruecolor($size, $size);

// Enhanced Colors (Dark Theme)
$bg = imagecolorallocate($img, 28, 29, 32); // #1c1d20
$white = imagecolorallocate($img, 255, 255, 255);
$accent = imagecolorallocate($img, 229, 229, 229); // #e5e5e5

// Fill background
imagefilledrectangle($img, 0, 0, $size, $size, $bg);

// Enable anti-aliasing
imageantialias($img, true);

// Draw Geometric Pattern (Abstract P/M)
$thickness = 40;
imagesetthickness($img, $thickness);

// Geometric shape points
// M-like shape with clean lines
$points = [
    100,
    400, // Bottom Left
    100,
    150, // Top Left
    256,
    300, // Middle Low
    412,
    150, // Top Right
    412,
    400  // Bottom Right
];

// Draw lines manually for better control
imageline($img, 100, 400, 100, 150, $accent);
imageline($img, 100, 150, 256, 300, $accent);
imageline($img, 256, 300, 412, 150, $accent);
imageline($img, 412, 150, 412, 400, $accent);

// Add a glowing accent circle in the center (subtle)
$circle_color = imagecolorallocatealpha($img, 255, 255, 255, 100); // Semi-transparent
imagefilledellipse($img, 256, 380, 20, 20, $circle_color);

// Output image to file if run from CLI, else to browser
if (php_sapi_name() === 'cli') {
    imagepng($img, 'apple-touch-icon.png');
} else {
    imagepng($img);
}

imagedestroy($img);
?>