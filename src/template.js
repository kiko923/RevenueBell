/**
 * HTML 页面模板
 */

import { getAppList, getAppsConfig } from '../config.js';
import { maskBarkKey, maskUrl } from './utils.js';

// 测试用的 Mock 数据 (Production 环境, productId: com.appname.xxxx.test)
const MOCK_PAYLOAD = {
  "signedPayload": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJub3RpZmljYXRpb25UeXBlIjoiU1VCU0NSSUJFRCIsInN1YnR5cGUiOiJJTklUSUFMX0JVWSIsIm5vdGlmaWNhdGlvblVVSUQiOiIxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTIiLCJkYXRhIjp7ImVudmlyb25tZW50IjoiUHJvZHVjdGlvbiIsInNpZ25lZFRyYW5zYWN0aW9uSW5mbyI6ImV5SmhiR2NpT2lKRlV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUp3Y205a2RXTjBTV1FpT2lKamIyMHVZWEJ3Ym1GdFpTNTRlSGg0TG5SbGMzUWlMQ0owY21GdWMyRmpkR2x2Ymtsa0lqb2lNakF3TURBd01ERXlNelExTmpjNElpd2liM0pwWjJsdVlXeFVjbUZ1YzJGamRHbHZia2xrSWpvaU1qQXdNREF3TURFeU16UTFOamM0SWl3aWNIVnlZMmhoYzJWRVlYUmxJam94TnpBd01EQXdNREF3TURBd0xDSnZjbWxuYVc1aGJGQjFjbU5vWVhObFJHRjBaU0k2TVRjd01EQXdNREF3TURBd01IMC5mYWtlX3NpZ25hdHVyZV9pbm5lciJ9LCJ2ZXJzaW9uIjoiMi4wIiwic2lnbmVkRGF0ZSI6MTcwMDAwMDAwMDAwMH0.fake_signature_outer"
};

