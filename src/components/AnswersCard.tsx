interface AiAnswerModalProps {
  answers: { question: string; answer: string }[]
  onClose: () => void
  answerLoading: boolean
}

const AiAnswerModal = ({ answers, onClose, answerLoading }: AiAnswerModalProps) => {
  return (
   <div className="bg-white p-6 rounded shadow-lg w-[80%] max-h-[80vh] overflow-y-auto">

    <div className="w-full flex justify-end">
      <button onClick={onClose} className="mb-4 px-3 py-1 bg-red-500 text-white rounded">Close</button>
    </div>
      
      {answerLoading ? (
        <div className="flex justify-center items-center p-10">
          <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
          <p className="ml-3">Loading answers...</p>
        </div>
      ) : answers.length === 0 ? (
        <p>No answers found.</p>
      ) : (
        answers.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded border mb-2">
            <p className="font-semibold text-sm">{item.question}</p>
            <p className="text-gray-700 mt-1">{item.answer}</p>
          </div>
        ))
      )}
    </div>
  )}

export default AiAnswerModal
