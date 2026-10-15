//*////////////////////// CARGA LOS ELEMENTOS DESDE UN JSON STRING//////////////////////// *//

const BotonCategoria = document.querySelectorAll(".boton_categoria");
const titulo_principal = document.querySelector(".titulo_principal");
let botonesAgregar = document.querySelectorAll(".producto_agregar");
const numerito = document.querySelector("#numerito");

/**+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

//*////////////////////// push cambio de fondo//////////////////////// *//
const toggle_fondo = document.getElementById("toggle_fondo");
const contenedor_padre = document.querySelector(".contenedor_padre");
const slogan = document.querySelector(".slogan");
const tituloslogan = document.getElementById("tituloslogan");
const titulo_carrusel = document.querySelector(".titulo_carrusel");
const titulo_slider_manual = document.querySelector(".titulo_slider_manual");
const titulolanding = document.querySelector(".titulo_landing");
const slogan_landing = document.querySelector(".parrafo_slogan_inicio");
const elemento = document.getElementsByClassName("elemento ul li");

let observadorRevelacionScroll = null;

function observarElementoScroll(element, delay = 0) {
  if (!observadorRevelacionScroll || element.classList.contains("revelar-scroll")) return;
  element.classList.add("revelar-scroll");
  element.style.setProperty("--reveal-delay", `${delay}ms`);
  observadorRevelacionScroll.observe(element);
}

function inicializarRevelacionesScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  observadorRevelacionScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revelar-scroll-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -20% 0px" });

  const elementos = document.querySelectorAll(
    ".titulo_slider_manual, .titulo_galeria_princi, .slogan_principal_galeria, .cont_etiqueta_acerca, .cont_etiqueta_acerca_twow, .titulo_comentarios, .slogan_cometarios, .algunos_coments, .item_comentario, .cont_formulario_footer"
  );

  elementos.forEach((element, index) => observarElementoScroll(element, Math.min((index % 4) * 70, 210)));
}

inicializarRevelacionesScroll();

if (toggle_fondo) {
  toggle_fondo.addEventListener("click", () => {
    toggle_fondo.classList.toggle("active_fondo");
    document.body.classList.toggle("active_fondo");
    [contenedor_padre, slogan, tituloslogan, titulo_carrusel, titulo_slider_manual, slogan_landing]
      .filter(Boolean)
      .forEach((element) => element.classList.toggle("active_fondo"));
  });
}

/*////////////////////funcion para cargar peoductos del JSON al galeria de inicio/////////// */
const contenedorProductos = document.querySelector("#contenedor_Productos"); //declaracion

let productos = []; //peticion
fetch("./productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    cargar_productos(productos);
  });

