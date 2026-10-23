Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\Davide\.gemini\antigravity-ide\scratch\SpendSmart-android\app\src\main\assets\logo.png"
$bmp = New-Object System.Drawing.Bitmap($imgPath)

Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"
$corner = $bmp.GetPixel(0, 0)
Write-Host "Corner: R=$($corner.R) G=$($corner.G) B=$($corner.B) A=$($corner.A)"

$bmp.Dispose()
