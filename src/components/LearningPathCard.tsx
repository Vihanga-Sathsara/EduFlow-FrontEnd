
interface LearningCardProps {
cardSeeAll : boolean
setSelectedPath?: (path: any) => void
setShowOverview?: (show: boolean) => void 
  learnDetail: {
    learningPaths: {
      title: string
      weeklyRoadmap: any[]
      status: boolean
    }[]
  }
}


const LearningPathCard = ({ learnDetail, cardSeeAll, setSelectedPath, setShowOverview } : LearningCardProps) => {
    
  
  const displayPaths = cardSeeAll ? learnDetail.learningPaths : learnDetail.learningPaths.slice(0, 2)
  
  return (
    <div className={`${cardSeeAll ? "grid lg:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-4" : "flex flex-col gap-4"}`}> 
      {
      displayPaths.map((item, index) => (
        <div key={index} className="p-4 mb-4 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition-shadow duration-300 bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status: {item.status ? "Completed" : "In Progress"}</span>
            <p className="text-blue-500 hover:underline lg:text-base sm:text-sm text-xs" onClick={() => { if (setSelectedPath) setSelectedPath(item); if (setShowOverview) setShowOverview(true)}}>Continue Learning</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LearningPathCard