function cargar_productos(productoElegidos) {
  contenedorProductos.innerHTML = "";

  productoElegidos.forEach((producto, index) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
    <div class="caracteristicas">
   <span class="texto_animadoone">Espacio Renovado</span>
     <hr class="linea_twow"><span class="texto_animadotwow">Listo para Disfrutar</span>
    </div>

        <img class="img_producto" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="producto_detalles">
          <h3 class="producto_titulo">${producto.titulo}</h3>
          <div class="carrito_producto_precio"></div>
          <div class="container_Boton_detalles" id="containerBotondetalles">
            <div class="content_detalles">
              ${producto.detalles ? `
                <div class="materiales_lista">
                  <p class="parrafo_detalles">
                    ${producto.detalles ? producto.detalles.descripcion : 'Proyecto de remodelación profesional con materiales de alta calidad y acabados superiores.'}
                  </p>
                  ${producto.imagenes_detalle && producto.imagenes_detalle.length > 0 ? `
                    <div class="slider_galeria_detalle">
                      ${producto.imagenes_detalle.slice(0,4).map((img, idx) => `
                        <input type="radio" name="slider_detalle_${producto.id}" id="slider_detalle_${producto.id}_${idx+1}" ${idx === 0 ? 'checked' : ''} hidden />
                      `).join('')}
                      <div class="slider_galeria_detalle_imgs">
                        ${producto.imagenes_detalle.slice(0,4).map((img, idx) => `
                          <div class="slider_galeria_detalle_img_item">
                            <img src="${img}" alt="Detalle visual del proyecto" class="img_detalle_galeria" />
                          </div>
                        `).join('')}
                      </div>
                      <div class="slider_galeria_detalle_controls">
                        ${producto.imagenes_detalle.slice(0,4).map((img, idx) => `
                          <label for="slider_detalle_${producto.id}_${idx+1}" class="slider_galeria_detalle_control"></label>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                  <h4>Materiales Utilizados:</h4>
                  <ul>
                    ${producto.detalles.materiales.map(material => `<li>• ${material}</li>`).join('')}
                  </ul>
                  <div class="especificaciones">
                    <p><strong>Tiempo estimado:</strong> ${producto.detalles.tiempo_estimado}</p>
                    <p><strong>Garantía:</strong> ${producto.detalles.garantia}</p>
                  </div>
                  ${producto.precio_estimado ? `<div class="precio_estimado"><span>Precio estimado:</span> <strong>${producto.precio_estimado}</strong></div>` : ''}
                </div>
              ` : `
                <p>Para más detalles sobre materiales y especificaciones técnicas, <a class="enlace_detalles" href="#footer">contáctanos</a></p>
              `}
            </div>
            <div class="togglebtn_detalles"></div>
          </div>
        </div>
      `;
    contenedorProductos.append(div);
    observarElementoScroll(div, Math.min((index % 4) * 70, 210));
    // Botón detalles
    const togglebtn = div.querySelector(".togglebtn_detalles");
    const container_Boton_detalles = div.querySelector(
      ".container_Boton_detalles"
    );
    togglebtn.addEventListener("click", function () {
      const detallesAbiertos = document.querySelectorAll(
        ".container_Boton_detalles.active_text"
      );
      detallesAbiertos.forEach((detalleAbierto) => {
        if (detalleAbierto !== container_Boton_detalles) {
          detalleAbierto.classList.remove("active_text");
        }
      });
      container_Boton_detalles.classList.toggle("active_text");
    });
  });

  // INICIALIZAR SLIDER Y CONTROLES SOLO PARA EL SLIDER DE PRODUCTOS
  const carousel = document.querySelector(".carousel");
  const leftArrow = document.getElementById("productos-left");
  const rightArrow = document.getElementById("productos-right");

  // Función para calcular el desplazamiento exacto de una tarjeta
  const getSmoothScrollAmount = () => {
    const firstCard = carousel.querySelector(".producto");
    if (!firstCard || typeof firstCard.clientWidth === "undefined") {
      return 0;
    }
    // El gap entre tarjetas es 2vh (según CSS)
    const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
    return firstCard.clientWidth + gap;
  };

  if (!leftArrow.dataset.listo) {
  leftArrow.dataset.listo = "1";
  leftArrow.addEventListener("click", () => {
    const scrollAmount = getSmoothScrollAmount();
    if (scrollAmount === 0) return;
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightArrow.addEventListener("click", () => {
    const scrollAmount = getSmoothScrollAmount();
    if (scrollAmount === 0) return;
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
  }
  if (typeof showHideIcons === "function") setTimeout(showHideIcons, 50);
}

/**+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

//*////////////////////// LISTA DESPEGABLe//////////////////////// *//

function abrirListaDesple() {
  if (
    listaOculta.style.display === "none" ||
    listaOculta.style.display === ""
  ) {
    listaOculta.style.display = "block";
  } else {
    listaOculta.style.display = "none";
  }
}
/* CIERRA EL BOTON CATEGORIA Y CARGA LOS PRODUCTOS DE LA CATEGORIA*/

document.addEventListener("DOMContentLoaded", function () {
  BotonCategoria.forEach((boton) => {
    boton.addEventListener("click", () => {
      const categoriaSeleccionada = boton.dataset.categoria;
      cargar_productos_filtrados(categoriaSeleccionada);

      /**/ /////////////////////FILTRADO LISTA DESPLEGABLE CATEGORIAS PRODUCTOS//////// */

      function cargar_productos_filtrados(categoriaSeleccionada) {
        fetch("./productos.json")
          .then((response) => response.json())
          .then((data) => {
            const productosFiltrados = data.filter(
              (producto) => producto.categoria === categoriaSeleccionada
            );
            mostrar_productos_filtrados(productosFiltrados);
          })
          .catch((error) => console.error("Error al cargar productos:", error));
      }
    });

    function mostrar_productos_filtrados(productos) {
      // Aquí deberías tener lógica para mostrar los productos filtrados en tu interfaz
      // Por ejemplo, puedes utilizar la función cargar_productos() con los productos filtrados
      cargar_productos(productos);
    }
  });
});

/**+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

/*////////////////////////// SCRIPT SLIDER MANUAL//////////////////*/

// Seleccionar elementos del DOM
const carousel = document.querySelector(".carousel"); // Contenedor del carrusel
const firstImg = carousel.querySelectorAll("img")[0]; // Primera imagen del carrusel
const arrowIcons = document.querySelectorAll(".wrapper .cont_controls i "); // Íconos de flecha

// Variables para rastreo del estado del arrastre y desplazamiento
let isDragStart = false,
  isDragging = false,
  prevPageX,
  prevScrollLeft,
  positionDiff;

// Función para mostrar u ocultar las flechas de navegación
const showHideIcons = () => {
  const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
  const left = document.getElementById("productos-left");
  const right = document.getElementById("productos-right");
  if (left) left.classList.toggle("control_oculto", carousel.scrollLeft <= 2);
  if (right) right.classList.toggle("control_oculto", carousel.scrollLeft >= scrollWidth - 2);
};

// Función para calcular el desplazamiento suave del carousel
const getSmoothScrollAmount = () => {
  const firstCard = carousel.querySelector(".producto");
  if (!firstCard || typeof firstCard.clientWidth === "undefined") {
    return 0;
  }
  // El gap entre tarjetas es 2vh (según CSS)
  const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
  return firstCard.clientWidth + gap;
};

// Función para alinear el carousel correctamente
const alignCarousel = () => {
  const firstImg = carousel.querySelector("img:first-child");
  if (!firstImg) return;
  
  const imgWidth = firstImg.clientWidth + 14;
  const currentScroll = carousel.scrollLeft;
  const alignedScroll = Math.round(currentScroll / imgWidth) * imgWidth;
  
  if (Math.abs(currentScroll - alignedScroll) > 10) {
    carousel.scrollTo({
      left: alignedScroll,
      behavior: 'smooth'
    });
  }
};

// Las flechas (#productos-left / #productos-right) se enlazan en cargar_productos()
carousel.addEventListener("scroll", () => showHideIcons(), { passive: true });

// Función para desplazamiento automático
const autoSlide = () => {
  const scrollAmount = getSmoothScrollAmount();
  
  if (
    carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth ||
    carousel.scrollLeft <= 0 ||
    scrollAmount === 0
  ) {
    return; // Retornar si no hay más imágenes hacia la izquierda o si no se puede calcular el desplazamiento
  }

  const dragDistance = Math.abs(positionDiff);
  const snapDifference = scrollAmount - dragDistance;

  if (carousel.scrollLeft > prevScrollLeft) {
    // Si el usuario desplaza hacia la derecha
    carousel.scrollLeft +=
      dragDistance > scrollAmount / 3 ? snapDifference : -dragDistance;
  } else {
    // Si el usuario desplaza hacia la izquierda
    carousel.scrollLeft -=
      dragDistance > scrollAmount / 3 ? snapDifference : -dragDistance;
  }
};

// Función para inicio de arrastre
const dragStart = (e) => {
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX; // Coordenadas del arrastre
  prevScrollLeft = carousel.scrollLeft; // Posición inicial del carrusel
};

// Función para arrastrar
const dragging = (e) => {
  if (!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX; // Diferencia de posición
  carousel.scrollLeft = prevScrollLeft - positionDiff; // Actualizar el desplazamiento
  showHideIcons();
};

// Función para finalizar el arrastre
const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");
  if (!isDragging) return;
  isDragging = false;
  autoSlide(); // Activar función de desplazamiento automático
};

// Event listeners para el arrastre y clics en el carrusel
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);
document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/**/ ///////////////// FUNCION MENU HAMBURGUESA /////////// */
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navMenu = document.getElementById("nav-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const closeMenuBtn = document.getElementById('close-menu');

  // Función centralizada para abrir/cerrar menú
  function toggleMenu(forceClose = false, immediate = false) {
    if (navMenu.classList.contains("active") || forceClose) {
      navMenu.classList.add("closing");
      menuOverlay.classList.remove("active");
      const finishClosing = () => {
        hamburgerMenu.classList.remove("active");
        navMenu.classList.remove("active", "closing");
        document.body.style.overflow = "auto";
        hamburgerMenu.setAttribute("aria-expanded", "false");
        hamburgerMenu.setAttribute("aria-label", "Abrir menú");
      };
      if (immediate) finishClosing();
      else setTimeout(finishClosing, 300);
    } else {
      hamburgerMenu.classList.add("active");
      navMenu.classList.add("active");
      menuOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      hamburgerMenu.setAttribute("aria-expanded", "true");
      hamburgerMenu.setAttribute("aria-label", "Cerrar menú");
    }
  }

  hamburgerMenu.addEventListener("click", () => toggleMenu());
  menuOverlay.addEventListener("click", () => toggleMenu(true));
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => toggleMenu(true));

  const themeToggle = document.getElementById("toggle_fondo");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 900px)").matches && navMenu.classList.contains("active")) {
        toggleMenu(true, true);
      }
    });
  }

  const proposalButton = document.getElementById("boton-propuesta");
  if (proposalButton) {
    proposalButton.addEventListener("click", () => {
      document.getElementById("propuesta")?.scrollIntoView({ behavior: "smooth", block: "start" });
      toggleMenu(true);
    });
  }

  // Scroll suave y cierre de menú para todos los enlaces
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      toggleMenu(true);
    });
  });

  // Cerrar menú con tecla Escape
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && navMenu.classList.contains("active")) {
      toggleMenu(true);
    }
  });
});
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//

/**/ /////////////////// SCRIP SLIDER ACERCA//////////////// */

// Implementación nativa del slider sin GSAP
function inicializarSliderAcerca() {
  var slides = document.querySelectorAll(".slide");
  
  // Solo ejecutar si hay slides
  if (slides.length > 0) {
    let currentSlide = 0;
    
    // Crear contenedor de dots si no existe
    let dotsContainer = document.getElementById("Dots");
    if (!dotsContainer) {
      dotsContainer = document.createElement("div");
      dotsContainer.id = "Dots";
      dotsContainer.style.cssText = "position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 10;";
      
      // Insertar después del primer contenedor de slides
      const firstSlideContainer = slides[0].closest('.container-all') || slides[0].parentElement;
      if (firstSlideContainer) {
        firstSlideContainer.style.position = "relative";
        firstSlideContainer.appendChild(dotsContainer);
      }
    }
    
    // Crear dots
    for (var i = 0; i < slides.length; i++) {
      var D = document.createElement("div");
      D.className = "Dot";
      D.id = "Dot" + i;
      D.style.cssText = "width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.3s;";
      
      D.addEventListener("click", function () {
        const dotIndex = parseInt(this.id.replace('Dot', ''));
        mostrarSlide(dotIndex);
      });
      
      dotsContainer.appendChild(D);
    }
    
    // Función para mostrar slide específico
    function mostrarSlide(index) {
      if (index < 0 || index >= slides.length) return;
      
      // Ocultar todos los slides
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
        slide.style.transform = i === index ? 'scale(1)' : 'scale(0.8)';
        slide.style.transition = 'all 0.5s ease';
      });
      
      // Actualizar dots
      document.querySelectorAll('.Dot').forEach((dot, i) => {
        dot.style.background = i === index ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)';
      });
      
      currentSlide = index;
    }
    
    // Función para navegar
    function GO(direction) {
      let newIndex = currentSlide + direction;
      if (newIndex < 0) newIndex = slides.length - 1;
      if (newIndex >= slides.length) newIndex = 0;
      mostrarSlide(newIndex);
    }
    
    // Agregar event listeners solo si los elementos existen
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevtBtn");

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        GO(1);
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        GO(-1);
      });
    }
    
    // Inicializar con el primer slide
    mostrarSlide(0);
  }
}


/**+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

/**/ ////////////GALERIA 2 sliders +video ////////////////////////////////////////////////////////////////////////*/

// Verificar si los elementos existen antes de usar
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector("#left");
const btnRigth = document.querySelector("#rigth");

if (slider && btnLeft && btnRigth) {
  let sliderSection = document.querySelectorAll(".slider_section");
  
  if (sliderSection.length > 0) {
    let sliderSectionLast = sliderSection[sliderSection.length - 1];
slider.insertAdjacentElement("afterbegin", sliderSectionLast);

function Next() {
  let sliderSectionFirst = document.querySelectorAll(".slider_section")[0];
      if (!sliderSectionFirst) return;

      slider.style.marginLeft = "-21.5vh";
  slider.style.transition = "all 1.5s";

  setTimeout(function () {
    slider.style.transition = "none";
    slider.insertAdjacentElement("beforeend", sliderSectionFirst);
    slider.style.marginLeft = "-0";
  }, 1500);
}

function antes() {
      let sliderSection = document.querySelectorAll(".slider_section");
      if (sliderSection.length === 0) return;
      
  let sliderSectionLast = sliderSection[sliderSection.length - 1];

      slider.style.marginLeft = "0";
  slider.style.transition = "all 1.5s";

  setTimeout(function () {
    slider.style.transition = "none";
    slider.insertAdjacentElement("afterbegin", sliderSectionLast);
    slider.style.marginLeft = "1vh";
  }, 1500);
}

btnRigth.addEventListener("click", function () {
  Next();
});

btnLeft.addEventListener("click", function () {
  antes();
});
  }
}

//  numero incrementador proyectos

// Función mejorada para iniciar los contadores
function iniciarContadores() {
  const numeroElementos = document.querySelectorAll(".numer_circulo");
  
  numeroElementos.forEach((elemento) => {
    const valorInicial = parseInt(elemento.getAttribute("data-inicial")) || 0;
    const valorMaximo = parseInt(elemento.getAttribute("data-maximo")) || 100;
    let valor = valorInicial;
    let subiendo = true;
    let animacionActiva = false;
    let corriendo = false;

    function animarNumero() {
      if (!animacionActiva) { corriendo = false; return; }
      
      if (subiendo) {
        valor++;
        if (valor >= valorMaximo) {
          subiendo = false;
        }
      } else {
        valor--;
        if (valor <= valorInicial) {
          subiendo = true;
        }
      }

      elemento.textContent = valor;
      setTimeout(animarNumero, 50); // Reducido de 10 a 50ms para mejor performance
    }

    // Iniciar animación solo si el elemento está visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animacionActiva = true;
          if (!corriendo) { corriendo = true; animarNumero(); }
        } else {
          animacionActiva = false;
        }
      });
    }, { threshold: 0.5 });

    observer.observe(elemento);
  });
}

function revelarElementosEnViewport() {
  const puntoActivacion = window.innerHeight * 0.8;
  document.querySelectorAll(".revelar-scroll:not(.revelar-scroll-visible)").forEach((element) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top <= puntoActivacion && bounds.bottom > 0) {
      element.classList.add("revelar-scroll-visible");
    }
  });
}

// Función mejorada para manejar las animaciones de scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.75; // Punto de activación más temprano
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Si el elemento está en el viewport o cerca de entrar
        if (elementTop < triggerPoint && elementBottom > 0) {
            element.style.opacity = '1';
            
            // Aplicar la animación correspondiente con un pequeño retraso basado en la posición
            const delay = Math.min((elementTop / windowHeight) * 0.5, 0.3);
            
            if (element.classList.contains('fade-in-up')) {
                element.style.animation = `fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s forwards`;
            } else if (element.classList.contains('fade-in-left')) {
                element.style.animation = `fadeInLeft 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s forwards`;
            } else if (element.classList.contains('fade-in-right')) {
                element.style.animation = `fadeInRight 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s forwards`;
                    }
    }
    });
}

// Revisión local orientativa: no envía textos a servicios externos.
function sugerirMejorasEscritura(texto) {
    const diccionario = {
        nesecito: 'necesito', nesesito: 'necesito', presio: 'precio', presios: 'precios',
        cotisacion: 'cotización', cotizacion: 'cotización', remodelacion: 'remodelación',
        reparacion: 'reparación', instalacion: 'instalación', habitacion: 'habitación',
        bano: 'baño', banos: 'baños', diseno: 'diseño', disenos: 'diseños',
        plomeria: 'plomería', tuberia: 'tubería', tuberias: 'tuberías',
        electrico: 'eléctrico', electricos: 'eléctricos', electrica: 'eléctrica', electricas: 'eléctricas',
        ceramica: 'cerámica', ceramicas: 'cerámicas', iluminacion: 'iluminación',
        impermeabilizacion: 'impermeabilización', demolicion: 'demolición', construccion: 'construcción',
        ampliacion: 'ampliación', descripcion: 'descripción', asesoria: 'asesoría'
    };
    const cambios = [];
    const vistos = new Set();
    const corregido = String(texto).replace(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g, (palabra) => {
        const clave = palabra.toLocaleLowerCase('es-CO');
        if (!Object.prototype.hasOwnProperty.call(diccionario, clave)) return palabra;
        let reemplazo = diccionario[clave];
        if (palabra === palabra.toLocaleUpperCase('es-CO')) reemplazo = reemplazo.toLocaleUpperCase('es-CO');
        else if (palabra[0] === palabra[0].toLocaleUpperCase('es-CO')) reemplazo = reemplazo[0].toLocaleUpperCase('es-CO') + reemplazo.slice(1);
        if (reemplazo !== palabra && !vistos.has(palabra)) {
            vistos.add(palabra);
            cambios.push({ original: palabra, sugerencia: reemplazo });
        }
        return reemplazo;
    });
    return { texto: corregido, cambios };
}

function inicializarAyudaEscritura(formulario) {
    const campo = formulario.elements.descripcion;
    const revisar = document.getElementById('revisarEscritura');
    const aplicar = document.getElementById('aplicarEscritura');
    const cancelar = document.getElementById('cancelarEscritura');
    const deshacer = document.getElementById('deshacerEscritura');
    const panel = document.getElementById('escrituraSugerencias');
    const lista = document.getElementById('listaSugerenciasEscritura');
    const estado = document.getElementById('escrituraEstado');
    if (!campo || !revisar || !aplicar || !cancelar || !deshacer || !panel || !lista || !estado) return;
    let propuesta = null;
    let anterior = null;
    function limpiarRevision() { propuesta = null; panel.hidden = true; lista.textContent = ''; }
    function limpiarTodo() { limpiarRevision(); anterior = null; deshacer.hidden = true; estado.textContent = ''; }
    campo.addEventListener('input', limpiarTodo);
    revisar.addEventListener('click', () => {
        limpiarRevision();
        if (!campo.value.trim()) { estado.textContent = 'Escribe primero una descripción de tu proyecto.'; campo.focus({ preventScroll: true }); return; }
        const resultado = sugerirMejorasEscritura(campo.value);
        if (!resultado.cambios.length) { estado.textContent = 'No encontramos errores en nuestra lista de palabras frecuentes. Esto no garantiza que no haya otros errores; revisa también las sugerencias de tu navegador.'; return; }
        propuesta = { original: campo.value, resultado };
        resultado.cambios.forEach((cambio) => { const item = document.createElement('li'); item.textContent = cambio.original + ' → ' + cambio.sugerencia; lista.appendChild(item); });
        panel.hidden = false;
        estado.textContent = 'Encontramos ' + resultado.cambios.length + ' posibles mejoras. Revísalas antes de aplicarlas.';
    });
    aplicar.addEventListener('click', () => {
        if (!propuesta || campo.value !== propuesta.original) { limpiarRevision(); estado.textContent = 'Tu texto cambió. Pulsa Revisar escritura de nuevo.'; return; }
        const original = campo.value;
        campo.value = propuesta.resultado.texto;
        campo.dispatchEvent(new Event('input', { bubbles: true }));
        anterior = original;
        deshacer.hidden = false;
        estado.textContent = 'Sugerencias aplicadas. Puedes deshacerlas antes de seguir escribiendo.';
        revisar.focus({ preventScroll: true });
    });
    cancelar.addEventListener('click', () => { limpiarRevision(); estado.textContent = 'Conservamos tu descripción sin cambios.'; revisar.focus({ preventScroll: true }); });
    deshacer.addEventListener('click', () => { if (anterior === null) return; campo.value = anterior; campo.dispatchEvent(new Event('input', { bubbles: true })); estado.textContent = 'Restauramos tu descripción original.'; campo.focus({ preventScroll: true }); });
    formulario.addEventListener('reset', limpiarTodo);
}

// Consecutivo global asignado por el servidor; no constituye una cotización aprobada.
function crearClaveSolicitudCotizacion() {
    if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') throw new Error('No hay generador seguro disponible.');
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    // Clave interna para reintentos; el número visible SOLO lo asigna el servidor.
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}


async function obtenerNumeroCotizacion(formulario) {
    const campo = formulario.elements.numero_cotizacion;
    if (!campo) throw new Error('Falta el campo de referencia.');
    const visible = document.getElementById('numeroCotizacionVisible');
    if (/^[0-9]{4,10}$/.test(campo.value)) {
        if (visible) visible.textContent = campo.value;
        return campo.value;
    }
    if (!formulario.dataset.cotizacionRequestKey) formulario.dataset.cotizacionRequestKey = crearClaveSolicitudCotizacion();
    if (visible) visible.textContent = 'Asignando número de cotización…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const respuesta = await fetch(NUMERO_COTIZACION_URL, {
            method: 'POST',
            credentials: 'same-origin',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ request_id: formulario.dataset.cotizacionRequestKey }),
            signal: controller.signal
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok || resultado.success !== true || typeof resultado.numero !== 'string' || !/^[0-9]{4,10}$/.test(resultado.numero)) {
            throw new Error('No se pudo obtener una referencia válida del servidor.');
        }
        campo.value = resultado.numero;
        if (visible) visible.textContent = resultado.numero;
        return resultado.numero;
    } finally {
        clearTimeout(timeout);
        if (!campo.value && visible) visible.textContent = 'Se asignará al enviar tu solicitud';
    }
}


function mostrarResultadoCotizacion(cotizacion, mensaje, estado) {
    const panel = document.getElementById('cotizacionResultado');
    if (!panel) return;
    document.getElementById('cotizacionResultadoNumero').textContent = cotizacion.numero;
    document.getElementById('cotizacionResultadoEstado').textContent = estado;
    document.getElementById('cotizacionResultadoWhatsApp').href = 'https://wa.me/' + WHATSAPP_COTIZACION + '?text=' + encodeURIComponent(mensaje);
    panel.hidden = false;
}

// ==================== FUNCIONALIDAD DEL FORMULARIO ====================

// Función para inicializar el formulario de contacto
function inicializarFormulario() {
    const formulario = document.getElementById('formularioContacto');
    const btnEnviar = document.querySelector('.btn_enviar_formulario');
    
    if (!formulario) return;
    
    // Detectar si es dispositivo móvil
    const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Validación en tiempo real
    const inputs = formulario.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validarCampo);
        input.addEventListener('input', limpiarError);
        
        // Optimizaciones específicas para móviles
        if (esMobile) {
            // Prevenir zoom en inputs en iOS
            if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
                input.style.fontSize = '16px'; // Previene zoom en iOS
            }
            
            // Mejorar experiencia de focus en móviles
            input.addEventListener('focus', () => {
                // Scroll suave al input en móviles
                setTimeout(() => {
                    input.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            });
        }
    });
    
    // Manejo del envío del formulario
    formulario.addEventListener('submit', manejarEnvioFormulario);

    // Formulario en pasos (slider)
    inicializarPasosFormulario(formulario);
    inicializarAyudaEscritura(formulario);
    formulario.addEventListener('reset', () => {
        const referencia = formulario.elements.numero_cotizacion;
        if (referencia) referencia.value = '';
        delete formulario.dataset.cotizacionRequestKey;
        const visible = document.getElementById('numeroCotizacionVisible');
        if (visible) visible.textContent = 'Se asignará al enviar tu solicitud';
    });
    
    // Animación de focus en inputs
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Optimizaciones para checkboxes en móviles
    const checkboxes = formulario.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (esMobile) {
            // Aumentar área táctil para checkboxes
            const label = checkbox.closest('label');
            if (label) {
                label.style.padding = '1vh';
                label.style.margin = '0.5vh 0';
            }
        }
    });
    
    // Optimizaciones para selects en móviles
    const selects = formulario.querySelectorAll('select');
    selects.forEach(select => {
        if (esMobile) {
            // Mejorar experiencia de select en móviles
            select.addEventListener('change', () => {
                // Feedback visual inmediato
                select.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    select.style.transform = 'scale(1)';
                }, 150);
            });
        }
    });
    
    // Prevenir envío accidental en móviles
    if (esMobile) {
        let submitTimeout;
        btnEnviar.addEventListener('touchstart', (e) => {
            submitTimeout = setTimeout(() => {
                btnEnviar.classList.add('touch-active');
            }, 100);
        });
        
        btnEnviar.addEventListener('touchend', (e) => {
            clearTimeout(submitTimeout);
            btnEnviar.classList.remove('touch-active');
        });
    }
}

// Función para validar campos individuales
function validarCampo(event) {
    const campo = event.target;
    const valor = campo.value.trim();
    const esRequerido = campo.hasAttribute('required');

    if (campo.type === 'checkbox') {
        if (esRequerido && !campo.checked) {
            mostrarError(campo, 'Debes aceptar para continuar');
            return false;
        }
        limpiarError(campo);
        return true;
    }

    if (esRequerido && !valor) {
        mostrarError(campo, 'Este campo es requerido');
        return false;
    }
    
    // Validaciones específicas
    if (campo.type === 'email' && valor) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
            mostrarError(campo, 'Ingresa un email válido');
            return false;
        }
    }
    
    if (campo.type === 'tel' && valor) {
        const telefonoRegex = /^[\d\s\-\+\(\)]+$/;
        if (!telefonoRegex.test(valor)) {
            mostrarError(campo, 'Ingresa un teléfono válido');
            return false;
        }
    }
    
    limpiarError(campo);
    return true;
}

// Función para mostrar errores
function mostrarError(campo, mensaje) {
    const formGroup = campo.closest('.form_group');
    if (!formGroup) return;
    const validation = formGroup.querySelector('.form_validation');

    campo.classList.add('campo_error');
    campo.setAttribute('aria-invalid', 'true');
    if (validation) {
        validation.textContent = mensaje;
        validation.setAttribute('role', 'alert');
    }
}

// Función para limpiar errores (acepta un campo o un evento)
function limpiarError(arg) {
    const campo = arg && arg.target ? arg.target : arg;
    if (!campo || !campo.closest) return;
    const formGroup = campo.closest('.form_group');
    if (!formGroup) return;
    const validation = formGroup.querySelector('.form_validation');

    campo.classList.remove('campo_error');
    campo.removeAttribute('aria-invalid');
    if (validation) {
        validation.textContent = '';
    }
}

// ==================== FORMULARIO EN PASOS ====================
function inicializarPasosFormulario(formulario) {
    const viewport = formulario.querySelector('.form_pasos');
    const track = formulario.querySelector('.form_pasos_track');
    const pasos = Array.from(formulario.querySelectorAll('.form_paso'));
    const items = Array.from(formulario.querySelectorAll('.form_progreso_item'));
    const linea = formulario.querySelector('.form_progreso_linea');
    const btnAtras = formulario.querySelector('.btn_form_atras');
    const btnSiguiente = formulario.querySelector('.btn_form_siguiente');
    const btnEnviar = formulario.querySelector('.btn_enviar_formulario');
    if (!viewport || !track || pasos.length < 2) return;

    const ultimo = pasos.length - 1;
    let actual = 0;

    function ajustarAltura() {
        viewport.style.height = pasos[actual].offsetHeight + 'px';
    }

    function validarPaso(indice) {
        let ok = true;
        let primero = null;
        pasos[indice].querySelectorAll('input[required], select[required], textarea[required]').forEach(campo => {
            const valido = validarCampo({ target: campo });
            if (!valido) {
                ok = false;
                if (!primero) primero = campo;
            }
        });
        if (primero) primero.focus({ preventScroll: true });
        return ok;
    }

    function irAPaso(indice, enfocar = true) {
        actual = Math.max(0, Math.min(ultimo, indice));
        track.style.transform = `translateX(-${actual * 100}%)`;
        pasos.forEach((paso, i) => {
            const activo = i === actual;
            paso.classList.toggle('activo', activo);
            paso.toggleAttribute('inert', !activo);
            paso.setAttribute('aria-hidden', activo ? 'false' : 'true');
        });
        items.forEach((item, i) => {
            item.classList.toggle('activo', i === actual);
            item.classList.toggle('completo', i < actual);
        });
        if (linea) linea.classList.toggle('completa', actual > 0);
        btnAtras.hidden = actual === 0;
        btnSiguiente.hidden = actual === ultimo;
        btnEnviar.hidden = actual !== ultimo;
        ajustarAltura();
        if (enfocar) {
            const campo = pasos[actual].querySelector('input, select, textarea');
            setTimeout(() => campo && campo.focus({ preventScroll: true }), 350);
            const caja = formulario.closest('.cont_formulario_footer') || formulario;
            const arriba = caja.getBoundingClientRect().top;
            if (arriba < 0 || arriba > window.innerHeight * 0.4) {
                caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    btnSiguiente.addEventListener('click', () => {
        if (validarPaso(actual)) irAPaso(actual + 1);
    });
    btnAtras.addEventListener('click', () => irAPaso(actual - 1));

    // Enter en un campo del paso 1 avanza en vez de enviar
    formulario.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && actual < ultimo && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            btnSiguiente.click();
        }
    });

    // Permite volver tocando el paso 1 del indicador
    items.forEach((item, i) => {
        item.addEventListener('click', () => {
            if (i < actual) irAPaso(i);
            else if (i === actual + 1 && validarPaso(actual)) irAPaso(i);
        });
    });

    window.addEventListener('resize', ajustarAltura);
    if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(ajustarAltura);
        pasos.forEach(p => ro.observe(p));
    }
    formulario.addEventListener('reset', () => irAPaso(0, false));

    irAPaso(0, false);
}

const NUMERO_COTIZACION_URL = './api/cotizacion-numero.php';
const WHATSAPP_COTIZACION = '573107634934';
const FORM_SUBMIT_COTIZACION_URL = 'https://formsubmit.co/ajax/37075257ed4a709dc858706075d2037d';

function textoOpcionSelect(select) {
    if (!select || !select.value || !select.selectedOptions || !select.selectedOptions[0]) {
        return 'No indicado';
    }
    return select.selectedOptions[0].text.trim();
}

function textoLibre(valor, respaldo = 'No indicado') {
    const texto = String(valor || '').trim();
    return texto || respaldo;
}

async function recopilarDatosCotizacion(formulario) {
    const datos = new FormData(formulario);
    const canales = [
        datos.has('contacto_whatsapp') ? 'WhatsApp' : null,
        datos.has('contacto_llamada') ? 'Llamada' : null,
        datos.has('contacto_email') ? 'Correo electrónico' : null
    ].filter(Boolean);
    // Capturar los datos antes de esperar la respuesta del servidor.
    const cotizacion = {
        modalidad: textoOpcionSelect(formulario.elements.modalidad_contratacion),
        nombre: textoLibre(datos.get('nombre')),
        telefono: textoLibre(datos.get('telefono')),
        email: textoLibre(datos.get('email')),
        ciudad: textoLibre(datos.get('ciudad')),
        tipoProyecto: textoOpcionSelect(formulario.elements.tipo_proyecto),
        presupuesto: textoOpcionSelect(formulario.elements.presupuesto),
        tiempoProyecto: textoOpcionSelect(formulario.elements.tiempo_proyecto),
        descripcion: textoLibre(datos.get('descripcion'), 'Sin descripción adicional'),
        contactoPreferido: canales.length ? canales.join(', ') : 'Por definir',
        fecha: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' })
    };
    cotizacion.numero = await obtenerNumeroCotizacion(formulario);
    return cotizacion;
}


function armarMensajeWhatsApp(cotizacion) {
    return [
        '🏗️ *Nueva solicitud de cotización*',
        '*M&O Remodelaciones y Acabados*',
        '',
        `📅 ${cotizacion.fecha}`,
        `🔖 *N.º de cotización: ${cotizacion.numero}*`,
        '',
        '━━━━━━━━━━━━━━',
        '👤 *Datos del cliente*',
        `• Nombre: ${cotizacion.nombre}`,
        `• Teléfono: ${cotizacion.telefono}`,
        `• Correo: ${cotizacion.email}`,
        `• Ciudad: ${cotizacion.ciudad}`,
        '',
        '🏠 *Datos del proyecto*',
        `• Tipo: ${cotizacion.tipoProyecto}`,
        `• Modalidad: ${cotizacion.modalidad}`,
        `• Presupuesto: ${cotizacion.presupuesto}`,
        `• Tiempo deseado: ${cotizacion.tiempoProyecto}`,
        '',
        '📝 *Descripción*',
        cotizacion.descripcion,
        '',
        '📞 *Contacto preferido*',
        cotizacion.contactoPreferido,
        '',
        '━━━━━━━━━━━━━━',
        '_Enviado desde el formulario web_'
    ].join('\n');
}

function prepararVentanaWhatsAppCotizacion() {
    // Se abre antes de esperar al servidor para reducir bloqueos del navegador.
    let ventana = null;
    try {
        ventana = window.open('about:blank', '_blank');
        if (!ventana) return null;
        ventana.opener = null;
        ventana.document.title = 'Preparando tu solicitud';
        ventana.document.body.textContent = 'Estamos asignando el número de cotización. Espera un momento…';
        return ventana;
    } catch (error) {
        try { if (ventana) ventana.close(); } catch (ignorado) { /* No afecta al enlace manual. */ }
        return null;
    }
}

function abrirWhatsAppCotizacion(mensaje, ventana) {
    if (!ventana || ventana.closed) return false;
    try {
        ventana.location.replace('https://wa.me/' + WHATSAPP_COTIZACION + '?text=' + encodeURIComponent(mensaje));
        return true;
    } catch (error) {
        try { ventana.close(); } catch (ignorado) { /* El comprobante conserva el enlace manual. */ }
        return false;
    }
}


async function enviarCorreoCotizacion(cotizacion) {
    const respuesta = await fetch(FORM_SUBMIT_COTIZACION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            _subject: `Cotización ${cotizacion.numero} — ${cotizacion.nombre}`,
            numero_cotizacion: cotizacion.numero,
            modalidad_contratacion: cotizacion.modalidad,
            _template: 'table',
            _captcha: 'false',
            _honey: '',
            _replyto: cotizacion.email,
            nombre: cotizacion.nombre,
            telefono: cotizacion.telefono,
            correo: cotizacion.email,
            ciudad: cotizacion.ciudad,
            tipo_de_proyecto: cotizacion.tipoProyecto,
            presupuesto: cotizacion.presupuesto,
            tiempo_deseado: cotizacion.tiempoProyecto,
            descripcion: cotizacion.descripcion,
            contacto_preferido: cotizacion.contactoPreferido,
            fecha: cotizacion.fecha
        })
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo enviar el correo');
    }

    const resultado = await respuesta.json();
    if (resultado.success !== true && resultado.success !== 'true') {
        throw new Error(resultado.message || 'No se pudo enviar el correo');
    }
}

async function manejarEnvioFormulario(event) {
    event.preventDefault();
    const formulario = event.target;
    const btnEnviar = formulario.querySelector('.btn_enviar_formulario');
    if (!btnEnviar || btnEnviar.disabled) return;
    if (formulario.elements._honey && formulario.elements._honey.value.trim()) return;
    let esValido = true;
    formulario.querySelectorAll('input[required], select[required], textarea[required]').forEach(campo => {
        if (!validarCampo({ target: campo })) esValido = false;
    });
    if (!esValido) {
        mostrarNotificacion('Por favor, completa todos los campos requeridos, incluida la modalidad de contratación.', 'error');
        return;
    }
    btnEnviar.classList.add('loading');
    btnEnviar.disabled = true;
    formulario.setAttribute('aria-busy', 'true');
    const ventanaWhatsApp = prepararVentanaWhatsAppCotizacion();
    let cotizacion;
    try {
        cotizacion = await recopilarDatosCotizacion(formulario);
    } catch (error) {
        try { if (ventanaWhatsApp) ventanaWhatsApp.close(); } catch (ignorado) { /* No había una ventana accesible. */ }
        btnEnviar.classList.remove('loading');
        btnEnviar.disabled = false;
        formulario.removeAttribute('aria-busy');
        mostrarNotificacion('No pudimos asignar el número de cotización. Conservamos tus datos: espera un momento e inténtalo de nuevo. No se ha enviado esta solicitud.', 'error');
        return;
    }
    const mensajeWhatsApp = armarMensajeWhatsApp(cotizacion);
    const whatsappAbierto = abrirWhatsAppCotizacion(mensajeWhatsApp, ventanaWhatsApp);
    mostrarResultadoCotizacion(cotizacion, mensajeWhatsApp, 'Solicitud preparada. Estamos intentando enviarla por correo. En WhatsApp debes pulsar Enviar para completar el contacto.');
    let correoEnviado = false;
    try {
        await enviarCorreoCotizacion(cotizacion);
        correoEnviado = true;
    } catch (error) {
        correoEnviado = false;
    } finally {
        btnEnviar.classList.remove('loading');
        btnEnviar.disabled = false;
        formulario.removeAttribute('aria-busy');
    }
    let estado;
    if (correoEnviado) {
        formulario.reset();
        estado = 'El servicio de correo confirmó la recepción de tu solicitud. ' + (whatsappAbierto ? 'WhatsApp se abrió con la misma referencia: pulsa Enviar en el chat.' : 'También puedes usar el enlace de abajo para enviarla por WhatsApp.');
    } else {
        estado = 'No pudimos confirmar el envío por correo. Conservamos tus datos y el mismo número para reintentar. ' + (whatsappAbierto ? 'Pulsa Enviar en WhatsApp para completar el contacto.' : 'Usa el enlace de abajo para abrir WhatsApp y pulsa Enviar en el chat.');
    }
    mostrarResultadoCotizacion(cotizacion, mensajeWhatsApp, estado);
    mostrarNotificacion('Cotización ' + cotizacion.numero + '. ' + estado, correoEnviado ? 'success' : 'error');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    // Detectar si es móvil
    const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    // Estilos base
    let estilosBase = `
        position: fixed;
        background: ${tipo === 'success' ? 'var(--clr-segundario)' : '#ff6b6b'};
        color: ${tipo === 'success' ? 'var(--clr-principal)' : 'white'};
        padding: 0.9rem 1.2rem;
        border-radius: 0.6rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: inherit;
        font-weight: 500;
    `;
    
    // Ajustar posición según dispositivo
    if (esMobile) {
        estilosBase += `
            top: 10px;
            left: 10px;
            right: 10px;
            transform: translateY(-100%);
            max-width: none;
            text-align: center;
            font-size: 0.95rem;
        `;
    } else {
        estilosBase += `
            top: 20px;
            right: 20px;
            max-width: 24rem;
            font-size: 0.95rem;
        `;
    }
    
    notificacion.style.cssText = estilosBase;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        if (esMobile) {
            notificacion.style.transform = 'translateY(0)';
        } else {
            notificacion.style.transform = 'translateX(0)';
        }
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        if (esMobile) {
            notificacion.style.transform = 'translateY(-100%)';
        } else {
            notificacion.style.transform = 'translateX(100%)';
        }
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 5000);
    
    // Permitir cerrar con tap en móviles
    if (esMobile) {
        notificacion.addEventListener('click', () => {
            notificacion.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        });
    }
}

// Agregar inicialización del formulario a la función principal
document.addEventListener('DOMContentLoaded', inicializarFormulario);

// Optimización del evento de scroll con throttling
let isScrolling;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
          revelarElementosEnViewport();
            handleScrollAnimations();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Efecto parallax removido - las imágenes se mantienen fijas en su contenedor

// Efectos de hover mejorados para botones
document.querySelectorAll('.cont_boton_acerca, .boton_contacto').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-4px) scale(1.05)';
        button.style.boxShadow = '8px 8px 16px rgba(0, 0, 0, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.08)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '4px 4px 8px rgba(0, 0, 0, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.05)';
    });
    
    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(0) scale(0.98)';
        button.style.boxShadow = 'inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.05)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(-4px) scale(1.05)';
        button.style.boxShadow = '8px 8px 16px rgba(0, 0, 0, 0.25), -8px -8px 16px rgba(255, 255, 255, 0.08)';
    });
});

// Función para inicializar todo de manera segura
function inicializarAplicacion() {
    try {
    // Inicializar contadores
    iniciarContadores();
    
    // Aplicar clases de animación
    document.querySelectorAll('.titulo_landing, .parrafo_slogan_inicio, .titulo_slogan, .conte_botones').forEach((el, index) => {
            if (el) {
        el.classList.add('animate-on-scroll');
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.2}s`;
            }
    });
    
    // Inicializar las animaciones
    handleScrollAnimations();
    revelarElementosEnViewport();
    
    // Forzar una actualización después de un breve retraso
    setTimeout(handleScrollAnimations, 100);
    } catch (error) {
        console.warn('Error al inicializar la aplicación:', error);
    }
}

