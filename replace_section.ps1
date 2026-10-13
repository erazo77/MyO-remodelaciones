$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8
$newSection = Get-Content 'C:\Users\usuario\Desktop\M&O web\gallery_section.html' -Raw -Encoding UTF8

$start = $content.IndexOf('<!-- ANTES / DESPUÉS SLIDERS')
if ($start -ne -1) {
    $end = $content.IndexOf('            </div>', $start)
    if ($end -ne -1) {
        $end = $content.IndexOf('            </div>', $end + 1)
        if ($end -ne -1) {
            $end = $content.IndexOf("`n", $end) + 1
        }
    }

    if ($end -ne -1) {
        $newContent = $content.Substring(0, $start) + $newSection + "`n`n" + $content.Substring($end)
        Set-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Value $newContent -Encoding UTF8
        Write-Host 'Replaced successfully'
    } else {
        Write-Host 'End not found'
    }
} else {
    Write-Host 'Start not found'
}