$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8
$idx = $content.IndexOf('ANTES / DESPU')
Write-Host "Index: $idx"
if ($idx -ne -1) {
    Write-Host "Context: $($content.Substring($idx, 50))"
}