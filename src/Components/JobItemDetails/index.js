import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
// eslint-disbale-next-line import/extensions
import SimilarJobItem from '../SimilarJobItem'
import SkillsCard from '../SkillsCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getFormattedSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    title: data.title,
    rating: data.rating,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getJobData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSimilarData = data.similar_jobs.map(eachSimilar =>
        this.getFormattedSimilarData(eachSimilar),
      )
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureview = () => {
    const {match} = this.props
    const {params} = match
    // eslint-disable-next-line
    const {id} = params
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! something went wrong </h1>
        <p> we cannot seem to find the page you are looking for</p>
        <div>
          <button type="button" id="button" onClick={this.getJobData}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  renderjobLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetailsSuccessView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div>
        <div>
          <div>
            <div>
              <img src={companyLogoUrl} alt="job details company logo" />
              <div>
                <h1> {title} </h1>
                <div>
                  <BsStarFill />
                  <p> {rating} </p>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <MdLocationOn />
                  <p> {location} </p>
                </div>
                <div>
                  <BsFillBriefcaseFill />
                  <p> {employmentType} </p>
                </div>
              </div>
              <p>{packagePerAnnum} </p>
            </div>
          </div>
          <hr />
          <div>
            <h1> Description </h1>
            <div>
              <a href={companyWebsiteUrl}>Visit</a>
              <BiLinkExternal />
            </div>
          </div>
          <p> {jobDescription} </p>
          <h1> Skills </h1>
          <ul>
            {skills.map(eachSkill => (
              <SkillsCard key={eachSkill.name} skillDetails={eachSkill} />
            ))}
          </ul>
          <h1> Life at Company </h1>
          <div>
            <p> {description} </p>
            <img src={imageUrl} alt="life at company" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobsData.map(eachJob => (
            <SimilarJobItem jobDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureview()
      case apiStatusConstants.inProgress:
        return this.renderjobLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobDetails()}</div>
      </>
    )
  }
}
export default JobItemDetails
