import './landing.css';

const Landing = () => {
  return(

    <>
    <div className="header">
      <header>
      <h1>flagget</h1>
      </header>
    </div>
    <div className="row-align">
      <div className="sidenavigasjon">
        <nav>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
          </ul>
          <hr />
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </nav>
      </div>
      <div className="main">
        <main>
          <h2>Main content</h2>
        </main>
      </div>
    </div>
    </>
  )
}
export default Landing;