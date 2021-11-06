import React, { Component } from "react";
import Header from "../components/Header";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import Footer from "../components/Footer";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      lastSis: null,
      lastBro: null,
      broNum: 0,
      sisNum: 0,
      content: '',
      readError: null,
      writeError: null,
      loadingChats: false
    };
    this.handleSubmitBRO = this.handleSubmitBRO.bind(this);
    this.handleSubmitSIS = this.handleSubmitSIS.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;
    try {
      db.ref("chats").on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort(function (a, b) { return a.timestamp - b.timestamp })
        this.setState({ chats });
        const  lastBro = chats.filter(ch =>  ch.content === "BRO!!!" ).slice(-1)[0];
        const lastSis = chats.filter(ch =>  ch.content === "SIS!!!" ).slice(-1)[0];
        this.setState({lastBro, lastSis } )
        const broNum = chats.filter(ch =>  ch.content === "BRO!!!" ).length;
        const sisNum = chats.filter(ch =>  ch.content === "SIS!!!" ).length;
        this.setState({broNum, sisNum } )
        chatArea.scrollBy(0, chatArea.scrollHeight);
        this.setState({ loadingChats: false });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

/*
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.chats.length !== this.state.chats.length) {
      const  lastBro = this.state.chats.filter(ch =>  ch.content === "BRO!!!" ).slice(-1)[0];
      const lastSis = this.state.chats.filter(ch =>  ch.content === "SIS!!!" ).slice(-1)[0];
      this.setState({lastBro, lastSis } )
      console.log("DID UPDATE")
    }
  }

*/

  async handleSubmitBRO(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;
    try {
      await db.ref("chats").push({
        content: "BRO!!!",
        timestamp: Date.now(),
        uid: this.state.user.uid,
        email: this.state.user.email
      });
      this.setState({ content: '' });
      chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }
  async handleSubmitSIS(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;
    try {
      await db.ref("chats").push({
        content: "SIS!!!",
        timestamp: Date.now(),
        uid: this.state.user.uid,
        email: this.state.user.email
      });
      this.setState({ content: '' });

      chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }
  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      <div>
        <Header />
        <div className="alert alert-info total-bro-sis">
          {this.state.broNum ? <span className="text-info">{"Total: " + this.state.broNum + " BRO"}</span>  : ""}
          {this.state.sisNum ? <span className="text-info">{" and " + this.state.sisNum + " SIS"}</span>  : ""}
        </div>
        <div className="btn-container">
          <button type="submit" onClick={this.handleSubmitBRO} className="btn btn-submit blue px-5 mt-4">BRO</button>
          <button type="submit" onClick={this.handleSubmitSIS} className="btn btn-submit pink px-5 mt-4">SIS</button>
        </div>

        <div className="chat-area" ref={this.myRef}>
          {/* loading indicator */}
          {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> : ""}
          {this.state.lastBro ? <p key={this.state.lastBro.timestamp} className={"chat-bubble "}>
            {this.state.lastBro.content}
            <div className="chat-time">{"Sent by " + this.state.lastBro.email}</div>
            <div className="chat-time">{" at " + this.formatTime(this.state.lastBro.timestamp)}</div>
          </p> : ""}
          {this.state.lastSis ? <p key={this.state.lastSis.timestamp} className={"chat-bubble"}>
            {this.state.lastSis.content}
            <div className="chat-time">{"Sent by " + this.state.lastSis.email}</div>
            <div className="chat-time">{" at " + this.formatTime(this.state.lastSis.timestamp)}</div>
          </p> : ""}
        </div>

        <Footer/>

      </div>
    );
  }
}
