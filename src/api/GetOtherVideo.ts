import Config from "react-native-config";

const getOtherVideo = async (url: string, page: number): Promise<any> => {
    try {
        // 关键：必须 trim() 去掉 URL 和 Key 后面可能的换行符或空格
        const apiUrl = Config.GET_OTHER_VIDEO_URL?.trim();
        const apiToken = Config.GET_OTHER_VIDEO_KEY?.trim();

        // const apiUrl = "https://www.magicalapk.com/api4/user/parse"
        // const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJVSURfMEZFODRGQzU2RTM3Nzk5NDhFM0I2QTA5RERDRUVDMUIiLCJleHAiOjQ5MDYzNTg4ODN9.JGToyGy13i0yTbGCAlyHvc0DvW4au7eo1DdOnEZHVYk"
        if (!apiUrl) throw new Error("Config URL is missing");

        // const postItem = { url: "https://www.douyin.com/user/MS4wLjABAAAAnCCjg32RdaNXS1twDgbCAEmGVwdQ_73NTL3hu5G-BQDnwoYjEGaMOiJu79JIyztR?from_tab_name=main", page: 1 };
        const postItem = { url: url, page: page };
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                // 1. 严格对应 APIPost 的 Content-Type
                "Content-Type": "application/json",
                // 2. 这里的 Token 变量必须 trim()，否则 JWT 最后的换行符会导致请求失败
                "Token": apiToken || "",
                // 3. 模拟 APIPost 的环境，或者干脆先不传 UA
                "Accept": "*/*",
                "Connection": "keep-alive",
            },
            body: JSON.stringify(postItem)
        });

        if (!response.ok) {
            // 如果 response 存在但 ok 为 false，说明连上了但后端报错
            const errorText = await response.text();
            throw new Error(`Server Error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        // 这里打印更详细的错误
        console.error("Fetch Error Detail:", error);
        throw error;
    }
}

export default getOtherVideo;