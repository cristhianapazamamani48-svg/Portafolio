/**
 * PORTAFOLIO PROFESIONAL PREMIUM - LÓGICA DE INTERACTIVIDAD
 * Control de animaciones, tema de color, filtros e interactividad de formularios.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. TEMA DE COLOR (CLARO / OSCURO)
    // ==========================================================================
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    // Detectar preferencia de sistema
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Aplicar tema inicial
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Manejar evento de click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        if (currentTheme === 'dark') {
            newTheme = 'light';
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================================================
    // 2. EFECTO DE ESCRITURA DINÁMICA (TYPING EFFECT)
    // ==========================================================================
    const typingText = document.getElementById('typingText');
    const words = ['Fullstack', 'Backend', 'Software', 'Web'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Borrando caracteres
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Escribiendo caracteres
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }
        
        // Control de estados
        if (!isDeleting && charIndex === currentWord.length) {
            // Espera al terminar de escribir la palabra
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Iniciar animación si existe el elemento
    if (typingText) {
        setTimeout(type, 1000);
    }

    // ==========================================================================
    // 3. MENÚ DE NAVEGACIÓN MÓVIL (HAMBURGER)
    // ==========================================================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function toggleMenu() {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
        
        // Bloquear scroll cuando el menú móvil está abierto
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    hamburger.addEventListener('click', toggleMenu);
    
    // Cerrar menú al hacer clic en un link
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ==========================================================================
    // 4. ANIMACIONES DE REVELADO AL HACER SCROLL (SCROLL REVEAL)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Dejar de observar una vez que el elemento se revela
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.12, // Se activa cuando el 12% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Margen inferior para una activación fluida
    });
    
    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // 5. FILTRADO DINÁMICO DE PROYECTOS
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Cambiar clase activa del botón
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                
                // Animación de salida y entrada suave
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Pequeño timeout para activar la transición opacidad/escala en el navegador
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Esperar a que termine la animación antes de ocultar
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Ajustes iniciales en el estilo de las tarjetas para transición suave
    projectCards.forEach((card) => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });

    // ==========================================================================
    // 6. DETECTOR DE SECCIÓN ACTIVA EN LA NAVEGACIÓN (ACTIVE NAV HIGH LIGHT)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    const navCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    const navObserver = new IntersectionObserver(navCallback, {
        root: null,
        threshold: 0.5, // 50% de la sección debe estar visible
        rootMargin: '-50px 0px -50px 0px'
    });
    
    sections.forEach((section) => {
        navObserver.observe(section);
    });

    // ==========================================================================
    // 7. ENVÍO E INTERACTIVIDAD DEL FORMULARIO DE CONTACTO
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Estado de carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando...</span>';
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            
            // Obtener el action del formulario (Web3Forms/Formspree u otro)
            const actionUrl = contactForm.getAttribute('action');
            const formData = new FormData(contactForm);
            
            // Validar que la API key de Web3Forms no sea la por defecto
            const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
            if (accessKeyInput && accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
                // Modo demostración: Simula un envío exitoso si no hay clave real cargada
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '¡Mensaje de prueba enviado con éxito! (Modo demostración activo)';
                    contactForm.reset();
                }, 1200);
                return;
            }
            
            try {
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Envío exitoso
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
                    contactForm.reset();
                } else {
                    // Fallo devuelto por la API
                    throw new Error(data.message || 'Ocurrió un error al enviar el formulario.');
                }
            } catch (error) {
                // Error de red o código
                formStatus.className = 'form-status error';
                formStatus.textContent = error.message || 'No se pudo conectar con el servidor. Inténtalo más tarde.';
            } finally {
                submitBtn.disabled = false;
                if (formStatus.className !== 'form-status success') {
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }
});
