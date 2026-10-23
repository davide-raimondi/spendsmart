param(
    [string]$srcPath = "C:\Users\Davide\.gemini\antigravity-ide\scratch\SpendSmart-android\app\src\main\assets\logo.png"
)

Add-Type -AssemblyName System.Drawing

$srcBmp = New-Object System.Drawing.Bitmap($srcPath)

$w = $srcBmp.Width
$h = $srcBmp.Height

# Background reference color (sample from top-left corner)
$corner = $srcBmp.GetPixel(5, 5)
$bgR = $corner.R
$bgG = $corner.G
$bgB = $corner.B

# Create 32-bit ARGB image with transparent background
$cleanBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$minX = $w
$minY = $h
$maxX = 0
$maxY = 0

$threshLow = 30
$threshHigh = 70

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $p = $srcBmp.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        
        if ($diff -le $threshLow) {
            # Completely background: transparent
            $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($diff -ge $threshHigh) {
            # Completely foreground
            $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        } else {
            # Smooth anti-aliased edge
            $alpha = [int](255 * ($diff - $threshLow) / ($threshHigh - $threshLow))
            $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Foreground Bounding Box: $minX, $minY to $maxX, $maxY"
$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1

# Crop foreground
$cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)
$croppedBmp = $cleanBmp.Clone($cropRect, $cleanBmp.PixelFormat)

# Master enlarged icon (512x512) where logo fills 88%
$masterSize = 512
$masterBmp = New-Object System.Drawing.Bitmap($masterSize, $masterSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($masterBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

$targetDim = [int]($masterSize * 0.88)
$scale = [Math]::Min($targetDim / $cropW, $targetDim / $cropH)
$drawW = [int]($cropW * $scale)
$drawH = [int]($cropH * $scale)
$drawX = [int](($masterSize - $drawW) / 2)
$drawY = [int](($masterSize - $drawH) / 2)

$g.DrawImage($croppedBmp, $drawX, $drawY, $drawW, $drawH)
$g.Dispose()

# Save master transparent logo
$masterBmp.Save("C:\Users\Davide\.gemini\antigravity-ide\scratch\SpendSmart-android\app\src\main\assets\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$masterBmp.Save("C:\Users\Davide\.gemini\antigravity-ide\scratch\expense-tracker\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Function to resize and save icon
function Save-Icon($bmp, $size, $destPath) {
    $targetBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $tg = [System.Drawing.Graphics]::FromImage($targetBmp)
    $tg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $tg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $tg.Clear([System.Drawing.Color]::Transparent)
    $tg.DrawImage($bmp, 0, 0, $size, $size)
    $tg.Dispose()
    
    $destDir = [System.IO.Path]::GetDirectoryName($destPath)
    if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force }
    $targetBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()
}

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$resBase = "C:\Users\Davide\.gemini\antigravity-ide\scratch\SpendSmart-android\app\src\main\res"

foreach ($k in $sizes.Keys) {
    $s = $sizes[$k]
    Save-Icon $masterBmp $s "$resBase\$k\ic_launcher.png"
    Save-Icon $masterBmp $s "$resBase\$k\ic_launcher_round.png"
    Write-Host "Generated $k at ${s}x${s}"
}

$srcBmp.Dispose()
$cleanBmp.Dispose()
$croppedBmp.Dispose()
$masterBmp.Dispose()

Write-Host "All icons updated successfully!"
