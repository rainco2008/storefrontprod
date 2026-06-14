# Astro 商城前端模板

这是一个基于 Astro 的商城前端模板，当前目标是先完成可独立部署的前端程序，再逐步接入 Payload CMS 作为后台。

项目已经配置为优先使用本地 mock 数据，因此不依赖 Payload CMS、原始 Storefront API 或其他后端服务也可以运行和部署。后续接入 Payload 时，只需要在现有的数据客户端边界上替换数据来源。

## 技术栈

- Astro `6.4.6`：页面路由、服务端渲染和构建
- `@astrojs/cloudflare` `13.7.0`：Cloudflare Workers adapter
- Wrangler `4.100.0`：Cloudflare Workers 部署 CLI
- SolidJS `1.8.22` + `@astrojs/solid-js` `6.0.1`：购物车抽屉、商品交互等局部交互组件
- Tailwind CSS `3.4.11` + `@astrojs/tailwind` `6.0.2`：样式系统
- Astro Actions：购物车会话操作
- Zod `4.4.3`：表单和 action 输入校验
- Stripe `16.6.0`：可选支付服务，默认未配置时不会阻塞部署
- Payload CMS：计划接入的后台系统

## 当前状态

前端默认使用 `src/lib/client.mock.ts` 中的 mock 商品和集合数据。这个配置来自 `tsconfig.json`：

```json
{
	"compilerOptions": {
		"paths": {
			"storefront:client": ["./src/lib/client.mock.ts"]
		}
	}
}
```

因此商品列表、集合页、商品详情页和购物车基础功能可以在没有 Payload CMS 的情况下工作。

支付功能默认处于未配置状态。如果没有 Stripe 环境变量，checkout API 会返回 `503`，不会影响站点构建和部署。

## 项目结构

```sh
├── public/                  # 静态资源
├── src/
│   ├── actions/             # Astro Actions
│   ├── components/          # 通用组件和布局组件
│   ├── features/            # 商品、集合、购物车等业务模块
│   ├── lib/                 # 数据客户端、工具函数、类型
│   ├── pages/               # Astro 文件路由
│   └── styles.css           # 全局样式
├── astro.config.ts          # Astro 和 Cloudflare adapter 配置
├── tsconfig.json            # 路径别名和 TypeScript 配置
├── wrangler.toml            # Cloudflare Workers 配置
└── package.json
```

## 本地开发

安装依赖：

```sh
pnpm install
```

启动开发服务器：

```sh
pnpm dev
```

生产构建：

```sh
pnpm build
```

类型检查：

```sh
pnpm astro check
```

单元测试：

```sh
pnpm vitest run
```

## Cloudflare Workers 部署

项目已使用 `@astrojs/cloudflare` adapter，并包含 `wrangler.toml`。

一键部署：

[Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/?url=https://github.com/rainco2008/storefront)

本地登录 Cloudflare：

```sh
pnpm wrangler login
```

构建并部署到 Cloudflare Workers：

```sh
pnpm deploy:workers
```

这个命令会先运行 `pnpm build`，然后使用 Astro 生成的 Workers 配置部署：

```sh
wrangler deploy --config dist/server/wrangler.json
```

Cloudflare Workers 推荐配置：

| 配置项 | 值 |
| --- | --- |
| Build command | `pnpm build` |
| Deploy command | `pnpm deploy:workers` |
| Node.js version | `22.12.0` 或更高 |

如果使用 Cloudflare 控制台或 Git 集成，请确保仓库地址与一键部署链接中的 GitHub URL 一致。

## 环境变量

当前前端不需要任何环境变量即可构建和部署。

启用 Stripe checkout 时需要配置：

| 变量名 | 说明 |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe 服务端密钥 |
| `US_SHIPPING_RATE_ID` | Stripe 美国配送费率 ID |
| `INTERNATIONAL_SHIPPING_RATE_ID` | Stripe 国际配送费率 ID |

启用订单邮件时可配置：

| 变量名 | 说明 |
| --- | --- |
| `LOOPS_API_KEY` | Loops API Key |
| `LOOPS_SHOP_TRANSACTIONAL_ID` | 客户订单确认邮件模板 ID |
| `LOOPS_FULFILLMENT_TRANSACTIONAL_ID` | 商家履约通知邮件模板 ID |
| `LOOPS_FULFILLMENT_EMAIL` | 商家接收履约通知的邮箱 |

启用地图展示时可配置：

| 变量名 | 说明 |
| --- | --- |
| `GOOGLE_GEOLOCATION_SERVER_KEY` | 服务端 Geolocation API Key |
| `PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | 浏览器端 Google Maps API Key |

浏览器端可读取的变量必须使用 `PUBLIC_` 前缀，例如：

```sh
PUBLIC_FATHOM_SITE_ID=xxxx
PUBLIC_GOOGLE_MAPS_BROWSER_KEY=xxxx
```

## Payload CMS 接入计划

当前建议保留 `storefront:client` 作为数据访问边界。接入 Payload 时可以新增一个 Payload 客户端，例如：

```sh
src/lib/client.payload.ts
```

然后在 `tsconfig.json` 中把 alias 从 mock client 切换到 Payload client：

```diff
{
	"compilerOptions": {
		"paths": {
-			"storefront:client": ["./src/lib/client.mock.ts"]
+			"storefront:client": ["./src/lib/client.payload.ts"]
		}
	}
}
```

Payload client 需要实现与 `src/lib/client.mock.ts` 相同的函数接口，例如：

- `getProducts`
- `getProductById`
- `getCollections`
- `getCollectionById`
- `createCustomer`
- `createOrder`
- `getOrderById`

这样页面、购物车和 checkout 逻辑不需要大范围重写。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm deploy:workers` | 构建并部署到 Cloudflare Workers |
| `pnpm astro check` | Astro 类型检查 |
| `pnpm vitest run` | 运行单元测试 |
| `pnpm test:e2e` | 运行 Playwright 端到端测试 |
| `pnpm format` | 格式化代码 |
| `pnpm lint` | 运行 lint 和类型检查 |

## 注意事项

- 当前商品和集合数据来自 mock 文件，不是 Payload CMS。
- checkout 支付流程需要 Stripe 变量配置后才可用。
- 后续接入 Payload 时，优先替换数据客户端，不建议直接在页面组件中写 Payload 请求。
- Cloudflare Workers 部署时使用 `pnpm deploy:workers`，不要直接部署未构建的源码目录。
