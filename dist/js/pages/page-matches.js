import Match from "../classes/Match.js";
import createPopup from "../utils/popup.js";

const token = localStorage.getItem("token");

// Init matches as empty array
const matches = [];

// Displaying matches
const matchesContainer = document.querySelector("#matches-container");

function parseDate(dateToParse) {
    const [dateInfo, timeInfo] = dateToParse.split(" ");
    const [date, month, year] = dateInfo.split("-");
    const [hours, minutes] = timeInfo.split(":");

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(date),
        parseInt(hours), parseInt(minutes));
}

async function init() {

    // API call to backend
    try {
        const url = "http://localhost:3000/api/get-current-matches";

        // GET RESPONSE
        let response = await axios.get(url);
        console.log(response);

        // TRANSFORM RESPONSE
        response.data.matches.forEach(match => {
            matches.push(
                new Match(match._id, `${match.team1.teamName} — ${match.team2.teamName}`,
                    match.team1.teamName, match.team2.teamName,
                    parseDate(match.date),
                    match.coefficients["1"].toFixed(2),
                    match.coefficients["x"].toFixed(2),
                    match.coefficients["2"].toFixed(2)
                )
            );
        });

        // DISPLAY
        displayMatches(matches);
    }
    catch (error) {
        console.log(error);
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
                            ${match.datetime.getDate() >= 10 ? match.datetime.getDate() : "0" + match.datetime.getDate()}.${match.datetime.getMonth() + 1 >= 10 ? match.datetime.getMonth() + 1 : "0" + (match.datetime.getMonth() + 1)}.${match.datetime.getFullYear()}
                        </p>
                        <p class="match__time">${match.datetime.getHours()}:${match.datetime.getMinutes()}</p>
                    </div>
        
                    <div class="match__coefficients-info">
                        <div class="match__coefficients-container">
                            <div class="match__coefficient match__coefficient--first">1: ${match.coefFirst}</div>
                            <div class="match__coefficient match__coefficient--second">x: ${match.coefX}</div>
                            <div class="match__coefficient match__coefficient--third">2: ${match.coefSecond > 100? (10).toFixed(2) : match.coefSecond}</div>
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
                return match.coefFirst >= parseFloat(coefFrom.value) && match.coefFirst <= parseFloat(coefTo.value);
            });
        }

        if (checkBoxX.checked) {
            filteredMatches = filteredMatches.filter(match => {
                return match.coefX >= parseFloat(coefFrom.value) && match.coefX <= parseFloat(coefTo.value);
            });
        }

        if (checkBox2.checked) {
            filteredMatches = filteredMatches.filter(match => {
                return match.coefSecond >= parseFloat(coefFrom.value) && match.coefSecond <= parseFloat(coefTo.value);
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