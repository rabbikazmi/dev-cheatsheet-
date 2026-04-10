// reference to dom elements
var cardsContainer = document.getElementById('cardsContainer');
var noResults = document.getElementById('noResults');
var searchInput = document.getElementById('searchInput');
var filterButtons = document.querySelectorAll('.filter-btn');
var clearBtn = document.getElementById('clearBtn');
var backToTopBtn = document.getElementById('backToTop');

// --- Favorites Logic ---
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('cheatsheet-favorites') || '[]');
    } catch (e) {
        return [];
    }
}

function saveFavorites(favs) {
    localStorage.setItem('cheatsheet-favorites', JSON.stringify(favs));
}

function isFavorite(title) {
    return getFavorites().includes(title);
}

function toggleFavorite(title) {
    var favs = getFavorites();
    var idx = favs.indexOf(title);
    if (idx === -1) {
        favs.push(title);
    } else {
        favs.splice(idx, 1);
    }
    saveFavorites(favs);
    return idx === -1; // true if just added
}

// set snippet count badge
var snippetBadge = document.getElementById('snippetBadge');
if (snippetBadge) {
    snippetBadge.textContent = cheatsheetData.length + ' snippets';
}

// track the current active filter and search term
var currentFilter = 'all';
var currentSearchTerm = '';

// update count for each category button
function updateCounts() {
    var categories = ['all', 'git', 'terminal', 'javascript', 'css', 'react', 'sql'];
    categories.forEach(function(category) {
        var countEl = document.getElementById('count-' + category);
        if (countEl) {
            if (category === 'all') {
                countEl.textContent = cheatsheetData.length;
            } else {
                var count = cheatsheetData.filter(function(item) {
                    return item.category === category;
                }).length;
                countEl.textContent = count;
            }
        }
    });
    // update favorites count
    var favCountEl = document.getElementById('count-favorites');
    if (favCountEl) {
        favCountEl.textContent = getFavorites().length;
    }
}

