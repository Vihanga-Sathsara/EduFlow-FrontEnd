import api from "./api"

export const saveLearningPath = async ( learningPath: { title: string, data: object, userId: string, status: boolean } ) => {
    const res = await api.post("/learning-path/save-learning-path", learningPath)
    return res.data
}

export const getLearningPaths = async ( userId: string ) => {
    const res = await api.get(`/learning-path/get-learning-paths/${userId}`)
    return res.data
}

export const updateLearningPathStatus = async ( progress: { userId: string, learningPathId: string, week: number, status: boolean } ) => {
    const res = await api.post("/learning-path/update-learning-path-status", progress)
    return res.data
}

export const getLearningPathProgress = async ( userId: string, learningPathId: string ) => {
    const res = await api.get(`/learning-path/get-learning-path-progress/${userId}/${learningPathId}`)
    return res.data
}

export const updateLearningDocument = async ( documentStatus: { userId: string, learningPathId: string, status: boolean } ) => {
    const res = await api.post("/learning-path/update-learning-document-status", documentStatus)
    return res.data
}

export const getAllLearningPaths = async () => {
    const res = await api.get("/learning-path/get-all-learning-paths")
    return res.data
}