// Inicializar animaciones al cargar la página de manera segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacion);
} else {
    inicializarAplicacion();
}

// Manejo del menú de navegación inferior
function inicializarNavegacionInferior() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const bottomNav = document.querySelector('.bottom-nav');

    if (!navItems.length || !sections.length || !bottomNav) {
        return; // Salir si no hay elementos necesarios
    }

    // Función para actualizar el ítem activo del menú
    function updateActiveNavItem() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Manejar el scroll para actualizar el menú
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Mostrar/ocultar menú según la dirección del scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            bottomNav.style.transform = 'translate(-50%, 100%)';
        } else {
            bottomNav.style.transform = 'translate(-50%, 0)';
        }
        
        lastScroll = currentScroll;
        updateActiveNavItem();
    });

    // Manejar clicks en los ítems del menú
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
            // Scroll suave a la sección
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Actualizar ítem activo
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            }
        });
    });

    // Efecto de presión en los ítems del menú
    navItems.forEach(item => {
        item.addEventListener('mousedown', () => {
            item.style.transform = 'translateY(0) scale(0.95)';
        });

        item.addEventListener('mouseup', () => {
            item.style.transform = 'translateY(-2px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Inicializar el estado activo del menú
    updateActiveNavItem();
}

// Inicializar navegación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarNavegacionInferior);
} else {
    inicializarNavegacionInferior();
}

// === CONTROLES INDIVIDUALES PARA SLIDERS LEFT Y RIGHT ===
document.addEventListener('DOMContentLoaded', function () {
    function setupIndividualSliderControls(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const slide = container.querySelector('.slide');
        const slides = container.querySelectorAll('.slide .item-slide');
        const prevBtn = container.querySelector('.slider-nav.prev');
        const nextBtn = container.querySelector('.slider-nav.next');
        const dots = container.querySelectorAll('.pagination-item');
        const radios = container.querySelectorAll('input[type="radio"][name="image-slide"]');
        
        if (!slide || slides.length === 0) return;
        
        let current = 0;
        const total = slides.length;
        
        // Ensure slide container is flex
        slide.style.display = 'flex';
        slide.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        slides.forEach(s => {
            s.style.flex = '0 0 100%';
            s.style.width = '100%';
        });
        
        function showSlide(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            slide.style.transform = `translateX(-${index * 100}%)`;
            if (radios[index]) radios[index].checked = true;
            dots.forEach((dot, i) => {
                // The CSS handles active state via :checked, but we can add visual feedback
            });
            current = index;
        }
        
        // Prev button
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(current - 1);
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(current + 1);
            });
        }
        
        // Pagination dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showSlide(i));
        });
        
        // Radio inputs (keyboard/accessibility)
        radios.forEach((radio, i) => {
            radio.addEventListener('change', () => {
                if (radio.checked) showSlide(i);
            });
        });
        
        // Keyboard navigation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                showSlide(current - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                showSlide(current + 1);
            }
        });
        
        // Touch/swipe support
        let startX = 0;
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) showSlide(current + 1);
                else showSlide(current - 1);
            }
        }, { passive: true });
        
        // Initialize
        showSlide(0);
    }
    
    setupIndividualSliderControls('.cont_left_galeria');
    setupIndividualSliderControls('.cont_rigth_galeria');
    
    // Video slider (new structure)
    const videoSliderContainer = document.querySelector('.video_slider_container');
    if (videoSliderContainer) {
        const slide = videoSliderContainer.querySelector('.video_slider .slide');
        const slides = videoSliderContainer.querySelectorAll('.video_slider .slide .item-slide');
        const prevBtn = videoSliderContainer.querySelector('.slider-nav.prev');
        const nextBtn = videoSliderContainer.querySelector('.slider-nav.next');
        const dots = videoSliderContainer.querySelectorAll('.pagination .pagination-item');
        const radios = videoSliderContainer.querySelectorAll('input[type="radio"][name="video-slide"]');
        
        if (slide && slides.length > 0) {
            let current = 0;
            const total = slides.length;
            
            // Initialize slide position
            slide.style.display = 'flex';
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
            slide.style.transform = 'translateX(0)';
            
            slides.forEach(s => {
                s.style.flex = '0 0 100%';
                s.style.width = '100%';
                s.style.height = '100%';
            });
            
            function showSlide(index) {
                if (index < 0) index = total - 1;
                if (index >= total) index = 0;
                slide.style.transform = `translateX(-${index * 100}%)`;
                if (radios[index]) radios[index].checked = true;
                current = index;
                
                // Play current video, pause others
                slides.forEach((s, i) => {
                    const video = s.querySelector('video');
                    if (video) {
                        if (i === index) {
                            video.currentTime = 0;
                            video.play().catch(() => {});
                        } else {
                            video.pause();
                            video.currentTime = 0;
                        }
                    }
                });
            }
            
            if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); showSlide(current - 1); });
            if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); showSlide(current + 1); });
            dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
            radios.forEach((radio, i) => radio.addEventListener('change', () => { if (radio.checked) showSlide(i); }));
            
            // Keyboard
            videoSliderContainer.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(current - 1); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(current + 1); }
            });
            
            // Touch swipe
            let startX = 0;
            videoSliderContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
            videoSliderContainer.addEventListener('touchend', (e) => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { showSlide(diff > 0 ? current + 1 : current - 1); }
            }, { passive: true });
            
            showSlide(0);
        }
    }
    
    // Antes/Despues sliders (new structure)
    document.querySelectorAll('.comparacion_item').forEach(item => {
        const comparacionSlider = item.querySelector('.comparacion_slider');
        if (!comparacionSlider) return;
        
        const slide = comparacionSlider.querySelector('.slide');
        const slides = comparacionSlider.querySelectorAll('.slide .item-slide');
        const prevBtn = comparacionSlider.querySelector('.slider-nav.prev');
        const nextBtn = comparacionSlider.querySelector('.slider-nav.next');
        const dots = comparacionSlider.querySelectorAll('.pagination .pagination-item');
        const radios = item.querySelectorAll('input[type="radio"][name^="antes-slide"], input[type="radio"][name^="despues-slide"]');
        
        if (slide && slides.length > 0) {
            let current = 0;
            const total = slides.length;
            
            slide.style.display = 'flex';
            slide.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
            slides.forEach(s => {
                s.style.flex = '0 0 100%';
                s.style.width = '100%';
            });
            
            function showSlide(index) {
                if (index < 0) index = total - 1;
                if (index >= total) index = 0;
                slide.style.transform = `translateX(-${index * 100}%)`;
                if (radios[index]) radios[index].checked = true;
                current = index;
            }
            
            if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); showSlide(current - 1); });
            if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); showSlide(current + 1); });
            dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
            radios.forEach((radio, i) => radio.addEventListener('change', () => { if (radio.checked) showSlide(i); }));
            
            // Keyboard
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(current - 1); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(current + 1); }
            });
            
            // Touch swipe
            let startX = 0;
            item.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
            item.addEventListener('touchend', (e) => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { showSlide(diff > 0 ? current + 1 : current - 1); }
            }, { passive: true });
            
            showSlide(0);
        }
    });
});

