// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
    }
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav') && !event.target.closest('.menu-toggle')) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Données des codes parrainage (simulées)
    const codesData = [
        {
            id: 1,
            merchant: "Deliveroo",
            code: "DELIVEROO15",
            description: "15€ de réduction sur votre première commande de plus de 25€",
            category: "Nourriture",
            expiry: "30/09/2024",
            uses: 189,
            successRate: 97,
            icon: "fas fa-utensils",
            featured: false
        },
        {
            id: 2,
            merchant: "Booking",
            code: "BOOKING10",
            description: "10% de réduction sur votre réservation d'hôtel",
            category: "Voyage",
            expiry: "31/08/2024",
            uses: 312,
            successRate: 95,
            icon: "fas fa-hotel",
            featured: true
        },
        {
            id: 3,
            merchant: "Sephora",
            code: "SEPHORA20",
            description: "20% de réduction sur votre première commande",
            category: "Beauté",
            expiry: "15/08/2024",
            uses: 145,
            successRate: 92,
            icon: "fas fa-paint-brush",
            featured: false
        },
        {
            id: 4,
            merchant: "Netflix",
            code: "NETFLIX1MOIS",
            description: "1 mois d'abonnement gratuit à Netflix",
            category: "Divertissement",
            expiry: "30/07/2024",
            uses: 421,
            successRate: 99,
            icon: "fas fa-film",
            featured: false
        }
    ];
    
    // Générer les nouveaux codes
    const codesContainer = document.getElementById('codesContainer');
    
    function generateCodeCards(codes) {
        if (!codesContainer) return;
        
        codesContainer.innerHTML = '';
        
        codes.forEach(code => {
            const codeCard = document.createElement('div');
            codeCard.className = `code-card ${code.featured ? 'featured' : ''}`;
            
            const timeAgo = Math.floor(Math.random() * 7) + 1;
            const timeUnit = timeAgo === 1 ? 'jour' : 'jours';
            
            codeCard.innerHTML = `
                <div class="code-header">
                    <div class="merchant-logo">
                        <i class="${code.icon}"></i>
                    </div>
                    <div class="merchant-info">
                        <h3>${code.merchant}</h3>
                        <div class="category-tag">${code.category}</div>
                    </div>
                    <div class="code-expiry">
                        <span class="expiry-badge">Valide jusqu'au ${code.expiry}</span>
                    </div>
                </div>
                <div class="code-description">
                    <p>${code.description}</p>
                </div>
                <div class="code-actions">
                    <div class="code-display">
                        <span id="code-${code.merchant.toLowerCase()}">${code.code}</span>
                        <button class="copy-btn" data-code="${code.code}" aria-label="Copier le code ${code.code}">
                            <i class="far fa-copy"></i> Copier
                        </button>
                    </div>
                    <a href="#" target="_blank" rel="noopener noreferrer" class="shop-btn">
                        <i class="fas fa-external-link-alt"></i> Aller sur le site
                    </a>
                </div>
                <div class="code-stats">
                    <span><i class="far fa-clock"></i> Il y a ${timeAgo} ${timeUnit}</span>
                    <span><i class="far fa-user"></i> ${code.uses} utilisations</span>
                    <span><i class="far fa-thumbs-up"></i> ${code.successRate}% de réussite</span>
                </div>
            `;
            
            codesContainer.appendChild(codeCard);
        });
        
        // Ajouter les événements de copie pour les nouveaux codes
        attachCopyEvents();
    }
    
    // Initialiser les codes
    generateCodeCards(codesData);
    
    // Fonction pour copier un code dans le presse-papier
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Code copié dans le presse-papier !');
        }, function(err) {
            // Fallback pour les anciens navigateurs
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Code copié dans le presse-papier !');
        });
    }
    
    // Attacher les événements de copie
    function attachCopyEvents() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                copyToClipboard(code);
            });
        });
    }
    
    // Initialiser les événements de copie pour les codes existants
    attachCopyEvents();
    
    // Notification
    function showNotification(message) {
        const notification = document.getElementById('copyNotification');
        if (!notification) return;
        
        notification.querySelector('p').textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Recherche
    const searchForm = document.querySelector('.search-box form');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm) {
                // Filtrer les codes basés sur la recherche
                const filteredCodes = codesData.filter(code => 
                    code.merchant.toLowerCase().includes(searchTerm) || 
                    code.category.toLowerCase().includes(searchTerm) ||
                    code.description.toLowerCase().includes(searchTerm)
                );
                
                // Si des résultats sont trouvés
                if (filteredCodes.length > 0) {
                    generateCodeCards(filteredCodes);
                    showNotification(`${filteredCodes.length} code(s) trouvé(s) pour "${searchTerm}"`);
                } else {
                    // Aucun résultat
                    codesContainer.innerHTML = `
                        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                            <i class="fas fa-search" style="font-size: 48px; color: #9ca3af; margin-bottom: 20px;"></i>
                            <h3 style="margin-bottom: 10px;">Aucun code trouvé</h3>
                            <p>Aucun code ne correspond à votre recherche "${searchTerm}".</p>
                        </div>
                    `;
                }
            }
        });
    }
    
    // Filtrage par catégories
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('span').textContent;
            
            // Filtrer par catégorie
            const filteredCodes = codesData.filter(code => 
                code.category.toLowerCase().includes(category.split(' ')[0].toLowerCase())
            );
            
            if (filteredCodes.length > 0) {
                generateCodeCards(filteredCodes);
                showNotification(`Codes de la catégorie "${category}"`);
                
                // Faire défiler jusqu'aux résultats
                document.getElementById('nouveautes').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation des statistiques
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace('k', '000').replace('M', '000000'));
            const suffix = stat.textContent.includes('k') ? 'k' : stat.textContent.includes('M') ? 'M€' : '';
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                let displayValue;
                if (suffix === 'k') {
                    displayValue = (current / 1000).toFixed(1).replace('.0', '') + 'k';
                } else if (suffix === 'M€') {
                    displayValue = (current / 1000000).toFixed(1).replace('.0', '') + 'M€';
                } else {
                    displayValue = Math.floor(current);
                }
                
                stat.textContent = displayValue;
            }, 20);
        });
    }
    
    // Lancer l'animation des statistiques quand elles entrent dans la vue
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-header');
    if (statsSection) {
        observer.observe(statsSection);
    }
});