// initialize the app when page loads
function initializeApp() {
    // render all cards on initial load
    renderCards(cheatsheetData);

    // update counts on load
    updateCounts();
    
    // add event listener for search input
    searchInput.addEventListener('keyup', handleSearch);

    // show or hide clear button based on input
    searchInput.addEventListener('input', function() {
        if (searchInput.value.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    });

    // clear input when × is clicked
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        currentSearchTerm = '';
        filterAndRenderCards();
    });
    
    // add event listeners for filter buttons
    filterButtons.forEach(function(button) {
        button.addEventListener('click', handleFilter);
    });

    // Back to Top functionality
    if (backToTopBtn) {
        var isVisible = false;

        window.addEventListener('scroll', function() {
            var shouldBeVisible = window.pageYOffset > 300;
            
            // Only update DOM if state changed
            if (shouldBeVisible !== isVisible) {
                isVisible = shouldBeVisible;
                if (isVisible) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// handle search input - filters cards by title or description
function handleSearch(event) {
    currentSearchTerm = event.target.value.toLowerCase();
    filterAndRenderCards();
}

// handle filter button clicks - filters cards by category
function handleFilter(event) {
    // remove active class from all buttons
    filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    // add active class to clicked button
    event.target.classList.add('active');
    
    // update current filter
    currentFilter = event.target.getAttribute('data-filter');
    
    // re-filter and render cards
    filterAndRenderCards();
}

// filter cards based on current filter and search term
function filterAndRenderCards() {
    var favs = getFavorites();
    var filtered = cheatsheetData.filter(function(cheatsheet) {
        // check if category matches (or if filter is 'all' or 'favorites')
        var categoryMatch;
        if (currentFilter === 'all') {
            categoryMatch = true;
        } else if (currentFilter === 'favorites') {
            categoryMatch = favs.includes(cheatsheet.title);
        } else {
            categoryMatch = cheatsheet.category === currentFilter;
        }
        
        // check if search term matches title or description
       var searchMatch = cheatsheet.title.toLowerCase().includes(currentSearchTerm) ||
                  cheatsheet.description.toLowerCase().includes(currentSearchTerm) ||
                  cheatsheet.category.toLowerCase().includes(currentSearchTerm);
        
        // return true only if both conditions are met
        return categoryMatch && searchMatch;
    });
    
    // render the filtered cards
    renderCards(filtered);
}

// render cards to the dom
function renderCards(cardsToRender) {
    var resultsCount = document.getElementById('resultCount');
    resultsCount.textContent = `Showing ${cardsToRender.length} of ${cheatsheetData.length} cheatsheets`;
    cardsContainer.innerHTML = '';
    
    // check if there are any cards to display
    if (cardsToRender.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    // hide the no results message
    noResults.style.display = 'none';
    
    // loop through each cheatsheet and create a card element
    cardsToRender.forEach(function(cheatsheet) {
        var card = createCardElement(cheatsheet);
        cardsContainer.appendChild(card);
    });
}

// create a card element for a single cheatsheet
function createCardElement(cheatsheet) {
    // create the card container
    var card = document.createElement('div');
    card.className = 'card';
    
    var favorited = isFavorite(cheatsheet.title);
    
    // build the html for the card
    card.innerHTML = 
        '<div class="card-header">' +
            '<h3 class="card-title">' + cheatsheet.title + '</h3>' +
            '<div class="card-header-right">' +
                '<button class="favorite-btn' + (favorited ? ' favorited' : '') + '" aria-label="Toggle favorite" title="Save to favorites">' +
                    (favorited ? '♥' : '♡') +
                '</button>' +
                '<span class="card-category"><span class="dot dot-' + cheatsheet.category + '"></span>' + cheatsheet.category + '</span>' +
            '</div>' +
        '</div>' +
        '<p class="card-description">' + cheatsheet.description + '</p>' +
        '<pre class="card-code">' + escapeHtml(cheatsheet.code) + '</pre>' +
        '<button class="copy-btn" data-code="' + escapeHtml(cheatsheet.code) + '">Copy Code</button>';
    
    // add click event listener to the copy button
    var copyButton = card.querySelector('.copy-btn');
    copyButton.addEventListener('click', handleCopyClick);

    // add click event listener to the favorite button
    var favButton = card.querySelector('.favorite-btn');
    favButton.addEventListener('click', function() {
        var added = toggleFavorite(cheatsheet.title);
        favButton.textContent = added ? '♥' : '♡';
        favButton.classList.toggle('favorited', added);
        updateCounts();
        // if currently viewing favorites and unfavorited, re-render
        if (currentFilter === 'favorites' && !added) {
            filterAndRenderCards();
        }
    });
    
    return card;
}

// handle copy button click - copies code to clipboard
function handleCopyClick(event) {
    var button = event.target;
    var code = button.getAttribute('data-code');
    
    // use the clipboard api to copy text
    navigator.clipboard.writeText(code).then(function() {
        // change button text to show success
        var originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        // revert button after 2 seconds
        setTimeout(function() {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(function() {
        // fallback for older browsers - use deprecated method
        copyToClipboardFallback(code, button);
    });
}

// fallback method for copying to clipboard in older browsers
function copyToClipboardFallback(text, button) {
    // create a temporary textarea element
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // remove the textarea
    document.body.removeChild(textarea);
    
    // show success message
    var originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(function() {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 2000);
}

// escape html special characters to prevent injection
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(char) {
        return map[char];
    });
}

// run initialization when dom is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// --- Dark Mode Logic ---
var themeToggle = document.getElementById('themeToggle');
var htmlElement = document.documentElement;

// 1. Check for saved preference on load
var savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
}

// 2. Add event listener to toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        var isDark = htmlElement.hasAttribute('data-theme');
        
        if (isDark) {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}