class Match {
    constructor(id, matchName, firstTeamName, secondTeamName,
        datetime, coefFirst, coefX, coefSecond) {
        this.id = id;
        this.matchName = matchName;
        this.firstTeamName = firstTeamName;
        this.secondTeamName = secondTeamName;
        this.datetime = datetime;
        this.coefFirst = coefFirst;
        this.coefX = coefX;
        this.coefSecond = coefSecond;
    }
}

export default Match;