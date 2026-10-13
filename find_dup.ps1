$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8
$idx = $content.IndexOf('ANTES / DESPUÉS SLIDERS - Side by side on desktop', 500)
Write-Host "Index: $idx"
if ($idx -ne -1) {
    Write-Host "Context: $($content.Substring($idx, 80))"
}