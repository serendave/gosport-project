import Match from "../classes/Match.js";
import createPopup from "../utils/popup.js";

const token = localStorage.getItem("token");

// API call to backend
const matches = [
    new Match(27, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 5, 14, 55), 1.45, 1.74, 2.3),
    new Match(38, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 20, 14, 55), 1.75, 1.6, 2.41),
    new Match(10, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 16, 14, 55), 1.45, 1.74, 2.3),
    new Match(43, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 23, 14, 55), 1.38, 1.74, 2.53),
    new Match(23, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 3, 14, 55), 2.23, 1.8, 2.3),
    new Match(15, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 21, 14, 55), 1.45, 1.74, 3),
    new Match(16, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 7, 14, 55), 3.19, 1.56, 2.14),
    new Match(21, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 25, 14, 55), 1.45, 1.2, 2.5),
    new Match(25, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 25, 14, 55), 3.2, 2.5, 1.2),
    new Match(30, "Bate — Neman Gordno", "Bate", "Neman Gordo", new Date(2020, 4, 25, 14, 55), 1.8, 2.3, 3.5)
];

// Displaying matches
const matchesContainer = document.querySelector("#matches-container");

async function init() {
    try {
        // const url = "http://localhost:3000/api/get-current-matches";
        // // GET RESPONSE
        // let response = await axios.get(url);
    
        // console.log(response);
        // TRANSFORM RESPONSE
        // matches = await response.JSON();
    
        // DISPLAY
        displayMatches(matches);
    }
    catch(error) {
        createPopup("Some error while loading matches occured", document.querySelector("body"));
    }
}

function displayMatches(matches) {
    matchesContainer.innerHTML = "";

    if (matches.length > 0) {
        matches.forEach(match => {
            const matchContent = `
                <figure class="match animate__animated animate__zoomIn animate__faster">
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
                            ${match.datetime.getDate() >= 10? match.datetime.getDate() : "0" + match.datetime.getDate()}.${match.datetime.getMonth() + 1 >= 10? match.datetime.getMonth() + 1: "0" + (match.datetime.getMonth() + 1)}.${match.datetime.getFullYear()}
                        </p>
                        <p class="match__time">${match.datetime.getHours()}:${match.datetime.getMinutes()}</p>
                    </div>
        
                    <div class="match__coefficients-info">
                        <div class="match__coefficients-container">
                            <div class="match__coefficient match__coefficient--first">1: ${match.coefFirst}</div>
                            <div class="match__coefficient match__coefficient--second">x: ${match.coefX}</div>
                            <div class="match__coefficient match__coefficient--third">2: ${match.coefSecond}</div>
                        </div>
                        <a class="btn btn-link" href="http://127.0.0.1:8080/match-details.html?id=${match.id}" id="match-detail-link-${match.id}">Detailed View</a>
                    </div>
                </figure>
            `;
        
            matchesContainer.insertAdjacentHTML("beforeend", matchContent);
        });
        
        const btnLinks = Array.from(document.querySelectorAll(".btn-link"));
        btnLinks.forEach(btnLink => {
            btnLink.addEventListener("click", e => {
                if (!token) {
                    e.preventDefault();
                    createPopup(
                        "Sign in to view defailed information about matches and make bets", 
                        document.querySelector("body"),
                        "http://127.0.0.1:8080/login.html",
                        "Sign in"
                    );
                }
            });
        })

    } else {
        const errorMessage = '<p class="page-matches__error">There is no matches suitable for the search criterias</p>';
        matchesContainer.insertAdjacentHTML("beforeend", errorMessage);
    }
}

// Adding event Listeners
const btnApply = document.querySelector("#filters-apply");
const btnReset = document.querySelector("#filters-reset");

const coefFrom = document.querySelector("#coefficient-from");
const coefTo = document.querySelector("#coefficient-to");

const checkBox1 = document.querySelector("#coefficient-1");
const checkBoxX = document.querySelector("#coefficient-x");
const checkBox2 = document.querySelector("#coefficient-2");

const dateFrom = document.querySelector("#date-from");
const dateTo = document.querySelector("#date-to");

const search = document.querySelector("#search");

let filteredMatches;

btnApply.addEventListener("click", e => {

    filteredMatches = matches;

    // FILTERING BY COEFFICIENTS
    if (coefFrom.value != "" && coefTo.value != "") {

        coefFrom.value = parseFloat(coefFrom.value);
        coefTo.value = parseFloat(coefTo.value);

        if (checkBox1.checked) {
            filteredMatches = filteredMatches.filter(match => {
                return match.coefFirst >= coefFrom.value && match.coefFirst <= coefTo.value;
            });
        }

        if (checkBoxX.checked) {
            filteredMatches = filteredMatches.filter(match => {
                return match.coefX >= coefFrom.value && match.coefX <= coefTo.value;
            });
        }

        if (checkBox2.checked) {
            filteredMatches = filteredMatches.filter(match => {
                return match.coefSecond >= coefFrom.value && match.coefSecond <= coefTo.value;
            });
        }
    }

    // FILTERING BY DATE
    if (dateFrom.value != "" && dateTo.value != "") {
        filteredMatches = filteredMatches.filter(match => {
            return match.datetime >= dateFrom.valueAsDate && match.datetime <= dateTo.valueAsDate.setHours(23, 59);
        });
    }

    // FILTERING BY NAME
    if (search.value != "") {
        const searchPattern = new RegExp(search.value.toLowerCase());

        filteredMatches = filteredMatches.filter(match => {
            return searchPattern.test(match.matchName.toLowerCase());
        })
    }

    displayMatches(filteredMatches);
});

btnReset.addEventListener("click", e => {
    coefFrom.value = "";
    coefTo.value = "";

    checkBox1.checked = false;
    checkBoxX.checked = false;
    checkBox2.checked = false;

    dateFrom.value = "";
    dateTo.value = "";

    search.value = "";

    displayMatches(matches);
});

init();