// 共用样式
const COMMON_STYLES = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f5f5f7; color: #1d1d1f; padding: 20px; }
  .card { background: white; padding: 40px; border-radius: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; max-width: 500px; width: 100%; }
  h1 { font-size: 24px; margin-bottom: 10px; }
  p { color: #86868b; margin-bottom: 20px; }
  .status { display: inline-block; background: #e3f5e6; color: #168030; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
  .url-box { background: #f5f5f7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed #d2d2d7; }
  .url-box h3 { font-size: 14px; color: #1d1d1f; margin: 0 0 10px 0; font-weight: 600; }
  .url-box p { font-size: 11px; color: #86868b; margin-bottom: 10px; }
  .url-display { display: flex; flex-direction: row; align-items: center; gap: 10px; }
  .url-input { width: calc(80% - 5px); background: white; border: 1px solid #d2d2d7; border-radius: 6px; padding: 10px 12px; font-size: 12px; color: #1d1d1f; font-family: 'Monaco', 'Menlo', monospace; word-wrap: break-word; overflow-wrap: break-word; line-height: 1.5; }
  .copy-btn { width: 20%; background: #0071e3; color: white; border: none; padding: 10px 8px; font-size: 13px; border-radius: 6px; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
  .copy-btn:hover { background: #0077ed; }
  .copy-btn:active { transform: scale(0.95); }
  .copy-btn.copied { background: #168030; }
  .config-box { background: #f9f9fb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e5e7; }
  .config-box h3 { font-size: 14px; color: #1d1d1f; margin: 0 0 12px 0; font-weight: 600; }
  .config-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e5e7; }
  .config-item:last-child { border-bottom: none; }
  .config-label { font-size: 12px; color: #86868b; font-weight: 500; }
  .config-value { font-size: 12px; color: #1d1d1f; font-family: 'Monaco', 'Menlo', monospace; background: white; padding: 4px 8px; border-radius: 4px; }
  .config-value.enabled { color: #168030; font-weight: 600; }
  .config-value.disabled { color: #d1180b; font-weight: 600; }
  .config-value.warning { color: #d1180b; font-weight: 600; background: #fff3cd; border: 1px solid #ffc107; }
  .config-icon { width: 32px; height: 32px; border-radius: 6px; object-fit: cover; border: 1px solid #e5e5e7; }
  button { background: #0071e3; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 980px; cursor: pointer; transition: all 0.2s; width: 100%; }
  button:hover { background: #0077ed; transform: scale(1.02); }
  button:active { transform: scale(0.98); }
  button:disabled { background: #ccc; cursor: wait; }
  .log { margin-top: 20px; font-size: 12px; color: #666; text-align: left; background: #f5f5f7; padding: 10px; border-radius: 8px; display: none; word-break: break-all; }
  a { color: #0071e3; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .app-list { list-style: none; padding: 0; margin: 0; }
  .app-list li { padding: 12px 15px; border-bottom: 1px solid #e5e5e7; display: flex; justify-content: space-between; align-items: center; }
  .app-list li:last-child { border-bottom: none; }
  .app-list .app-name { font-weight: 600; color: #1d1d1f; }
  .app-list .app-link { font-size: 12px; }
  .back-link { display: inline-block; margin-bottom: 20px; font-size: 14px; }
`;

/**
 * 渲染应用列表页面
 * @param {string} baseUrl - Worker 基础 URL
 * @param {object} env - 环境变量
 * @returns {string} HTML 字符串
 */
export function renderAppListHtml(baseUrl, env) {
  const appList = getAppList(env);
  const appsConfig = getAppsConfig(env);

  let appListHtml = '';
  if (appList.length === 0) {
    appListHtml = '<p style="color: #d1180b;">未配置任何应用，请设置 APPS 环境变量</p>';
  } else {
    appListHtml = '<ul class="app-list">';
    for (const appName of appList) {
      const appConfig = appsConfig[appName];
      const productName = appConfig?.productName || appName;
      appListHtml += `
        <li>
          <span class="app-name">${productName}</span>
          <a class="app-link" href="${baseUrl}/${appName}">查看详情 →</a>
        </li>
      `;
    }
    appListHtml += '</ul>';
  }

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RevenueBell - 应用列表</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="card">
    <div class="status">● 服务运行中 (Active)</div>
    <h1>RevenueBell</h1>
    <p>Apple App Store Server Notifications V2 转发器</p>

    <div class="config-box">
      <h3>📱 已配置的应用 (${appList.length})</h3>
      ${appListHtml}
    </div>

    <div class="url-box">
      <h3>📖 使用说明</h3>
      <p style="text-align: left; line-height: 1.8;">
        1. 设置 <code>APPS</code> 环境变量配置应用<br>
        2. 在 App Store Connect 中配置通知 URL：<br>
        <code>${baseUrl}/应用名称</code>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 渲染单个应用管理页面
 * @param {string} appName - 应用名称
 * @param {string} currentUrl - 当前 URL
 * @param {object} appConfig - 应用配置
 * @param {object} env - 环境变量
 * @returns {string} HTML 字符串
 */
export function renderAppHtml(appName, currentUrl, appConfig, env) {
  const productName = appConfig.productName;
  const barkKey = appConfig.barkKey;
  const barkIcon = appConfig.barkIcon;
  const forwardUrl = appConfig.forwardUrl;
  const enableSandbox = appConfig.enableSandbox;
  const notificationConfig = appConfig.notifications;

  const maskedBarkKey = maskBarkKey(barkKey);
  const maskedForwardUrl = maskUrl(forwardUrl);

  // 获取基础 URL (去掉路径部分)
  const baseUrl = currentUrl.replace(/\/[^/]*$/, '');

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} - RevenueBell</title>
  <style>${COMMON_STYLES}</style>
</head>
<body>
  <div class="card">
    <a class="back-link" href="${baseUrl}/">← 返回应用列表</a>
    <div class="status">● 服务运行中 (Active)</div>
    <h1>${productName}</h1>
    <p>App Store Server Notifications V2 接收端点</p>

    <div class="url-box">
      <h3>📋 配置 URL</h3>
      <p>请将下方 URL 复制到 App Store Connect 的服务器通知配置中</p>
      <div class="url-display">
        <div class="url-input" id="notificationUrl">${currentUrl}</div>
        <button class="copy-btn" onclick="copyUrl()">复制</button>
      </div>
    </div>

    <div class="config-box">
      <h3>⚙️ 当前配置</h3>
      <div class="config-item">
        <span class="config-label">应用标识</span>
        <span class="config-value">${appName}</span>
      </div>
      <div class="config-item">
        <span class="config-label">产品名称</span>
        <span class="config-value">${productName}</span>
      </div>
      <div class="config-item">
        <span class="config-label">Bark Key</span>
        <span class="config-value ${!barkKey ? 'warning' : ''}">${!barkKey ? '⚠️ 未配置' : maskedBarkKey}</span>
      </div>
      <div class="config-item">
        <span class="config-label">默认图标</span>
        ${barkIcon ? `<img src="${barkIcon}" alt="Bark Icon" class="config-icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" /><span class="config-value" style="display:none;">加载失败</span>` : '<span class="config-value">未设置</span>'}
      </div>
      <div class="config-item">
        <span class="config-label">测试环境推送</span>
        <span class="config-value ${enableSandbox ? 'enabled' : 'disabled'}">${enableSandbox ? '已启用' : '已禁用'}</span>
      </div>
      <div class="config-item">
        <span class="config-label">转发 URL</span>
        <span class="config-value">${forwardUrl ? maskedForwardUrl : '未设置'}</span>
      </div>
    </div>

    <div class="config-box">
      <h3>📬 通知类型开关</h3>
      <div class="config-item">
        <span class="config-label">🎉 收入通知</span>
        <span class="config-value ${notificationConfig.REVENUE?.enabled ? 'enabled' : 'disabled'}">${notificationConfig.REVENUE?.enabled ? '已启用' : '已禁用'}</span>
      </div>
      <div class="config-item">
        <span class="config-label">💸 退款通知</span>
        <span class="config-value ${notificationConfig.REFUND?.enabled ? 'enabled' : 'disabled'}">${notificationConfig.REFUND?.enabled ? '已启用' : '已禁用'}</span>
      </div>
      <div class="config-item">
        <span class="config-label">⚠️ 风险预警</span>
        <span class="config-value ${notificationConfig.RISK?.enabled ? 'enabled' : 'disabled'}">${notificationConfig.RISK?.enabled ? '已启用' : '已禁用'}</span>
      </div>
      <div class="config-item">
        <span class="config-label">ℹ️ 状态变更</span>
        <span class="config-value ${notificationConfig.STATUS?.enabled ? 'enabled' : 'disabled'}">${notificationConfig.STATUS?.enabled ? '已启用' : '已禁用'}</span>
      </div>
    </div>

    <button id="testBtn" onclick="sendTest()">发送测试通知</button>
    <div id="logArea" class="log"></div>
  </div>

  <script>
    function copyUrl() {
      const urlText = document.getElementById('notificationUrl').innerText;
      const btn = event.target;

      navigator.clipboard.writeText(urlText).then(() => {
        const originalText = btn.innerText;
        btn.innerText = '已复制 ✓';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动选择并复制');
      });
    }

    async function sendTest() {
      const btn = document.getElementById('testBtn');
      const log = document.getElementById('logArea');

      btn.disabled = true;
      btn.innerText = "发送中...";
      log.style.display = 'none';

      const payload = ${JSON.stringify(MOCK_PAYLOAD)};

      try {
        const response = await fetch("${currentUrl}", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
          btn.innerText = "发送成功 ✅";
          log.innerHTML = "<strong>后端返回:</strong><br/>" + JSON.stringify(result, null, 2);
          log.style.display = 'block';
          setTimeout(() => { btn.disabled = false; btn.innerText = "再次发送测试通知"; }, 3000);
        } else {
          throw new Error(result.message || "Unknown Error");
        }
      } catch (e) {
        btn.innerText = "发送失败 ❌";
        log.innerHTML = "<strong>错误:</strong> " + e.message;
        log.style.display = 'block';
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>
  `;
}
