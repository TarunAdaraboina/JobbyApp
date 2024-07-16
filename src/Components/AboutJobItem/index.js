import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'ract-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class AboutJobItem extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  // eslint-disable-next-line no-unused-vars
  getJobData = async props => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const optionsJobData = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobData = await fetch(jobDetailsApiUrl, optionsJobData)
    if (responseJobData.ok === true) {
      const fetchtedData = await responseJobData.json()
      const updatedjobDetails = [fetchtedData.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachItem.title,
      }))

      const updatedSimilarJobDetails = fetchtedData.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          employmentType: eachItem.employment_type,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )
      this.setState({
        jobDataDetails: updatedjobDetails,
        similarJobsData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state
    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        // estin-disable-next-line no-usused-vars
        id,
        jobDescription,
        lifeAtCompany,
        packagePerAnnum,
        location,
        rating,
        title,
        skills,
      } = jobDataDetails[0]

      return (
        <>
          <div>
            <div>
              <div>
                <img src={companyLogoUrl} alt="job details company logo" />
                <div>
                  <h1> {title} </h1>
                  <div>
                    <AiFillStar />
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
                    <p> {employmentType} </p>
                  </div>
                </div>
                <div>
                  <p> {packagePerAnnum} </p>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <div>
                <h1>Description </h1>
                <a href={companyWebsiteUrl}>
                  {' '}
                  Visit <BiLinkExternal />{' '}
                </a>
              </div>
              <p> {jobDescription} </p>
            </div>
            <h1>Skills</h1>
            <ul>
              {skills.map(eachItem => (
                <li key={eachItem.name}>
                  <img src={eachItem.imageUrl} alt={eachItem.name} />
                  <p> {eachItem.name} </p>
                </li>
              ))}
            </ul>
            <div>
              <div>
                <h1> Life at Company </h1>
                <p> {lifeAtCompany.description} </p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobsData.map(eachItem => (
              <SimilarJobs
                key={eachItem.id}
                similarJobData={eachItem}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  onRetryJobDetailsAgain = () => {
    this.getJobData()
  }

  renderFailureview = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! something went wrong </h1>
      <p> we cannot seem to find the page you are looking for.</p>
      <div>
        <button type="button" onClick={this.onRetryJobDetailsAgain}>
          retry
        </button>
      </div>
    </div>
  )

  renderjobLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

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

export default AboutJobItem
