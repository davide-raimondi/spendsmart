Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\Davide\.gemini\antigravity-ide\scratch\SpendSmart-android\app\src\main\assets\logo.png"
$bmp = New-Object System.Drawing.Bitmap($imgPath)

$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

# Sample corner color as background reference
$bgR = 12
$bgG = 24
$bgB = 46

for ($y = 0; $y -lt $bmp.Height; $y += 4) {
    for ($x = 0; $x -lt $bmp.Width; $x += 4) {
        $p = $bmp.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bgR) + [Math]::Abs($p.G - $bgG) + [Math]::Abs($p.B - $bgB)
        if ($diff -gt 35) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Symbol Bounds: X: $minX to $maxX, Y: $minY to $maxY"
Write-Host "Symbol Size: ($($maxX - $minX)) x ($($maxY - $minY)) out of $($bmp.Width) x $($bmp.Height)"

$bmp.Dispose()
