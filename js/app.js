// Base de datos local (simulada con localStorage)
class GameDatabase {
    constructor() {
        this.games = JSON.parse(localStorage.getItem('games')) || [];
        this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        
        // Datos de ejemplo si no hay juegos
        if (this.games.length === 0) {
            this.addSampleData();
        }
    }
    
    // Agregar datos de ejemplo
    addSampleData() {
        const sampleGames = [
            {
                id: 1,
                title: "The Legend of Zelda: Breath of the Wild",
                platform: "Nintendo",
                genre: "Aventura",
                releaseDate: "2017-03-03",
                image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
                description: "Un juego de aventuras de mundo abierto donde exploras el reino de Hyrule.",
                rating: 5
            },
            {
                id: 2,
                title: "Red Dead Redemption 2",
                platform: "PlayStation",
                genre: "Acción",
                releaseDate: "2018-10-26",
                image: "https://image.api.playstation.com/vulcan/img/rnd/202009/2818/GGyEnCkeSXvHQYcRYGdnJo8C.png",
                description: "Una épica historia del Salvaje Oeste americano.",
                rating: 5
            },
            {
                id: 3,
                title: "Minecraft",
                platform: "PC",
                genre: "Aventura",
                releaseDate: "2011-11-18",
                image: "https://www.minecraft.net/content/dam/games/minecraft/key-art/Games_Subnav_Minecraft-300x465.jpg",
                description: "Un juego de construcción y aventuras en un mundo de bloques.",
                rating: 4
            }
        ];
        
        const sampleReviews = [
            {
                id: 1,
                gameId: 1,
                rating: 5,
                text: "Uno de los mejores juegos que he jugado. El mundo abierto es impresionante y la libertad que te da es increíble."
            },
            {
                id: 2,
                gameId: 2,
                rating: 5,
                text: "La historia es conmovedora y el nivel de detalle en el juego es asombroso. Definitivamente una obra maestra."
            }
        ];
        
        this.games = sampleGames;
        this.reviews = sampleReviews;
        this.saveData();
    }
    
    // Guardar datos en localStorage
    saveData() {
        localStorage.setItem('games', JSON.stringify(this.games));
        localStorage.setItem('reviews', JSON.stringify(this.reviews));
    }
    
    // Métodos para gestionar juegos
    getAllGames() {
        return this.games;
    }
    
    getGameById(id) {
        return this.games.find(game => game.id === id);
    }
    
    addGame(game) {
        // Generar ID único
        const newId = this.games.length > 0 ? Math.max(...this.games.map(g => g.id)) + 1 : 1;
        const newGame = { ...game, id: newId };
        this.games.push(newGame);
        this.saveData();
        return newGame;
    }
    
    updateGame(updatedGame) {
        const index = this.games.findIndex(game => game.id === updatedGame.id);
        if (index !== -1) {
            this.games[index] = updatedGame;
            this.saveData();
            return true;
        }
        return false;
    }
    
    deleteGame(id) {
        const initialLength = this.games.length;
        this.games = this.games.filter(game => game.id !== id);
        
        // También eliminar reseñas asociadas
        this.reviews = this.reviews.filter(review => review.gameId !== id);
        
        this.saveData();
        return this.games.length < initialLength;
    }
    
    // Métodos para gestionar reseñas
    getReviewsByGameId(gameId) {
        return this.reviews.filter(review => review.gameId === gameId);
    }
    
    getAllReviews() {
        return this.reviews;
    }
    
    addReview(review) {
        const newId = this.reviews.length > 0 ? Math.max(...this.reviews.map(r => r.id)) + 1 : 1;
        const newReview = { ...review, id: newId };
        this.reviews.push(newReview);
        
        // Actualizar calificación promedio del juego
        this.updateGameRating(review.gameId);
        
        this.saveData();
        return newReview;
    }
    
