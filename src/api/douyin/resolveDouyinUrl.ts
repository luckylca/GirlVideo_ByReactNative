/**
 * 抖音短链接解析器
 * 使用WebView捕获302重定向来提取用户ID
 */

// 1. 匹配标准 ID (兼容 web url 和 deep link)
const ID_REGEX = /(?:share\/user\/|user\/|sec_uid=|"sec_uid":")([a-zA-Z0-9_\-]+)/;
const SHORT_LINK_REGEX = /https:\/\/v\.douyin\.com\/[a-zA-Z0-9_\-]+(?:\/)?/;

// 2. 使用通用API测试工具的请求头（和APIPost一致）
const APP_HEADERS = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': 'PostmanRuntime-ApipostRuntime/1.1.0',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
};

/**
 * 创建抖音URL解析器
 * @param rawText 包含抖音短链接的原始文本
 * @returns 解析器对象，包含短链接和提取用户ID的方法
 */
export const createDouyinResolver = (rawText: string) => {
    if (!rawText) throw new Error("输入为空");

    // 本地检查：如果已经包含完整的用户ID，直接返回
    const directMatch = rawText.match(ID_REGEX);
    if (directMatch && directMatch[1] && !rawText.includes('v.douyin.com')) {
        return {
            shortUrl: null,
            userUrl: `https://www.douyin.com/user/${directMatch[1]}`,
            needsWebView: false,
        };
    }

    // 提取短链接
    const shortMatch = rawText.match(SHORT_LINK_REGEX);
    if (!shortMatch) throw new Error("未识别到有效的抖音链接");

    const shortUrl = shortMatch[0];

    return {
        shortUrl,
        userUrl: null,
        needsWebView: true,

        /**
         * 从WebView导航URL中提取用户ID
         * @param url WebView当前的URL
         * @returns 如果找到用户ID，返回完整的用户主页URL；否则返回null
         */
        extractUserIdFromUrl: (url: string): string | null => {
            // 检查标准 ID
            const match = url.match(ID_REGEX);
            if (match && match[1]) {
                return `https://www.douyin.com/user/${match[1]}`;
            }

            // 检查 Deep Link 格式 (例如 snssdk1128://user/profile/MS4w...)
            const deepMatch = url.match(/user\/profile\/([a-zA-Z0-9_\-]+)/);
            if (deepMatch && deepMatch[1]) {
                return `https://www.douyin.com/user/${deepMatch[1]}`;
            }

            return null;
        }
    };
};

/**
 * 解析抖音短链接（兼容旧版本的函数签名）
 * 注意：这个函数现在需要配合WebView使用
 * 推荐使用 createDouyinResolver 来获得更好的控制
 */
export const resolveDouyinUrl = async (rawText: string): Promise<string> => {
    const resolver = createDouyinResolver(rawText);

    // 如果不需要WebView，直接返回
    if (!resolver.needsWebView && resolver.userUrl) {
        return resolver.userUrl;
    }

    // 如果需要WebView，抛出错误提示
    throw new Error("此链接需要使用WebView解析，请使用createDouyinResolver配合WebView组件");
};