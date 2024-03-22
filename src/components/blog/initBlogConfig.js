import defaultConfigs from '../default-blog-config.json';
export function initBlogConfig(blogConfig) {
    let config;
    try {
        config = blogConfig;
        if (!config) {
            throw e;
        }
    } catch (error) {
        config = defaultConfigs;
    }

    return config;
}