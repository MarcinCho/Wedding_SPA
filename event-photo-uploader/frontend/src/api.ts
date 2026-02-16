export async function uploadImage(file: File, onProgress: (progress: number) => void): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        xhr.open('POST', '/api/upload');

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                onProgress(Math.round(percentComplete));
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve({ success: true });
            } else {
                resolve({ success: false, message: xhr.responseText || 'Upload failed' });
            }
        };

        xhr.onerror = () => {
            resolve({ success: false, message: 'Network error' });
        };

        xhr.send(formData);
    });
}
