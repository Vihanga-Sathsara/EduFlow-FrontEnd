import api from "./api"

export const genarateLearningPath = async (userInput: string) => {
    const res = await api.post("/ai/generate", { userInput })
    return res.data
}

export const generateNote = async ( subject: string, topics: string[] ) => {
    const res = await api.post("/ai/generate-note", { subject, topics },{ responseType: "arraybuffer" })
    const blob = new Blob([res.data], { type: "application/pdf" });
    return blob
}

export const generateAnswers = async ( subject: string, questions: string[] ) => {
    const res = await api.post("/ai/genarate-answers", { subject, questions })
    return res.data
}

