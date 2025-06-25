// Chrome插件后台脚本

// 点击插件图标时打开独立页面
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html')
    });
});

// 插件安装时的处理
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Excel文件对比工具已安装');
    
    if (details.reason === 'install') {
        // 首次安装
        console.log('首次安装Excel文件对比工具');
    } else if (details.reason === 'update') {
        // 更新
        console.log('Excel文件对比工具已更新到版本:', chrome.runtime.getManifest().version);
    }
});

// 处理来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('收到消息:', request);
    
    switch (request.action) {
        case 'saveData':
            // 保存数据到本地存储
            chrome.storage.local.set(request.data, () => {
                sendResponse({ success: true });
            });
            return true; // 保持消息通道开放
            
        case 'loadData':
            // 从本地存储加载数据
            chrome.storage.local.get(request.keys, (result) => {
                sendResponse({ success: true, data: result });
            });
            return true;
            
        case 'clearData':
            // 清除本地存储数据
            chrome.storage.local.clear(() => {
                sendResponse({ success: true });
            });
            return true;
            
        default:
            sendResponse({ success: false, error: '未知操作' });
    }
});

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log('存储发生变化:', changes, namespace);
});

// 错误处理
chrome.runtime.onSuspend.addListener(() => {
    console.log('Excel文件对比工具后台脚本即将挂起');
});

// 插件启动时的初始化
console.log('Excel文件对比工具后台脚本已启动');