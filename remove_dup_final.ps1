$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8
$start = 21109
$end = 23003
if ($end -ne -1) {
    $newContent = $content.Substring(0, $start) + $content.Substring($end)
    Set-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Value $newContent -Encoding UTF8
    Write-Host 'Duplicate removed successfully'
} else {
    Write-Host 'End not found'
}