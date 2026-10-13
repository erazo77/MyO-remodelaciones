$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8
$start = 20813
$end = $content.IndexOf('            </div>', $start)
if ($end -ne -1) {
    $end = $content.IndexOf('            </div>', $end + 1)
    if ($end -ne -1) {
        $end = $content.IndexOf("`n", $end) + 1
    }
}
Write-Host "Start: 20813"
Write-Host "End: $end"
if ($end -ne -1) {
    Write-Host "Context: $($content.Substring($end - 50, 50))"
}