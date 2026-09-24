/**
 * IDLMS - Core Front-end Interactions & Demo States
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Keyboard Shortcut (Cmd/Ctrl + K) to focus search
    const searchInput = document.getElementById('globalSearchInput');
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    // 2. Search Submission (Header Search Forms across all pages)
    document.querySelectorAll('.header-search').forEach((form) => {
        form.addEventListener('submit', (e) => {
            const input = form.querySelector('.header-search-input');
            if (input && input.value.trim() !== '') {
                e.preventDefault();
                const query = encodeURIComponent(input.value.trim());
                window.location.href = `search-results.html?q=${query}`;
            } else {
                e.preventDefault();
                showToast('Please enter search keywords or ISBN', 'info');
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (searchInput.value.trim() !== '') {
                    const query = encodeURIComponent(searchInput.value.trim());
                    window.location.href = `search-results.html?q=${query}`;
                } else {
                    showToast('Please enter search keywords or ISBN', 'info');
                }
            }
        });
    }

    // 11. Discover Search Action
    const discoverForm = document.getElementById('discoverSearchForm');
    const discoverInput = document.getElementById('discoverSearchInput');
    const discoverBtn = document.getElementById('discoverSearchBtn');
    
    const executeDiscoverSearch = (e) => {
        if (e) e.preventDefault();
        const query = discoverInput ? discoverInput.value.trim() : '';
        if (query) {
            const q = encodeURIComponent(query);
            window.location.href = `search-results.html?q=${q}`;
        } else {
            showToast('Please enter search keywords or ISBN', 'info');
        }
    };

    if (discoverForm) {
        discoverForm.addEventListener('submit', executeDiscoverSearch);
    }
    if (discoverBtn) {
        discoverBtn.addEventListener('click', executeDiscoverSearch);
    }
    if (discoverInput) {
        discoverInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeDiscoverSearch(e);
            }
        });
    }

    // Dynamic Query Parameter Reader on Search Results Page
    const isSearchResultsPage = window.location.pathname.includes('search-results.html') || document.querySelector('.search-results-main');
    if (isSearchResultsPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        if (searchQuery) {
            if (searchInput) {
                searchInput.value = searchQuery;
            }
            const subtitle = document.querySelector('.search-page-subtitle');
            if (subtitle) {
                subtitle.textContent = `Showing results for "${searchQuery}"`;
            }
            const pageTitle = document.querySelector('.search-page-title');
            if (pageTitle) {
                pageTitle.setAttribute('data-query', searchQuery);
            }
            const aiDesc = document.querySelector('.ai-banner-desc');
            if (aiDesc) {
                aiDesc.textContent = `Understanding your intent: books about ${searchQuery}, data communication, protocols, and related topics.`;
            }
            document.title = `IDLMS - Search Results: ${searchQuery}`;
        }
    }

    // 22. Search Results Page Actions
    document.querySelectorAll('.btn-result-action[data-action="borrow"]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const book = btn.getAttribute('data-book') || 'Book';
            showToast(`Borrow request placed for "${book}"! Available for pickup at 3rd Floor desk.`, 'success');
        });
    });

    document.querySelectorAll('.btn-result-action[data-action="read"]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const book = btn.getAttribute('data-book') || 'E-Book';
            showToast(`Opening Digital E-Book Reader for "${book}"...`, 'info');
        });
    });

    document.querySelectorAll('.btn-result-reserve').forEach((btn) => {
        btn.addEventListener('click', () => {
            const book = btn.getAttribute('data-book') || 'Book';
            showToast(`Reserved "${book}"! You will be notified in 2 days when returned.`, 'success');
        });
    });

    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            showToast('Filters applied: Showing 142 matching resources', 'info');
        });
    }

    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.querySelectorAll('.filters-sidebar-card input[type="checkbox"]').forEach(cb => cb.checked = false);
            showToast('All search filters reset.', 'info');
        });
    }

    const searchSortSelect = document.getElementById('searchSortSelect');
    if (searchSortSelect) {
        searchSortSelect.addEventListener('change', () => {
            const text = searchSortSelect.options[searchSortSelect.selectedIndex].text;
            showToast(`Sorted results by: ${text}`, 'info');
        });
    }

    const learnMoreAiBtn = document.getElementById('learnMoreAiBtn');
    if (learnMoreAiBtn) {
        learnMoreAiBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('AI Semantic Search: Maps query intent to catalog concepts using vector search.', 'ai');
        });
    }

    // 3. Notification Dropdown Toggle
    const notifBtn = document.getElementById('notifBtn');
    const notifMenu = document.getElementById('notifMenu');
    if (notifBtn && notifMenu) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPopovers();
            notifMenu.classList.toggle('show');
        });
    }

    // 4. User Profile Dropdown Toggle
    const profileWidget = document.getElementById('profileWidget');
    const profileMenu = document.getElementById('profileMenu');
    if (profileWidget && profileMenu) {
        profileWidget.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPopovers();
            profileMenu.classList.toggle('show');
        });
    }

    // 5. Book Action Dropdowns (Three-dots menu)
    document.querySelectorAll('.btn-icon-dots, .btn-res-dots, .btn-history-dots').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = btn.closest('.dropdown-container');
            const menu = parent ? parent.querySelector('.popover-menu') : null;
            if (menu) {
                const isCurrentlyOpen = menu.classList.contains('show');
                closeAllPopovers();
                if (!isCurrentlyOpen) {
                    menu.classList.add('show');
                }
            }
        });
    });

    // Close popovers on click outside
    document.addEventListener('click', () => {
        closeAllPopovers();
    });

    function closeAllPopovers() {
        document.querySelectorAll('.popover-menu').forEach((menu) => {
            menu.classList.remove('show');
        });
    }

    // 6. AI Assistant Prompt Buttons
    document.querySelectorAll('.ai-prompt-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const promptText = btn.querySelector('.ai-prompt-text')?.textContent || 'Prompt';
            showToast(`AI Assistant: Processing "${promptText}"...`, 'ai');
        });
    });

    // 7. AI Chat Button
    const aiChatBtn = document.getElementById('aiChatBtn');
    if (aiChatBtn) {
        aiChatBtn.addEventListener('click', () => {
            showToast('Opening AI Library Assistant...', 'ai');
        });
    }

    // 8. Continue Reading Button
    const continueReadingBtn = document.getElementById('continueReadingBtn');
    if (continueReadingBtn) {
        continueReadingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Opening Reader for "Thinking, Fast and Slow" (Page 324/480)...', 'info');
        });
    }

    // 9. Book Mini Card Clicks
    document.querySelectorAll('.mini-book-card').forEach((card) => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.mini-book-title')?.textContent || 'Book';
            showToast(`Loading details for "${title}"...`, 'info');
        });
    });

    // 10. Discover Resource Type Tabs
    document.querySelectorAll('.resource-tab-btn').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.resource-tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.querySelector('span')?.textContent || 'Filter';
            showToast(`Filtering by resource type: ${tabName}`, 'info');
        });
    });



    // 12. Advanced Search Button
    const advSearchBtn = document.getElementById('advancedSearchBtn');
    if (advSearchBtn) {
        advSearchBtn.addEventListener('click', () => {
            showToast('Opening Advanced Search Filters (Author, Year, Publisher, ISBN)...', 'info');
        });
    }

    // 13. Trending Topics Click
    document.querySelectorAll('.trending-card').forEach((card) => {
        card.addEventListener('click', () => {
            const topic = card.querySelector('.trending-title')?.textContent || 'Topic';
            showToast(`Exploring trending topic: "${topic}"`, 'info');
        });
    });

    // 14. Category Cards Click
    document.querySelectorAll('.category-card, .tinted-cat-card').forEach((card) => {
        card.addEventListener('click', () => {
            const category = card.querySelector('.category-title, .tinted-cat-title')?.textContent || 'Category';
            showToast(`Browsing category: "${category}"`, 'info');
        });
    });

    // 15. Featured Digital Resources Click
    document.querySelectorAll('.featured-res-card').forEach((card) => {
        card.addEventListener('click', () => {
            const resName = card.querySelector('.featured-res-name')?.textContent || 'Provider';
            showToast(`Accessing institutional subscription: ${resName}`, 'info');
        });
    });

    // 16. Discover Book View Button Click
    document.querySelectorAll('.btn-book-view').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = btn.closest('.discover-book-col');
            const title = parent?.querySelector('.discover-book-title')?.textContent || 'Book';
            showToast(`Viewing book details: "${title}"`, 'info');
        });
    });

    // 17. Borrowing Tabs (Active, Due Soon, Overdue, Returned)
    document.querySelectorAll('.borrowing-tab-btn').forEach((tab) => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.borrowing-tab-btn').forEach(t => {
                t.classList.remove('active');
                t.querySelector('.tab-count-pill')?.classList.remove('active');
            });
            tab.classList.add('active');
            tab.querySelector('.tab-count-pill')?.classList.add('active');
            const tabName = tab.querySelector('span')?.textContent || 'Tab';
            showToast(`Filtered table to: ${tabName} borrowings`, 'info');
        });
    });

    // 18. Sort Dropdown Change
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const selectedText = sortSelect.options[sortSelect.selectedIndex].text;
            showToast(`${selectedText}`, 'info');
        });
    }

    // 19. Renew Book Buttons
    document.querySelectorAll('.btn-renew').forEach((btn) => {
        btn.addEventListener('click', () => {
            const bookTitle = btn.getAttribute('data-book') || 'Book';
            showToast(`Renewed "${bookTitle}" for +14 days! New Due Date: 12 Jul 2025`, 'success');
        });
    });

    // Helper to determine the current page origin
    function getCurrentPageSlug() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('digital-library.html') || path.includes('digital.html') || path.endsWith('/digital-library')) return 'digital-library';
        if (path.includes('reading-history.html') || path.includes('history.html') || path.endsWith('/reading-history') || path.endsWith('/history')) return 'reading-history';
        if (path.includes('reservations.html') || path.endsWith('/reservations')) return 'reservations';
        if (path.includes('dashboard.html') || path.endsWith('/dashboard') || path.endsWith('/')) return 'dashboard';
        if (path.includes('discover.html') || path.endsWith('/discover')) return 'discover';
        if (path.includes('borrowings.html') || path.endsWith('/borrowings')) return 'borrowings';
        if (path.includes('search-results.html') || path.endsWith('/search-results')) return 'search-results';
        return 'dashboard';
    }

    // Helper to navigate to book details with origin tracking
    function goToBookDetails(bookId) {
        if (!bookId) return;
        const fromSlug = getCurrentPageSlug();
        let target = `book-details.html?id=${encodeURIComponent(bookId)}&from=${encodeURIComponent(fromSlug)}`;
        if (fromSlug === 'search-results') {
            const currentQ = new URLSearchParams(window.location.search).get('q');
            if (currentQ) target += `&q=${encodeURIComponent(currentQ)}`;
        }
        window.location.href = target;
    }

    // 20. View Details Link (My Borrowings)
    document.querySelectorAll('.view-details-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && href.includes('book-details.html')) {
                // allow native link navigation
                return;
            }
            e.preventDefault();
            const tr = link.closest('tr');
            const bookId = tr?.getAttribute('data-book-id');
            if (bookId) {
                goToBookDetails(bookId);
            } else {
                const title = tr?.querySelector('.resource-title')?.textContent || 'Resource';
                showToast(`Opening borrow details for "${title}"...`, 'info');
            }
        });
    });

    // Click anywhere on resource cell in borrowings table
    document.querySelectorAll('.borrowings-table .resource-cell').forEach((cell) => {
        cell.addEventListener('click', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) return;
            const tr = cell.closest('tr');
            const bookId = tr?.getAttribute('data-book-id');
            if (bookId) {
                goToBookDetails(bookId);
            }
        });
    });

    // 21. Renewal Policy & Quick Help Clicks
    const renewalPolicyBtn = document.getElementById('renewalPolicyBtn');
    if (renewalPolicyBtn) {
        renewalPolicyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Renewal Policy: Students may renew books up to 3 times for 14 days each.', 'info');
        });
    }

    // 23. Global Book Card Navigation (Title, Cover, or Card Click)
    document.querySelectorAll('[data-book-id]').forEach((card) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('.dropdown-container') || e.target.closest('a')) {
                return;
            }
            const bookId = card.getAttribute('data-book-id');
            if (bookId) {
                goToBookDetails(bookId);
            }
        });
    });

    document.querySelectorAll('.book-thumb-cover, .result-cover-thumb, .mini-book-cover, .book-card-cover, .reading-cover-img, .resource-thumb').forEach((cover) => {
        cover.style.cursor = 'pointer';
        cover.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            const parent = cover.closest('[data-book-id]');
            if (parent) {
                const bookId = parent.getAttribute('data-book-id');
                if (bookId) goToBookDetails(bookId);
            }
        });
    });

    // 24. Book Details Page Controller (book-details.html)
    const isBookDetailsPage = window.location.pathname.includes('book-details.html') || document.querySelector('.book-details-main');
    if (isBookDetailsPage) {
        initBookDetailsPage();
    }

    function initBookDetailsPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id') || 'computer-networks';
        const book = typeof getBookById === 'function' ? getBookById(bookId) : (window.IDLMS_BOOKS ? window.IDLMS_BOOKS[bookId] : null);

        if (!book) return;

        // Set document title
        document.title = `IDLMS - ${book.title}`;

        // Populate Cover
        const coverEl = document.getElementById('bookCover');
        if (coverEl) {
            coverEl.src = book.cover;
            coverEl.alt = `${book.title} - ${book.subtitle || ''}`;
        }

        // Populate Badges & Titles
        const typeBadgeEl = document.getElementById('bookTypeBadge');
        if (typeBadgeEl) typeBadgeEl.textContent = book.typeBadge || 'Book';

        const titleEl = document.getElementById('bookTitle');
        if (titleEl) titleEl.textContent = book.title;

        const subtitleEl = document.getElementById('bookSubtitle');
        if (subtitleEl) {
            if (book.subtitle) {
                subtitleEl.textContent = book.subtitle;
                subtitleEl.style.display = 'block';
            } else {
                subtitleEl.style.display = 'none';
            }
        }

        // Authors
        const authorEl = document.getElementById('bookAuthor');
        if (authorEl) authorEl.textContent = `By ${book.author}`;

        const coAuthorEl = document.getElementById('bookCoAuthor');
        if (coAuthorEl) {
            if (book.coAuthor) {
                coAuthorEl.textContent = `Co-author: ${book.coAuthor}`;
                coAuthorEl.style.display = 'inline';
            } else {
                coAuthorEl.style.display = 'none';
            }
        }

        // Rating
        const ratingEl = document.getElementById('bookRating');
        if (ratingEl) ratingEl.textContent = book.rating.toFixed(1);

        const ratingCountEl = document.getElementById('bookRatingCount');
        if (ratingCountEl) ratingCountEl.textContent = `(${book.ratingCount || book.reviewCount + ' ratings'})`;

        const tabReviewsBtn = document.getElementById('tabReviewsBtn');
        if (tabReviewsBtn) tabReviewsBtn.textContent = `Reviews (${book.reviewCount ? book.reviewCount.toLocaleString() : '1,245'})`;

        // Availability badge & copies
        const availBadge = document.getElementById('bookAvailBadge');
        const availText = document.getElementById('bookAvailText');
        const copiesText = document.getElementById('bookCopiesText');
        
        if (availBadge && availText && copiesText) {
            if (book.statusType === 'due-soon') {
                availBadge.className = 'badge-due-amber';
                availText.textContent = 'Due Soon';
                copiesText.textContent = `Copies available: 0 of ${book.totalCopies}`;
            } else if (book.copiesAvailable > 0) {
                availBadge.className = 'badge-available-green';
                availText.textContent = book.availability || 'Available';
                copiesText.textContent = `Copies available: ${book.copiesAvailable} of ${book.totalCopies}`;
            } else {
                availBadge.className = 'badge-due-amber';
                availText.textContent = 'Checked Out';
                copiesText.textContent = `Copies available: 0 of ${book.totalCopies}`;
            }
        }

        // Specifications
        const branchEl = document.getElementById('bookBranch');
        if (branchEl) branchEl.textContent = book.branch || 'Central Library';

        const shelfEl = document.getElementById('bookShelf');
        if (shelfEl) shelfEl.textContent = book.shelf || 'Shelf 3';

        const rackEl = document.getElementById('bookRack');
        if (rackEl) rackEl.textContent = book.rack || 'R2 – Networking';

        const editionEl = document.getElementById('bookEdition');
        if (editionEl) editionEl.textContent = book.edition || '1st Edition';

        const publisherEl = document.getElementById('bookPublisher');
        if (publisherEl) publisherEl.textContent = book.publisher || 'Publisher';

        const yearEl = document.getElementById('bookYear');
        if (yearEl) yearEl.textContent = book.publicationYear || '2021';

        const langEl = document.getElementById('bookLanguage');
        if (langEl) langEl.textContent = book.language || 'English';

        const catEl = document.getElementById('bookCategory');
        if (catEl) catEl.textContent = book.subjectCategory || 'General Collection';

        // About Description
        const aboutEl = document.getElementById('bookAbout');
        if (aboutEl) aboutEl.textContent = book.about;

        const aboutExtendedEl = document.getElementById('bookAboutExtended');
        if (aboutExtendedEl) aboutExtendedEl.textContent = book.aboutExtended || '';

        // Due date
        const dueDateEl = document.getElementById('bookDueDate');
        if (dueDateEl) dueDateEl.textContent = book.dueDate || '28 May 2025';

        // Show More / Show Less Toggle
        const btnShowMore = document.getElementById('btnShowMore');
        if (btnShowMore && aboutExtendedEl) {
            btnShowMore.addEventListener('click', () => {
                const isOpen = aboutExtendedEl.classList.contains('show');
                if (isOpen) {
                    aboutExtendedEl.classList.remove('show');
                    btnShowMore.innerHTML = `<span>Show more</span> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
                } else {
                    aboutExtendedEl.classList.add('show');
                    btnShowMore.innerHTML = `<span>Show less</span> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
                }
            });
        }

        // Back button navigation with dynamic origin detection
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            const fromParam = (urlParams.get('from') || '').toLowerCase();
            const referrer = document.referrer || '';
            const searchQ = urlParams.get('q');

            let backLabel = 'Back to Search Results';
            let backUrl = 'search-results.html';

            if (fromParam === 'dashboard' || (!fromParam && referrer.includes('dashboard.html'))) {
                backLabel = 'Back to Dashboard';
                backUrl = 'dashboard.html';
            } else if (fromParam === 'digital-library' || fromParam === 'digital' || (!fromParam && referrer.includes('digital-library.html'))) {
                backLabel = 'Back to Digital Library';
                backUrl = 'digital-library.html';
            } else if (fromParam === 'discover' || (!fromParam && referrer.includes('discover.html'))) {
                backLabel = 'Back to Discover';
                backUrl = 'discover.html';
            } else if (fromParam === 'borrowings' || (!fromParam && referrer.includes('borrowings.html'))) {
                backLabel = 'Back to My Borrowings';
                backUrl = 'borrowings.html';
            } else if (fromParam === 'reservations' || (!fromParam && referrer.includes('reservations.html'))) {
                backLabel = 'Back to Reservations';
                backUrl = 'reservations.html';
            } else if (fromParam === 'reading-history' || fromParam === 'history' || (!fromParam && (referrer.includes('reading-history.html') || referrer.includes('history.html')))) {
                backLabel = 'Back to Reading History';
                backUrl = 'reading-history.html';
            } else if (fromParam === 'search-results' || fromParam === 'search' || referrer.includes('search-results.html')) {
                backLabel = 'Back to Search Results';
                if (searchQ) {
                    backUrl = `search-results.html?q=${encodeURIComponent(searchQ)}`;
                } else if (referrer.includes('search-results.html')) {
                    backUrl = referrer;
                } else {
                    backUrl = 'search-results.html';
                }
            } else if (referrer && !referrer.includes('book-details.html')) {
                if (referrer.includes('digital-library') || referrer.includes('digital')) {
                    backLabel = 'Back to Digital Library';
                    backUrl = 'digital-library.html';
                } else if (referrer.includes('reading-history') || referrer.includes('history')) {
                    backLabel = 'Back to Reading History';
                    backUrl = 'reading-history.html';
                } else if (referrer.includes('reservations')) {
                    backLabel = 'Back to Reservations';
                    backUrl = 'reservations.html';
                } else if (referrer.includes('borrowings')) {
                    backLabel = 'Back to My Borrowings';
                    backUrl = 'borrowings.html';
                } else if (referrer.includes('dashboard')) {
                    backLabel = 'Back to Dashboard';
                    backUrl = 'dashboard.html';
                } else if (referrer.includes('discover')) {
                    backLabel = 'Back to Discover';
                    backUrl = 'discover.html';
                } else if (referrer.includes('search-results')) {
                    backLabel = 'Back to Search Results';
                    backUrl = referrer;
                } else {
                    backLabel = 'Back to Discover';
                    backUrl = 'discover.html';
                }
            } else {
                backLabel = 'Back to Discover';
                backUrl = 'discover.html';
            }

            const spanText = backBtn.querySelector('span');
            if (spanText) {
                spanText.textContent = backLabel;
            }
            backBtn.setAttribute('href', backUrl);

            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = backUrl;
            });
        }

        // Action Buttons
        const btnBorrow = document.getElementById('btnBorrowBook');
        if (btnBorrow) {
            btnBorrow.addEventListener('click', () => {
                if (book.copiesAvailable > 0) {
                    showToast(`Borrow request placed for "${book.title}"! Due on ${book.dueDate}. Ready for pickup at ${book.branch}.`, 'success');
                } else {
                    showToast(`"${book.title}" is currently checked out. Please reserve it below.`, 'info');
                }
            });
        }

        const btnReserve = document.getElementById('btnReserveBook');
        if (btnReserve) {
            btnReserve.addEventListener('click', () => {
                showToast(`Reservation confirmed for "${book.title}". You will receive an SMS and email when ready.`, 'success');
            });
        }

        const btnRead = document.getElementById('btnReadOnline');
        if (btnRead) {
            btnRead.addEventListener('click', () => {
                showToast(`Opening Digital E-Book Reader for "${book.title}"...`, 'info');
            });
        }

        // Bookmark / Reading List toggle
        const btnBookmark = document.getElementById('btnBookmark');
        const bookmarkText = document.getElementById('bookmarkBtnText');
        if (btnBookmark && bookmarkText) {
            let isSaved = false;
            btnBookmark.addEventListener('click', () => {
                isSaved = !isSaved;
                if (isSaved) {
                    btnBookmark.classList.add('saved');
                    bookmarkText.textContent = 'Saved in Reading List';
                    showToast(`"${book.title}" added to your Reading List!`, 'success');
                } else {
                    btnBookmark.classList.remove('saved');
                    bookmarkText.textContent = 'Add to Reading List';
                    showToast(`"${book.title}" removed from your Reading List.`, 'info');
                }
            });
        }

        // Ask AI Button
        const btnAskAI = document.getElementById('btnAskAI');
        if (btnAskAI) {
            btnAskAI.addEventListener('click', () => {
                showToast(`AI Assistant: Analyzing "${book.title}"... Ask me any questions regarding key concepts, summaries, or citations!`, 'ai');
            });
        }

        // Tabs Handling
        const tabBtns = document.querySelectorAll('.detail-tab-btn');
        const panelAbout = document.getElementById('panel-about');
        const panelReviews = document.getElementById('panel-reviews');

        const switchTab = (tabName) => {
            tabBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
            });

            if (tabName === 'reviews') {
                if (panelAbout) panelAbout.style.display = 'none';
                if (panelReviews) {
                    panelReviews.style.display = 'block';
                    panelReviews.classList.add('active');
                }
            } else {
                if (panelAbout) panelAbout.style.display = 'block';
                if (panelReviews) {
                    panelReviews.style.display = 'none';
                    panelReviews.classList.remove('active');
                }
                if (tabName === 'related') {
                    const relatedSection = document.querySelector('.related-books-section');
                    if (relatedSection) relatedSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                switchTab(target);
            });
        });

        // "View reviews ->" link switch to Reviews tab
        const viewReviewsLink = document.getElementById('viewReviewsLink');
        if (viewReviewsLink) {
            viewReviewsLink.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('reviews');
                if (panelReviews) panelReviews.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Populate Reviews
        renderBookReviews(book);

        // Populate Related Books
        renderRelatedBooks(book);
    }

    function renderBookReviews(book) {
        const container = document.getElementById('reviewsListContainer');
        const bigRating = document.getElementById('reviewBigRating');
        const totalRatings = document.getElementById('reviewTotalRatings');

        if (bigRating) bigRating.textContent = book.rating.toFixed(1);
        if (totalRatings) totalRatings.textContent = `Based on ${book.reviewCount ? book.reviewCount.toLocaleString() : '1,245'} verified ratings`;

        if (!container) return;
        const reviews = book.reviews && book.reviews.length > 0 ? book.reviews : [
            {
                author: 'Alex Chen',
                initials: 'AC',
                rating: 5,
                date: '18 May 2025',
                verified: true,
                title: 'The gold standard for networking courses',
                comment: 'Kurose & Ross top-down approach makes grasping the layers so intuitive. Starting from the Application layer down to the Physical layer matches how programmers interact with networks.'
            },
            {
                author: 'Sarah Jenkins',
                initials: 'SJ',
                rating: 4,
                date: '12 May 2025',
                verified: true,
                title: 'Comprehensive and up-to-date',
                comment: 'The 8th edition updates on 5G and cloud architectures are excellent. Great diagrams and explanations of TCP congestion control.'
            }
        ];

        container.innerHTML = reviews.map(rev => `
            <div class="review-card-item">
                <div class="review-top-meta">
                    <div class="reviewer-profile">
                        <div class="reviewer-avatar-circle">${rev.initials || rev.author.substring(0,2).toUpperCase()}</div>
                        <div>
                            <span class="reviewer-name">${rev.author}</span>
                            ${rev.verified ? '<span class="verified-badge">&#10003; Verified Student</span>' : ''}
                        </div>
                    </div>
                    <span class="review-date">${rev.date}</span>
                </div>
                <div style="display: flex; gap: 2px; margin-bottom: 0.35rem;">
                    ${Array.from({length: rev.rating}).map(() => `<svg class="star-icon-gold" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`).join('')}
                </div>
                <h4 class="review-title-text">${rev.title}</h4>
                <p class="review-body-text">${rev.comment}</p>
            </div>
        `).join('');
    }

    function renderRelatedBooks(book) {
        const grid = document.getElementById('relatedCardsGrid');
        if (!grid) return;

        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = urlParams.get('from');
        const fromQuery = fromParam ? `&from=${encodeURIComponent(fromParam)}` : '';

        const relatedIds = book.relatedBookIds && book.relatedBookIds.length >= 5 
            ? book.relatedBookIds 
            : ['data-communications', 'tcp-ip-illustrated', 'wireless-communications', 'network-security', 'operating-system-concepts'];

        const relatedHtml = relatedIds.slice(0, 5).map(id => {
            const b = typeof getBookById === 'function' ? getBookById(id) : null;
            if (!b) return '';
            return `
                <a href="book-details.html?id=${b.id}${fromQuery}" class="related-book-card" data-book-id="${b.id}">
                    <div class="related-cover-thumb">
                        <img src="${b.cover}" alt="${b.title}">
                    </div>
                    <div class="related-meta">
                        <h3 class="related-book-title">${b.title}</h3>
                        <span class="related-book-author">${b.author}</span>
                        <div class="related-rating-row">
                            <svg class="star-icon-gold" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span>${b.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        grid.innerHTML = relatedHtml;

        // Next button rotates or shifts related books
        const nextBtn = document.getElementById('relatedNextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showToast('Viewing more related books in catalogue...', 'info');
            });
        }
    }

    // 25. Reservations Page Controller (reservations.html)
    const isReservationsPage = window.location.pathname.includes('reservations.html') || document.querySelector('.reservations-main');
    if (isReservationsPage) {
        initReservationsPage();
    }

    function initReservationsPage() {
        const kpiCards = document.querySelectorAll('.reservation-kpi-card');
        const tableBody = document.getElementById('reservationsTableBody');
        const rows = Array.from(tableBody ? tableBody.querySelectorAll('tr') : []);
        const summaryText = document.getElementById('resSummaryText');
        const totalCount = rows.length;

        // Filter Rows by Status
        function filterReservations(filterKey) {
            let visibleCount = 0;
            rows.forEach(row => {
                const status = row.getAttribute('data-status');
                if (filterKey === 'all' || status === filterKey) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (summaryText) {
                if (visibleCount === 0) {
                    summaryText.textContent = `Showing 0 of ${totalCount} reservations`;
                } else {
                    summaryText.textContent = `Showing 1 to ${visibleCount} of ${visibleCount} reservations`;
                }
            }
        }

        // KPI Filter Clicks
        kpiCards.forEach(card => {
            card.addEventListener('click', () => {
                kpiCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const filterKey = card.getAttribute('data-filter') || 'all';
                filterReservations(filterKey);
            });
        });

        // Date Column Header Sorting
        const sortDateHeader = document.getElementById('sortDateHeader');
        let sortAsc = true;
        if (sortDateHeader && tableBody) {
            sortDateHeader.addEventListener('click', () => {
                sortAsc = !sortAsc;
                const sortedRows = [...rows].sort((a, b) => {
                    const dateA = new Date(a.getAttribute('data-date') || 0).getTime();
                    const dateB = new Date(b.getAttribute('data-date') || 0).getTime();
                    return sortAsc ? dateA - dateB : dateB - dateA;
                });
                sortedRows.forEach(row => tableBody.appendChild(row));
                showToast(`Sorted reservations by date (${sortAsc ? 'oldest first' : 'newest first'})`, 'info');
            });
        }

        // Popover Actions
        document.querySelectorAll('.btn-cancel-res').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tr = btn.closest('tr');
                const title = tr?.querySelector('.res-book-title')?.textContent?.trim() || 'Book';
                showToast(`Reservation for "${title}" has been cancelled.`, 'info');
                // Close popover
                const menu = btn.closest('.popover-menu');
                if (menu) menu.classList.remove('show');
            });
        });

        document.querySelectorAll('.btn-reserve-again').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tr = btn.closest('tr');
                const title = tr?.querySelector('.res-book-title')?.textContent?.trim() || 'Book';
                showToast(`Reservation request placed again for "${title}". You will receive an SMS and email when ready.`, 'success');
                const menu = btn.closest('.popover-menu');
                if (menu) menu.classList.remove('show');
            });
        });

        document.querySelectorAll('.popover-item').forEach(item => {
            if (item.textContent.trim() === 'Download Slip') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    showToast('Downloading reservation slip (PDF)...', 'info');
                    const menu = item.closest('.popover-menu');
                    if (menu) menu.classList.remove('show');
                });
            } else if (item.textContent.trim() === 'Report Issue') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    showToast('Issue reported to the library circulation desk.', 'info');
                    const menu = item.closest('.popover-menu');
                    if (menu) menu.classList.remove('show');
                });
            }
        });
    }

    // 26. Reading / Borrowing History Page Controller (reading-history.html)
    const isReadingHistoryPage = window.location.pathname.includes('reading-history.html') || window.location.pathname.includes('history.html') || document.querySelector('.reading-history-main');
    if (isReadingHistoryPage) {
        initReadingHistoryPage();
    }

    function initReadingHistoryPage() {
        const filterInput = document.getElementById('historyFilterInput');
        const statusSelect = document.getElementById('historyStatusSelect');
        const typeSelect = document.getElementById('historyTypeSelect');
        const datePickerBtn = document.getElementById('historyDatePickerBtn');
        const exportBtn = document.getElementById('historyExportBtn');
        const tableBody = document.getElementById('historyTableBody');
        const rows = Array.from(tableBody ? tableBody.querySelectorAll('tr') : []);
        const summaryText = document.getElementById('historySummaryText');
        const totalCount = 32;

        function applyHistoryFilters() {
            const query = (filterInput ? filterInput.value.trim().toLowerCase() : '');
            const selectedStatus = statusSelect ? statusSelect.value : 'all';
            const selectedType = typeSelect ? typeSelect.value : 'all';

            let visibleCount = 0;
            rows.forEach(row => {
                const title = row.querySelector('.history-resource-title')?.textContent?.toLowerCase() || '';
                const author = row.querySelector('.history-author-cell')?.textContent?.toLowerCase() || '';
                const rowStatus = row.getAttribute('data-status') || '';
                const rowType = row.getAttribute('data-type') || 'book';

                const matchesQuery = !query || title.includes(query) || author.includes(query);
                const matchesStatus = selectedStatus === 'all' || rowStatus === selectedStatus;
                const matchesType = selectedType === 'all' || rowType === selectedType;

                if (matchesQuery && matchesStatus && matchesType) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (summaryText) {
                if (visibleCount === 0) {
                    summaryText.textContent = `Showing 0 of ${totalCount} history records`;
                } else {
                    summaryText.textContent = `Showing 1 to ${visibleCount} of ${totalCount} history records`;
                }
            }
        }

        if (filterInput) {
            filterInput.addEventListener('input', applyHistoryFilters);
        }

        if (statusSelect) {
            statusSelect.addEventListener('change', () => {
                applyHistoryFilters();
                const text = statusSelect.options[statusSelect.selectedIndex].text;
                showToast(`Filtered by status: ${text}`, 'info');
            });
        }

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                applyHistoryFilters();
                const text = typeSelect.options[typeSelect.selectedIndex].text;
                showToast(`Filtered by resource type: ${text}`, 'info');
            });
        }

        if (datePickerBtn) {
            datePickerBtn.addEventListener('click', () => {
                showToast('Date range active: 01 Jan 2024 – 31 May 2025. Click to change range.', 'info');
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                showToast('Exporting borrowing history report (PDF/CSV)...', 'success');
            });
        }

        // Receipt Download
        document.querySelectorAll('.btn-download-receipt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tr = btn.closest('tr');
                const title = tr?.querySelector('.history-resource-title')?.textContent?.trim() || 'Book';
                showToast(`Downloading return receipt for "${title}"...`, 'info');
                const menu = btn.closest('.popover-menu');
                if (menu) menu.classList.remove('show');
            });
        });

        // Borrow Again
        document.querySelectorAll('.btn-borrow-again').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tr = btn.closest('tr');
                const title = tr?.querySelector('.history-resource-title')?.textContent?.trim() || 'Book';
                showToast(`Borrow request placed for "${title}"! Available at circulation desk.`, 'success');
                const menu = btn.closest('.popover-menu');
                if (menu) menu.classList.remove('show');
            });
        });

        // Pagination buttons
        const pageBtns = document.querySelectorAll('.history-page-btn');
        pageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled || btn.textContent === '<' || btn.textContent === '>') return;
                pageBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const pageNum = parseInt(btn.textContent.trim(), 10);
                const start = (pageNum - 1) * 8 + 1;
                const end = Math.min(pageNum * 8, totalCount);
                if (summaryText) {
                    summaryText.textContent = `Showing ${start} to ${end} of ${totalCount} history records`;
                }
                showToast(`Switched to page ${pageNum} of borrowing history.`, 'info');
            });
        });
    }

    // 27. Digital Library Page Controller (digital-library.html)
    const isDigitalLibraryPage = window.location.pathname.includes('digital-library.html') || window.location.pathname.includes('digital.html') || document.querySelector('.digital-page-main');
    if (isDigitalLibraryPage) {
        initDigitalLibraryPage();
    }

    function initDigitalLibraryPage() {
        // 1. In-page Digital Search Form/Button
        const searchInput = document.getElementById('digitalSearchInput');
        const searchBtn = document.getElementById('btnDigitalSearch');
        const advSearchBtn = document.getElementById('digitalAdvSearchBtn');

        const executeDigitalSearch = () => {
            const query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            } else {
                showToast('Please enter title, author, keyword, or ISBN', 'info');
            }
        };

        if (searchBtn) {
            searchBtn.addEventListener('click', executeDigitalSearch);
        }
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    executeDigitalSearch();
                }
            });
        }
        if (advSearchBtn) {
            advSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Advanced Search filters: Format, Faculty, Year, Subject, Peer-Reviewed.', 'info');
            });
        }

        // 2. Resource Type Filter Pills
        const pills = document.querySelectorAll('.digital-filter-pill');
        const bookCards = document.querySelectorAll('.continue-card, .digi-book-card');

        pills.forEach((pill) => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const filter = pill.getAttribute('data-filter') || 'all';
                const pillLabel = pill.textContent.trim();

                if (filter === 'all') {
                    bookCards.forEach(card => card.style.display = '');
                    showToast('Showing all digital resources', 'info');
                } else if (filter === 'ebook') {
                    bookCards.forEach(card => {
                        const hasEbook = card.querySelector('.badge-ebook');
                        card.style.display = hasEbook ? '' : 'none';
                    });
                    showToast(`Showing ${pillLabel}`, 'info');
                } else if (filter === 'pdf') {
                    bookCards.forEach(card => {
                        const hasPdf = card.querySelector('.badge-pdf');
                        card.style.display = hasPdf ? '' : 'none';
                    });
                    showToast(`Showing ${pillLabel}`, 'info');
                } else {
                    // Filter simulated for journals, theses, etc.
                    bookCards.forEach(card => card.style.display = '');
                    showToast(`Filtered by: ${pillLabel} (12 results available)`, 'info');
                }
            });
        });

        // 3. Bookmark Toggle Buttons
        let savedBookmarksCount = 24;
        const bookmarksCountEl = document.querySelector('.saved-bookmarks-count');

        document.querySelectorAll('.btn-bookmark-icon').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const card = btn.closest('.continue-card, .digi-book-card');
                const title = card?.querySelector('.continue-card-title, .digi-book-title')?.textContent?.trim() || 'Resource';
                const isSaved = btn.classList.toggle('bookmarked');
                const svg = btn.querySelector('svg');

                if (isSaved) {
                    btn.style.color = '#2563EB';
                    if (svg) svg.setAttribute('fill', '#2563EB');
                    savedBookmarksCount++;
                    if (bookmarksCountEl) bookmarksCountEl.textContent = savedBookmarksCount;
                    showToast(`"${title}" added to your saved bookmarks!`, 'success');
                } else {
                    btn.style.color = '';
                    if (svg) svg.setAttribute('fill', 'none');
                    savedBookmarksCount = Math.max(0, savedBookmarksCount - 1);
                    if (bookmarksCountEl) bookmarksCountEl.textContent = savedBookmarksCount;
                    showToast(`"${title}" removed from saved bookmarks.`, 'info');
                }
            });
        });

        // 4. Reading Activity Select dropdown
        const activitySelect = document.getElementById('activityRangeSelect');
        const activityTimeText = document.getElementById('activityTimeText');
        if (activitySelect && activityTimeText) {
            activitySelect.addEventListener('change', () => {
                if (activitySelect.value === 'month') {
                    activityTimeText.textContent = '22h 45m';
                    showToast('Reading activity updated for: This Month', 'info');
                } else {
                    activityTimeText.textContent = '5h 34m';
                    showToast('Reading activity updated for: This Week', 'info');
                }
            });
        }

        // 5. Offline Reading Learn More
        const btnOfflineLearn = document.getElementById('btnOfflineLearn');
        if (btnOfflineLearn) {
            btnOfflineLearn.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Offline Mode: Download up to 10 e-books or PDFs to read anytime without internet connection.', 'info');
            });
        }

        // 6. AI Assistant Promo
        const btnAskAiPromo = document.getElementById('btnAskAiPromo');
        if (btnAskAiPromo) {
            btnAskAiPromo.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('AI Assistant: Explore intelligent summaries, semantic search, and conceptual explanations!', 'ai');
            });
        }

        // 7. Quick Links
        document.querySelectorAll('.quick-link-item').forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.getAttribute('data-action');
                const label = item.querySelector('span')?.textContent || 'Link';
                if (action === 'new') {
                    showToast('Viewing New Arrivals in Digital Library', 'info');
                } else if (action === 'top') {
                    showToast('Viewing Top Rated Digital Resources', 'info');
                } else if (action === 'guides') {
                    showToast('Opening Subject Guides repository...', 'info');
                } else if (action === 'support') {
                    showToast('Connecting to Digital Library Support Desk...', 'info');
                } else {
                    showToast(`Opening ${label}...`, 'info');
                }
            });
        });

        // 8. Browse by Subject chips
        document.querySelectorAll('.subject-chip-card').forEach((chip) => {
            chip.addEventListener('click', (e) => {
                e.preventDefault();
                const subj = chip.getAttribute('data-subject') || 'Subject';
                window.location.href = `search-results.html?q=${encodeURIComponent(subj)}`;
            });
        });

        // 9. View all section headers
        document.querySelectorAll('.digital-section-viewall').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sec = link.getAttribute('data-section');
                showToast(`Viewing all resources in this section (${sec})...`, 'info');
            });
        });

        // 10. Saved Bookmarks row click
        const savedBookmarksLink = document.getElementById('savedBookmarksLink');
        if (savedBookmarksLink) {
            savedBookmarksLink.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Opening your 24 saved bookmarks & reading list...', 'info');
            });
        }
    }
});

/**
 * Toast Notification Utility
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose icon
    let iconSvg = '';
    if (type === 'ai') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`;
    } else if (type === 'success') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`;
    } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3200);
}
