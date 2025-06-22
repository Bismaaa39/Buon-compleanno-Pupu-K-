window.onload = function() {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const specialMessage = "Buon compleanno alla regina!"; 

  const characterImages = [];
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `${i}.jpg`;
    characterImages.push(img);
  }

  let characterIndex = 0;
  let animationSpeed = 0.1;

  let x = 50;
  let y = 50;

  const speed = 7;

  const walls = [
    {x: 0, y: 0, w: 800, h: 20},
    {x: 0, y: 580, w: 800, h: 20},
    {x: 0, y: 0, w: 20, h: 600},
    {x: 780, y: 0, w: 20, h: 600},
    {x: 200, y: 100, w: 20, h: 300},
    {x: 400, y: 200, w: 300, h: 20}
  ];

  const specialArea = {x: 600, y: 300, w: 100, h: 100};
  let popupProgress = 0;
  let inSpecialArea = false;

  let keys = {};
  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
  });
  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  function isColliding(nx, ny) {
    const characterSize = 100;
    for (let wall of walls) {
      if (
        nx < wall.x + wall.w &&
        nx + characterSize > wall.x &&
        ny < wall.y + wall.h &&
        ny + characterSize > wall.y
      ) {
        return true;
      }
    }
    return false;
  }

  function isInSpecialArea() {
    const characterSize = 100;
    return (
      x < specialArea.x + specialArea.w &&
      x + characterSize > specialArea.x &&
      y < specialArea.y + specialArea.h &&
      y + characterSize > specialArea.y
    );
  }

  function drawCharacter() {
    const characterSize = 100;

    if (keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"]) {
      characterIndex += animationSpeed;
      if (characterIndex >= characterImages.length) {
        characterIndex = 1; 
      }
    } else {
      characterIndex = 0;
    }

    const currentImage = characterImages[Math.floor(characterIndex)];
    ctx.drawImage(currentImage, x, y, characterSize, characterSize);
  }

  function drawPopup() {
    const scale = popupProgress;
    const opacity = popupProgress;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    ctx.fillStyle = "blue";
    ctx.fillRect(-250, -50, 500, 100);

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(specialMessage, 0, 10);

    ctx.restore();
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let newX = x;
    let newY = y;

    if (keys["ArrowUp"]) newY -= speed;
    if (keys["ArrowDown"]) newY += speed;
    if (keys["ArrowLeft"]) newX -= speed;
    if (keys["ArrowRight"]) newX += speed;

    if (!isColliding(newX, newY)) {
      x = newX;
      y = newY;
    }

  
    ctx.fillStyle = "black";
    walls.forEach((wall) => {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    });


    drawCharacter();

 
    ctx.fillStyle = "green";
    ctx.fillRect(specialArea.x, specialArea.y, specialArea.w, specialArea.h);

 
    ctx.font = "20px times new roman";
    ctx.fillStyle = "red";
    ctx.fillText("Benvenuto nel gioco!", 250, 50);
    ctx.fillText("Kalo Bisa Mainin di laptop/pc yaa, sama mainnya pake arrow key", 100, 571);

    if (isInSpecialArea()) {
      inSpecialArea = true;
    } else {
      inSpecialArea = false;
      popupProgress = 0;
    }

    if (inSpecialArea) {
      if (popupProgress < 1) {
        popupProgress += 0.03;
      }
      drawPopup();
    }

    requestAnimationFrame(gameLoop);
  }

  characterImages[0].onload = function() {
    gameLoop();
  };
};
