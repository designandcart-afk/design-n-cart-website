document.addEventListener('DOMContentLoaded', function() {
    
    // --- Configuration ---
    const GOOGLE_SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypSOyP9ptcbDozbsCqrLQ79kiMWWE0HfWiAS8_YD5rryx-1TkvFZPw5Z2dKnxPBByY/exec'; 

    // --- Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const menu = document.querySelector('.menu-list');
    const closeBtn = document.querySelector('.close-menu-btn');

    if (hamburger && menu && closeBtn) {
        const openMenu = () => menu.classList.add('active');
        const closeMenu = () => menu.classList.remove('active');

        hamburger.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
    }

    // --- Scroll Animation Logic ---
    const animatedElements = document.querySelectorAll('.fade-in-section');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => observer.observe(element));
    }

    // --- Accordion Logic for About Page ---
    const accordionTriggers = document.querySelectorAll('.collapsible-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const parentItem = this.parentElement;
            
            const allItems = document.querySelectorAll('.collapsible-item');
            allItems.forEach(item => {
                if (item !== parentItem && item.classList.contains('is-open')) {
                    item.classList.remove('is-open');
                }
            });

            parentItem.classList.toggle('is-open');
        });
    });
    
    // --- Multi-Step Conditional Form Logic ---
    const multiStepForm = document.getElementById('multi-step-form');
    
    if (multiStepForm) {
        const formSteps = Array.from(multiStepForm.querySelectorAll('.form-step'));
        const nextBtns = multiStepForm.querySelectorAll('.next-btn');
        const backBtns = multiStepForm.querySelectorAll('.back-btn');
        const confirmationMessage = document.getElementById('confirmation-message');
        
        let currentStep = 0;

        const showStep = (stepIndex) => {
            formSteps.forEach((step, index) => {
                step.classList.toggle('active-step', index === stepIndex);
            });
        };

        const handleRoleChange = () => {
            // Find which radio button is checked in the first step
            const selectedRoleInput = formSteps[0].querySelector('input[name="Role"]:checked');
            if (!selectedRoleInput) return; 

            const selectedRole = selectedRoleInput.value;
            
            // Hide all conditional groups in the second step
            formSteps[1].querySelectorAll('.conditional-group').forEach(group => {
                group.style.display = 'none';
            });

            // Show the correct one based on the selected value
            if (selectedRole === 'Designer') {
                document.getElementById('designer-questions').style.display = 'block';
            } else if (selectedRole === 'Vendor') {
                document.getElementById('vendor-questions').style.display = 'block';
            } else if (selectedRole === 'Other') {
                document.getElementById('other-questions').style.display = 'block';
            }
        };

        nextBtns.forEach(button => {
            button.addEventListener('click', () => {
                // Validation for current step
                const currentStepElement = formSteps[currentStep];
                const currentStepInputs = currentStepElement.querySelectorAll('[required]');
                let isValid = true;
                currentStepInputs.forEach(input => {
                    if (input.type === 'radio') {
                        const radioGroup = currentStepElement.querySelector(`input[name="${input.name}"]:checked`);
                        if (!radioGroup) {
                           isValid = false;
                        }
                    } else if (!input.value.trim()) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    alert('Please fill out all required fields before proceeding.');
                    return;
                }
                
                // If we are on the first step, determine which questions to show next
                if (currentStep === 0) {
                    handleRoleChange();
                }
                
                if (currentStep < formSteps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        });

        backBtns.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });

        multiStepForm.addEventListener('submit', e => {
            e.preventDefault();
            const submitButton = multiStepForm.querySelector('.form-submit-btn');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            if (GOOGLE_SHEET_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                alert('Form submission is not configured. Please contact the site administrator.');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
                return;
            }

            fetch(GOOGLE_SHEET_SCRIPT_URL, { method: 'POST', body: new FormData(multiStepForm)})
                .then(response => {
                    if (response.ok) {
                        multiStepForm.style.display = 'none';
                        confirmationMessage.style.display = 'block';
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('An error occurred while submitting the form. Please try again later.');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit';
                });
        });

        // Initially hide all conditional question groups in the second step
        if(formSteps.length > 1) {
            formSteps[1].querySelectorAll('.conditional-group').forEach(group => {
                group.style.display = 'none';
            });
        }
    }
});