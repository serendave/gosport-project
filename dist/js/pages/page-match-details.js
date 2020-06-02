import createPopup from "../utils/popup.js";

let matchId;
let chosenCoefficient;
let teamName = "";
let token;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function displayBetModal(element) {
    chosenCoefficient = element.dataset.value;
    const [coefficient, coefValue] = chosenCoefficient.split(" ");

    const modalMakeBet = document.querySelector("#modal-make-bet");
    const betInfo = document.querySelector("#modal-make-bet .page__modal-bet-info");
    betInfo.children[0].textContent = teamName;
    betInfo.children[0].style.display = "block";
    betInfo.children[2].textContent = `${coefficient} (${coefValue})`;

    modalMakeBet.classList.remove("page__modal--hidden");

    const modalClose = document.querySelector("#modal-make-bet .page__modal-content--close");
    modalClose.addEventListener("click", e => {
        modalMakeBet.classList.add("page__modal--hidden");
    });

    const makeBetButton = document.querySelector("#btn-make-bet");
    makeBetButton.addEventListener("click", e => {
        modalMakeBet.classList.add("page__modal--hidden");

        const url = "http://localhost:3000/api/make-bet";
        axios.post(url, {
            token,
            matchId,
            coefficient: chosenCoefficient.split(" ")[0]
        })
            .then(response => {
                console.log(response);

                if (document.querySelectorAll(".page__modal").length < 2) {
                    createPopup(
                        "You made bet! Go to your cabinet to see chosen bets",
                        "",
                        "http://127.0.0.1:8080/cabinet.html",
                        "Go to my cabinet"
                    );
                }
            })
            .catch(error => {
                console.log(error);

                if (document.querySelectorAll(".page__modal").length < 2) {
                    createPopup("Some error occured. Please, try again");
                }
            });
    });
}

function displayStats(matches, statsContainer, teamId) {
    matches.forEach(match => {

        let currentTeam, otherTeam;
        let currentTeamScore, otherTeamScore;
        let result;

        if (teamId === match.team1._id) {
            currentTeam = match.team1;
            currentTeamScore = match.goalsTeam1;
            otherTeam = match.team2;
            otherTeamScore = match.goalsTeam2;
        } else {
            currentTeam = match.team2;
            currentTeamScore = match.goalsTeam2;
            otherTeam = match.team1;
            otherTeamScore = match.goalsTeam1;
        }

        if (currentTeamScore > otherTeamScore) {
            result = "statistics__element--win";
        } else if (currentTeamScore === otherTeamScore) {
            result = "statistics__element--draw";
        } else {
            result = "statistics__element--lose";
        }

        let resultScore = `${currentTeamScore}:${otherTeamScore}`;

        if (currentTeamScore === null || otherTeamScore === null) {
            resultScore = "Playing";
            result = "statistics__element--win";
        }

        if (currentTeam.teamName.split(" ")[1] === "Mönchengladbach") {
            currentTeam.teamName = "Mönchen Gladbach";
        }

        if (otherTeam.teamName.split(" ")[1] === "Mönchengladbach") {
            otherTeam.teamName = "Mönchen Gladbach";
        }

        const matchInfo = `
                <div class="statistics__row">
                    <div class="statistics__element">${currentTeam.teamName}</div>
                    <div class="statistics__element ${result}">${resultScore}</div>
                    <div class="statistics__element">${otherTeam.teamName}</div>
                </div>
            `;

        statsContainer.insertAdjacentHTML("beforeend", matchInfo);
    });
}

function parseDate(dateToParse) {
    const [dateInfo, timeInfo] = dateToParse.split(" ");
    const [date, month, year] = dateInfo.split("-");
    const [hours, minutes] = timeInfo.split(":");

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(date),
        parseInt(hours), parseInt(minutes));
}

