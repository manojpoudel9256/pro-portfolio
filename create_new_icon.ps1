
Add-Type -AssemblyName System.Drawing

# Create a bitmap of size 1024x1024 for high quality
$size = 1024
$bitmap = New-Object System.Drawing.Bitmap $size, $size

# Create a graphics object
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Colors - Premium Gold and Black Palette
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#1c1d20") # Matte Black
$accentColor = [System.Drawing.ColorTranslator]::FromHtml("#d4af37") # Metallic Gold

# Fill background
$graphics.Clear($bgColor)

# Define Pen and Brush
$penThickness = 60
$pen = New-Object System.Drawing.Pen $accentColor, $penThickness
$brush = New-Object System.Drawing.SolidBrush $accentColor

# Design: Abstract Architectural Monogram (M / P / Structure)
# Let's create a diamond/hexagon shape with internal geometry

# Center Points
$cx = $size / 2
$cy = $size / 2
$r = 300 # Radius

# Points for a hexagon
$points = @()
for ($i = 0; $i -lt 6; $i++) {
    $angle = [Math]::PI / 3 * $i - [Math]::PI / 2
    $x = $cx + $r * [Math]::Cos($angle)
    $y = $cy + $r * [Math]::Sin($angle)
    $points += New-Object System.Drawing.PointF $x, $y
}

# Draw Hexagon Outline
$graphics.DrawPolygon($pen, $points)

# Internal Geometry - Abstract 'M' or Structure
# Draw a "Y" shape inside to give it depth (isometric cube feel)
$centerPt = New-Object System.Drawing.PointF $cx, $cy
$graphics.DrawLine($pen, $centerPt, $points[0]) # Up
$graphics.DrawLine($pen, $centerPt, $points[2]) # Down Right
$graphics.DrawLine($pen, $centerPt, $points[4]) # Down Left

# Add a circle in the center for focus
$circleR = 80
$circleRect = New-Object System.Drawing.RectangleF ($cx - $circleR), ($cy - $circleR), ($circleR * 2), ($circleR * 2)
# $graphics.FillEllipse($brush, $circleRect) # Solid center?
# Or just an outline?
$pen.Color = [System.Drawing.ColorTranslator]::FromHtml("#ffffff") # White accent
$pen.Width = 30
$graphics.DrawEllipse($pen, $circleRect)


# Save
$outputFile = "c:\xampp\htdocs\Portfolio\new_premium_icon.png"
$bitmap.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$graphics.Dispose()
$bitmap.Dispose()
$pen.Dispose()
$brush.Dispose()