    updateGameRating(gameId) {
        const gameReviews = this.getReviewsByGameId(gameId);
        if (gameReviews.length > 0) {
            const avgRating = gameReviews.reduce((sum, review) => sum + review.rating, 0) / gameReviews.length;
            const game = this.getGameById(gameId);
            if (game) {
                game.rating = Math.round(avgRating);
                this.updateGame(game);
            }
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const db = new GameDatabase();
    const app = new App(db);
    app.init();
});

// Clase principal de la aplicación
class App {
    constructor(database) {
        this.db = database;
        this.currentSection = 'home-section';
        
        // Referencias a elementos DOM
        this.navLinks = {
            home: document.getElementById('nav-home'),
            addGame: document.getElementById('nav-add-game'),
            reviews: document.getElementById('nav-reviews')
        };
        
        this.sections = {
            home: document.getElementById('home-section'),
            addGame: document.getElementById('add-game-section'),
            reviews: document.getElementById('reviews-section')
        };
        
        this.gamesContainer = document.getElementById('games-container');
        this.reviewsContainer = document.querySelector('.reviews-container');
        this.gameDetailsModal = document.getElementById('game-details-modal');
        this.closeModal = document.querySelector('.close-modal');
        
        // Formularios
        this.addGameForm = document.getElementById('add-game-form');
        this.addReviewForm = document.getElementById('add-review-form');
        
        // Filtros y búsqueda
        this.searchInput = document.getElementById('search-games');
        this.searchBtn = document.getElementById('search-btn');
        this.platformFilter = document.getElementById('filter-platform');
        this.genreFilter = document.getElementById('filter-genre');
        this.sortBy = document.getElementById('sort-by');
    }
    
    init() {
        // Inicializar navegación
        this.initNavigation();
        
        // Cargar juegos y reseñas
        this.loadGames();
        this.loadReviews();
        this.populateGameSelect();
        
        // Inicializar eventos
        this.initEvents();
        
        // Inicializar sistema de calificación
        this.initRatingSystem();
    }
    
    initNavigation() {
        // Eventos de navegación
        this.navLinks.home.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('home-section');
        });
        
