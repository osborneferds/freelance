// Tour Experiences Database Defaults (used if not already set in localStorage)
const DEFAULT_TOURS = [
  {
    id: "shared-evening-safari",
    title: "Shared Evening Desert Safari",
    category: "desert",
    price: 85,
    rating: 4.8,
    reviews: 342,
    duration: "6 Hours",
    tags: ["Bestseller", "DDCR Protected"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    description: "Embark on an award-winning safari in the Dubai Desert Conservation Reserve. Indulge in an authentic barbecue dinner, enjoy traditional entertainment, and experience dune driving led by professional conservation guides.",
    highlights: [
      "Dune driving in the Dubai Desert Conservation Reserve",
      "Camel riding at sunset over golden dunes",
      "Henna painting and traditional falcon photo-op",
      "Three-course gourmet buffet BBQ dinner",
      "Spectacular belly dance and fire-spinning Tanoura shows"
    ],
    itinerary: [
      { time: "15:00 - 16:00", activity: "Hotel pick-up in a shared air-conditioned 4x4 vehicle" },
      { time: "16:30 - 17:30", activity: "Thrilling dune drive in the conservation reserve observing wildlife" },
      { time: "17:45", activity: "Sunset photo-stop with spectacular desert views and light refreshments" },
      { time: "18:30 - 21:00", activity: "Bedouin camp activities, barbecue buffet, and live performances under the stars" },
      { time: "21:30", activity: "Return transfer to your hotel" }
    ],
    inclusions: [
      "Shared hotel transfers (Dubai hotels)",
      "Professional safari guide",
      "Wildlife dune drive",
      "Gourmet BBQ buffet (Vegetarian/Halal options)",
      "Unlimited soft drinks, Arabic coffee & tea",
      "Sandboarding & Camel riding"
    ],
    exclusions: [
      "Premium alcoholic beverages (available to purchase)",
      "Private vehicle upgrade (available during checkout)",
      "Souvenirs"
    ],
    faq: [
      { q: "What should I wear?", a: "Loose, comfortable clothing and sandals are recommended. Bring a light jacket for winter evenings (November to March)." },
      { q: "Is it suitable for pregnant women?", a: "Dune drives are not recommended for pregnant guests. We can arrange direct camp transfers upon request." }
    ]
  },
  {
    id: "premium-dune-dinner",
    title: "Premium Dune Dinner Safari",
    category: "desert",
    price: 135,
    rating: 4.9,
    reviews: 198,
    duration: "7 Hours",
    tags: ["Eco-friendly", "Premium"],
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    description: "An exclusive, eco-focused dining experience nestled deep in the Dubai Desert Conservation Reserve. Features a private table setup, a premium multi-course menu, and stargazing with an astronomer.",
    highlights: [
      "Eco-focused wildlife drive in the conservation reserve",
      "Private table setup on the dunes",
      "Falconry demonstration at sunset",
      "Gourmet 5-star grilled dinner with fine beverages",
      "Guided stargazing session under the dark desert sky"
    ],
    itinerary: [
      { time: "15:30", activity: "Private/Semi-private hotel pick-up in a premium SUV" },
      { time: "16:45", activity: "Eco-tourism drive observing native Arabian Oryx and gazelles" },
      { time: "18:00", activity: "Falconry show and sunset drinks on the dunes" },
      { time: "19:00 - 21:30", activity: "Premium 5-course table-service dinner under the stars" },
      { time: "22:00", activity: "Drop-off at your hotel" }
    ],
    inclusions: [
      "Premium vehicle transfers",
      "Wildlife safari drive",
      "Sunset champagne/juice & falconry",
      "5-course gourmet table-service dinner",
      "Stargazing session with astronomer guide",
      "Portion of fee goes to conservation"
    ],
    exclusions: [
      "Gratuities",
      "Hard liquor options (available on site)"
    ],
    faq: [
      { q: "Is this tour eco-friendly?", a: "Yes, it operates in the protected DDCR reserve. A portion of all proceeds directly supports local desert wildlife conservation projects." }
    ]
  },
  {
    id: "morning-dunes-camel",
    title: "Morning Dunes & Camel Trek",
    category: "desert",
    price: 65,
    rating: 4.7,
    reviews: 154,
    duration: "4.5 Hours",
    tags: ["Popular"],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    description: "Beat the heat with a morning desert drive. Enjoy sandboarding, a camel trek, and standard refreshments in a tranquil desert setting before the day gets busy.",
    highlights: [
      "Morning wildlife spotting in the fresh desert air",
      "Guided sandboarding down high dunes",
      "Authentic 30-minute camel trek",
      "Light Arabic breakfast and premium coffee in a desert majlis"
    ],
    itinerary: [
      { time: "07:30 - 08:30", activity: "Early morning hotel pick-up" },
      { time: "09:00", activity: "Scenic morning drive through high desert dunes" },
      { time: "09:30 - 10:30", activity: "Sandboarding and guided camel ride" },
      { time: "10:45", activity: "Arabic coffee, dates, and light breakfast in a desert majlis" },
      { time: "11:30", activity: "Return transfer to your hotel" }
    ],
    inclusions: [
      "Shared transfers",
      "Morning dune drive",
      "Sandboard hire",
      "Camel trek",
      "Light breakfast & refreshments"
    ],
    exclusions: [
      "Camp entertainment (morning tour focus is nature)",
      "Souvenir photos"
    ],
    faq: [
      { q: "Is breakfast included?", a: "Yes, a light Arabic breakfast consisting of pastries, dates, coffee, tea, and juice is included." }
    ]
  },
  {
    id: "dubai-private-city",
    title: "Dubai Private City Tour",
    category: "city",
    price: 110,
    rating: 4.8,
    reviews: 220,
    duration: "5 Hours",
    tags: ["Exclusive", "City Tour"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    description: "Explore both old and new Dubai with your own private certified guide. Visit the historic Al Fahidi district, ride an Abra across the creek, and marvel at the Burj Khalifa.",
    highlights: [
      "Private guide and transport for up to 6 people",
      "Abra water taxi ride across Dubai Creek",
      "Gold & Spice Souks exploration with guide shopping assistance",
      "Photo stops at Burj Al Arab and Burj Khalifa"
    ],
    itinerary: [
      { time: "09:00", activity: "Private pick-up from your hotel in Dubai" },
      { time: "09:30 - 11:00", activity: "Walking tour of Al Fahidi, Dubai Museum, and Gold/Spice Souks" },
      { time: "11:15", activity: "Traditional Abra water taxi crossing" },
      { time: "12:00 - 13:30", activity: "Drive down Jumeirah Beach road with photo stops at Burj Al Arab" },
      { time: "14:00", activity: "Drop-off at Burj Khalifa or your hotel" }
    ],
    inclusions: [
      "Private air-conditioned vehicle",
      "Licensed English-speaking guide",
      "Abra ticket",
      "Mineral water"
    ],
    exclusions: [
      "Burj Khalifa entry ticket (available as add-on)",
      "Lunch / meals"
    ],
    faq: [
      { q: "Can we customize the stops?", a: "Yes, since this is a private tour, you can customize the itinerary with your guide on the day." }
    ]
  },
  {
    id: "abu-dhabi-louvre",
    title: "Abu Dhabi & Louvre Day Tour",
    category: "city",
    price: 145,
    rating: 4.9,
    reviews: 176,
    duration: "9 Hours",
    tags: ["Bestseller", "Cultural"],
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    description: "Discover the highlights of the UAE's capital. Marvel at the majestic Sheikh Zayed Grand Mosque, drive along the scenic Corniche, and visit the stunning Louvre Abu Dhabi museum.",
    highlights: [
      "Guided tour inside the Sheikh Zayed Grand Mosque",
      "Scenic drive along Abu Dhabi Corniche",
      "Entry ticket to the futuristic Louvre Abu Dhabi",
      "Comfortable round-trip transport from Dubai"
    ],
    itinerary: [
      { time: "08:00 - 09:00", activity: "Drive from Dubai to Abu Dhabi with tour guide" },
      { time: "10:30 - 12:00", activity: "Guided visit inside the Sheikh Zayed Grand Mosque" },
      { time: "12:30 - 13:30", activity: "Lunch break at a premium Marina resort (Self-pay)" },
      { time: "14:00 - 16:30", activity: "Explore the Louvre Abu Dhabi's art and architecture" },
      { time: "17:00", activity: "Return drive to Dubai, arrival by 18:30" }
    ],
    inclusions: [
      "Round-trip transfers from Dubai",
      "Professional cultural guide",
      "Louvre Abu Dhabi entry ticket",
      "Mosque entry and guidance"
    ],
    exclusions: [
      "Lunch and beverages",
      "Gratuities"
    ],
    faq: [
      { q: "Is there a dress code for the mosque?", a: "Yes. Men must wear long trousers. Women must be fully covered to the wrists and ankles, and wear a headscarf. We will provide detailed dress guidelines prior to departure." }
    ]
  },
  {
    id: "aquaventure-ticket",
    title: "Aquaventure Waterpark Ticket",
    category: "attractions",
    price: 95,
    rating: 4.9,
    reviews: 412,
    duration: "Full Day",
    tags: ["Adventure", "Family"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    description: "Splash into a world of excitement at the world's largest waterpark, located at Atlantis The Palm. Enjoy over 105 record-breaking slides, attractions, and a private beach.",
    highlights: [
      "Access to over 105 slides and attractions",
      "Ride the legendary Leap of Faith and Odyssey of Terror",
      "700 meters of private white sand beach",
      "Splashers kids play areas for family fun"
    ],
    itinerary: [
      { time: "10:00", activity: "Waterpark gates open" },
      { time: "10:00 - 18:00", activity: "Enjoy unlimited rides, slides, and beach access at your own pace" }
    ],
    inclusions: [
      "Full-day admission ticket",
      "Access to all slides and rides",
      "Access to the private beach",
      "Life jackets (complimentary)"
    ],
    exclusions: [
      "Hotel transfers (available to book during checkout)",
      "Locker and towel rental",
      "Food and beverages"
    ],
    faq: [
      { q: "Are towels provided?", a: "Towels and lockers are available for rent at the venue, or you can bring your own towel." }
    ]
  }
];

// Active Tour Catalog in Memory (Syncs with LocalStorage)
let TOURS = [];
let currentTour = null;
let bookingStep = 1;
let currentBookingPhotos = [];
const TAX_RATE = 0.05;
let currentFilters = {
  category: 'all',
  searchQuery: '',
  date: '',
  guests: ''
};

// Cached Calculator state
let currentPaneCalculatedPrice = 0;
let currentPaneSelectedTransfer = 'shared';
let stripe = null;
let stripeElements = null;
let stripeCardStyle = null;
let stripeCardElement = null;

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  initLocalStorage();
  initApp();
});

// Initialize LocalStorage for tours and seed bookings
function initLocalStorage() {
  // 1. Tours Catalog Load
  const storedTours = localStorage.getItem('sd_tours_catalog');
  if (storedTours) {
    TOURS = JSON.parse(storedTours);
  } else {
    TOURS = [...DEFAULT_TOURS];
    localStorage.setItem('sd_tours_catalog', JSON.stringify(TOURS));
  }

  // 2. Seed bookings if empty
  const storedBookings = localStorage.getItem('sd_bookings_list');
  if (!storedBookings) {
    const seedBookings = [
      {
        refId: "AA-928475",
        tourId: "shared-evening-safari",
        tourTitle: "Shared Evening Desert Safari",
        date: "2026-07-02",
        guests: "2",
        name: "Oliver Smith",
        email: "oliver.smith@example.com",
        phone: "+44 7911 123456",
        notes: "No dietary restrictions. Vegetarian options preferred for buffet.",
        transferType: "shared",
        totalPrice: 170,
        status: "confirmed"
      },
      {
        refId: "AA-103948",
        tourId: "premium-dune-dinner",
        tourTitle: "Premium Dune Dinner Safari",
        date: "2026-06-29",
        guests: "4",
        name: "Amara Diop",
        email: "amara@example.net",
        phone: "+33 6 1234 5678",
        notes: "Anniversary celebration. Private table setup.",
        transferType: "private",
        totalPrice: 660,
        status: "pending"
      },
      {
        refId: "AA-593847",
        tourId: "dubai-private-city",
        tourTitle: "Dubai Private City Tour",
        date: "2026-07-05",
        guests: "3",
        name: "Hiroshi Tanaka",
        email: "tanaka.hiro@example.co.jp",
        phone: "+81 90 1234 5678",
        notes: "Requires wheelchair accommodations.",
        transferType: "shared",
        totalPrice: 330,
        status: "pending"
      },
      {
        refId: "AA-304918",
        tourId: "aquaventure-ticket",
        tourTitle: "Aquaventure Waterpark Ticket",
        date: "2026-06-27",
        guests: "2",
        name: "David Miller",
        email: "david.miller@example.com",
        phone: "+1 202 555 0122",
        notes: "",
        transferType: "none",
        totalPrice: 190,
        status: "cancelled"
      }
    ];
    localStorage.setItem('sd_bookings_list', JSON.stringify(seedBookings));
  }
}

function initApp() {
  renderTours();
  setupFilterTabs();
  setupSearchWidget();
  setupDetailModal();
  setupBookingForm();
  initStripePayment();
  setupFaqAccordion();
  setupWhatsAppWidget();
  setupSmoothScroll();
  setupAdminPanelToggles();
}

function initStripePayment() {
  const stripeKey = 'pk_test_51MxxxxxxxReplaceWithYourKey';
  if (!window.Stripe || stripeKey.includes('ReplaceWithYourKey') || stripeKey.includes('xxxx')) {
    console.warn('Stripe.js is not configured for card payments in this demo. Booking flow will continue without card tokenization.');
    return;
  }

  stripe = Stripe(stripeKey);
  stripeElements = stripe.elements();

  stripeCardStyle = {
    base: {
      color: '#1E1A18',
      fontSize: '16px',
      fontFamily: 'Outfit, sans-serif',
      '::placeholder': { color: '#8F847D' },
      iconColor: '#8A1538'
    },
    invalid: {
      color: '#D93025',
      iconColor: '#D93025'
    }
  };

  if (!stripeElements) return;

  stripeCardElement = stripeElements.create('card', { style: stripeCardStyle, hidePostalCode: true });
  const quickContainer = document.getElementById('quickCardElement');
  if (quickContainer) stripeCardElement.mount(quickContainer);

  const handleStripeChange = (event, errorContainerId) => {
    const errorContainer = document.getElementById(errorContainerId);
    if (errorContainer) {
      errorContainer.textContent = event.error ? event.error.message : '';
    }
  };

  if (stripeCardElement) stripeCardElement.on('change', event => handleStripeChange(event, 'quickCardErrors'));
}

function mountQuickCardElement() {
  if (!stripeCardElement || !stripeCardStyle) return;

  const quickContainer = document.getElementById('quickCardElement');
  if (!quickContainer) return;

  try {
    stripeCardElement.unmount();
  } catch (error) {
    // Ignore if the element was not mounted yet.
  }

  stripeCardElement.mount(quickContainer);
}

function mountModalCardElement() {
  if (!stripeCardElement || !stripeCardStyle) return;

  const paneContainer = document.getElementById('paneCardElement');
  if (!paneContainer) return;

  try {
    stripeCardElement.unmount();
  } catch (error) {
    // Ignore if the element was not mounted yet.
  }

  stripeCardElement.mount(paneContainer);
  stripeCardElement.on('change', event => {
    const errorContainer = document.getElementById('paneCardErrors');
    if (errorContainer) {
      errorContainer.textContent = event.error ? event.error.message : '';
    }
  });
}

async function createStripeToken(cardElement) {
  if (!stripe || !cardElement) {
    alert('Stripe payment is unavailable at this time.');
    return null;
  }

  const result = await stripe.createToken(cardElement);
  if (result.error) {
    const errorContainer = cardElement === stripeCardElement ? document.getElementById('quickCardErrors') : document.getElementById('paneCardErrors');
    if (errorContainer) errorContainer.textContent = result.error.message;
    alert(result.error.message);
    return null;
  }

  return result.token.id;
}

// 1. Render Tours Grid (Public View)
function renderTours() {
  const toursGrid = document.getElementById('toursGrid');
  if (!toursGrid) return;

  const filteredTours = TOURS.filter(tour => {
    // Category filter
    const matchesCategory = currentFilters.category === 'all' || tour.category === currentFilters.category;
    
    // Search query filter (matches title or description)
    const query = currentFilters.searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      tour.title.toLowerCase().includes(query) || 
      tour.description.toLowerCase().includes(query);
    
    return matchesCategory && matchesSearch;
  });

  if (filteredTours.length === 0) {
    toursGrid.innerHTML = `
      <div class="no-results">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No adventures found</h3>
        <p>Try adjusting your search criteria or filters.</p>
        <button class="button button-primary" onclick="resetFilters()">View all tours</button>
      </div>
    `;
    return;
  }

  toursGrid.innerHTML = filteredTours.map(tour => {
    const starsHtml = '★'.repeat(Math.round(tour.rating)) + '☆'.repeat(5 - Math.round(tour.rating));
    const badgeHtml = tour.tags.map(tag => `<span class="tour-tag ${tag.toLowerCase().replace(' ', '-') === 'eco-friendly' ? 'eco-badge' : ''}">${tag}</span>`).join('');
    
    return `
      <article class="tour-card" data-id="${tour.id}">
        <div class="tour-card-image" style="background-image: url('${tour.image}')">
          <div class="tour-badge-container">
            ${badgeHtml}
          </div>
          <span class="tour-duration-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${tour.duration}
          </span>
        </div>
        <div class="tour-card-body">
          <div class="tour-card-rating">
            <span class="stars">${starsHtml}</span>
            <span class="rating-text">${tour.rating} (${tour.reviews} reviews)</span>
          </div>
          <h3 class="tour-card-title">${tour.title}</h3>
          <p class="tour-card-description">${tour.description}</p>
          <div class="tour-card-footer">
            <div class="tour-card-price">
              <span class="price-label">From</span>
              <span class="price-amount">USD ${tour.price}</span>
              <span class="price-unit">/ person</span>
            </div>
            <div class="tour-card-actions">
              <button class="button button-secondary button-small" onclick="openTourDetails('${tour.id}')">View Details</button>
              <button class="button button-primary button-small" onclick="quickBookTour('${tour.id}')">Book Now</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// 2. Setup Category Tabs
function setupFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      currentFilters.category = tab.dataset.category;
      renderTours();
    });
  });
}

// Reset filters convenience function
window.resetFilters = function() {
  currentFilters.category = 'all';
  currentFilters.searchQuery = '';
  currentFilters.date = '';
  currentFilters.guests = '';
  
  // Reset active classes on tabs
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(t => {
    if (t.dataset.category === 'all') t.classList.add('active');
    else t.classList.remove('active');
  });

  // Reset inputs in Hero Search Widget
  const searchInput = document.getElementById('searchWidgetInput');
  const dateInput = document.getElementById('searchWidgetDate');
  const guestsInput = document.getElementById('searchWidgetGuests');
  
  if (searchInput) searchInput.value = '';
  if (dateInput) dateInput.value = '';
  if (guestsInput) guestsInput.value = '';

  renderTours();
};

// 3. Setup Search Widget
function setupSearchWidget() {
  const searchForm = document.getElementById('searchWidgetForm');
  if (!searchForm) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('searchWidgetInput');
    const dateInput = document.getElementById('searchWidgetDate');
    const guestsInput = document.getElementById('searchWidgetGuests');

    currentFilters.searchQuery = searchInput ? searchInput.value : '';
    currentFilters.date = dateInput ? dateInput.value : '';
    currentFilters.guests = guestsInput ? guestsInput.value : '';

    renderTours();

    // Scroll to tours section
    const toursSection = document.getElementById('exploreTours');
    toursSection?.scrollIntoView({ behavior: 'smooth' });
  });
}

// 4. Detailed Tour Modal System
function setupDetailModal() {
  const modal = document.getElementById('tourDetailModal');
  const closeBtn = document.getElementById('closeModalBtn');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    closeTourModal();
  });

  // Close modal when clicking outside contents
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeTourModal();
    }
  });

  // Esc key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeTourModal();
    }
  });
}

window.openTourDetails = function(tourId) {
  const tour = TOURS.find(t => t.id === tourId);
  if (!tour) return;
  
  currentTour = tour;
  bookingStep = 1;
  currentBookingPhotos = [];

  const modal = document.getElementById('tourDetailModal');
  const content = document.getElementById('modalDynamicContent');
  if (!modal || !content) return;

  // Initialize booking details form placeholders
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const starsHtml = '★'.repeat(Math.round(tour.rating)) + '☆'.repeat(5 - Math.round(tour.rating));

  // Build inside content
  content.innerHTML = `
    <div class="modal-grid">
      <!-- Left side: Tour details -->
      <div class="modal-details-pane">
        <div class="modal-hero-banner" style="background-image: url('${tour.image}')">
          <div class="modal-hero-overlay">
            <span class="modal-duration-tag">${tour.duration}</span>
            <h2 class="modal-title">${tour.title}</h2>
            <div class="modal-rating">
              <span class="stars">${starsHtml}</span>
              <span>${tour.rating} (${tour.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <!-- Modal navigation tabs -->
        <div class="modal-tabs">
          <button class="modal-tab active" onclick="switchModalTab(event, 'overview')">Overview</button>
          <button class="modal-tab" onclick="switchModalTab(event, 'itinerary')">Itinerary</button>
          <button class="modal-tab" onclick="switchModalTab(event, 'inclusions')">Inclusions</button>
          <button class="modal-tab" onclick="switchModalTab(event, 'faqs')">FAQs</button>
        </div>

        <!-- Tab content boxes -->
        <div id="modalTabOverview" class="modal-tab-content active">
          <p class="modal-description">${tour.description}</p>
          <h4 class="sub-heading">Experience Highlights</h4>
          <ul class="highlights-list">
            ${tour.highlights.map(h => `<li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${h}</span>
            </li>`).join('')}
          </ul>
        </div>

        <div id="modalTabItinerary" class="modal-tab-content">
          <h4 class="sub-heading">Tour Timeline</h4>
          <div class="itinerary-timeline">
            ${tour.itinerary.map(item => `
              <div class="timeline-item">
                <div class="timeline-badge">${item.time}</div>
                <div class="timeline-content">${item.activity}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="modalTabInclusions" class="modal-tab-content">
          <div class="inclusions-grid">
            <div class="inclusions-box">
              <h4 class="sub-heading inc-header">What's Included</h4>
              <ul class="inc-list">
                ${tour.inclusions.map(inc => `<li>
                  <svg class="inc-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${inc}</span>
                </li>`).join('')}
              </ul>
            </div>
            <div class="exclusions-box">
              <h4 class="sub-heading exc-header">What's Excluded</h4>
              <ul class="exc-list">
                ${tour.exclusions.map(exc => `<li>
                  <svg class="exc-cross" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  <span>${exc}</span>
                </li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div id="modalTabFaqs" class="modal-tab-content">
          <h4 class="sub-heading">Frequently Asked Questions</h4>
          <div class="faq-accordion-modal">
            ${tour.faq && tour.faq.length > 0 ? 
              tour.faq.map((f, idx) => `
                <div class="faq-item-modal">
                  <button class="faq-quest-modal" onclick="toggleModalFaq(this)">
                    <span>${f.q}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  <div class="faq-ans-modal" hidden>
                    <p>${f.a}</p>
                  </div>
                </div>
              `).join('') : '<p>Please refer to our main FAQ section or reach out to our chat guides for specifics.</p>'
            }
          </div>
        </div>
      </div>

      <!-- Right side: Interactive booking flow -->
      <div class="modal-booking-pane">
        <div class="booking-pane-header">
          <h3>Book Experience</h3>
          <div class="price-tag-large">
            <span class="base-amount">USD ${tour.price}</span>
            <span class="base-unit">/ person</span>
          </div>
        </div>

        <!-- Progress indicator -->
        <div class="progress-bar">
          <div class="progress-step active" id="progStep1">1</div>
          <div class="progress-divider"></div>
          <div class="progress-step" id="progStep2">2</div>
          <div class="progress-divider"></div>
          <div class="progress-step" id="progStep3">3</div>
        </div>

        <!-- Step 1 Form: Dates and Guests -->
        <form id="paneBookingForm" onsubmit="handlePaneSubmit(event)">
          <div class="step-container" id="bookingStep1Content">
            <div class="field-group">
              <label for="bookingDate">Tour date <span class="required">*</span></label>
              <input type="date" id="bookingDate" min="${minDate}" value="${currentFilters.date}" required onchange="calculateBookingPrice()" />
            </div>

            <div class="field-group">
              <label for="bookingGuests">Guests <span class="required">*</span></label>
              <select id="bookingGuests" required onchange="calculateBookingPrice()">
                <option value="1" ${currentFilters.guests === '1' ? 'selected' : ''}>1 Guest</option>
                <option value="2" ${currentFilters.guests === '2' || currentFilters.guests === '' ? 'selected' : ''}>2 Guests</option>
                <option value="3" ${currentFilters.guests === '3' ? 'selected' : ''}>3 Guests</option>
                <option value="4" ${currentFilters.guests === '4' ? 'selected' : ''}>4 Guests</option>
                <option value="5" ${currentFilters.guests === '5' ? 'selected' : ''}>5 Guests</option>
                <option value="6" ${currentFilters.guests === '6' ? 'selected' : ''}>6 Guests</option>
                <option value="7" ${currentFilters.guests === '7' ? 'selected' : ''}>7+ Guests (Group enquiry)</option>
              </select>
            </div>

            <div class="field-group">
              <label for="bookingPackageTier">Package tier</label>
              <select id="bookingPackageTier" onchange="calculateBookingPrice()">
                <option value="Gold">Gold</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div class="field-group">
              <label for="bookingPickupTime">Pick-up time</label>
              <input type="time" id="bookingPickupTime" onchange="calculateBookingPrice()" />
            </div>

            <div class="field-group">
              <label for="bookingStartTime">Tour start time</label>
              <input type="time" id="bookingStartTime" onchange="calculateBookingPrice()" />
            </div>

            <!-- Transfer details (desert/city tour specific) -->
            ${tour.category !== 'attractions' ? `
              <div class="field-group field-group-full">
                <label>Vehicle preference</label>
                <div class="transfer-options">
                  <label class="radio-label">
                    <input type="radio" name="transferType" value="shared" checked onchange="calculateBookingPrice()" />
                    <div class="radio-card">
                      <strong>Sharing Vehicle</strong>
                      <span>Best value</span>
                    </div>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="transferType" value="private" onchange="calculateBookingPrice()" />
                    <div class="radio-card">
                      <strong>Private Vehicle</strong>
                      <span>+ USD 120</span>
                    </div>
                  </label>
                </div>
              </div>
            ` : `
              <div class="field-group field-group-full">
                <label>Vehicle preference</label>
                <div class="transfer-options">
                  <label class="radio-label">
                    <input type="radio" name="transferType" value="none" checked onchange="calculateBookingPrice()" />
                    <div class="radio-card">
                      <strong>Self-drive</strong>
                      <span>Included</span>
                    </div>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="transferType" value="shared" onchange="calculateBookingPrice()" />
                    <div class="radio-card">
                      <strong>Shared Shuttle</strong>
                      <span>+ USD 25 / guest</span>
                    </div>
                  </label>
                </div>
              </div>
            `}
          </div>

          <!-- Step 2 Form: Contact details -->
          <div class="step-container" id="bookingStep2Content" hidden>
            <div class="field-group">
              <label for="custName">First name <span class="required">*</span></label>
              <input type="text" id="custName" placeholder="John" />
            </div>
            <div class="field-group">
              <label for="custLastName">Last name <span class="required">*</span></label>
              <input type="text" id="custLastName" placeholder="Doe" />
            </div>
            <div class="field-group">
              <label for="custEmail">Email Address <span class="required">*</span></label>
              <input type="email" id="custEmail" placeholder="johndoe@example.com" />
            </div>
            <div class="field-group">
              <label for="custPhone">Phone Number <span class="required">*</span></label>
              <input type="tel" id="custPhone" placeholder="+971 50 123 4567" />
            </div>
            <div class="field-group">
              <label for="custCountry">Country of residence <span class="required">*</span></label>
              <input type="text" id="custCountry" placeholder="United Arab Emirates" />
            </div>
            <div class="field-group">
              <label for="custPickupLocation">Pick-up location <span class="required">*</span></label>
              <input type="text" id="custPickupLocation" placeholder="Dubai Marina Hotel" />
            </div>
            <div class="field-group">
              <label>Payment method</label>
              <div class="payment-option-grid">
                <label class="payment-option">
                  <input type="radio" name="panePaymentMethod" value="Payment Link" checked onchange="handlePanePaymentMethodChange()" />
                  <span>Payment Link</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="panePaymentMethod" value="Google Pay" onchange="handlePanePaymentMethodChange()" />
                  <span>Google Pay</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="panePaymentMethod" value="Apple Pay" onchange="handlePanePaymentMethodChange()" />
                  <span>Apple Pay</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="panePaymentMethod" value="Card" onchange="handlePanePaymentMethodChange()" />
                  <span>Credit / Debit Card</span>
                </label>
              </div>
            </div>
            <div class="field-group" id="paneCardFields" hidden>
              <label>
                Card details
                <div id="paneCardElement" class="stripe-card-element"></div>
                <div id="paneCardErrors" class="stripe-card-errors" role="alert"></div>
              </label>
            </div>
            <div class="field-group">
              <label for="panePhotoUpload">Upload photos (up to 10)</label>
              <input type="file" id="panePhotoUpload" accept="image/*" multiple onchange="handlePanePhotoUpload(event)" />
            </div>
            <div class="photo-preview-grid" id="panePhotoPreview"></div>
            <div class="field-group">
              <label for="custNotes">Special Requests</label>
              <textarea id="custNotes" rows="3" placeholder="Dietary guidelines, hotel location for pickup, etc."></textarea>
            </div>
          </div>

          <!-- Step 3 Form: Checkout & confirmation -->
          <div class="step-container" id="bookingStep3Content" hidden>
            <div class="booking-receipt-card">
              <h4>Review Booking Summary</h4>
              <ul class="receipt-details">
                <li><span>Activity:</span> <strong id="receiptTitle"></strong></li>
                <li><span>Date:</span> <strong id="receiptDate"></strong></li>
                <li><span>Guests:</span> <strong id="receiptGuests"></strong></li>
                <li><span>Transfers:</span> <strong id="receiptTransfers"></strong></li>
              </ul>
              <div class="receipt-divider"></div>
              <div class="receipt-total-line">
                <span>Total Price:</span>
                <strong id="receiptTotal"></strong>
              </div>
            </div>
            <p class="receipt-terms">
              By confirming, you agree to our 48-hour free cancellation policy. A booking confirmation voucher will be emailed instantly.
            </p>
          </div>

          <!-- Action buttons for booking panel -->
          <div class="booking-pane-footer">
            <div class="pane-price-summary">
              <span class="summary-label">Total Amount</span>
              <strong id="paneCalcTotal">USD 170</strong>
            </div>
            <div class="pane-action-buttons">
              <button type="button" class="button button-secondary" id="paneBackBtn" onclick="paneGoBack()" hidden>Back</button>
              <button type="submit" class="button button-primary" id="paneNextBtn">Next Step</button>
            </div>
          </div>
        </form>

        <!-- Success Panel -->
        <div class="booking-success-panel" id="paneSuccessContent" hidden>
          <div class="success-icon-wrapper">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Adventure Booked!</h3>
          <p>Your request has been registered under booking reference <strong><span id="paneSuccessRef"></span></strong>.</p>
          <p class="success-desc">We have sent a confirmation email containing itinerary, pickup instructions, and a receipt. Safe travels!</p>
          <button class="button button-primary" onclick="closeTourModal()">Return to Experiences</button>
        </div>
      </div>
    </div>
  `;

  // Prepare Stripe card input inside the modal before showing
  maybeInitModalStripe();

  // Display the modal
  modal.hidden = false;
  document.body.style.overflow = 'hidden'; // prevent page background scrolling
  
  // Run initial price calculation
  calculateBookingPrice();
};

window.closeTourModal = function() {
  const modal = document.getElementById('tourDetailModal');
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = ''; // restore scrolling
    currentTour = null;
  }
  mountQuickCardElement();
};

// Switch detail tabs inside the modal
window.switchModalTab = function(event, tabName) {
  // Reset tabs
  const tabButtons = event.target.parentElement.querySelectorAll('.modal-tab');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Reset tab content boxes
  const contentPanes = event.target.closest('.modal-details-pane').querySelectorAll('.modal-tab-content');
  contentPanes.forEach(pane => pane.classList.remove('active'));

  // Open corresponding one
  const targetId = 'modalTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
  const targetPane = document.getElementById(targetId);
  if (targetPane) {
    targetPane.classList.add('active');
  }
};

// Toggle accordion items inside modal FAQ
window.toggleModalFaq = function(button) {
  const answer = button.nextElementSibling;
  const isExpanded = answer.hidden === false;
  
  // Toggle answer view
  answer.hidden = isExpanded;
  
  // Rotate svg chevron
  const svg = button.querySelector('svg');
  if (svg) {
    svg.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    svg.style.transition = 'transform 0.2s ease';
  }
};

window.getPackageTierMultiplier = function(tier) {
  if (tier === 'Premium') return 1.25;
  if (tier === 'VIP') return 1.5;
  return 1.0; // Gold or default
};

window.formatMoney = function(amount) {
  return `USD ${amount.toFixed(2)}`;
};

window.calculateBookingPrice = function() {
  if (!currentTour) return;

  const guestsSelect = document.getElementById('bookingGuests');
  const packageTierSelect = document.getElementById('bookingPackageTier');
  const guestsVal = parseInt(guestsSelect?.value || '2', 10);
  const packageTier = packageTierSelect?.value || 'Gold';
  const basePrice = currentTour.price;

  let totalAmount = basePrice * guestsVal * getPackageTierMultiplier(packageTier);

  // Check transfer type
  const transferRadios = document.getElementsByName('transferType');
  let selectedTransfer = 'shared';
  for (const radio of transferRadios) {
    if (radio.checked) {
      selectedTransfer = radio.value;
      break;
    }
  }

  // Calculate pricing modifier
  if (currentTour.category !== 'attractions') {
    if (selectedTransfer === 'private') {
      totalAmount += 120; // flat fee for private luxury vehicle
    }
  } else {
    if (selectedTransfer === 'shared') {
      totalAmount += (25 * guestsVal); // $25 per passenger for attraction transfers
    }
  }

  const taxAmount = totalAmount * TAX_RATE;
  const grossAmount = totalAmount + taxAmount;

  currentPaneCalculatedPrice = Math.round((grossAmount + Number.EPSILON) * 100) / 100;
  currentPaneSelectedTransfer = selectedTransfer;

  const totalDisplay = formatMoney(currentPaneCalculatedPrice);
  const noteDisplay = `includes ${formatMoney(taxAmount)} tax`;

  const paneCalcTotal = document.getElementById('paneCalcTotal');
  if (paneCalcTotal) paneCalcTotal.innerText = `${totalDisplay} (${noteDisplay})`;

  if (guestsVal >= 7) {
    const nextBtn = document.getElementById('paneNextBtn');
    if (nextBtn) nextBtn.innerText = 'Enquire Now';
  } else {
    const nextBtn = document.getElementById('paneNextBtn');
    if (nextBtn && bookingStep === 1) nextBtn.innerText = 'Next Step';
  }

  return currentPaneCalculatedPrice;
};

window.handlePanePaymentMethodChange = function() {
  const selected = document.querySelector('input[name="panePaymentMethod"]:checked')?.value;
  const cardFields = document.getElementById('paneCardFields');

  if (selected === 'Card') {
    if (cardFields) {
      cardFields.hidden = false;
      if (!stripeCardElement) {
        mountModalCardElement();
      }
    }
  } else {
    if (cardFields) cardFields.hidden = true;
  }
};

function maybeInitModalStripe() {
  const paneCardElement = document.getElementById('paneCardElement');
  if (!paneCardElement || !stripe) return;
  mountModalCardElement();
}

window.handlePanePhotoUpload = function(event) {
  const files = Array.from(event.target.files || []);
  const previewContainer = document.getElementById('panePhotoPreview');
  currentBookingPhotos = files.slice(0, 10).map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file)
  }));

  if (!previewContainer) return;
  previewContainer.innerHTML = currentBookingPhotos.map(photo => `
    <div class="photo-thumb">
      <img src="${photo.url}" alt="Uploaded photo preview" />
      <span>${photo.name}</span>
    </div>
  `).join('');
};

window.createPaymentLink = function(refId) {
  return `https://pay.sunsetdunes.example/checkout?booking=${encodeURIComponent(refId)}`;
};

window.simulateBookingEmails = function(booking) {
  const customerEmail = booking.email;
  const adminEmail = 'ops@sunsetdunes.com';
  const paymentInstruction = booking.paymentMethod === 'Card'
    ? 'Your card payment has been securely processed.'
    : `Use this payment method: ${booking.paymentMethod}. ${booking.paymentMethod === 'Payment Link' ? `Pay here: ${createPaymentLink(booking.refId)}` : ''}`;

  console.group('Simulated Email Dispatch');
  console.log('To:', customerEmail);
  console.log('Subject: Your Sunset Dunes booking confirmation');
  console.log('Body:', `Hello ${booking.firstName} ${booking.lastName},\n\n` +
    `Thank you for booking ${booking.tourTitle} on ${booking.date}. Your booking reference is ${booking.refId}.\n` +
    `Pickup: ${booking.pickupLocation} at ${booking.pickupTime || 'TBD'}.\n` +
    `Tour Start: ${booking.tourStartTime || 'TBD'}.\n` +
    `Package Tier: ${booking.packageTier}.\n` +
    `Vehicle: ${booking.transferType === 'private' ? 'Private Vehicle' : booking.transferType === 'shared' ? 'Sharing Vehicle' : 'Self-drive'}.\n` +
    `Guests: ${booking.guests}.\n` +
    `Total Paid: ${formatMoney(booking.totalPrice)} (includes ${formatMoney(booking.totalPrice * TAX_RATE / (1 + TAX_RATE))} tax).\n\n` +
    paymentInstruction +
    `\n\nWe have also sent a copy to our operations team.\n\nBest regards,\nSunset Dunes`);
  console.groupEnd();

  console.group('Simulated Admin Notification');
  console.log('To:', adminEmail);
  console.log('Subject: New booking received —', booking.refId);
  console.log('Body:', `Booking details for ${booking.refId}:\n` +
    `Client: ${booking.firstName} ${booking.lastName} (${booking.email}, ${booking.phone})\n` +
    `Country: ${booking.country}\n` +
    `Tour: ${booking.tourTitle}\n` +
    `Date: ${booking.date}\n` +
    `Pickup location: ${booking.pickupLocation}\n` +
    `Pickup time: ${booking.pickupTime}\n` +
    `Start time: ${booking.tourStartTime}\n` +
    `Guests: ${booking.guests}\n` +
    `Package: ${booking.packageTier}\n` +
    `Vehicle: ${booking.transferType === 'private' ? 'Private Vehicle' : booking.transferType === 'shared' ? 'Sharing Vehicle' : 'Self-drive'}\n` +
    `Payment method: ${booking.paymentMethod}\n` +
    `Total value: ${formatMoney(booking.totalPrice)}.\n` +
    `Notes: ${booking.notes || 'None'}\n` +
    `Uploaded photos: ${booking.photos.length} file(s).`);
  console.groupEnd();
};


// 6. Booking Panel Checkout Steps & LocalStorage Persistence
window.handlePaneSubmit = async function(event) {
  event.preventDefault();

  if (bookingStep === 1) {
    const dateInput = document.getElementById('bookingDate');
    if (!dateInput.value) {
      alert('Please select a preferred date for your safari.');
      return;
    }
    
    // Proceed to Step 2
    bookingStep = 2;
    document.getElementById('bookingStep1Content').hidden = true;
    document.getElementById('bookingStep2Content').hidden = false;
    document.getElementById('paneBackBtn').hidden = false;
    
    // Update progress bar
    document.getElementById('progStep2').classList.add('active');

    // Make inputs required on step 2
    document.getElementById('custName').setAttribute('required', 'required');
    document.getElementById('custEmail').setAttribute('required', 'required');
    document.getElementById('custPhone').setAttribute('required', 'required');

  } else if (bookingStep === 2) {
    const firstNameVal = document.getElementById('custName').value.trim();
    const lastNameVal = document.getElementById('custLastName').value.trim();
    const emailVal = document.getElementById('custEmail').value.trim();
    const phoneVal = document.getElementById('custPhone').value.trim();
    const countryVal = document.getElementById('custCountry').value.trim();
    const pickupLocationVal = document.getElementById('custPickupLocation').value.trim();

    if (!firstNameVal || !lastNameVal || !emailVal || !phoneVal || !countryVal || !pickupLocationVal) {
      alert('Please fill out all required contact and location fields.');
      return;
    }

    bookingStep = 3;
    document.getElementById('bookingStep2Content').hidden = true;
    document.getElementById('bookingStep3Content').hidden = false;
    
    document.getElementById('progStep3').classList.add('active');
    document.getElementById('paneNextBtn').innerText = 'Confirm Reservation';

    const dateVal = document.getElementById('bookingDate').value;
    const guestsCount = document.getElementById('bookingGuests').value;
    const packageTier = document.getElementById('bookingPackageTier')?.value || 'Gold';
    const pickupTime = document.getElementById('bookingPickupTime')?.value || 'TBD';
    const tourStartTime = document.getElementById('bookingStartTime')?.value || 'TBD';
    const totalCost = document.getElementById('paneCalcTotal').innerText;

    let transferName = 'Sharing Vehicle';
    if (currentPaneSelectedTransfer === 'private') transferName = 'Private Vehicle';
    if (currentPaneSelectedTransfer === 'none') transferName = 'Self-drive';
    if (currentPaneSelectedTransfer === 'shared' && currentTour.category === 'attractions') transferName = 'Hotel Shuttle Addition';

    document.getElementById('receiptTitle').innerText = `${currentTour.title} · ${packageTier}`;
    document.getElementById('receiptDate').innerText = `${dateVal} @ ${tourStartTime}`;
    document.getElementById('receiptGuests').innerText = guestsCount >= 7 ? '7+ Guests (Group)' : `${guestsCount} Guest(s)`;
    document.getElementById('receiptTransfers').innerText = `${transferName} · Pickup ${pickupTime}`;
    document.getElementById('receiptTotal').innerText = totalCost;

  } else if (bookingStep === 3) {
    // Save to LocalStorage bookings list
    const refNum = `AA-${Math.floor(100000 + Math.random() * 900000)}`;
    const packageTier = document.getElementById('bookingPackageTier')?.value || 'Gold';
    const pickupTime = document.getElementById('bookingPickupTime')?.value || '';
    const tourStartTime = document.getElementById('bookingStartTime')?.value || '';
    const firstName = document.getElementById('custName').value.trim();
    const lastName = document.getElementById('custLastName')?.value.trim() || '';
    const email = document.getElementById('custEmail').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const country = document.getElementById('custCountry')?.value.trim() || '';
    const pickupLocation = document.getElementById('custPickupLocation')?.value.trim() || '';
    const notes = document.getElementById('custNotes').value.trim();
    const paymentMethod = document.querySelector('input[name="panePaymentMethod"]:checked')?.value || 'Payment Link';

    let cardToken = null;
    if (paymentMethod === 'Card') {
      cardToken = await createStripeToken(stripeCardElement);
      if (!cardToken) return;
    }

    const newBooking = {
      refId: refNum,
      tourId: currentTour.id,
      tourTitle: currentTour.title,
      date: document.getElementById('bookingDate').value,
      pickupTime,
      tourStartTime,
      packageTier,
      guests: document.getElementById('bookingGuests').value,
      firstName,
      lastName,
      email,
      phone,
      country,
      pickupLocation,
      notes,
      transferType: currentPaneSelectedTransfer,
      paymentMethod,
      cardToken,
      photos: currentBookingPhotos,
      totalPrice: currentPaneCalculatedPrice,
      status: "pending"
    };

    const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
    bookingsList.unshift(newBooking);
    localStorage.setItem('sd_bookings_list', JSON.stringify(bookingsList));

    const bookingForm = document.getElementById('paneBookingForm');
    const successPanel = document.getElementById('paneSuccessContent');
    const successRefText = document.getElementById('paneSuccessRef');
    
    if (bookingForm && successPanel) {
      bookingForm.hidden = true;
      successPanel.hidden = false;
      if (successRefText) successRefText.innerText = refNum;
    }

    simulateBookingEmails(newBooking);
    console.log('New Booking Added to Database:', newBooking);
  }
};

window.paneGoBack = function() {
  if (bookingStep === 2) {
    bookingStep = 1;
    document.getElementById('bookingStep2Content').hidden = true;
    document.getElementById('bookingStep1Content').hidden = false;
    document.getElementById('paneBackBtn').hidden = true;
    document.getElementById('progStep2').classList.remove('active');
    
    // Remove required attrs
    document.getElementById('custName').removeAttribute('required');
    document.getElementById('custEmail').removeAttribute('required');
    document.getElementById('custPhone').removeAttribute('required');

    calculateBookingPrice(); // updates button text

  } else if (bookingStep === 3) {
    bookingStep = 2;
    document.getElementById('bookingStep3Content').hidden = true;
    document.getElementById('bookingStep2Content').hidden = false;
    document.getElementById('progStep3').classList.remove('active');
    document.getElementById('paneNextBtn').innerText = 'Next Step';
  }
};

// 7. Setup Quick Book Shortcut from Tours Card
window.quickBookTour = function(tourId) {
  openTourDetails(tourId);
};

// 8. Main page Enquiry Form Submission
function setupBookingForm() {
  const quickBookingForm = document.getElementById('bookingForm');
  const quickConfirmPanel = document.getElementById('confirmationPanel');
  const quickCardFields = document.getElementById('cardPaymentFields');
  const quickPhotoUpload = document.getElementById('bookingPhotoUpload');
  const quickPhotoPreview = document.getElementById('bookingPhotoPreview');

  if (!quickBookingForm) return;

  const updateQuickCardFields = () => {
    const selected = quickBookingForm.querySelector('input[name="paymentMethod"]:checked')?.value;
    if (selected === 'Card') {
      if (quickCardFields) quickCardFields.hidden = false;
    } else {
      if (quickCardFields) quickCardFields.hidden = true;
    }
  };

  const renderQuickPhotoPreview = (event) => {
    if (!quickPhotoPreview) return;
    const files = Array.from(event.target.files || []).slice(0, 10);
    quickPhotoPreview.innerHTML = files.map(file => {
      const objectUrl = URL.createObjectURL(file);
      return `
        <div class="photo-thumb">
          <img src="${objectUrl}" alt="Uploaded photo preview" />
          <span>${file.name}</span>
        </div>
      `;
    }).join('');
  };

  quickBookingForm.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', updateQuickCardFields);
  });

  if (quickPhotoUpload) {
    quickPhotoUpload.addEventListener('change', renderQuickPhotoPreview);
  }

  updateQuickCardFields();

  quickBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(quickBookingForm);
    const tourSelectionId = formData.get('tourType')?.toString();
    const packageTier = formData.get('packageTier')?.toString() || 'Gold';
    const dateVal = formData.get('date')?.toString();
    const pickupTime = formData.get('pickupTime')?.toString();
    const tourStartTime = formData.get('tourStartTime')?.toString();
    const guestsSelectVal = formData.get('guests')?.toString();
    const firstNameVal = formData.get('firstName')?.toString().trim();
    const lastNameVal = formData.get('lastName')?.toString().trim();
    const emailVal = formData.get('email')?.toString().trim();
    const phoneVal = formData.get('phone')?.toString().trim();
    const countryVal = formData.get('country')?.toString().trim();
    const pickupLocationVal = formData.get('pickupLocation')?.toString().trim();
    const paymentMethodVal = formData.get('paymentMethod')?.toString() || 'Payment Link';
    const transferTypeVal = formData.get('transferType')?.toString() || 'shared';
    const notesVal = formData.get('notes')?.toString().trim();
    const photoFiles = Array.from((quickBookingForm.querySelector('#bookingPhotoUpload')?.files) || []);

    if (!firstNameVal || !lastNameVal || !emailVal || !phoneVal || !tourSelectionId || !dateVal || !guestsSelectVal || !countryVal || !pickupLocationVal || !pickupTime || !tourStartTime) {
      alert('Please fill in all requested fields to complete your booking enquiry.');
      return;
    }

    let cardToken = null;
    if (paymentMethodVal === 'Card') {
      cardToken = await createStripeToken(stripeCardElement);
      if (!cardToken) {
        return;
      }
    }

    const refNum = `AA-${Math.floor(100000 + Math.random() * 900000)}`;
    const tourObject = TOURS.find(t => t.id === tourSelectionId) || { price: 85, id: "custom", title: "Custom Tour" };
    const packageMultiplier = packageTier === 'Premium' ? 1.25 : packageTier === 'VIP' ? 1.5 : 1.0;
    let transferFee = 0;
    if (tourObject.category !== 'attractions') {
      if (transferTypeVal === 'private') transferFee = 120;
    } else {
      if (transferTypeVal === 'shared') transferFee = 25 * parseInt(guestsSelectVal || '2', 10);
    }

    const approxTotal = Math.round((tourObject.price * parseInt(guestsSelectVal || '2', 10) * packageMultiplier + transferFee) * (1 + TAX_RATE));

    const photoMetadata = photoFiles.slice(0, 10).map(file => ({ name: file.name, size: file.size, type: file.type }));

    const newEnquiry = {
      refId: refNum,
      tourId: tourObject.id,
      tourTitle: tourObject.title,
      packageTier,
      date: dateVal,
      pickupTime,
      tourStartTime,
      guests: guestsSelectVal,
      firstName: firstNameVal,
      lastName: lastNameVal,
      name: `${firstNameVal} ${lastNameVal}`,
      email: emailVal,
      phone: phoneVal,
      country: countryVal,
      pickupLocation: pickupLocationVal,
      paymentMethod: paymentMethodVal,
      cardToken,
      notes: notesVal,
      photos: photoMetadata,
      transferType: transferTypeVal,
      totalPrice: approxTotal,
      status: "pending"
    };

    const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
    bookingsList.unshift(newEnquiry);
    localStorage.setItem('sd_bookings_list', JSON.stringify(bookingsList));

    quickBookingForm.hidden = true;
    if (quickConfirmPanel) {
      quickConfirmPanel.innerHTML = `
        <div class="quick-success">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#8A1538" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <h3>Booking Inquiry Submitted!</h3>
          <p>Your request has been logged under ID: <strong>${refNum}</strong>.</p>
          <p>We will email your confirmation and payment details to <strong>${emailVal}</strong> shortly.</p>
        </div>
      `;
      quickConfirmPanel.hidden = false;
    }

    simulateBookingEmails(newEnquiry);
    console.log('Quick booking enquiry submitted & logged:', newEnquiry);
  });
}

// 9. Main FAQ Accordion
function setupFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-quest');
  faqQuestions.forEach(quest => {
    quest.addEventListener('click', () => {
      const answer = quest.nextElementSibling;
      const isOpen = !answer.hidden;

      // Toggle current
      answer.hidden = isOpen;
      quest.classList.toggle('active', !isOpen);

      // Rotate chevron icon
      const icon = quest.querySelector('.faq-chevron');
      if (icon) {
        icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });
}

// 10. WhatsApp Widget Toggle
function setupWhatsAppWidget() {
  const btn = document.getElementById('whatsappBtn');
  const card = document.getElementById('chatExpertCard');
  const closeBtn = document.getElementById('closeChatWidget');

  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (card) {
      card.hidden = !card.hidden;
      card.classList.toggle('active', !card.hidden);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (card) {
        card.hidden = true;
        card.classList.remove('active');
      }
    });
  }
}

// 11. Smooth Navigation Links Scroll
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      if (targetId.startsWith('#adminTab')) return; // ignore admin tab routing
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close modal and exit admin view if traveling to public section anchors
        closeTourModal();
        toggleAdminView(false);

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ==========================================
// ADMIN DASHBOARD MODULE
// ==========================================

function setupAdminPanelToggles() {
  // Add listeners to navbar and footer triggers
  const adminLinks = document.querySelectorAll('.trigger-admin-portal');
  adminLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showAdminLogin();
    });
  });

  const exitBtn = document.getElementById('exitAdminBtn');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      toggleAdminView(false);
    });
  }

  // Admin Login Gate
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('loginUser')?.value.trim();
      const pass = document.getElementById('loginPass')?.value.trim();
      const errEl = document.getElementById('loginError');

      if (user === 'admin' && pass === 'admin') {
        // Hide gate, show dashboard
        const gate = document.getElementById('adminLoginGate');
        if (gate) gate.hidden = true;
        toggleAdminView(true);
      } else {
        if (errEl) errEl.hidden = false;
        document.getElementById('loginPass').value = '';
      }
    });
  }

  // Toggle password visibility
  const togglePassBtn = document.getElementById('toggleLoginPass');
  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      const passInput = document.getElementById('loginPass');
      if (passInput) {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
      }
    });
  }

  // Admin inner tab buttons
  const tabButtons = document.querySelectorAll('.admin-nav-item[data-tab]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.dataset.tab;
      switchAdminTab(tabName);
    });
  });

  // Refresh Data button
  const refreshBtn = document.getElementById('refreshDataBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderAdminStats();
      renderAdminBookings();
      renderAdminCatalog();
      renderAdminAnalytics();
      showAdminToast('Dashboard data refreshed successfully.', 'success');
    });
  }

  // Clear All Data button
  const clearBtn = document.getElementById('clearDataBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('Are you sure you want to clear ALL booking records? This cannot be undone.')) return;
      localStorage.removeItem('sd_bookings_list');
      renderAdminStats();
      renderAdminBookings();
      renderAdminAnalytics();
      showAdminToast('All booking records cleared.', 'warning');
    });
  }

  // Reset All Rates
  const resetRatesBtn = document.getElementById('resetAllRatesBtn');
  if (resetRatesBtn) {
    resetRatesBtn.addEventListener('click', () => {
      if (!confirm('Reset ALL tour prices back to default base rates?')) return;
      DEFAULT_TOURS.forEach(dt => {
        const ti = TOURS.findIndex(t => t.id === dt.id);
        if (ti !== -1) TOURS[ti].price = dt.price;
      });
      localStorage.setItem('sd_tours_catalog', JSON.stringify(TOURS));
      renderAdminCatalog();
      renderTours();
      showAdminToast('All rates reset to default base pricing.', 'success');
    });
  }

  // Status filter pills in Bookings tab
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      renderAdminBookings(
        document.getElementById('adminBookingSearch')?.value || '',
        filter
      );
    });
  });

  // Bookings Search Input
  const bookingSearch = document.getElementById('adminBookingSearch');
  if (bookingSearch) {
    bookingSearch.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
      renderAdminBookings(e.target.value, activeFilter);
    });
  }

  // Live datetime clock in header
  startAdminClock();
}

