$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8

# Find start of galeria_comparacion
$start = $content.IndexOf('<div class="galeria_comparacion">')
if ($start -ne -1) {
    # Find end of galeria_comparacion (the closing div)
    $end = $content.IndexOf('</div>', $start)
    # Find the second closing div
    $end2 = $content.IndexOf('</div>', $end + 1)
    if ($end2 -ne -1) {
        $end3 = $content.IndexOf('</div>', $end2 + 1)
        if ($end3 -ne -1) {
            $end = $content.IndexOf("`n", $end3) + 1
        }
    }
    
    Write-Host "Start: $start, End: $end"
    
    # Keep only the first comparacion_item (Antes slider)
    # Find the end of the first comparacion_item
    $firstItemEnd = $content.IndexOf('                    </div>', $start)
    $firstItemEnd2 = $content.IndexOf('                    </div>', $firstItemEnd + 1)
    $firstItemEnd3 = $content.IndexOf('                    </div>', $firstItemEnd2 + 1)
    if ($firstItemEnd3 -ne -1) {
        $firstItemEnd = $content.IndexOf("`n", $firstItemEnd3) + 1
    }
    
    Write-Host "First item end: $firstItemEnd"
    
    # Build new content: keep everything before galeria_comparacion + first item + closing divs
    $newContent = $content.Substring(0, $start) + @'
                <div class="galeria_comparacion">
                    <div class="comparacion_item">
                        <div class="comparacion_slider">
                            <button class="slider-nav prev" aria-label="Imagen anterior" tabindex="0"><i class="bi bi-chevron-left"></i></button>
                            <button class="slider-nav next" aria-label="Imagen siguiente" tabindex="0"><i class="bi bi-chevron-right"></i></button>
                            
                            <!-- Label overlay on slider -->
                            <div class="comparacion_label_overlay antes">Antes</div>
                            
                            <div class="slide">
                                <div class="item-slide"><img src="./img/imagen galeria 1.jpg" alt="Antes 1"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 2.jpg" alt="Antes 2"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 3.jpg" alt="Antes 3"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 4.jpg" alt="Antes 4"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 5.jpg" alt="Antes 5"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 6.jpg" alt="Antes 6"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 7.jpg" alt="Antes 7"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 8.jpg" alt="Antes 8"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 9.jpg" alt="Antes 9"></div>
                                <div class="item-slide"><img src="./img/imagen galeria 10.jpg" alt="Antes 10"></div>
                            </div>
                        </div>
                        <div class="pagination">
                            <label class="pagination-item" for="antes1"></label>
                            <label class="pagination-item" for="antes2"></label>
                            <label class="pagination-item" for="antes3"></label>
                            <label class="pagination-item" for="antes4"></label>
                            <label class="pagination-item" for="antes5"></label>
                            <label class="pagination-item" for="antes6"></label>
                            <label class="pagination-item" for="antes7"></label>
                            <label class="pagination-item" for="antes8"></label>
                            <label class="pagination-item" for="antes9"></label>
                            <label class="pagination-item" for="antes10"></label>
                        </div>
                        <!-- Hidden radios for antes slider -->
                        <input type="radio" id="antes1" name="antes-slide" hidden checked />
                        <input type="radio" id="antes2" name="antes-slide" hidden />
                        <input type="radio" id="antes3" name="antes-slide" hidden /
                        <input type="radio" id="antes4" name="antes-slide" hidden /
                        <input type="radio" id="antes5" name="antes-slide" hidden /
                        <input type="radio" id="antes6" name="antes-slide" hidden /
                        <input type="radio" id="antes7" name="antes-slide" hidden /
                        <input type="radio" id="antes8" name="antes-slide" hidden /
                        <input type="radio" id="antes9" name="antes-slide" hidden /
                        <input type="radio" id="antes10" name="antes-slide" hidden /
                    </div>
                </div>
'@ + "`n`n" + $content.Substring($end)
    
    Set-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Value $newContent -Encoding UTF8
    Write-Host 'Cleaned up gallery - kept only Antes slider'
} else {
    Write-Host 'Start not found'
}