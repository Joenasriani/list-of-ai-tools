document.addEventListener('DOMContentLoaded', () => {
    
    // === Icon Mapping for Categories ===
    // Maps your category names to Font Awesome icons
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

    /**
     * Renders the entire tool catalog based on the provided tool data.
     * @param {Array} tools - An array of tool objects to render.
     */
    function renderCatalog(tools) {
        // Clear existing content
        toolCatalog.innerHTML = '';
        sidebarLinksContainer.innerHTML = '';

        if (tools.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }
        noResultsMessage.style.display = 'none';

        // 1. Group tools by category and subcategory
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

        // 2. Build and inject the HTML
        for (const [categoryName, subcategories] of categories.entries()) {
            
            // Create ID for linking (e.g., "Business & Enterprise AI" -> "business-enterprise-ai")
            const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const iconClass = categoryIcons[categoryName] || 'fa-solid fa-atom'; // Default icon

            // A. Create Sidebar Link
            const sidebarLink = document.createElement('li');
            sidebarLink.innerHTML = `<a href="#${categoryId}"><i class="${iconClass}"></i> ${categoryName}</a>`;
            sidebarLinksContainer.appendChild(sidebarLink);

            // B. Create Main Category Section
            const categorySection = document.createElement('section');
            categorySection.id = categoryId;
            categorySection.className = 'category-section';
            
            const categoryHeader = document.createElement('h2');
            categoryHeader.innerHTML = `<i class="${iconClass}"></i> ${categoryName}`;
            categorySection.appendChild(categoryHeader);

            // C. Create Subcategory Sections
            for (const [subcategoryName, toolList] of subcategories.entries()) {
                const subcategoryTitle = document.createElement('h3');
                subcategoryTitle.className = 'subcategory-title';
                subcategoryTitle.textContent = subcategoryName;
                categorySection.appendChild(subcategoryTitle);

                const toolGrid = document.createElement('div');
                toolGrid.className = 'tool-grid';

                // D. Create Tool Cards
                toolList.forEach(tool => {
                    const toolCard = document.createElement('div');
                    toolCard.className = 'tool-card';
                    toolCard.innerHTML = `
                        <h4>${tool.name}</h4>
                        <p>${tool.description}</p>
                        <a href="${tool.url}" target="_blank" class="tool-link">
                            Visit Site <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    `;
                    toolGrid.appendChild(toolCard);
                });

                categorySection.appendChild(toolGrid);
            }
            toolCatalog.appendChild(categorySection);
        }
        
        // Re-add mobile sidebar link functionality
        addSidebarLinkListeners();
    }

    /**
     * Filters the master tool list based on the search term.
     * @param {string} searchTerm - The text to search for.
     * @returns {Array} - A filtered array of tool objects.
     */
    function filterTools(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        return toolsData.filter(tool => {
            const nameMatch = tool.name.toLowerCase().includes(searchTerm);
            const descriptionMatch = tool.description.toLowerCase().includes(searchTerm);
            const categoryMatch = tool.category.toLowerCase().includes(searchTerm);
            const subcategoryMatch = tool.subcategory.toLowerCase().includes(searchTerm);
            return nameMatch || descriptionMatch || categoryMatch || subcategoryMatch;
        });
    }

    // === Event Listeners ===

    // 1. Live Search
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value;
        const filteredTools = filterTools(searchTerm);
        renderCatalog(filteredTools);
    });

    // 2. Mobile Sidebar Toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // 3. Close sidebar on link click (for mobile)
    function addSidebarLinkListeners() {
        const sidebarLinks = document.querySelectorAll('.sidebar-links a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }

    // === Initial Page Load ===
    // Render the full catalog when the page first loads
    renderCatalog(toolsData);
});
