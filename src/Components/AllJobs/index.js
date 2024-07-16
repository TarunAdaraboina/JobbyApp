/* eslint-disbale import/extensions */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutLineSearch} from 'react-icons/ai'
// eslint-disable-next-line import/extensions
import Header from '../Header'
// eslint-disable-next-line import/no-unresloved
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const failureImage = 'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    // eslint-disable-next-line no-unused-vars
    const {checkboxInputs, radioInput, searchInput} = this.state
    const apiProfile = 'https://apis.ccbp.in/profile'
    const optionProfiles = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const responseProfile = await fetch(apiProfile, optionProfiles)
    if (responseProfile.ok === true) {
      const fetchtedDataProfile = await responseProfile.json()
      const updatedProfile = fetchtedDataProfile.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.shortBio,
      }))
      this.setState({
        profileData: updatedProfile,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onGetJobDetails = async () => {
    this.setState({apiJobStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(jobApiUrl, optionsJobs)
    if (responseJobs.ok === true) {
      const fetchtedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchtedDataJobs.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        titile: eachItem.titile,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state

    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )

    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        // eslint-disable-next-line no-unused-vars
        prevState => ({checkboxInputs: filteredData}),
        this.onGetJobDetails,
      )
    }
  }

  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div>
          <img src={profileImageUrl} alt="profile" />
          <h1> {name} </h1>
          <p> {shortBio} </p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  onGetFailureView = () => (
    <div>
      <button type="button" onClick={this.onRetryProfile}>
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.onGetJobDetails()
  }

  onGetJobsFailureView = () => (
    <div>
      <img src={failureImage} alt="failure view" />
      <h1> Oops! something went wrong </h1>
      <p>we cannot seem to find the page you are looking for </p>
      <div>
        <button type="button" onClick={this.onRetryJobs}>
          retry
        </button>
      </div>
    </div>
  )

  onGetJobsView = () => {
    const {jobsData} = this.state
    const nojobs = jobsData.length === 0
    return nojobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1> No jobs found</h1>
        <p> we could not find any jobs. Try others filter.</p>
      </div>
    ) : (
      <ul>
        {jobsData.map(eachItem => (
          <JobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  onRenderJobsStatus = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.onGetJobsView()
      case apiStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetCheckBoxesView = () => (
    <ul>
      {employmentTypesList.map(eachItem => (
        <li key={eachItem.employmentTypeId}>
          <input
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={this.onGetInputOption}
          />
          <label htmlfor={eachItem.employmentTypeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonView = () => (
    <ul>
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId}>
          <input
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label htmlfor={eachItem.salaryRangeId}>{eachItem.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetsearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.onGetJobDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {checkboxInputs, radioInput, searchInput} = this.state
    return (
      <>
        <Header />
        <div>
          {this.onRenderProfileStatus()}
          <hr />
          <h1> Type of Employment </h1>
          {this.onGetCheckBoxesView()}
          <hr />
          <h1> Salary Range </h1>
          {this.onGetRadioButtonView()}
        </div>
        <div>
          <div>
            <input
              type="search"
              value={searchInput}
              placeholder="Search"
              onChange={this.onGetsearchInput}
              onKeyDown={this.onEnterSearchInput}
            />
            <button
              data-testid="searchButton"
              type="button"
              onClick={this.onSubmitSearchInput}
            >
              <AiOutLineSearch />
            </button>
          </div>
          {this.onRenderJobsStatus()}
        </div>
      </>
    )
  }
}

export default AllJobs
