import { useMemo, useState } from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const jobsData = [
  { id: 1, title: 'Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { id: 2, title: 'UX Designer', department: 'Design', location: 'Washington, USA', type: 'Full-time' },
  { id: 3, title: 'Marketing Manager', department: 'Marketing', location: 'New York, USA', type: 'Full-time' },
  { id: 4, title: 'Sales Executive', department: 'Sales', location: 'Remote', type: 'Part-time' },
  { id: 5, title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { id: 6, title: 'Content Strategist', department: 'Marketing', location: 'Washington, USA', type: 'Full-time' },
];

const Careers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState([]);

  const toggleDepartment = (e) => {
    if (filterDepartment.includes(e.target.value)) {
      setFilterDepartment(prev => prev.filter(item => item !== e.target.value))
    } else {
      setFilterDepartment(prev => [...prev, e.target.value])
    }
  }

  const filteredJobs = useMemo(() => {
    let tempJobs = jobsData;

    if (filterDepartment.length > 0) {
      tempJobs = tempJobs.filter(job => filterDepartment.includes(job.department));
    }

    if (searchTerm) {
      tempJobs = tempJobs.filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return tempJobs;
  }, [filterDepartment, searchTerm]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Filter Sidebar */}
      <div className='min-w-60'>
        <p className='my-2 text-xl flex items-center cursor-pointer gap-2 uppercase prata-regular'>Filters</p>

        <div className='border border-gray-300 pl-5 py-3 mt-6'>
          <p className='mb-3 text-sm font-medium'>DEPARTMENT</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Engineering', 'Design', 'Marketing', 'Sales'].map((dept) => (
              <p key={dept} className='flex gap-2'>
                <input className='w-3' type="checkbox" value={dept} onChange={toggleDepartment} /> {dept}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className='flex-1'>
        <div className='flex flex-col md:flex-row justify-between md:items-center text-base sm:text-2xl mb-4 gap-4'>
          <Title text1={'OPEN'} text2={'ROLES'} />
          {/* Search Bar */}
          <div className='inline-flex items-center border border-gray-300 px-4 py-2 rounded-full w-full md:max-w-xs bg-white'>
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder='Search by job title...'
              className='flex-1 outline-none text-sm'
            />
            <img className='w-4' src={assets.search_icon} alt="Search" />
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className='border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all duration-300 rounded-sm'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800'>{job.title}</h3>
                  <div className='flex gap-4 mt-1 text-sm text-gray-500'>
                    <span className='flex items-center gap-1'>
                      <span className='w-2 h-2 rounded-full bg-blue-500'></span>
                      {job.department}
                    </span>
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/apply/${job.title}`)}
                  className='mt-4 md:mt-0 px-6 py-2 border border-black text-sm hover:bg-black hover:text-white transition-all duration-300 uppercase font-medium tracking-wider'
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <p className='text-gray-500 text-center py-10'>No roles found matching your filters.</p>
          )}
        </div>

        {/* Benefits Section */}
        <div className='mt-20 bg-slate-50 p-10 text-center rounded-sm'>
          <h2 className='prata-regular text-2xl mb-6'>Why join <span className='text-black'>VICTONY</span>?</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='space-y-2'>
              <b className='text-gray-800'>Growth</b>
              <p className='text-sm text-gray-600'>We invest in your career path with mentorship and learning resources.</p>
            </div>
            <div className='space-y-2'>
              <b className='text-gray-800'>Flexibility</b>
              <p className='text-sm text-gray-600'>Hybrid and remote options designed for modern life-work balance.</p>
            </div>
            <div className='space-y-2'>
              <b className='text-gray-800'>Innovation</b>
              <p className='text-sm text-gray-600'>Work with a cutting-edge tech stack to build the future of e-commerce.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Careers