// === SISTEMA DE RESEÑAS CON ESTRELLAS ===
document.addEventListener('DOMContentLoaded', function () {
    const formResena = document.getElementById('formResena');
    const contResenasLista = document.getElementById('contResenasLista');
    
    if (!formResena || !contResenasLista) return;

    // Cargar reseñas guardadas de localStorage
    function cargarResenas() {
        const resenasGuardadas = localStorage.getItem('myo_resenas');
        if (resenasGuardadas) {
            try {
                return JSON.parse(resenasGuardadas);
            } catch (e) {
                console.warn('Error al parsear reseñas guardadas');
                return [];
            }
        }
        return [];
    }

    // Guardar reseñas en localStorage
    function guardarResenas(resenas) {
        localStorage.setItem('myo_resenas', JSON.stringify(resenas));
    }

    // Renderizar lista de reseñas
    function renderizarResenas() {
        const resenas = cargarResenas();
        contResenasLista.innerHTML = '';
        
        if (resenas.length === 0) {
            contResenasLista.innerHTML = '<li class="sin_reseñas">Aún no hay reseñas. ¡Sé el primero en dejar la tuya!</li>';
            return;
        }

        // Mostrar las más recientes primero
        resenas.slice().reverse().forEach(resena => {
            const li = document.createElement('li');
            const estrellasLlenas = '★'.repeat(resena.calificacion);
            const estrellasVacias = '☆'.repeat(5 - resena.calificacion);
            const inicial = resena.nombre.trim().charAt(0).toUpperCase();
            const fecha = new Date(resena.fecha).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            li.innerHTML = `
                <div class="reseña_header">
                    <div class="reseña_avatar">${inicial}</div>
                    <span class="reseña_autor">${resena.nombre}</span>
                    <div class="reseña_estrellas">
                        ${[...estrellasLlenas].map(e => `<i>${e}</i>`).join('')}
                        ${[...estrellasVacias].map(e => `<i class="vacio">${e}</i>`).join('')}
                    </div>
                </div>
                <p class="reseña_texto">${resena.comentario}</p>
                <span class="reseña_fecha">${fecha}</span>
            `;
            contResenasLista.appendChild(li);
        });
    }

    // Manejar envío del formulario
    formResena.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre_reseña').value.trim();
        const calificacion = document.querySelector('input[name="calificacion"]:checked')?.value;
        const comentario = document.getElementById('comentario_reseña').value.trim();

        if (!nombre || !calificacion || !comentario) {
            mostrarNotificacionResena('Por favor completa todos los campos', 'error');
            return;
        }

        const nuevaResena = {
            nombre,
            calificacion: parseInt(calificacion),
            comentario,
            fecha: new Date().toISOString()
        };

        const resenas = cargarResenas();
        resenas.push(nuevaResena);
        guardarResenas(resenas);

        renderizarResenas();
        formResena.reset();

        mostrarNotificacionResena('¡Gracias por tu reseña!', 'success');
    });

    // Inicializar
    renderizarResenas();
});

