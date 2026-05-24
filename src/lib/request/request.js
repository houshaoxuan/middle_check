// 本地验收展示后端配置。
// 默认连接当前访问主机的 8000 端口，部署到同一台服务器时无需写死内网 IP。
// 如需反向代理或自定义端口，可设置 NEXT_PUBLIC_API_BASE_URL。
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  return 'http://localhost:8000';
};

export const BASE_URL = getBaseUrl();

// 通用请求封装
export default async function request(config) {
  // 合并默认配置
  const {
    method = 'GET',
    data = null,
    headers = {},
    responseType = 'json'
  } = config;

  // 处理请求参数
  const requestConfig = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  // GET请求参数处理
  let requestUrl = config.url;

  if (method.toUpperCase() === 'GET' && data) {
    const params = new URLSearchParams(data).toString();
    requestUrl += `?${params}`;
  } else if (data) {  // 非GET请求体处理
    requestConfig.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(BASE_URL + requestUrl, requestConfig);

/*     // 响应状态检查
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } */

    // 响应数据处理
    const responseData = await (responseType === 'text'
      ? response.text()
      : response.json());

/*     // 响应拦截器（示例）
    if (typeof responseInterceptor === 'function') {
      return responseInterceptor(responseData);
    } */

    return responseData;
  } catch (error) {
    // 统一错误处理
    throw new Error(`请求失败: ${error.message}`);
  }
}

request.BASE_URL = BASE_URL;
