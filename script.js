document.addEventListener('DOMContentLoaded', () => {
    
    // Check if toolsData loaded
    if (typeof toolsData !== 'undefined' && toolsData.length > 0) {
        initializeApp();
    } else {
        console.error("FATAL ERROR: `toolsData` is not defined or is empty.");
    }

});

// Contains all application logic
function initializeApp() {

    // === Icon Mapping ===
    const categoryIcons = {
        "Business & Enterprise AI": "fa-solid fa-briefcase",
        "Productivity & Collaboration": "fa-solid fa-gears",
        "Generative Media (Creative AI)": "fa-solid fa-palette",
        "Development & Technical AI": "fa-solid fa-code",
        "XR, 3D & Game Development": "fa-solid fa-vr-cardboard"
    };

    // === Get DOM Elements ===
    const toolCatalog = document.getElementById('tool-catalog');
    const sidebarLinksContainer = document.getElementById('sidebar-links');
    const searchBar = document.getElementById('search-bar');
    const noResultsMessage = document.getElementById('no-results-message');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const backToTopButton = document.getElementById('back-to-top');

    /**
     * Renders the entire tool catalog.
     */
    function renderCatalog(tools) {
        toolCatalog.innerHTML = ''; // Clear previous results
        sidebarLinksContainer.innerHTML = '';
        
        let cardAnimationDelayIndex = 0;

        if (tools.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }
        noResultsMessage.style.display = 'none';

        // 1. Group tools
        const categories = new Map();
        tools.forEach(tool => {
            if (!categories.has(tool.category)) {
                categories.set(tool.category, new Map());
            }
            if (!categories.get(tool.category).has(tool.subcategory)) {
                categories.get(tool.category).set(tool.subcategory, []);
            }
            categories.get(tool.category).get(tool.subcategory).push(tool);
        });

        // 2. Build HTML
        let isFirstCategory = true;
        for (const [categoryName, subcategories] of categories.entries()) {
            
            const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const iconClass = categoryIcons[categoryName] || 'fa-solid fa-atom';

            // A. Sidebar Link
            const sidebarLink = document.createElement('li');
            sidebarLink.innerHTML = `<a href="#${categoryId}"><i class="${iconClass}"></i> ${categoryName}</a>`;
            sidebarLinksContainer.appendChild(sidebarLink);

            // B. Category Section
            const categorySection = document.createElement('section');
            categorySection.id = categoryId;
            // First category starts expanded (no .collapsed class)
            categorySection.className = isFirstCategory ? 'category-section' : 'category-section collapsed';

            // C. Category Header (Clickable Title)
            const categoryHeader = document.createElement('h2');
            categoryHeader.innerHTML = `
                <span><i class="${iconClass}"></i> ${categoryName}</span>
                <i class="fa-solid fa-chevron-down collapse-chevron"></i> 
            `;
            // Add click listener to toggle collapse
            categoryHeader.addEventListener('click', () => {
                categorySection.classList.toggle('collapsed');
            });
            categorySection.appendChild(categoryHeader);

            // D. Content Wrapper (This collapses/expands)
            const categoryContent = document.createElement('div');
            categoryContent.className = 'category-content';

            // E. Subcategories & Grids
            for (const [subcategoryName, toolList] of subcategories.entries()) {
                const subcategoryTitle = document.createElement('h3');
                subcategoryTitle.className = 'subcategory-title';
                subcategoryTitle.textContent = subcategoryName;
                categoryContent.appendChild(subcategoryTitle); 

                const toolGrid = document.createElement('div');
                toolGrid.className = 'tool-grid';

                // F. Tool Cards
                toolList.forEach(tool => {
                    const toolCard = document.createElement('div');
                    toolCard.className = 'tool-card';
                    toolCard.style.animationDelay = `${cardAnimationDelayIndex * 0.04}s`;
                    cardAnimationDelayIndex++;
                    
                    toolCard.innerHTML = `
                        <h4>${tool.name}</h4>
                        <p>${tool.description}</p>
                        <a href="${tool.url}" target="_blank" class="tool-link">
                            Visit Site <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    `;
                    toolGrid.appendChild(toolCard);
                });
                categoryContent.appendChild(toolGrid); 
            }
            categorySection.appendChild(categoryContent); 
            toolCatalog.appendChild(categorySection); 
            
            isFirstCategory = false; 
        }
        
        addSidebarLinkListeners();
    }

    // === Event Listeners ===

    // 1. Live Search
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredTools = toolsData.filter(tool => {
            return tool.name.toLowerCase().includes(searchTerm) ||
                   tool.description.toLowerCase().includes(searchTerm);
        });
        
        // When searching, re-render and expand all categories
        renderCatalog(filteredTools);
        document.querySelectorAll('.category-section').forEach(section => {
             section.classList.remove('collapsed'); // Expand all when searching
        });
    });

    // 2. Mobile Sidebar Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (sidebar) sidebar.classList.toggle('active');
        });
    }

    // 3. Close sidebar on link click (for mobile)
    function addSidebarLinkListeners() {
        sidebarLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900 && sidebar) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }

    // 4. Back to Top Button Listeners
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // === Initial Page Load ===
    if (toolCatalog && sidebarLinksContainer && searchBar && noResultsMessage) {
        renderCatalog(toolsData); // Render the full catalog
    } else {
        console.error("Initialization failed: One or more critical HTML elements are missing.");
    }
}