function startAdminClock() {
  const el = document.getElementById('adminHeaderDatetime');
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    }) + ' · ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  }
  tick();
  setInterval(tick, 30000);
}

const TAB_TITLES = {
  overview: { breadcrumb: 'Dashboard / Overview', title: 'Overview' },
  bookings: { breadcrumb: 'Dashboard / Bookings', title: 'Bookings Queue' },
  catalog: { breadcrumb: 'Dashboard / Catalog', title: 'Tour Catalog' },
  analytics: { breadcrumb: 'Dashboard / Analytics', title: 'Analytics' }
};

function switchAdminTab(tabName) {
  // Update nav buttons
  document.querySelectorAll('.admin-nav-item[data-tab]').forEach(t => t.classList.remove('active'));
  const activeBtn = document.querySelector(`.admin-nav-item[data-tab="${tabName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update content panes
  document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
  const targetPane = document.getElementById(`adminTab-${tabName}`);
  if (targetPane) targetPane.classList.add('active');

  // Update header breadcrumb
  const meta = TAB_TITLES[tabName];
  if (meta) {
    const bc = document.getElementById('adminHeaderBreadcrumb');
    const ht = document.getElementById('adminHeaderTitle');
    if (bc) bc.textContent = meta.breadcrumb;
    if (ht) ht.textContent = meta.title;
  }
}

function showAdminLogin() {
  const gate = document.getElementById('adminLoginGate');
  if (gate) gate.hidden = false;
}


// Toggle overall view B2C Storefront vs Admin panel
window.toggleAdminView = function(showAdmin) {
  const publicView = document.getElementById('publicView');
  const adminView = document.getElementById('adminView');

  if (showAdmin) {
    if (publicView) publicView.hidden = true;
    if (adminView) adminView.hidden = false;
    
    // Refresh admin data
    renderAdminStats();
    renderAdminBookings();
    renderAdminCatalog();
    renderAdminAnalytics();

    // Scroll to top of dashboard
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    if (publicView) publicView.hidden = false;
    if (adminView) adminView.hidden = true;
    
    // Refresh B2C catalog in case price changed in admin
    renderTours();
  }
};

// Calculate and render stats cards
function renderAdminStats() {
  const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
  
  // Total Revenue (Confirmed only)
  const revenue = bookingsList
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // Booking count
  const bookingsCount = bookingsList.length;

  // Active/Pending enquiries
  const pendingCount = bookingsList.filter(b => b.status === 'pending').length;

  // Eco-safaris booked count
  const ecoSafaris = bookingsList.filter(b => b.tourId === 'premium-dune-dinner' || b.tourId === 'shared-evening-safari').length;

  // Inject into DOM
  const valRevenue = document.getElementById('statValRevenue');
  const valBookings = document.getElementById('statValBookings');
  const valPending = document.getElementById('statValPending');
  const valEco = document.getElementById('statValEco');

  if (valRevenue) valRevenue.innerText = `$${revenue.toLocaleString()}`;
  if (valBookings) valBookings.innerText = bookingsCount.toString();
  if (valPending) valPending.innerText = pendingCount.toString();
  if (valEco) valEco.innerText = ecoSafaris.toString();

  // Update pending badge in sidebar nav
  const pendingBadge = document.getElementById('pendingBadge');
  if (pendingBadge) {
    pendingBadge.textContent = pendingCount.toString();
    pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
  }

  // Notification dot if there are pending items
  const notifyDot = document.getElementById('adminNotifyDot');
  if (notifyDot) notifyDot.hidden = pendingCount === 0;
}

// Render Bookings Queue Table
function renderAdminBookings(filterQuery = '', statusFilter = 'all') {
  const tableBody = document.getElementById('adminBookingsTableBody');
  const tableBodyFull = document.getElementById('adminBookingsTableBodyFull');
  if (!tableBody && !tableBodyFull) return;

  const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
  const query = filterQuery.toLowerCase().trim();

  const filtered = bookingsList.filter(b => {
    const clientName = (b.name || `${b.firstName || ''} ${b.lastName || ''}`).trim();
    const matchesQuery = query === '' || 
      b.refId.toLowerCase().includes(query) ||
      clientName.toLowerCase().includes(query) ||
      b.tourTitle.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // Update records count label
  const countLabel = document.getElementById('bookingsCountLabel');
  if (countLabel) countLabel.textContent = `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`;

  let htmlContent = '';
  if (filtered.length === 0) {
    htmlContent = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted);">
          No booking records found matching search.
        </td>
      </tr>
    `;
  } else {
    htmlContent = filtered.map(b => {
      const formattedPrice = b.totalPrice > 0 ? `$${b.totalPrice}` : 'Enquiry';
      const statusClass = `badge-status badge-${b.status}`;
      
      // Conditional actions based on status
      let actionButtons = '';
      if (b.status === 'pending') {
        actionButtons = `
          <button class="admin-btn btn-confirm" onclick="event.stopPropagation(); updateBookingStatus('${b.refId}', 'confirmed')" title="Confirm Booking">
            Confirm
          </button>
          <button class="admin-btn btn-cancel" onclick="event.stopPropagation(); updateBookingStatus('${b.refId}', 'cancelled')" title="Cancel Booking">
            Cancel
          </button>
        `;
      }
      
      // Always provide delete option
      actionButtons += `
        <button class="admin-btn btn-delete" onclick="event.stopPropagation(); deleteBooking('${b.refId}')" title="Delete record">
          Delete
        </button>
      `;

      return `
        <tr class="clickable-row" onclick="openBookingDrawer('${b.refId}')">
          <td><strong>${b.refId}</strong></td>
          <td>
            <div style="font-weight: 600;">${b.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${b.email}</div>
          </td>
          <td>${b.tourTitle}</td>
          <td>${b.date}</td>
          <td>${b.guests} Guests</td>
          <td><strong>${formattedPrice}</strong></td>
          <td><span class="${statusClass}">${b.status}</span></td>
          <td>
            <div class="admin-table-actions">
              ${actionButtons}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (tableBody) tableBody.innerHTML = htmlContent;
  if (tableBodyFull) tableBodyFull.innerHTML = htmlContent;
}

// Update status of booking (Confirmed / Cancelled)
window.updateBookingStatus = function(refId, newStatus) {
  const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
  const index = bookingsList.findIndex(b => b.refId === refId);
  
  if (index !== -1) {
    bookingsList[index].status = newStatus;
    localStorage.setItem('sd_bookings_list', JSON.stringify(bookingsList));
    
    // Re-render admin views
    renderAdminStats();
    renderAdminBookings(document.getElementById('adminBookingSearch')?.value || '');
    renderAdminAnalytics();

    // Trigger toast notification
    let toastType = 'success';
    if (newStatus === 'cancelled') toastType = 'warning';
    showAdminToast(`Booking ${refId} status updated to: ${newStatus.toUpperCase()}`, toastType);

    // If the drawer is currently open for this booking, refresh the drawer details in real-time
    const drawer = document.getElementById('adminBookingDrawer');
    if (drawer && drawer.classList.contains('open') && currentTour && currentTour.refId === refId) {
      openBookingDrawer(refId);
    }
    
    console.log(`Booking ${refId} status updated to: ${newStatus}`);
  }
};

// Delete booking record
window.deleteBooking = function(refId) {
  if (!confirm(`Are you sure you want to permanently delete booking record ${refId}?`)) {
    return;
  }

  const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
  const filtered = bookingsList.filter(b => b.refId !== refId);
  localStorage.setItem('sd_bookings_list', JSON.stringify(filtered));

  // Re-render admin views
  renderAdminStats();
  renderAdminBookings(document.getElementById('adminBookingSearch')?.value || '');
  renderAdminAnalytics();

  showAdminToast(`Booking record ${refId} permanently deleted.`, 'error');
  console.log(`Booking record ${refId} deleted.`);
};

// Render Tours price catalog manager (Visual card grid style)
function renderAdminCatalog() {
  const gridContainer = document.getElementById('adminCatalogGrid');
  if (!gridContainer) return;

  gridContainer.innerHTML = TOURS.map(tour => {
    // Calculate rate difference relative to baseline defaults
    const defaultTour = DEFAULT_TOURS.find(d => d.id === tour.id) || { price: tour.price };
    const diff = tour.price - defaultTour.price;
    let deltaBadge = '';
    
    if (diff > 0) {
      deltaBadge = `<span class="price-delta-badge delta-plus">+$${diff} vs base</span>`;
    } else if (diff < 0) {
      deltaBadge = `<span class="price-delta-badge delta-minus">-$${Math.abs(diff)} vs base</span>`;
    } else {
      deltaBadge = `<span class="price-delta-badge delta-none">Standard Rate</span>`;
    }

    return `
      <div class="admin-catalog-card">
        <div class="catalog-card-image" style="background-image: url('${tour.image}')">
          <span class="catalog-card-category">${tour.category}</span>
        </div>
        <div class="catalog-card-body">
          <h4 class="catalog-card-title">${tour.title}</h4>
          
          <div class="catalog-card-editor-row">
            <span class="catalog-price-label">Base Price / Pax</span>
            <div class="catalog-price-inputs">
              <span>USD</span>
              <input type="number" min="1" id="priceInput-${tour.id}" value="${tour.price}" />
            </div>
          </div>
          
          <div class="catalog-card-footer">
            ${deltaBadge}
            <button class="catalog-save-btn" onclick="saveTourPrice('${tour.id}')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Save Rate
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Save modified tour price in memory and LocalStorage
window.saveTourPrice = function(tourId) {
  const inputEl = document.getElementById(`priceInput-${tourId}`);
  if (!inputEl) return;

  const newPrice = parseInt(inputEl.value, 10);
  if (isNaN(newPrice) || newPrice <= 0) {
    showAdminToast('Please enter a valid positive base rate.', 'error');
    return;
  }

  const tourIndex = TOURS.findIndex(t => t.id === tourId);
  if (tourIndex !== -1) {
    const oldPrice = TOURS[tourIndex].price;
    TOURS[tourIndex].price = newPrice;
    localStorage.setItem('sd_tours_catalog', JSON.stringify(TOURS));
    
    // Refresh views
    renderAdminCatalog();
    renderTours(); // sync B2C catalog cards
    
    showAdminToast(`Rate updated successfully: $${oldPrice} → $${newPrice}`, 'success');
    console.log(`Saved price update: ${tourId} -> USD ${newPrice}`);
  }
};

// Render Analytics Tab (Popularity distribution charts)
function renderAdminAnalytics() {
  const analyticsContainer = document.getElementById('adminAnalyticsContainer');
  const avgOrderValEl = document.getElementById('statValAvgOrder');
  if (!analyticsContainer) return;

  const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
  const totalBookings = bookingsList.length;

  // Calculate Average Order Value
  const totalPaidSum = bookingsList.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const avgOrderVal = totalBookings > 0 ? Math.round(totalPaidSum / totalBookings) : 0;
  if (avgOrderValEl) avgOrderValEl.innerText = `$${avgOrderVal}`;

  // Confirmation Rate
  const confirmedCount = bookingsList.filter(b => b.status === 'confirmed').length;
  const convRate = totalBookings > 0 ? Math.round((confirmedCount / totalBookings) * 100) : 0;
  const convRateEl = document.getElementById('statValConvRate');
  if (convRateEl) convRateEl.innerText = `${convRate}%`;

  if (totalBookings === 0) {
    analyticsContainer.innerHTML = `
      <div class="admin-panel-card" style="text-align: center; padding: 3rem;">
        <div style="color: var(--admin-text-muted); margin-bottom: 0.8rem;">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <p style="color: var(--admin-text-muted); font-size: 0.9rem;">No booking data yet. Complete bookings to generate analytics.</p>
      </div>
    `;
    return;
  }

  // Count booking volume per tour
  const popularityMap = {};
  TOURS.forEach(t => { popularityMap[t.id] = { title: t.title, count: 0 }; });
  
  // Account for custom enquiries not in default IDs
  popularityMap['enquiry'] = { title: 'Other/Bespoke Enquiries', count: 0 };

  bookingsList.forEach(b => {
    if (popularityMap[b.tourId]) {
      popularityMap[b.tourId].count++;
    } else {
      popularityMap['enquiry'].count++;
    }
  });

  // Sort by counts descending
  const sortedStats = Object.keys(popularityMap)
    .map(key => ({ id: key, ...popularityMap[key] }))
    .filter(item => item.count > 0 || item.id !== 'enquiry') // show custom enquiries if greater than 0
    .sort((a, b) => b.count - a.count);

  analyticsContainer.innerHTML = `
    <div class="admin-panel-card" style="margin-bottom: 1.5rem;">
    <div class="admin-panel-card-header"><div><h3 class="admin-panel-title">Experience Booking Distribution</h3><p class="admin-panel-sub">Breakdown of all-time bookings by tour package</p></div></div>
    <div style="padding: 1.5rem;"><div class="analytics-bars-list">
      ${sortedStats.map(item => {
        const percentage = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0;
        return `
          <div class="analytics-bar-row">
            <div class="bar-meta">
              <span class="bar-title">${item.title}</span>
              <span class="bar-count"><strong>${item.count}</strong> booking(s) (${percentage}%)</span>
            </div>
            <div class="bar-container-visual">
              <div class="bar-fill-visual" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div></div></div>
  `;
}

// Custom Toast notification engine
window.showAdminToast = function(message, type = 'success') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast toast-${type}`;
  
  // Icon selector
  let iconHtml = '';
  if (type === 'success') {
    iconHtml = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#25D366" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'warning') {
    iconHtml = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C5A059" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconHtml = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8A1538" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  }

  toast.innerHTML = `
    ${iconHtml}
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.classList.add('dismissing'); setTimeout(() => this.parentElement.remove(), 300)" aria-label="Close alert">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  container.appendChild(toast);

  // Auto dismiss
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('dismissing');
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
};

// Slide-out Drawer auditing controls
window.openBookingDrawer = function(refId) {
  const bookingsList = JSON.parse(localStorage.getItem('sd_bookings_list') || '[]');
  const booking = bookingsList.find(b => b.refId === refId);
  if (!booking) return;

  const overlay = document.getElementById('adminBookingDrawerOverlay');
  const drawer = document.getElementById('adminBookingDrawer');
  if (!overlay || !drawer) return;

  // Cache currently audited booking reference globally
  currentTour = { refId: refId }; 

  const statusClass = `badge-status badge-${booking.status}`;
  const formattedPrice = booking.totalPrice > 0 ? `$${booking.totalPrice}` : 'Enquiry';
  
  let transferName = 'Shared Vehicle Transfer';
  if (booking.transferType === 'private') transferName = 'Private SUV Transfer';
  if (booking.transferType === 'none') transferName = 'Self-Drive (No pickup)';

  // Build drawer action buttons
  let actionButtons = '';
  if (booking.status === 'pending') {
    actionButtons = `
      <button class="admin-btn btn-confirm" onclick="updateBookingStatus('${booking.refId}', 'confirmed'); openBookingDrawer('${booking.refId}');">
        Confirm Booking
      </button>
      <button class="admin-btn btn-cancel" onclick="updateBookingStatus('${booking.refId}', 'cancelled'); openBookingDrawer('${booking.refId}');">
        Cancel Booking
      </button>
    `;
  } else {
    actionButtons = `
      <button class="admin-btn btn-cancel" onclick="updateBookingStatus('${booking.refId}', 'pending'); openBookingDrawer('${booking.refId}');" style="background-color: var(--accent-light); color: var(--accent-hover); border-color: rgba(197, 160, 89, 0.3);">
        Re-open Pending Status
      </button>
    `;
  }

  drawer.innerHTML = `
    <div class="admin-drawer-header">
      <h3>Audit Booking</h3>
      <button class="close-drawer-btn" onclick="closeBookingDrawer()" aria-label="Close drawer">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    
    <div class="admin-drawer-body">
      <div>
        <div class="drawer-section-title">Log Summary</div>
        <ul class="drawer-details-list">
          <li><span>Reference ID:</span> <strong>${booking.refId}</strong></li>
          <li><span>Process Status:</span> <strong><span class="${statusClass}">${booking.status}</span></strong></li>
          <li><span>Travel Date:</span> <strong>${booking.date}</strong></li>
        </ul>
      </div>

      <div>
        <div class="drawer-section-title">Client Details</div>
        <ul class="drawer-details-list">
          <li><span>Full Name:</span> <strong>${booking.name || `${booking.firstName || ''} ${booking.lastName || ''}`.trim()}</strong></li>
          <li><span>Email:</span> <strong><a href="mailto:${booking.email}" style="color:var(--admin-accent);text-decoration:underline;">${booking.email}</a></strong></li>
          <li><span>Phone:</span> <strong>${booking.phone}</strong></li>
          <li><span>Country:</span> <strong>${booking.country || 'N/A'}</strong></li>
          <li><span>Pickup location:</span> <strong>${booking.pickupLocation || 'N/A'}</strong></li>
          <li><span>Pickup time:</span> <strong>${booking.pickupTime || 'TBD'}</strong></li>
          <li><span>Start time:</span> <strong>${booking.tourStartTime || 'TBD'}</strong></li>
          <li><span>Package tier:</span> <strong>${booking.packageTier || 'Gold'}</strong></li>
          <li><span>Payment method:</span> <strong>${booking.paymentMethod || 'Payment Link'}</strong></li>
          <li><span>Travel Notes:</span> <strong style="text-align:right; font-weight:normal; color:var(--text-muted);">${booking.notes || 'None specified'}</strong></li>
          <li><span>Uploaded photos:</span> <strong>${booking.photos?.length || 0} file(s)</strong></li>
        </ul>
      </div>

      <div>
        <div class="drawer-section-title">Invoice Voucher</div>
        <div class="drawer-invoice-box">
          <h4 style="margin-bottom:0.8rem;">${booking.tourTitle}</h4>
          <ul class="drawer-details-list" style="gap:0.4rem; font-size:0.82rem;">
            <li><span>Base Ticket Rate:</span> <strong>${formattedPrice}</strong></li>
            <li><span>Passenger Count:</span> <strong>${booking.guests} Guest(s)</strong></li>
            <li><span>Transportation:</span> <strong>${transferName}</strong></li>
          </ul>
          <div class="drawer-invoice-total">
            <span>Total Value:</span>
            <strong>${formattedPrice}</strong>
          </div>
        </div>
        <button class="btn-print-summary" onclick="alert('Print dialog dispatched. Voucher PDF-#AA-${booking.refId} generated.')" style="margin-top:1rem;">
          Generate Invoice PDF
        </button>
      </div>
    </div>

    <div class="admin-drawer-footer">
      <div class="drawer-action-buttons">
        ${actionButtons}
        <button class="admin-btn btn-delete" onclick="deleteBooking('${booking.refId}'); closeBookingDrawer();" style="flex-grow:1; font-weight:700;">
          Delete Record
        </button>
      </div>
    </div>
  `;

  overlay.hidden = false;
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeBookingDrawer = function() {
  const overlay = document.getElementById('adminBookingDrawerOverlay');
  const drawer = document.getElementById('adminBookingDrawer');
  if (overlay && drawer) {
    drawer.classList.remove('open');
    setTimeout(() => {
      overlay.hidden = true;
      document.body.style.overflow = '';
      currentTour = null; // clear audited ref cache
    }, 300);
  }
};
