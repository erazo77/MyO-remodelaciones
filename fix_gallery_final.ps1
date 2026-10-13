$content = Get-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Raw -Encoding UTF8

# Find gallery section start
$start = $content.IndexOf('<!-- ///////////////////////////SECCION GALERIA//////////////// -->')
# Find next section (ACERCA)
$end = $content.IndexOf('<!-- ///////////////////////////SECCION ACERCA//////////////// -->')

if ($start -ne -1 -and $end -ne -1) {
    $newSection = @'
        <!-- ///////////////////////////SECCION GALERIA//////////////// -->
        <section id="galeria">

            <div class="cont_general_galeria">

                <!-- VIDEO HERO - Full width at top -->
                <div class="galeria_video_hero">
                    
                    <div class="video_slider_container">
                        <div class="video_slider">
                            <button class="slider-nav prev" aria-label="Video anterior" tabindex="0"><i class="bi bi-chevron-left"></i></button>
                            <button class="slider-nav next" aria-label="Video siguiente" tabindex="0"><i class="bi bi-chevron-right"></i></button>
                            
                            <div class="slide">
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render remodelasion general.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render remodelasion general 2.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render remodelasion general 3.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render de cocina.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render cocina 2.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render cocina 3.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render cocina 4.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render remodelasion genral 4.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render remodelasio completa 5.mp4"></video></div>
                                <div class="item-slide"><video muted playsinline preload="metadata" class="video_cento" src="./videos/render remodelasio completa 6.mp4"></video></div>
                            </div>
                        </div>
                        
                        <!-- Title overlay on video -->
                        <h2 class="titulo_galeria_princi">Transformamos Espacios: Donde la Innovaci&oacute;n se Encuentra con el
                            Dise&ntilde;o</h2>
                        
                        <!-- Hidden radios for video slider (before pagination for CSS ~ selector) -->
                        <input type="radio" id="video1" name="video-slide" hidden checked />
                        <input type="radio" id="video2" name="video-slide" hidden />
                        <input type="radio" id="video3" name="video-slide" hidden />
                        <input type="radio" id="video4" name="video-slide" hidden />
                        <input type="radio" id="video5" name="video-slide" hidden />
                        <input type="radio" id="video6" name="video-slide" hidden />
                        <input type="radio" id="video7" name="video-slide" hidden />
                        <input type="radio" id="video8" name="video-slide" hidden />
                        <input type="radio" id="video9" name="video-slide" hidden />
                        <input type="radio" id="video10" name="video-slide" hidden />
                        <div class="pagination">
                            <label class="pagination-item" for="video1"></label>
                            <label class="pagination-item" for="video2"></label>
                            <label class="pagination-item" for="video3"></label>
                            <label class="pagination-item" for="video4"></label>
                            <label class="pagination-item" for="video5"></label>
                            <label class="pagination-item" for="video6"></label>
                            <label class="pagination-item" for="video7"></label>
                            <label class="pagination-item" for="video8"></label>
                            <label class="pagination-item" for="video9"></label>
                            <label class="pagination-item" for="video10"></label>
                        </div>
                    </div>
                    
                    <p class="slogan_principal_galeria">
                        En M&O Remodelaciones y Acabados, transformamos espacios con creatividad y experiencia. Nuestro equipo combina
                        dise&ntilde;o innovador y funcionalidad para crear hogares &uacute;nicos. Desde renovaciones completas hasta
                        cambios espec&iacute;ficos, nos especializamos en dar vida a tus ideas con materiales de primera
                        calidad y un servicio personalizado. &#161;Haz realidad tuvisi&oacute;n del espacio ideal!
                    </p>
                </div>

                <!-- ANTES SLIDER - Full width -->
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
                        <input type="radio" id="antes3" name="antes-slide" hidden />
                        <input type="radio" id="antes4" name="antes-slide" hidden />
                        <input type="radio" id="antes5" name="antes-slide" hidden />
                        <input type="radio" id="antes6" name="antes-slide" hidden />
                        <input type="radio" id="antes6" name="antes-slide" hidden />
                        <input type="radio" id="antes7" name="antes-slide" hidden />
                        <input type="radio" id="antes8" name="antes-slide" hidden />
                        <input type="radio" id="antes9" name="antes-slide" hidden />
                        <input type="radio" id="antes10" name="antes-slide" hidden />
                    </div>
                </div>

            </div>

        </section>
'@

    $newContent = $content.Substring(0, $start) + $newSection + "`n`n" + $content.Substring($end)
    Set-Content 'C:\Users\usuario\Desktop\M&O web\index.html' -Value $newContent -Encoding UTF8
    Write-Host 'Gallery section replaced successfully'
} else {
    Write-Host "Markers not found: start=$start end=$end"
}