window.onload = () => {

    // Check if user is authenticated
    token = localStorage.getItem("token");

    if (token !== undefined && token !== null) {

        // Parse the URL parameter
        matchId = getParameterByName("id");
        // console.log(matchId);

        // Get the match and display it
        const url = "http://localhost:3000/api/match/get-details";

        console.log(token, "token");
        console.log(matchId, "matchId");

        axios.get(url, { params: { token, matchId } })
            .then(response => {
                console.log(response);

                const match = response.data.match;

                // DISPLAYING GENERAL INFO
                document.querySelector("#match-name").textContent =
                    match.team1.teamName + " : " + match.team2.teamName;

                // DISPLAYING COEFFICIENTS
                document.querySelector("#coefficient-1 span:last-child")
                    .textContent = match.coefficients["1"].toFixed(2);
                document.querySelector("#coefficient-x span:last-child")
                    .textContent = match.coefficients["x"].toFixed(2);
                document.querySelector("#coefficient-2 span:last-child")
                    .textContent = match.coefficients["2"] > 100 ?
                        match.coefficients["2"].toString().substr(0, 2)
                        : match.coefficients["2"].toFixed(2);
                document.querySelector("#coefficient-1x span:last-child")
                    .textContent = match.coefficients["1x"].toFixed(2);
                document.querySelector("#coefficient-12 span:last-child")
                    .textContent = match.coefficients["12"].toFixed(2);
                document.querySelector("#coefficient-2x span:last-child")
                    .textContent = match.coefficients["2x"].toFixed(2);


                const coefficients = Array.from(
                    document.querySelectorAll(".match-detail__coefficients .match-detail__item"));

                coefficients.forEach(coefficient => {
                    coefficient.addEventListener("click", e => {
                        displayBetModal(e.target)
                    });
                });

                // DISPLAYING MATH PREDICTION
                document.querySelector("#math-prediction-1 span:last-child")
                    .textContent = match.mathPredicts["1"].toFixed(2) + " %";
                document.querySelector("#math-prediction-x span:last-child")
                    .textContent = match.mathPredicts["x"].toFixed(2) + " %";
                document.querySelector("#math-prediction-2 span:last-child")
                    .textContent = match.mathPredicts["2"].toFixed(2) + " %";
                document.querySelector("#math-prediction-1x span:last-child")
                    .textContent = match.mathPredicts["1x"].toFixed(2) + " %";
                document.querySelector("#math-prediction-12 span:last-child")
                    .textContent = match.mathPredicts["12"].toFixed(2) + " %";
                document.querySelector("#math-prediction-2x span:last-child")
                    .textContent = match.mathPredicts["2x"].toFixed(2) + " %";


                // DISPLAYING NEURO PREDICTION
                // document.querySelector("#neuro-prediction-1 span:last-child").textContent = response.data;
                // document.querySelector("#neuro-prediction-x span:last-child").textContent = response.data;
                // document.querySelector("#neuro-prediction-2 span:last-child").textContent = response.data;
                // document.querySelector("#neuro-prediction-1x span:last-child").textContent = response.data;
                // document.querySelector("#neuro-prediction-12 span:last-child").textContent = response.data;
                // document.querySelector("#neuro-prediction-2x span:last-child").textContent = response.data;


                // DISPLAYING DATE
                const datetime = parseDate(match.date);

                const date = `${datetime.getDate() >= 10 ? datetime.getDate() : "0" + datetime.getDate()}.${datetime.getMonth() + 1 >= 10 ? datetime.getMonth() + 1 : "0" + (datetime.getMonth() + 1)}.${datetime.getFullYear()}`;

                const time = `${datetime.getHours()}:${datetime.getMinutes()}`;

                document.querySelector("#match-date").textContent = date;
                document.querySelector("#match-time").textContent = time;


                // DISPLAYING STATS
                const urlStats = "http://localhost:3000/api/team/getStats";
                const firstTeamId = match.team1._id;
                const secondTeamId = match.team2._id;

                axios.get(urlStats, { params: { token, teamId: firstTeamId } })
                    .then(response => {
                        console.log(response);
                        const statsContainer = document.querySelector("#statistics-team-1 .statictics__container");
                        displayStats(response.data.matches, statsContainer, firstTeamId);
                    })
                    .catch(error => {
                        console.log(error);
                    })

                axios.get(urlStats, { params: { token, teamId: secondTeamId } })
                    .then(response => {
                        console.log(response);
                        const statsContainer = document.querySelector("#statistics-team-2 .statictics__container");
                        displayStats(response.data.matches, statsContainer, secondTeamId);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);

                if (document.querySelectorAll(".page__modal").length < 2) {
                    createPopup("Some error occured. Please, try again");
                }
            });

    } else {
        const cabinet = document.querySelector(".page-match-details .row");
        cabinet.innerHTML = "";

        const accessDenied = document.createElement("div");
        accessDenied.className = "page__access-denied";

        const accessDeniedContainter = document.createElement("div");
        accessDeniedContainter.className = "page__access-denied--container";
        accessDeniedContainter.textContent = "You are not authenticated and don't have permissions to view this page";

        accessDenied.appendChild(accessDeniedContainter);
        cabinet.appendChild(accessDenied);

        window.location.replace('http://127.0.0.1:8080/matches.html');
    }
};