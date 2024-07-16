import {BsSearch} from 'react-icons/bs'

// eslint-diable-next-line import/extensions
import ProfileDetails from '../ProfileDetails'
import './index.css'

const FiltersGroup = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event)
  }

  const onEnterSearchInput = event => {
    const {getJobs} = props
    if (event.key === 'Enter') {
      getJobs()
    }
  }

  const renderSearchInput = () => {
    const {getJobs, searchInput} = props

    return (
      <div>
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button type="button" id="searchButton" onClick={getJobs}>
          {' '}
          <BsSearch />
        </button>
      </div>
    )
  }

  const renderTypeOfEmpolyment = () => {
    const {employmentTypesList} = props
    return (
      <div>
        <h1> Type of Empolyment </h1>
        <ul>
          {employmentTypesList.map(eachType => {
            const {changeEmployeeList} = props
            const onSelectEmployeeType = event => {
              changeEmployeeList(event.target.value)
            }
            return (
              <li
                key={eachType.employmentTypeId}
                onChange={onSelectEmployeeType}
              >
                <input
                  type="checkbox"
                  id={eachType.employmentTypeId}
                  value={eachType.employmentTypeId}
                />
                <label htmlFor={eachType.employmentTypeId}>
                  {eachType.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const renderSalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <div>
        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(eachSalary => {
            const {changeSalary} = props
            const onClickSalary = () => {
              changeSalary(eachSalary.salaryRangeId)
            }
            return (
              <li key={eachSalary.salaryRangeId} onClick={onClickSalary}>
                <input
                  type="radio"
                  id={eachSalary.salaryRangeId}
                  name="salary"
                />
                <label htmlFor={eachSalary.salaryRangeId}>
                  {eachSalary.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {renderSearchInput()}
      <ProfileDetails />
      <hr />
      {renderTypeOfEmpolyment()}
      <hr />
      {renderSalaryRange()}
    </div>
  )
}

export default FiltersGroup
