import Match from "../classes/Match.js";

// API call to backend
const matches = [
    new Match(2, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 5, 14, 55), 1.45, 1.74, 2.3),
    new Match(38, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 20, 5, 14, 55), 1.75, 1.6, 2.41),
    new Match(10, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 16, 5, 14, 55), 1.45, 1.74, 2.3),
    new Match(43, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 23, 5, 14, 55), 1.38, 1.74, 2.53),
    new Match(23, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 3, 5, 14, 55), 2.23, 1.8, 2.3),
    new Match(15, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 21, 5, 14, 55), 1.45, 1.74, 3),
    new Match(16, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 7, 5, 14, 55), 3.19, 1.56, 2.14),
    new Match(21, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 25, 5, 14, 55), 1.45, 1.2, 2.5)
];

// Displaying matches
const matchesContainer = document.querySelector("#matches-container");

function init() {
    displayMatches(matches);
}

function displayMatches(matches) {
    matchesContainer.innerHTML = "";

    matches.forEach(match => {
        const matchContent = `
            <figure class="match">
                <div class="match__general-info">
                    <div>
                        <div class="match__team match__first-team">
                            <!-- team logo -->
                            <h4 class="match__team-name">${match.firstTeamName}</h4>
                        </div>
                        <img src="dist/images/match.jpg" alt="Match image" class="match__image">
                        <div class="match__team match__second-team">
                            <!-- team logo -->
                            <h4 class="match__team-name">${match.secondTeamName}</h4>
                        </div>
                    </div>
                    <h2 class="match__name">
                        ${match.matchName}
                    </h2>
                </div>
    
                <div class="match__date-info">
                    <p class="match__date">
                        ${match.datetime.getDate()}.${match.datetime.getMonth()}.${match.datetime.getFullYear()}
                    </p>
                    <p class="match__time">${match.datetime.getHours()}:${match.datetime.getMinutes()}</p>
                </div>
    
                <div class="match__coefficients-info">
                    <div class="match__coefficients-container">
                        <div class="match__coefficient match__coefficient--first">1: ${match.coefFirst}</div>
                        <div class="match__coefficient match__coefficient--second">x: ${match.coefX}</div>
                        <div class="match__coefficient match__coefficient--third">2: ${match.coefSecond}</div>
                    </div>
                    <button class="btn">Detailed View</button>
                </div>
            </figure>
        `;
    
        matchesContainer.insertAdjacentHTML("beforeend", matchContent);
    });
}

// Adding event Listeners
const btnApply = document.querySelector("#filters-apply");
const btnReset = document.querySelector("#filters-reset");

let coefFrom = document.querySelector("#coefficient-from");
let coefTo = document.querySelector("#coefficient-to");

btnApply.addEventListener("click", e => {
    const filteredMatches = matches;

    if (coefFrom.value != "" && coefTo.value != "") {
        coefFrom.value = parseInt(coefFrom.value);
        coefTo.value = parseInt(coefTo.value);

        filteredMatches = matches.filter(match => {
            return match.coefFirst >= coefFrom.value && match.coefFirst <= coefTo.value;
        });
    }

    displayMatches(filteredMatches);
});

btnReset.addEventListener("click", e => {
    coefFrom.value = "";
    coefTo.value = "";
});

init();