import api from "./api"

export const uploadEbookFile = async ( formData: FormData ) => {
    const res = await api.post("/ebook/upload-ebook", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
            
        }
    })
    return res.data
}

export const getAllEbooks = async () => {
    const res = await api.get("/ebook/get-all-ebooks")
    return res.data
}