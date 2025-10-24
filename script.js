// This function contains all the application logic
function initializeApp() {

    // === Icon Mapping for Categories ===
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
    const filterTagsContainer = document.getElementById('filter-tags');
    const backToTopButton = document.getElementById('back-to-top');

    // Store all subcategories for tag generation
    const allSubcategories = [...new Set(toolsData.map(tool => tool.subcategory))].sort();

    /**
     * Renders the entire tool catalog based on the provided tool data.
     */
    function renderCatalog(tools) {
        // Clear only the tool content, not the tag header
        toolCatalog.querySelectorAll('.category-section').forEach(el => el.remove());
        sidebarLinksContainer.innerHTML = '';
        
        let cardAnimationDelayIndex = 0; // For staggered animation

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
            
            const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const iconClass = categoryIcons[categoryName] || 'fa-solid fa-atom';

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
                    
                    // Apply staggered animation delay
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

                categorySection.appendChild(toolGrid);
            }
            toolCatalog.appendChild(categorySection);
        }
        
        addSidebarLinkListeners();
    }

    /**
     * Generates the clickable filter tags
     */
    function renderFilterTags() {
        filterTagsContainer.innerHTML = ''; // Clear existing tags
        
        // 1. Create "All" tag
        const allTag = document.createElement('button');
        allTag.className = 'filter-tag active'; // Active by default
        allTag.textContent = 'All Tools';
        allTag.dataset.filter = 'All';
        filterTagsContainer.appendChild(allTag);

        // 2. Create tags for each subcategory
        allSubcategories.forEach(subcategory => {
            const tag = document.createElement('button');
            tag.className = 'filter-tag';
            tag.textContent = subcategory;
            tag.dataset.filter = subcategory;
            filterTagsContainer.appendChild(tag);
        });

        // 3. Add click listener to the tag container (event delegation)
        filterTagsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                handleTagClick(e.target);
            }
        });
    }

    /**
     * Handles the logic when a filter tag is clicked
     */
    function handleTagClick(clickedTag) {
        // 1. Update active state
        filterTagsContainer.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        clickedTag.classList.add('active');

        // 2. Get filter value and clear search bar
        const filter = clickedTag.dataset.filter;
        searchBar.value = ''; // Clear search

        // 3. Filter tools and re-render
        let filteredTools;
        if (filter === 'All') {
            filteredTools = toolsData;
        } else {
            filteredTools = toolsData.filter(tool => tool.subcategory === filter);
        }
        renderCatalog(filteredTools);
    }

    // === Event Listeners ===

    // 1. Live Search
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Deactivate all tags
        filterTagsContainer.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        
        // Activate "All" tag
        const allTag = filterTagsContainer.querySelector('.filter-tag[data-filter="All"]');
        if (allTag) {
            allTag.classList.add('active');
        }

        // Filter and re-render
        const filteredTools = toolsData.filter(tool => {
            return tool.name.toLowerCase().includes(searchTerm) ||
                   tool.description.toLowerCase().includes(searchTerm);
        });
        renderCatalog(filteredTools);
    });

    // 2. Mobile Sidebar Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 3. Close sidebar on link click (for mobile)
    function addSidebarLinkListeners() {
        sidebarLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // === Initial Page Load ===
    // Check if all elements exist before running
    if (toolCatalog && sidebarLinksContainer && searchBar && noResultsMessage && filterTagsContainer) {
        renderFilterTags();   // Build the tags once
        renderCatalog(toolsData); // Render the full catalog
    } else {
        console.error("Initialization failed: One or more critical HTML elements are missing.");
    }
}

// === NEW ROBUST STARTUP CHECK ===
// This waits for the HTML (DOMContentLoaded) and THEN checks if 'tools.js' loaded.
document.addEventListener('DOMContentLoaded', () => {
    
    // Check if toolsData (from tools.js) exists.
    if (typeof toolsData !== 'undefined' && toolsData.length > 0) {
        // If yes, run the app.
        initializeApp();
    } else {
        // If no, report the critical error.
        console.error('FATAL ERROR: `toolsData` is not defined or is empty.');
        console.error('This means the `tools.js` file failed to load or is empty. Check the file path and network tab.');
        // You could even write this error to the page
        document.body.innerHTML = `<div style="color: red; font-size: 24px; padding: 40px; font-family: sans-serif;">
            FATAL ERROR: Could not load tool database. <br>
            Please check the browser console (Right-click > Inspect > Console) for details.
            </div>`;
    }
});
