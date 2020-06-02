$(document).ready(() => {

    // Sticky navigation
    $(".features").waypoint(function (direction) {
        if (direction == "down") {
            $(".header").addClass("header--sticky");
        } else {
            $(".header").removeClass("header--sticky");
        }
    }, {
        offset: "55px"
    });

    const url = "http://localhost:3000/api/get-current-matches";
    const numberOfMatchesToShow = 4;
    const matchesContainer = document.querySelector(".matches__container .slider__items");

    axios.get(url)
        .then(response => {
            for (let i = 0; i < numberOfMatchesToShow; i++) {
                const match = response.data.matches[i];
                const [date, time] = match.date.split(" ");
                
                const matchTemplate = `
                    <figure class="matches__match slider__item slider__item_${i + 1}">
                        <div class="matches__team">
                            <img src="dist/images/team-logo-1.png" alt="Team 1 logo" class="matches__team-logo">
                            <p class="matches__team-name">${match.team1.teamName}</p>
                        </div>
                        <div class="matches__info">
                            <img src="dist/images/match.jpg" alt="Match image" class="matches__image">
                            <p class="matches__date">${date.replace(/-/g, ".")}</p>
                            <p class="matches__time">${time}</p>
                        </div>
                        <div class="matches__team">
                            <img src="dist/images/team-logo-2.jpg" alt="Team 2 logo" class="matches__team-logo">
                            <p class="matches__team-name">${match.team2.teamName}</p>
                        </div>
                    </figure>
                `;

                matchesContainer.insertAdjacentHTML("beforeend", matchTemplate);
            }
        })
        .catch(error => {
            console.log(error);
        });
});