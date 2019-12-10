import React, { Component } from 'react';
import firebase from './firebase';
import '../App.scss';
import 'firebase/auth';

class Polls extends Component {
  constructor() {
      super();
      this.state = {
          pollQuestions: [],
          currentPoll: [],
          answer1TotalVotes: 0,
          answer2TotalVotes: 0,
          pollQuestionRef: firebase.database().ref('/publicPolls')
      };
  }

  componentDidMount() {
    const {pollQuestionRef} = this.state;
    // Going to firebase and check each object (Poll) to see if the first one is checked/voted and storing them into an array
    pollQuestionRef.on('value', fbData => {
      const pollData = fbData.val();
      const pollContent = Object.values(pollData);
      const pollNum = [];
      for (let key in pollData){  
        const pollNumbers = {
          pNumber: key,
          pName: pollData[key],
          voted: false
        }
        pollNum.push(pollNumbers);
      }
      this.setState({
        pollQuestions: pollContent,
        currentPoll: pollNum
      });
    });
  }

  // Incrementing the option one every time a user votes for option one in any vote poll
  incrementAnswer1Count = (e) => {
    e.preventDefault();
    const {id} = e.currentTarget;
    const {currentPoll, pollQuestionRef} = this.state;
    const vote = currentPoll[id].pName.votes1 + 1;
    const {userId} = this.props;
    pollQuestionRef.child(`${currentPoll[id].pNumber}`).update({
      votes1: vote,
    });

    pollQuestionRef.child(`${currentPoll[id].pNumber}`).child('usersVotedList').push(userId);
    const newCurrentPoll = [...currentPoll]
    newCurrentPoll[id].voted = true
    this.setState({
      answer1TotalVotes: vote,
      currentPoll: newCurrentPoll
    });
  }

  // Incrementing the option two every time a user votes for option two in any vote poll
  incrementAnswer2Count = (e) => {
    e.preventDefault();
    const {id} = e.currentTarget;
    const {currentPoll, pollQuestionRef} = this.state;
    const vote = currentPoll[id].pName.votes2 + 1;
    const {userId} = this.props;
    pollQuestionRef.child(`${currentPoll[id].pNumber}`).update({
      votes2: vote
    });

    pollQuestionRef.child(`${currentPoll[id].pNumber}`).child('usersVotedList').push(userId);
    const newCurrentPoll = [...currentPoll]
    newCurrentPoll[id].voted = true
    this.setState({
      answer2TotalVotes: vote,
      currentPoll: newCurrentPoll
    });
  }

  render() {
    const {
      incrementAnswer1Count,
      incrementAnswer2Count,
      state: {
        currentPoll,
        pollQuestions
      }
    } = this;

    const {userId} = this.props;
    return (
        <div className="wrapper">
          <ul className='pollsList'>
            {
              pollQuestions.map((value, index) => {
                const optionA = value.answer1;
                const optionB = value.answer2;
                const totalVotesA = value.votes1;
                const totalVotesB = value.votes2;
                const pollQ = value.question;
                const currentPollQ = index;
                const voted = currentPoll[index].voted;
                const usersVotedList = value.usersVotedList;
                let item;
                for (let user in usersVotedList) {
                  if (usersVotedList[user] !== userId) {
                    item = (
                      <li key={index} className='pollItem'>
                          <div className="pollQuestion">
                            <p>{pollQ}</p>
                          </div>
                          <div className="voteButtons">
                            <button 
                              id={currentPollQ} 
                              onClick={incrementAnswer1Count}  
                              value='votes1'
                              disabled={voted ? true : false}
                            >
                              {optionA}
                              <p className={`${voted ? 'showVotes' : null}`}>
                                ({totalVotesA})
                              </p>
                            </button>
                            <button 
                              id={currentPollQ}
                              onClick={incrementAnswer2Count} 
                              value='votes2'
                              disabled={voted ? true : false}
                            >
                              {optionB}
                              <p className={`${voted ? 'showVotes' : null}`}>
                                ({totalVotesB})
                              </p>
                            </button>
                          </div>
                      </li>
                    )
                  }
                  else {
                    item = (
                      <li key={index} className='pollItem'>
                          <div className="pollQuestion">
                            <p>{pollQ}</p>
                          </div>
                          <div className="voteButtons">
                            <button 
                              id={currentPollQ} 
                              onClick={incrementAnswer1Count}  
                              value='votes1'
                              disabled={true}
                            >
                              {optionA}
                              <p className='showVotes'>
                                ({totalVotesA})
                              </p>
                            </button>
                            <button 
                              id={currentPollQ}
                              onClick={incrementAnswer2Count} 
                              value='votes2'
                              disabled={true}
                            >
                              {optionB}
                              <p className='showVotes'>
                                ({totalVotesB})
                              </p>
                            </button>
                          </div>
                      </li>
                    )
                  }
                }
              return item;
              })
            }
          </ul>
        </div>
    );
  };
};

export default Polls;