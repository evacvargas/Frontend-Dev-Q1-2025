import { fetchArticles } from '../services/api.js';

class ArticlesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._articles = [];
        this._displayedArticles = [];
        this._chunkSize = 12;
        this._currentIndex = 12;
        this._isLoading = false;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
                .dropdown {
                    position: relative;
                    display: inline-block;
                }
                .dropdown-content {
                    display: none;
                    position: absolute;
                    right: 0;
                    background-color: #f9f9f9;
                    border-radius: 0 0 10px 10px;
                    min-width: 160px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    z-index: 1;
                }
                .dropdown-content.show {
                    display: block;
                }
                .dropdown-content button {
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                }
                .dropdown-content button:hover {
                    background-color: #f1f1f1;
                }
            </style>
            <nav class="bg-gray-500 p-4 flex justify-between items-center absolute top-0 left-0 w-full">
                <h1 class="text-white text-xl font-bold">Article List</h1>
                <div class="flex items-center">
                    <input type="text" id="searchInput" placeholder="Buscar Articulos..." class="p-2 rounded-l-md border border-gray-300" />
                    <button id="searchButton" class="bg-indigo-500 text-white p-2 px-4">Buscar</button>
                    <div class="dropdown ml-2">
                        <button id="sortButton" class="bg-indigo-500 text-white p-2 rounded-md">Ordenar por fecha</button>
                        <div id="sortDropdown" class="dropdown-content">
                            <button id="sortNewest" class="text-gray-500 hover:bg-gray-100">Más recientes</button>
                            <button id="sortOldest" class="text-gray-500 hover:bg-gray-100">Más antiguos</button>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="pt-16 mt-4">
                <div id="articlesContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                </div>
                <div id="loadingIndicator" class="text-center py-5 text-indigo-700 font-bold transition-opacity duration-300 z-10">
                    Cargando más artículos...
                </div>
            </div>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get articles() {
        return this._articles;
    }

    set articles(value) {
        this._articles = value;
    }

    get displayedArticles() {
        return this._displayedArticles;
    }

    set displayedArticles(value) {
        this._displayedArticles = value;
    }

    get chunkSize() {
        return this._chunkSize;
    }

    get currentIndex() {
        return this._currentIndex;
    }

    set currentIndex(value) {
        this._currentIndex = value;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = value;
        this.updateLoadingState(value);
    }

    async connectedCallback() {
        try {
            await this.initializeArticles();
            this.setupIntersectionObserver();
            await this.loadMoreArticles();
            this.setupSearch();
            this.setupSortDropdown();
        } catch (error) {
            console.error('Error al inicializar ArticlesList:', error);
        }
    }

    disconnectedCallback() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    setupSearch() {
        const searchInput = this.shadowRoot.getElementById('searchInput');
        const searchButton = this.shadowRoot.getElementById('searchButton');

        searchButton.addEventListener('click', () => {
            this.search(searchInput.value);
        });

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.search(event.target.value);
            }
        });

        searchInput.addEventListener('input', (event) => {
            if (!event.target.value.trim()) {
                this.resetToInitialState();
            }
        });
    }

    resetToInitialState() {
        const container = this.shadowRoot.getElementById('articlesContainer');
        container.innerHTML = '';
        this.displayedArticles = this.articles;
        this.currentIndex = this.chunkSize;
        this.renderArticles(this.articles.slice(0, this.chunkSize));
        const loadingIndicator = this.shadowRoot.getElementById('loadingIndicator');
        loadingIndicator.style.display = 'block';
    }

    search(query) {
        const container = this.shadowRoot.getElementById('articlesContainer');
        container.innerHTML = '';

        if (!query.trim()) {
            this.resetToInitialState();
            return;
        }

        this.displayedArticles = this.articles.filter(article => {
            return (
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                article.description.toLowerCase().includes(query.toLowerCase())
            );
        });

        this.currentIndex = this.chunkSize;
        this.renderArticles(this.displayedArticles.slice(0, this.chunkSize));

        const loadingIndicator = this.shadowRoot.getElementById('loadingIndicator');
        loadingIndicator.style.display = 
            this.currentIndex < this.displayedArticles.length ? 'block' : 'none';
    }

    async initializeArticles() {
        try {
            this.articles = await fetchArticles();
            this.displayedArticles = this.articles;
            this.currentIndex = this.chunkSize;
            
            this.renderArticles(this.displayedArticles.slice(0, this.chunkSize));
            
            const loadingIndicator = this.shadowRoot.getElementById('loadingIndicator');
            loadingIndicator.style.display = this.hasMoreArticles() ? 'block' : 'none';
        } catch (error) {
            console.error('Error al obtener artículos:', error);
            this.articles = [];
            this.displayedArticles = [];
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading && this.hasMoreArticles()) {
                    this.loadMoreArticles();
                }
            });
        }, options);

        const loadingIndicator = this.shadowRoot.getElementById('loadingIndicator');
        this.observer.observe(loadingIndicator);
    }

    hasMoreArticles() {
        return this.currentIndex < this.displayedArticles.length;
    }

    async loadMoreArticles() {
        if (this.isLoading || !this.hasMoreArticles()) return;

        this.isLoading = true;
        this.updateLoadingState(true);

        try {
            const nextChunk = this.displayedArticles.slice(
                this.currentIndex,
                this.currentIndex + this.chunkSize
            );

            await this.renderArticles(nextChunk);
            this.currentIndex += this.chunkSize;

            if (!this.hasMoreArticles()) {
                this.updateLoadingState(false);
                this.shadowRoot.getElementById('loadingIndicator').style.display = 'none';
            }
        } catch (error) {
            console.error('Error al cargar más artículos:', error);
        } finally {
            this.isLoading = false;
            this.updateLoadingState(false);
        }
    }

    updateLoadingState(isLoading) {
        const loadingIndicator = this.shadowRoot.getElementById('loadingIndicator');
        if (isLoading) {
            loadingIndicator.classList.add('opacity-100');
        } else {
            loadingIndicator.classList.remove('opacity-100');
        }
    }

    async renderArticles(articles) {
        const container = this.shadowRoot.getElementById('articlesContainer');
        
        articles.forEach(articleData => {
            const articleItem = document.createElement('article-item');
            articleItem.setAttribute('title', articleData.title);
            articleItem.setAttribute('description', articleData.description);
            articleItem.setAttribute('image', articleData.image);
            articleItem.setAttribute('articleCompany', articleData.company);
            articleItem.setAttribute('authorId', articleData.author);
            articleItem.setAttribute('publishedAt', articleData.publishedAt);
            articleItem.setAttribute('content', articleData.content);
            container.appendChild(articleItem);
        });
    }

    setupSortDropdown() {
        const sortButton = this.shadowRoot.getElementById('sortButton');
        const sortDropdown = this.shadowRoot.getElementById('sortDropdown');
        const sortNewest = this.shadowRoot.getElementById('sortNewest');
        const sortOldest = this.shadowRoot.getElementById('sortOldest');

        sortButton.addEventListener('click', (event) => {
            event.stopPropagation();
            sortDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            const clickInDropdown = event.composedPath().includes(sortDropdown);
            const clickInButton = event.composedPath().includes(sortButton);
            
            if (!clickInDropdown && !clickInButton) {
                sortDropdown.classList.remove('show');
            }
        });

        sortNewest.addEventListener('click', () => {
            this.sortArticles('desc');
            sortDropdown.classList.remove('show');
        });

        sortOldest.addEventListener('click', () => {
            this.sortArticles('asc');
            sortDropdown.classList.remove('show');
        });
    }

    sortArticles(order) {
        const container = this.shadowRoot.getElementById('articlesContainer');
        container.innerHTML = '';

        this.displayedArticles.sort((a, b) => {
            const dateA = new Date(a.publishedAt);
            const dateB = new Date(b.publishedAt);
            return order === 'desc' ? dateB - dateA : dateA - dateB;
        });

        this.currentIndex = this.chunkSize;
        this.renderArticles(this.displayedArticles.slice(0, this.chunkSize));

        const loadingIndicator = this.shadowRoot.getElementById('loadingIndicator');
        loadingIndicator.style.display = this.hasMoreArticles() ? 'block' : 'none';
    }
}

customElements.define('article-list', ArticlesList);
