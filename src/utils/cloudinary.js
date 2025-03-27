
const uploadMedia = async (file, resourceType = 'image') => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Replace with your upload preset
        
        // The resource_type parameter determines whether it's an image or video upload
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, // Replace with your cloud name
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();
        
        // For videos, you might want to return both the video URL and a thumbnail
        if (resourceType === 'video') {
            return {
                url: data.secure_url,
                thumbnail: data.thumbnail_url, // Cloudinary automatically generates video thumbnails
                duration: data.duration, // Video duration in seconds
                format: data.format // Video format
            };
        }
        
        return data.secure_url;
    } catch (error) {
        console.error(`Error uploading ${resourceType}:`, error);
        throw error;
    }
};

// Helper function to check if a file is a video
const isVideo = (file) => {
    return file.type.startsWith('video/');
};

// Helper function to check if a file is an image
const isImage = (file) => {
    return file.type.startsWith('image/');
};

export { uploadMedia, isVideo, isImage };