// Función de notificación reutilizable para reseñas
function mostrarNotificacionResena(mensaje, tipo) {
    const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    let estilosBase = `
        position: fixed;
        background: ${tipo === 'success' ? 'var(--clr-segundario)' : '#ff6b6b'};
        color: ${tipo === 'success' ? 'var(--clr-principal)' : 'white'};
        padding: 0.9rem 1.2rem;
        border-radius: 0.6rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: inherit;
        font-weight: 500;
    `;
    
    if (esMobile) {
        estilosBase += `
            top: 10px;
            left: 10px;
            right: 10px;
            transform: translateY(-100%);
            max-width: none;
            text-align: center;
            font-size: 0.95rem;
        `;
    } else {
        estilosBase += `
            top: 20px;
            right: 20px;
            max-width: 24rem;
            font-size: 0.95rem;
        `;
    }
    
    notificacion.style.cssText = estilosBase;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        if (esMobile) {
            notificacion.style.transform = 'translateY(0)';
        } else {
            notificacion.style.transform = 'translateX(0)';
        }
    }, 100);
    
    setTimeout(() => {
        if (esMobile) {
            notificacion.style.transform = 'translateY(-100%)';
        } else {
            notificacion.style.transform = 'translateX(100%)';
        }
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 4000);
    
    if (esMobile) {
        notificacion.addEventListener('click', () => {
            notificacion.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        });
    }
}