import React, { Component } from 'react';
import firebase from './firebase';
import '../App.scss';

class Polls extends Component {
  constructor() {
      super();
      this.state = {
          pollQuestions: [],
          currentPoll: [],
          answer1TotalVotes: 0,
          answer2TotalVotes: 0,
          pollQuestionRef: firebase.database().ref('users/guests/polls')
      };
  }

  componentDidMount() {
    const {pollQuestionRef} = this.state;

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

  incrementAnswer1Count = (e) => {
    e.preventDefault();
    const {id} = e.currentTarget;
    const {currentPoll, pollQuestionRef} = this.state;
    const vote = currentPoll[id].pName.votes1 + 1;
    pollQuestionRef.child(`${currentPoll[id].pNumber}`).update({votes1: vote});

    const newCurrentPoll = [...currentPoll]
    newCurrentPoll[id].voted = true
    this.setState({
      answer1TotalVotes: vote,
      currentPoll: newCurrentPoll
    });
  }

  incrementAnswer2Count = (e) => {
    e.preventDefault();
    const {id} = e.currentTarget;
    const {currentPoll, pollQuestionRef} = this.state;
    const vote = currentPoll[id].pName.votes2 + 1;
    pollQuestionRef.child(`${currentPoll[id].pNumber}`).update({votes2: vote});

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
        currentPoll
      }
    } = this;

    return (
        <div className="wrapper">
          <ul className='pollsList'>
            {
              this.state.pollQuestions.map((value, index) => {
                const optionA = value.answer1;
                const optionB = value.answer2;
                const totalVotesA = value.votes1;
                const totalVotesB = value.votes2;
                const pollQ = value.question;
                const currentPollQ = index;
                const voted = currentPoll[index].voted;
                return (
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
              })
            }
            
            {/* <li className='pollItem'>
                <div className="pollQuestion">
                  <p>pineapple on pizza?</p>
                </div>
                <div className="voteButtons">
                  <button onClick={onPollSubmit} type='button' value='yes'>yes</button>
                  <button onClick={onPollSubmit} type='button' value='no'>no</button>
                </div>
            </li>
            <li className='pollItem'>
                <div className="pollQuestion">
                  <p>ketchup or mustard?</p>
                </div>
                <div className="voteButtons">
                  <button onClick={onPollSubmit} type='button' value='ketchup'>ketchup</button>
                  <button onClick={onPollSubmit} type='button' value='mustard'>mustard</button>
                </div>
            </li>
            <li className='pollItem'>
                <div className="pollQuestion">
                	<p>chocolate or vanilla?</p>
                </div>
                <div className="voteButtons">
                  <button onClick={onPollSubmit} type='button' value='chocolate'>chocolate</button>
                  <button onClick={onPollSubmit} type='button' value='vanilla'>vanilla</button>
                </div>
            </li>
            <li className='pollItem'>
                <div className="pollQuestion">
                  <p>dogs or cats?</p>
                </div>
                <div className="voteButtons">
                  <button onClick={onPollSubmit} type='button' value='dogs'>dogs</button>
                  <button onClick={onPollSubmit} type='button' value='cats'>cats</button>
                </div>
            </li> */}
          </ul>
        </div>
    );
  };
};

export default Polls;