
Add-Type -AssemblyName System.Drawing

# Create a bitmap of size 512x512
$bitmap = New-Object System.Drawing.Bitmap 512, 512

# Create a graphics object
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Colors
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#1c1d20")
$fgColor = [System.Drawing.ColorTranslator]::FromHtml("#e5e5e5")

# Fill background
$graphics.Clear($bgColor)

# Define Pen
$pen = New-Object System.Drawing.Pen $fgColor, 40

# Define Points for 'M'
$p1 = New-Object System.Drawing.Point 100, 400
$p2 = New-Object System.Drawing.Point 100, 150
$p3 = New-Object System.Drawing.Point 256, 300
$p4 = New-Object System.Drawing.Point 412, 150
$p5 = New-Object System.Drawing.Point 412, 400

# Draw 'M'
$graphics.DrawLine($pen, $p1, $p2)
$graphics.DrawLine($pen, $p2, $p3)
$graphics.DrawLine($pen, $p3, $p4)
$graphics.DrawLine($pen, $p4, $p5)

# Save
$bitmap.Save("c:\xampp\htdocs\Portfolio\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$graphics.Dispose()
$bitmap.Dispose()
