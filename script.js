// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // === Mobile Sidebar Toggle ===
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when a link is clicked on mobile
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                sidebar.classList.remove('active');
            }
        });
    });

    // === Live Search Functionality ===
    const searchBar = document.getElementById('search-bar');
    const toolCards = document.querySelectorAll('.tool-card');
    const categorySections = document.querySelectorAll('.category-section');
    const subcategoryTitles = document.querySelectorAll('.subcategory-title');
    const noResultsMessage = document.getElementById('no-results-message');

    if (searchBar) {
        searchBar.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let visibleCardsCount = 0;

            // 1. Filter individual tool cards
            toolCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const cardText = title + description;

                if (cardText.includes(searchTerm)) {
                    card.style.display = 'flex'; // Show card
                    visibleCardsCount++;
                } else {
                    card.style.display = 'none'; // Hide card
                }
            });

            // 2. Filter subcategory titles
            subcategoryTitles.forEach(title => {
                // Find the next .tool-grid
                const grid = title.nextElementSibling;
                if (grid && grid.classList.contains('tool-grid')) {
                    // Check if any children (cards) in this grid are visible
                    const visibleCardsInGrid = grid.querySelectorAll('.tool-card[style*="display: flex"]').length;
                    
                    if (visibleCardsInGrid > 0) {
                        title.style.display = 'block'; // Show sub-title
                    } else {
                        title.style.display = 'none'; // Hide sub-title
                    }
                }
            });

            // 3. Filter main category sections
            categorySections.forEach(section => {
                // Check if any children (cards) in this section are visible
                const visibleCardsInSection = section.querySelectorAll('.tool-card[style*="display: flex"]').length;
                
                if (visibleCardsInSection > 0) {
                    section.style.display = 'block'; // Show section
                } else {
                    section.style.display = 'none'; // Hide section
                }
            });

            // 4. Show 'No Results' message if no cards are visible at all
            if (visibleCardsCount === 0) {
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
            }
        });
    }
});
