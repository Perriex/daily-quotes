import Penguin from "./assets/Penguin";
import useApp from "./api/useApp";

import "./App.css";

function App() {
  const {
    nofitCount,
    quotes,
    connect,
    update,
    connectToServer,
    disconnetFromServer,
  } = useApp();

  return (
    <div className="container">
      <a onClick={update}>
        <Penguin number={nofitCount} showWelcome={!connect} />
        {nofitCount > 0 && <strong>Click on me to update!</strong>}
      </a>
      {connect ? (
        <button onClick={disconnetFromServer}>Enough!</button>
      ) : (
        <button onClick={connectToServer}>Say nice quotes!</button>
      )}
      {quotes && (
        <section className="list">
          <h1>Quotes</h1>
          <ul>
            {quotes.length === 0 ? (
              <>Wait for new quotes!</>
            ) : (
              quotes.map((item, index) => (
                <li key={index}>
                  <h5>{item.author} : </h5>
                  <p>{item.quote}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
