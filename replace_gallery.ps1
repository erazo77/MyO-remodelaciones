$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8
$start = $content.IndexOf('<!-- ///////////////////////////SECCION GALERIA//////////////// -->')
$end = $content.IndexOf('<!-- ///////////////////////////SECCION ACERCA//////////////// -->')

if ($start -ne -1 -and $end -ne -1) {
    $newSection = Get-Content 'C:\Users\usuario\Desktop\M&O web\new_gallery.html' -Raw -Encoding UTF8
    $newContent = $content.Substring(0, $start) + $newSection + "`n`n" + $content.Substring($end)
    Set-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Value $newContent -Encoding UTF8
    Write-Host 'Gallery section replaced successfully'
} else {
    Write-Host 'Markers not found: start=' + $start + ' end=' + $end
}