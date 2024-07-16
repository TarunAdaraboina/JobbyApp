import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div>
      <div>
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of People search for jobs, salary information, company
          reviews. Find the job thats fitss your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button">Find Jobs</button>
        </Link>
      </div>
    </div>
  </>
)
export default Home
