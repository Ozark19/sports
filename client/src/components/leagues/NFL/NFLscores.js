import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../../Loader";

class NFLscores extends Component {
  state = {
    startDate: new Date(),
    loading: false,
    scores: null,
  };

  componentDidMount = async () => {
    this.setState({ loading: true }, this.getScores);
  };

  handleChange = async (date) => {
    this.setState(
      {
        startDate: date,
        loading: true,
      },
      this.getScores
    );
  };

  getScores = async () => {
    let date = moment(this.state.startDate).format("YYYYMMDD");
    if (date > 20210103) {
      date = 20210103;
    } else if (date < 20200910) {
      date = 20200910;
    }

    const info = await fetch(`/api/nfl/scores/${date}`);
    const scores = await info.json();

    this.setState({ loading: false, scores: scores });
  };

  render() {
    let date = moment(this.state.startDate).format("dddd MMMM Do");
    let lastDate = moment(this.state.startDate).format("YYYYMMDD");
    if (lastDate > 20210103) {
      date = "Sunday January 3rd";
    } else if (lastDate < 20200910) {
      date = "Thursday September 10th";
    }
    if (this.state.loading) {
      return (
        <div>
          <Loader />
        </div>
      );
    } else if (this.state.scores) {
      return (
        <div className="scores-container">
          <div className="scores-div">
            <div className="scores-title">
              <div className="scores-date">
                <h3>{date}</h3>
              </div>

              <div className="calendar-picker">
                <label>
                  <i className="fas fa-calendar-alt"></i>
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    showPopperArrow={false}
                  />
                </label>
              </div>
            </div>
            {this.state.scores.scoreboard.gameScore ? (
              <div className="scores-games-container">
                {this.state.scores.scoreboard.gameScore.map((item) => {
                  return (
                    <div className="scores-games" key={item.game.ID}>
                      <div className="scores-games-names">
                        <p>
                          {item.game.awayTeam.Abbreviation}{" "}
                          {item.game.awayTeam.Name}
                        </p>
                        <p>
                          {item.game.homeTeam.Abbreviation}{" "}
                          {item.game.homeTeam.Name}
                        </p>
                      </div>
                      <div className="scores-games-scores">
                        <p>{item.awayScore}</p>
                        <p>{item.homeScore}</p>
                      </div>
                      <div className="scores-games-time">
                        {(() => {
                          if (item.isCompleted === "true") {
                            return <p>Final</p>;
                          } else if (item.game.delayedOrPostponedReason) {
                            return <p>Postponed</p>;
                          } else {
                            return <p>{item.game.time}</p>;
                          }
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <h3>No games scheduled</h3>
            )}
          </div>
        </div>
      );
    }

    return <div></div>;
  }
}

export default NFLscores;
