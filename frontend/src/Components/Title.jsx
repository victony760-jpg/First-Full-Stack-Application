

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex items-center gap-2 mb-3 text-2xl sm:text-3xl lg:text-4xl'>
      <p className='prata-regular text-gray-500 whitespace-nowrap'>{text1} <span className='text-gray-700 font-semibold'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-px sm:h-0.5 bg-gray-700'></p>
    </div>
  )
}

export default Title
