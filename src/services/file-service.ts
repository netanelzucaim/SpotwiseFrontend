import apiClient from "./api-client";

interface IUploadResponse {
    url: string;
}

export const uploadPhoto = async (photo: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        if (photo) {
            formData.append("file", photo);
            apiClient.post<IUploadResponse>('file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                resolve(res.data.url);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        } else {
            reject(new Error("No photo provided"));
        }
    });
}