        this.navLinks.addGame.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('add-game-section');
        });
        
        this.navLinks.reviews.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('reviews-section');
        });
    }
    
    showSection(sectionId) {
        // Ocultar todas las secciones
        Object.values(this.sections).forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección seleccionada
        document.getElementById(sectionId).classList.add('active');
        
        // Actualizar navegación
        Object.values(this.navLinks).forEach(link => {
            link.classList.remove('active');
        });
        
        // Activar enlace correspondiente
        const navId = `nav-${sectionId.split('-')[0]}`;
        document.getElementById(navId).classList.add('active');
        
        this.currentSection = sectionId;
    }
    
    initEvents() {
        // Evento para agregar juego
        this.addGameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddGame();
        });
        
        // Evento para agregar reseña
        this.addReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddReview();
        });
        
        // Eventos de búsqueda y filtrado
        this.searchBtn.addEventListener('click', () => this.filterGames());
        this.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.filterGames();
        });
        
        this.platformFilter.addEventListener('change', () => this.filterGames());
        this.genreFilter.addEventListener('change', () => this.filterGames());
        this.sortBy.addEventListener('change', () => this.filterGames());
        
        // Cerrar modal
        this.closeModal.addEventListener('click', () => {
            this.gameDetailsModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === this.gameDetailsModal) {
                this.gameDetailsModal.style.display = 'none';
            }
        });
    }
    
    initRatingSystem() {
        // Inicializar sistema de calificación para agregar juego
        const gameRatingStars = document.querySelectorAll('#add-game-form .rating-input i');
        const gameRatingInput = document.getElementById('game-rating');
        
        gameRatingStars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                gameRatingInput.value = rating;
                
                // Actualizar estrellas
                gameRatingStars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
        
        // Inicializar sistema de calificación para agregar reseña
        const reviewRatingStars = document.querySelectorAll('#add-review-form .rating-input i');
        const reviewRatingInput = document.getElementById('review-rating');
        
        reviewRatingStars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                reviewRatingInput.value = rating;
                
                // Actualizar estrellas
                reviewRatingStars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
    }
    
    loadGames() {
        const games = this.db.getAllGames();
        this.renderGames(games);
    }
    
    renderGames(games) {
        this.gamesContainer.innerHTML = '';
        
        if (games.length === 0) {
            this.gamesContainer.innerHTML = '<p class="no-results">No se encontraron juegos. ¡Agrega uno nuevo!</p>';
            return;
        }
        
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.setAttribute('data-id', game.id);
            
            const defaultImage = 'https://via.placeholder.com/300x150?text=No+Image';
            
            gameCard.innerHTML = `
                <div class="game-image" style="background-image: url('${game.image || defaultImage}')"></div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <div class="game-meta">
                        <span>${game.platform}</span>
                        <span>${game.genre}</span>
                    </div>
                    <div class="game-rating">
                        ${this.getStarRating(game.rating)}
                    </div>
                </div>
            `;
            
            // Evento para mostrar detalles
            gameCard.addEventListener('click', () => {
                this.showGameDetails(game.id);
            });
            
            this.gamesContainer.appendChild(gameCard);
        });
    }
    
    getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    showGameDetails(gameId) {
        const game = this.db.getGameById(gameId);
        const reviews = this.db.getReviewsByGameId(gameId);
        
        if (!game) return;
        
        const gameDetailsContent = document.getElementById('game-details-content');
        const defaultImage = 'https://via.placeholder.com/300x300?text=No+Image';
        
        // Formatear fecha
        const releaseDate = new Date(game.releaseDate).toLocaleDateString();
        
        // Crear HTML para reseñas
        let reviewsHtml = '';
        if (reviews.length > 0) {
            reviewsHtml = reviews.map(review => `
                <div class="review-card">
                    <div class="review-rating">${this.getStarRating(review.rating)}</div>
                    <p class="review-text">${review.text}</p>
                </div>
            `).join('');
        } else {
            reviewsHtml = '<p>No hay reseñas para este juego todavía.</p>';
        }
        
        gameDetailsContent.innerHTML = `
            <div class="game-details-header">
                <div class="game-details-image" style="background-image: url('${game.image || defaultImage}')"></div>
                <div class="game-details-info">
                    <h3>${game.title}</h3>
                    <div class="game-details-meta">
                        <span><strong>Plataforma:</strong> ${game.platform}</span>
                        <span><strong>Género:</strong> ${game.genre}</span>
                        <span><strong>Lanzamiento:</strong> ${releaseDate}</span>
                    </div>
                    <div class="game-rating">
                        ${this.getStarRating(game.rating)}
                    </div>
                </div>
            </div>
            <div class="game-details-description">
                <h4>Descripción:</h4>
                <p>${game.description || 'No hay descripción disponible.'}</p>
            </div>
            <div class="game-details-reviews">
                <h4>Reseñas:</h4>
                ${reviewsHtml}
            </div>
            <div class="game-details-actions">
                <button class="btn-primary" id="add-review-btn">Agregar Reseña</button>
                <button class="btn-danger" id="delete-game-btn">Eliminar Juego</button>
            </div>
        `;
        
        // Mostrar modal
        this.gameDetailsModal.style.display = 'block';
        
        // Eventos para botones
        document.getElementById('add-review-btn').addEventListener('click', () => {
            this.gameDetailsModal.style.display = 'none';
            this.showSection('reviews-section');
            document.getElementById('review-game').value = gameId;
        });
        
        document.getElementById('delete-game-btn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas eliminar este juego?')) {
                this.db.deleteGame(gameId);
                this.gameDetailsModal.style.display = 'none';
                this.loadGames();
                this.loadReviews();
                this.populateGameSelect();
            }
        });
    }
    
    filterGames() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const platform = this.platformFilter.value;
        const genre = this.genreFilter.value;
        const sortBy = this.sortBy.value;
        
        let filteredGames = this.db.getAllGames();
        
        // Filtrar por término de búsqueda
        if (searchTerm) {
            filteredGames = filteredGames.filter(game => 
                game.title.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filtrar por plataforma
        if (platform) {
            filteredGames = filteredGames.filter(game => game.platform === platform);
        }
        
        // Filtrar por género
        if (genre) {
            filteredGames = filteredGames.filter(game => game.genre === genre);
        }
        
        // Ordenar
        if (sortBy === 'title') {
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'rating') {
            filteredGames.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'releaseDate') {
            filteredGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        }
        
        this.renderGames(filteredGames);
    }
    
    handleAddGame() {
        const title = document.getElementById('game-title').value;
        const platform = document.getElementById('game-platform').value;
        const genre = document.getElementById('game-genre').value;
        const releaseDate = document.getElementById('game-release-date').value;
        const image = document.getElementById('game-image').value;
        const description = document.getElementById('game-description').value;
        const rating = parseInt(document.getElementById('game-rating').value) || 0;
        
        const newGame = {
            title,
            platform,
            genre,
            releaseDate,
            image,
            description,
            rating
        };
        
        this.db.addGame(newGame);
        this.addGameForm.reset();
        
        // Resetear estrellas
        document.querySelectorAll('#add-game-form .rating-input i').forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
        
        // Mostrar mensaje de éxito
        alert('¡Juego agregado con éxito!');
        
        // Actualizar listas
        this.loadGames();
        this.populateGameSelect();
        
        // Redirigir a la página de inicio
        this.showSection('home-section');
    }
    
    loadReviews() {
        const reviews = this.db.getAllReviews();
        this.renderReviews(reviews);
    }
    
    renderReviews(reviews) {
        this.reviewsContainer.innerHTML = '';
        
        if (reviews.length === 0) {
            this.reviewsContainer.innerHTML = '<p class="no-results">No hay reseñas disponibles. ¡Sé el primero en agregar una!</p>';
            return;
        }
        
        reviews.forEach(review => {
            const game = this.db.getGameById(review.gameId);
            if (!game) return;
            
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            reviewCard.innerHTML = `
                <div class="review-header">
                    <span class="review-game">${game.title}</span>
                    <div class="review-rating">${this.getStarRating(review.rating)}</div>
                </div>
                <p class="review-text">${review.text}</p>
            `;
            
            this.reviewsContainer.appendChild(reviewCard);
        });
    }
    
    populateGameSelect() {
        const gameSelect = document.getElementById('review-game');
        const games = this.db.getAllGames();
        
        // Limpiar opciones actuales
        gameSelect.innerHTML = '<option value="">Selecciona un juego</option>';
        
        // Agregar opciones de juegos
        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.id;
            option.textContent = game.title;
            gameSelect.appendChild(option);
        });
    }
    
    handleAddReview() {
        const gameId = parseInt(document.getElementById('review-game').value);
        const rating = parseInt(document.getElementById('review-rating').value) || 0;
        const text = document.getElementById('review-text').value;
        
        if (!gameId) {
            alert('Por favor, selecciona un juego para reseñar.');
            return;
        }
        
        if (rating === 0) {
            alert('Por favor, selecciona una calificación.');
            return;
        }
        
        const newReview = {
            gameId,
            rating,
            text
        };
        
        this.db.addReview(newReview);
        this.addReviewForm.reset();
        
        // Resetear estrellas
        document.querySelectorAll('#add-review-form .rating-input i').forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
        
        // Mostrar mensaje de éxito
        alert('¡Reseña agregada con éxito!');
        
        // Actualizar listas
        this.loadReviews();
        this.loadGames(); // Para actualizar las calificaciones
    }
}