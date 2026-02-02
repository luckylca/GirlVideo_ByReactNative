

const getVideo = async (videoChanelUrl: string): Promise<any> => {
    try {
        const response = await fetch(videoChanelUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching video data:", error);
        throw error;
    }
}

export default getVideo;