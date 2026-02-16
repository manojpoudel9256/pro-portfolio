
Add-Type -AssemblyName System.Drawing

$inputPath = "c:\xampp\htdocs\Portfolio\manojpoudel.jpeg"
$outputPath = "c:\xampp\htdocs\Portfolio\apple-touch-icon.png"

if (-not (Test-Path $inputPath)) {
    Write-Error "File not found: $inputPath"
    Exit 1
}

$originalImage = [System.Drawing.Image]::FromFile($inputPath)
$size = 512
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$graphics.Clear([System.Drawing.Color]::Transparent)

# Circular Clip
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(0, 0, $size, $size)
$graphics.SetClip($path)

# Crop Logic
$minDim = [Math]::Min($originalImage.Width, $originalImage.Height)
$srcX = [int](($originalImage.Width - $minDim) / 2)
$srcY = [int](($originalImage.Height - $minDim) / 2)

$destRect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
$srcRect = New-Object System.Drawing.Rectangle $srcX, $srcY, $minDim, $minDim
$units = [System.Drawing.GraphicsUnit]::Pixel

$graphics.DrawImage($originalImage, $destRect, $srcRect, $units)

$graphics.ResetClip()

# Border
$borderThickness = 20
$pen = New-Object System.Drawing.Pen [System.Drawing.Color]::White, $borderThickness
$offset = [int]($borderThickness / 2)
$diameter = [int]($size - $borderThickness)
$graphics.DrawEllipse($pen, $offset, $offset, $diameter, $diameter)

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$originalImage.Dispose()
$graphics.Dispose()
$bitmap.Dispose()
$pen.Dispose()
$path.Dispose()

Write-Host "Success"
