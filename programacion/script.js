// script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close Mobile Menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Form Submission Handling
    const appointmentForm = document.getElementById('appointmentForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetForm');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', () => {
            const btn = appointmentForm.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Enviando...';
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            appointmentForm.reset();
            formSuccess.classList.add('hidden');
            appointmentForm.classList.remove('hidden');
        });
    }

    // Set minimum date for appointment to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    // Wizard Modal Logic
    const wizardModal = document.getElementById('wizardModal');
    const closeWizard = document.getElementById('closeWizard');
    const navWizardBtn = document.getElementById('navWizardBtn');
    const heroWizardBtn = document.getElementById('heroWizardBtn');
    
    // Step Elements
    const steps = [
        document.getElementById('wizardStep1'),
        document.getElementById('wizardStep2'),
        document.getElementById('wizardStep3'),
        document.getElementById('wizardStep4')
    ];
    const indicators = document.querySelectorAll('.step-indicator');
    
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    
    let currentStep = 0; // 0-indexed corresponding to Step 1
    
    // Order State
    let selectedModel = null;
    let basePrice = 0;
    let selectedTechValue = 0;
    let selectedTechNames = [];
    
    const updateTotal = () => {
        const total = basePrice + selectedTechValue;
        document.getElementById('wizardTotalPrice').textContent = '$' + total.toLocaleString('en-US') + ' MXN';
    };

    const updateSummary = () => {
        // Modelo
        if (selectedModel) {
            document.getElementById('sumModelo').textContent = selectedModel;
            document.getElementById('sumModeloPrice').textContent = '$' + basePrice.toLocaleString('en-US') + ' MXN';
        }
        
        // Graduación
        const gradSiBtn = document.querySelector('.grad-btn[data-type="si"]');
        const gradSi = gradSiBtn ? gradSiBtn.classList.contains('active') : false;
        const gradNo = document.querySelector('.grad-btn[data-type="no"]').classList.contains('active');
        const gradText = document.getElementById('gradText').value.trim();
        
        if (gradSi) {
            document.getElementById('sumGrad').textContent = gradText ? "Receta provista" : "Pendiente de adjuntar receta";
        } else if (gradNo) {
            document.getElementById('sumGrad').textContent = "Necesitaré Examen";
        } else {
            document.getElementById('sumGrad').textContent = "No especificada";
        }
        
        // Tecnologías
        const techList = document.getElementById('sumTechList');
        techList.innerHTML = '';
        if (selectedTechNames.length === 0) {
            techList.innerHTML = '<li>Sin tratamientos adicionales</li>';
        } else {
            selectedTechNames.forEach(tech => {
                const li = document.createElement('li');
                li.textContent = tech;
                techList.appendChild(li);
            });
        }
        
        updateTotal();
    };

    const navigateStep = (targetStep) => {
        // Hide all steps
        steps.forEach((step, idx) => {
            if (idx === targetStep) {
                step.classList.remove('hidden');
                step.classList.add('active');
            } else {
                step.classList.add('hidden');
                step.classList.remove('active');
            }
        });
        
        // Update indicators
        indicators.forEach((ind, idx) => {
            if (idx <= targetStep) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
        
        // Update buttons
        btnPrev.classList.toggle('hidden', targetStep === 0);
        
        if (targetStep === steps.length - 1) {
            btnNext.textContent = 'Finalizar Pedido';
            updateSummary();
        } else {
            btnNext.textContent = 'Siguiente';
            // Disable Next if on Step 1 and no model selected
            if (targetStep === 0 && !selectedModel) {
                btnNext.disabled = true;
            } else {
                btnNext.disabled = false;
            }
        }
        
        currentStep = targetStep;
    };

    const openWizard = () => {
        wizardModal.classList.add('active');
        navigateStep(currentStep); // Open at current step
    };

    // Open events
    if (navWizardBtn) navWizardBtn.addEventListener('click', openWizard);
    if (heroWizardBtn) heroWizardBtn.addEventListener('click', openWizard);
    
    // Override product cards to open wizard and pre-select
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('h3').textContent;
            // Find corresponding mini catalog item
            const miniProducts = document.querySelectorAll('.mini-product');
            miniProducts.forEach(mp => {
                if(mp.dataset.name === name) {
                    mp.click();
                }
            });
            openWizard(); // Opens wizard pre-selected to step 1
        });
    });
    
    // Close events
    if (closeWizard) closeWizard.addEventListener('click', () => wizardModal.classList.remove('active'));
    if (wizardModal) {
        wizardModal.addEventListener('click', (e) => {
            if (e.target === wizardModal) {
                wizardModal.classList.remove('active');
            }
        });
    }
    
    // Navigation events
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                navigateStep(currentStep + 1);
            } else {
                // Final step action: Enviar vía FormSubmit (Formulario Oculto)
                const oName = document.getElementById('orderName').value.trim();
                const oPhone = document.getElementById('orderPhone').value.trim();
                
                if (!oName || !oPhone) {
                    alert('Por favor, rellena tu nombre y número de teléfono para procesar tu pedido.');
                    return;
                }

                btnNext.textContent = 'Procesando...';
                btnNext.disabled = true;

                // Llenar el formulario oculto
                document.getElementById('hidden_oName').value = oName;
                document.getElementById('hidden_oPhone').value = oPhone;
                document.getElementById('hidden_oModel').value = selectedModel;
                document.getElementById('hidden_oGrad').value = document.getElementById('sumGrad').textContent;
                document.getElementById('hidden_oReceta').value = document.getElementById('gradText').value.trim();
                document.getElementById('hidden_oTech').value = selectedTechNames.length > 0 ? selectedTechNames.join(', ') : 'Ninguna';
                document.getElementById('hidden_oTotal').value = document.getElementById('wizardTotalPrice').textContent;

                // Enviar el formulario oculto (esto hará que llegue al Gmail)
                document.getElementById('hiddenOrderForm').submit();
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentStep > 0) {
                navigateStep(currentStep - 1);
            }
        });
    }

    // Step 1: Model Selection
    const miniProducts = document.querySelectorAll('.mini-product');
    miniProducts.forEach(prod => {
        prod.addEventListener('click', () => {
            // Deselect others
            miniProducts.forEach(p => p.classList.remove('selected'));
            // Select current
            prod.classList.add('selected');
            selectedModel = prod.dataset.name;
            basePrice = parseInt(prod.dataset.price);
            if (currentStep === 0) {
                btnNext.disabled = false; // Enable next
            }
            updateTotal();
        });
    });

    // Step 2: Graduation
    const gradBtns = document.querySelectorAll('.grad-btn');
    gradBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gradBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.type === 'si') {
                document.getElementById('graduacionSi').classList.remove('hidden');
                document.getElementById('graduacionNo').classList.add('hidden');
            } else {
                document.getElementById('graduacionNo').classList.remove('hidden');
                document.getElementById('graduacionSi').classList.add('hidden');
            }
        });
    });

    // Step 3: Technologies
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            
            // Recalculate added tech value
            selectedTechValue = 0;
            selectedTechNames = [];
            document.querySelectorAll('.tech-card.selected').forEach(selectedCard => {
                selectedTechValue += parseInt(selectedCard.dataset.price);
                selectedTechNames.push(selectedCard.dataset.name || "Tratamiento");
            });
            
            updateTotal();
        });
    });
});
