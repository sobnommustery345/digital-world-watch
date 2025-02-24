// Get DOM elements
const timeElement = document.getElementById('time'); // Time display element
const ampmElement = document.getElementById('ampm'); // AM/PM display element
const dateElement = document.getElementById('date'); // Date display element
const searchInput = document.getElementById('searchInput'); // Search input element
const searchResults = document.getElementById('searchResults'); // Search results container

// Current timezone (default to local)
let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Set initial timezone to the local timezone

// Get all available timezones
const allTimezones = Intl.supportedValuesOf('timeZone'); // Get the list of supported timezones

// Format options for time and date
const timeOptions = {
    hour: '2-digit', // Display hour in two digits
    minute: '2-digit', // Display minute in two digits
    second: '2-digit', // Display second in two digits
    hour12: true // Use 12-hour format (AM/PM)
};

const dateOptions = {
    weekday: 'long', // Full weekday name
    year: 'numeric', // Full year format
    month: 'long', // Full month name
    day: 'numeric' // Numeric day of the month
};

// Update clock function
function updateClock() {
    const now = new Date(); // Get current date and time
    
    // Format time for the current timezone
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        ...timeOptions, // Use defined time options
        timeZone: currentTimezone // Apply current timezone
    });
    
    // Format date for the current timezone
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        ...dateOptions, // Use defined date options
        timeZone: currentTimezone // Apply current timezone
    });

    // Split time and AM/PM
    const [timeWithoutAmPm, ampm] = timeFormatter.format(now).split(' '); // Split formatted time into time and AM/PM
    
    // Update DOM with formatted time and date
    timeElement.textContent = timeWithoutAmPm; // Display the time
    ampmElement.textContent = ampm; // Display AM/PM
    dateElement.textContent = dateFormatter.format(now); // Display the date
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase(); // Convert the search query to lowercase
    
    if (query) {
        // Filter timezones based on the search query
        const filteredTimezones = allTimezones.filter(tz => 
            tz.toLowerCase().replace(/_/g, ' ').includes(query) // Replace underscores with spaces and check if it includes the query
        );
        
        // Show search results
        searchResults.innerHTML = filteredTimezones
            .map(tz => `<button type="button">${tz.replace(/_/g, ' ')}</button>`) // Create button for each timezone
            .join(''); // Join buttons as HTML
        
        searchResults.style.display = 'block'; // Show the search results
        
        // Add click handlers to results
        searchResults.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                // Update current timezone on button click
                currentTimezone = button.textContent.replace(/ /g, '_'); // Convert spaces back to underscores
                searchInput.value = ''; // Clear search input
                searchResults.style.display = 'none'; // Hide search results
                updateClock(); // Update the clock immediately
            });
        });
    } else {
        searchResults.style.display = 'none'; // Hide search results if query is empty
    }
});

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.style.display = 'none'; // Hide search results if click is outside
    }
});

// Initial clock update and start interval
updateClock(); // Update the clock immediately
setInterval(updateClock, 1000); // Update the clock every second
