// reference to dom elements
var cardsContainer = document.getElementById('cardsContainer');
var noResults = document.getElementById('noResults');
var searchInput = document.getElementById('searchInput');
var clearSearch = document.getElementById('clearSearch');
var filterButtons = document.querySelectorAll('.filter-btn');

// track the current active filter and search term
var currentFilter = 'all';
var currentSearchTerm = '';

// initialize the app when page loads
function initializeApp() {
    // render all cards on initial load
    renderCards(cheatsheetData);
    
    // add event listener for search input
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        clearSearch.classList.remove('visible');
        currentSearchTerm = '';
        filterAndRenderCards();
        searchInput.focus();
    });
    
    // add event listeners for filter buttons
    filterButtons.forEach(function(button) {
        button.addEventListener('click', handleFilter);
    });
}

// handle search input - filters cards by title or description
function handleSearch(event) {
    currentSearchTerm = event.target.value.toLowerCase();
    clearSearch.classList.toggle('visible', currentSearchTerm.length > 0);
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
    var filtered = cheatsheetData.filter(function(cheatsheet) {
        // check if category matches (or if filter is 'all')
        var categoryMatch = currentFilter === 'all' || cheatsheet.category === currentFilter;
        
        // check if search term matches title or description
        var searchMatch = cheatsheet.title.toLowerCase().includes(currentSearchTerm) ||
                          cheatsheet.description.toLowerCase().includes(currentSearchTerm);
        
        // return true only if both conditions are met
        return categoryMatch && searchMatch;
    });
    
    // render the filtered cards
    renderCards(filtered);
}

// render cards to the dom
function renderCards(cardsToRender) {
    // clear the container
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
    
    // build the html for the card
    card.innerHTML = 
        '<div class="card-header">' +
            '<h3 class="card-title">' + cheatsheet.title + '</h3>' +
            '<span class="card-category">' + cheatsheet.category + '</span>' +
        '</div>' +
        '<p class="card-description">' + cheatsheet.description + '</p>' +
        '<pre class="card-code">' + escapeHtml(cheatsheet.code) + '</pre>' +
        '<button class="copy-btn" data-code="' + escapeHtml(cheatsheet.code) + '">Copy Code</button>';
    
    // add click event listener to the copy button
    var copyButton = card.querySelector('.copy-btn');
    copyButton.addEventListener('click', handleCopyClick);
    
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