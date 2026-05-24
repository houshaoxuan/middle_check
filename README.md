# Middle Check Demo

中期验收展示网页，包含 Next.js 前端和本地 Python 模拟后端。

## 环境

- Node.js 16.15.1
- npm 8+
- Python 3.10+

## 安装

```powershell
npm install
npm run backend:install
```

## 本地运行

启动后端：

```powershell
npm run dev:backend
```

启动前端：

```powershell
npm run dev:frontend
```

访问：

```text
http://localhost:3000
```

前端默认请求 `http://<当前访问主机>:8000`。如需自定义后端地址，可设置：

```powershell
$env:NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
npm run dev:frontend
```

## 说明

`backend/` 提供本地 mock 后端，复刻前端原有接口路径和流式日志行为，验收展示时不再依赖公网或内网后端服务。
