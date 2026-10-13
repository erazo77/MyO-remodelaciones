$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8
$newSection = Get-Content 'C:\Users\usuario\Desktop\M&O web\gallery_section.html' -Raw -Encoding UTF8

$start = 20813
$end = 22763

if ($end -ne -1) {
    $newContent = $content.Substring(0, $start) + $newSection + "`n`n" + $content.Substring($end)
    Set-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Value $newContent -Encoding UTF8
    Write-Host 'Replaced successfully'
} else {
    Write-Host 'End not found'
}