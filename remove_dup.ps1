$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8

# Find the duplicate gallery_comparacion in comments section
$start = $content.IndexOf('                <!-- ANTES / DESPUÉS SLIDERS - Side by side on desktop, stacked on mobile -->', 500)
if ($start -ne -1) {
    # Find the end of this duplicate section (before the next section)
    $end = $content.IndexOf('                </div>', $start)
    # Find the second closing div
    $end2 = $content.IndexOf('                </div>', $end + 1)
    if ($end2 -ne -1) {
        $end = $content.IndexOf("`n", $end2) + 1
    }
    
    Write-Host "Start: $start, End: $end"
    
    # Remove the duplicate
    $newContent = $content.Substring(0, $start) + $content.Substring($end)
    Set-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Value $newContent -Encoding UTF8
    Write-Host 'Duplicate removed successfully'
} else {
    Write-Host 'Start not found'
}