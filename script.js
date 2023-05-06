//https://img1.freepng.fr/20180619/siu/kisspng-space-invaders-tetris-video-game-arcade-game-space-invader-5b28a3e371ee79.2538551215293900514667.jpg
//https://img1.freepng.fr/20180826/wvp/kisspng-space-invaders-extreme-2-clip-art-video-games-fercsa-amp-apos-s-profile-hackaday-io-5b82e8f9809347.3869059415353059775267.jpg


// Sélection du canvas et création d'un contexte de dessin 2D
const canvas = document.getElementById("spaceInvaders");
const ctx = canvas.getContext("2d");

// Dimensions du canvas
canvas.width = 1300;
canvas.height = 900;

// Charger les images
const vaisseauImg = new Image();
vaisseauImg.src = "https://img1.freepng.fr/20180619/siu/kisspng-space-invaders-tetris-video-game-arcade-game-space-invader-5b28a3e371ee79.2538551215293900514667.jpg";
const alienImg = new Image();
alienImg.src = "https://img1.freepng.fr/20180826/wvp/kisspng-space-invaders-extreme-2-clip-art-video-games-fercsa-amp-apos-s-profile-hackaday-io-5b82e8f9809347.3869059415353059775267.jpg";

// Classe pour le vaisseau du joueur
class Vaisseau {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.drawImage(vaisseauImg, this.x, this.y, this.width, this.height);
    }
}

// Classe pour les cibles (les aliens)
class Alien {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = 1;
    }

    draw() {
        ctx.drawImage(alienImg, this.x, this.y, this.width, this.height);
    }
}

// Classe pour les tirs
class Tir {
    constructor(x, y, width, height, isAlien = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isAlien = isAlien;
    }

    draw() {
        ctx.fillStyle = this.isAlien ? "green" : "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.isAlien ? 5 : -5;
    }
}

// Création du vaisseau du joueur
const vaisseau = new Vaisseau(canvas.width / 2 - 25, canvas.height - 50, 50, 20);

// Création des aliens
const aliens = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        aliens.push(new Alien(100 + j * 100, 50 + i * 50, 40, 40));
    }
}

// Tableau des tirs
const tirs = [];

// Score et vies du joueur
let score = 0;
let lives = 3;

// Fonction pour dessiner les éléments du jeu
function draw() {
    ctx.fillStyle = "white"; // Mettre le fond en blanc
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("Vies: " + "❤️".repeat(lives), 10, 60);

    vaisseau.draw();
    aliens.forEach((alien) => alien.draw());
    tirs.forEach((tir) => tir.draw());
}

// Fonction pour déplacer le vaisseau du joueur
function moveVaisseau(e) {
    if (e.key === "ArrowLeft" && vaisseau.x > 0) {
        vaisseau.x -= 10;
    } else if (e.key === "ArrowRight" && vaisseau.x < canvas.width - vaisseau.width) {
        vaisseau.x += 10;
    }
}

// Fonction pour gérer les tirs
function handleTirs(e) {
    if (e.key === " ") {
        const tir = new Tir(vaisseau.x + vaisseau.width / 2 - 2.5, vaisseau.y, 5, 10);
        tirs.push(tir);
    }
}

// Fonction pour vérifier les collisions entre les tirs et les aliens/vaisseau
function checkCollisions() {
    for (let i = tirs.length - 1; i >= 0; i--) {
        for (let j = aliens.length - 1; j >= 0; j--) {
            if (
                tirs[i].x < aliens[j].x + aliens[j].width &&
                tirs[i].x + tirs[i].width > aliens[j].x &&
                tirs[i].y < aliens[j].y + aliens[j].height &&
                tirs[i].y + tirs[i].height > aliens[j].y &&
                !tirs[i].isAlien
            ) {
                tirs.splice(i, 1);
                aliens.splice(j, 1);
                score += 10;
                break;
            }
        }
        if (
            tirs[i] &&
            tirs[i].isAlien &&
            tirs[i].x < vaisseau.x + vaisseau.width &&
            tirs[i].x + tirs[i].width > vaisseau.x &&
            tirs[i].y < vaisseau.y + vaisseau.height &&
            tirs[i].y + tirs[i].height > vaisseau.y
        ) {
            tirs.splice(i, 1);
            lives--;
            if (lives === 0) {
                alert("Game Over");
                location.reload();
            }
        }
    }
}
// Vitesse des aliens
let alienSpeed = 0.15;

// Fonction pour mettre à jour la vitesse des aliens en fonction du score
function updateAlienSpeed() {
    if (score >= 50 && score < 100) {
      alienSpeed = 0.20;
    } else if (score >= 100 && score < 150) {
      alienSpeed =0.35;
    } else if (score >= 150) {
      alienSpeed = 0.5;
    }
  }
  
// Fonction pour déplacer les aliens
function moveAliens() {
    let changeDirection = false;
  
    for (const alien of aliens) {
      if (alien.direction === 1 && alien.x + alien.width >= canvas.width) {
        changeDirection = true;
      } else if (alien.direction === -1 && alien.x <= 0) {
        changeDirection = true;
      }
    }
  
    for (const alien of aliens) {
      if (changeDirection) {
        alien.y += 40;
        alien.direction *= -1;
      } else {
        alien.x += 5 * alien.direction * alienSpeed;
      }
  
      if (alien.y + alien.height >= canvas.height) {
        alert("Game Over");
        location.reload();
      }
    }
  }
  
// Fonction pour gérer les tirs des aliens
function alienTirs() {
    for (const alien of aliens) {
        if (Math.random() < 0.001) {
            const tir = new Tir(alien.x + alien.width / 2 - 2.5, alien.y + alien.height, 5, 10, true);
            tirs.push(tir);
        }
    }
}

// Ecouter les événements du clavier
document.addEventListener("keydown", moveVaisseau);
document.addEventListener("keydown", handleTirs);

// Boucle de jeu
function gameLoop() {
    draw();
    moveAliens();
    checkCollisions();
    alienTirs();
    updateAlienSpeed(); // Ajoutez cette ligne pour mettre à jour la vitesse des aliens en fonction du score
    tirs.forEach((tir) => tir.update());
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();