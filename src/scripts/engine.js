const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardsSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    player2: "computer-cards",
    player2Box: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/"; 

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
]

async function getRandomCardId() {
  return Math.floor(Math.random() * cardData.length);
}


async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${pathImages}card-back.png`);
  cardImage.setAttribute("data-id", idCard);  // idCard agora é o índice correto
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });

    // Alterar para passar o índice corretamente no mouseover
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard);  // Usar idCard diretamente aqui
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Empate!";

  let playerCard = cardData[playerCardId];

  if(playerCard.winOf.includes(computerCardId)) {
    duelResults = "Ganhou!";
    await playAudio("win");
    state.score.playerScore++;
  }

  if(playerCard.loseOf.includes(computerCardId)) {
    duelResults = "Perdeu!";
    await playAudio("lose");
    state.score.computerScore++;
  }

  return duelResults;
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function removeAllCardsImages() {
  let cards = state.playerSides.player2Box;
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
  
  cards = state.playerSides.player1Box;
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardsSprites.avatar.src = cardData[index].img;
  state.cardsSprites.name.innerText = cardData[index].name;
  state.cardsSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for(let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);

  }
}

async function resetDuel() {
  state.cardsSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

function init() {
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.player2);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();