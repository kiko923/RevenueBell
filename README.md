# RevenueBell

RevenueBell 是一个轻量级的 Cloudflare Worker，用于接收 Apple App Store Server Notifications V2，并通过 Bark 把收入、退款、风险预警、状态变更通知推送到你的设备。

项目同时支持两种部署方式：

- 单应用版：复制 `wpush.js` 到 Cloudflare Dashboard，适合只接一个 App。
- 多应用版：使用 `wrangler.jsonc` + `index.js`，适合一个 Worker 同时接多个 App。

默认情况下，四类通知都会推送：收入通知、退款通知、风险预警、状态变更。

## 快速开始

### 前置要求

1. Cloudflare 账号：https://dash.cloudflare.com/sign-up
2. Bark App：从 App Store 下载 Bark，并获取推送 Key
   - App Store 链接：https://apps.apple.com/cn/app/bark/id1403753865
   - Bark Key 通常类似 `yirE82xxxxxxxxxxxx`

## 方式一：单应用版

适合只部署一个 App。README 原来的教程就是这个方式。

### 通过 Cloudflare Dashboard 部署

1. 登录 Cloudflare Dashboard：https://dash.cloudflare.com/
2. 进入 `Workers & Pages` -> `Create application` -> `Create Worker`
3. 创建 Worker 后点击 `Edit code`
4. 将 `wpush.js` 的全部内容复制粘贴到编辑器中
5. 点击右上角 `Deploy`

### 单应用环境变量

在 Worker 详情页进入 `Settings` -> `Variables and Secrets`，添加：

```txt
PRODUCT_NAME=你的产品名称
BARK_KEY=你的 Bark 推送 Key
BARK_ICON=你的应用图标 URL
ENABLE_SANDBOX_NOTIFICATIONS=false
```

可选变量：

```txt
FORWARD_URL=https://example.com/webhook
NOTIFICATION_CONFIG={"REVENUE":{"enabled":true},"REFUND":{"enabled":true},"RISK":{"enabled":true},"STATUS":{"enabled":true}}
BARK_SOUND=calypso
BARK_SOUND_REVENUE=calypso
BARK_SOUND_REFUND=minuet
BARK_SOUND_RISK=chord
BARK_SOUND_STATUS=popcorn
```

单应用版的 App Store Connect 通知 URL：

```txt
https://你的-worker.workers.dev
```

## 方式二：多应用版

适合一个 Worker 同时接多个 App。本仓库的 `wrangler.jsonc` 默认使用这个方式：

```json
"main": "index.js"
```

多应用版的通知 URL 必须带应用名：

```txt
https://你的-worker.workers.dev/iRich
https://你的-worker.workers.dev/iDeepa
```

### 多应用环境变量

最小配置：

```txt
APPS=iRich,iDeepa
BARK_KEY=你的全局 Bark 推送 Key
PRODUCT_NAME_iRich=iRich
PRODUCT_NAME_iDeepa=iDeepa
```

按应用覆盖配置：

```txt
BARK_KEY_iRich=某个 App 单独的 Bark Key
BARK_ICON_iRich=https://example.com/irich.png
FORWARD_URL_iRich=https://example.com/webhook
ENABLE_SANDBOX_iRich=true
NOTIFICATION_CONFIG_iRich={"RISK":{"enabled":false}}
```

全局配置：

```txt
NOTIFICATION_CONFIG={"REVENUE":{"enabled":true},"REFUND":{"enabled":true},"RISK":{"enabled":true},"STATUS":{"enabled":true}}
BARK_SOUND=sherwoodforest
BARK_SOUND_REVENUE=calypso
BARK_SOUND_REFUND=minuet
BARK_SOUND_RISK=chord
BARK_SOUND_STATUS=popcorn
```

配置优先级：

```txt
应用级变量 > 全局变量 > 代码默认值
```

## 通知类型开关

四类通知默认都已启用。如果你想关闭某一类，用 `NOTIFICATION_CONFIG` 覆盖即可。

全部开启：

```txt
NOTIFICATION_CONFIG={"REVENUE":{"enabled":true},"REFUND":{"enabled":true},"RISK":{"enabled":true},"STATUS":{"enabled":true}}
```

只关闭风险预警：

```txt
NOTIFICATION_CONFIG={"RISK":{"enabled":false}}
```

通知类型说明：

| 类别 | 默认 | 说明 |
| --- | --- | --- |
| `REVENUE` | 开启 | 新订阅、续订、重新订阅、优惠购买、退款撤销等 |
| `REFUND` | 开启 | 退款、消耗品退款请求、消耗品信息请求 |
| `RISK` | 开启 | 续订失败、过期、宽限期结束、订阅撤销等 |
| `STATUS` | 开启 | 自动续订开关变化、计划升降级、涨价状态、订阅延期等 |

`NOTIFICATION_CONFIG` 还可以覆盖每类通知的图标、声音、分组：

```txt
NOTIFICATION_CONFIG={"REFUND":{"enabled":true,"sound":"minuet","group":"Refund"},"RISK":{"enabled":true,"sound":"chord","group":"Risk"}}
```

## 配置 App Store Connect

1. 登录 App Store Connect：https://appstoreconnect.apple.com/
2. 进入对应 App 的 `App 信息` -> `App Store 服务器通知`
3. 填写生产服务器 URL 和沙盒服务器 URL
4. 通知版本选择 `Version 2`

单应用版填写 Worker 根路径：

```txt
https://你的-worker.workers.dev
```

多应用版填写带应用名的路径：

```txt
https://你的-worker.workers.dev/iRich
```

## 测试通知

访问你的 Worker URL 会看到内置测试页面：

- 单应用版：`https://你的-worker.workers.dev`
- 多应用版：`https://你的-worker.workers.dev/iRich`

点击 `发送测试通知`，检查 Bark 是否收到推送。

## 查看日志

在 Cloudflare Dashboard 中：

1. 进入你的 Worker
2. 点击 `Logs` -> `Begin log stream`
3. 查看请求、事件类型、忽略原因和推送结果

## 注意事项

- 当前代码会解码 Apple 的 JWS payload，但没有做严格签名验证。
- 如果只是给自己做收入提醒，这通常够用。
- 如果要用通知结果给用户开通权益，建议增加 Apple JWS 签名验证和幂等处理。
- `CONSUMPTION_REQUEST` 当前只会推送提醒，不会自动向 Apple 回填消费信息。

## 致谢

- [Bark](https://github.com/Finb/Bark)
- [Cloudflare Workers](https://workers.cloudflare.com/)
