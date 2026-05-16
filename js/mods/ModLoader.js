/*:
 * @target MZ
 * @plugindesc 游戏内模组管理器（DOM化UI & 现代交互 & 拖放添加Mod & 滑动条/长文本/数据库引用）
 * @author joker创意 / GLM核心代码
 * @version V3.13.0
 *
 * @param Mod Button X
 * @type number
 * @default 20
 * @desc 模组管理按钮距离屏幕左侧的 X 坐标
 *
 * @param Mod Button Y
 * @type number
 * @default 20
 * @desc 模组管理按钮距离屏幕顶部的 Y 坐标
 *
 * @help
 * 【功能及使用方式】
 * 1. 管理游戏内 Mod 的开启与关闭，采用现代 DOM 化 UI 界面。
 * 2. 支持带有 @default 的参数修改（数值、开关、文本、单选下拉、颜色、长文本、数据库引用）。
 * 3. 严苛规则：若 Mod 存在任何未设置 @default 的参数，则该 Mod 所有参数禁止修改！(兼容适配偷懒倒逼：mod作者规范写参数，提升整体Mod质量)
 * 4. 在Mod管理器中点击带有[⚙]标志的Mod名称旁的齿轮图标可唤起参数编辑面板。修改参数后，需保存后实装修改。
 * 5. 布尔开关参数与RMMZ官方对齐，存储为 "true"/"false"。
 * 6. 支持恢复该插件所有参数为默认值(不保存)。
 * 7. 支持 @type color 标签：@color[#ff0000]红色文字@/color、@color[24]RMMZ色号@/color、@color[red]CSS颜色@/color
 * 8. F5刷新游戏后，游戏才能读取新的mod开关状态及参数值。
 * 9. 支持导入Mod、删除Mod、排序Mod
 * 10.支持检测游戏plugins更新，一键恢复Mod配置
 * 11.支持一键全关Mod
 * 12.标签读取支持：@version @base @orderAfter @orderBefore @author @help
 * 
 * 【前置必要操作 - 两种模式】
 * 
 * 【模式1：注入模式 】
 * 玩家需对游戏的index.html注入代码。modloader.js文件直接放入 /js/mods 目录即可。
 * 
 * index.html注入结构参考：
 *     <body style="background-color: black">
 *     <script type="text/javascript" src="js/libs/pixi.js"></script>
 *     <!-- 只要注入下面这一行，把控制权完全交给插件内部 -->
 *     <script type="text/javascript" src="js/mods/ModLoader.js"></script>
 *     <script type="text/javascript" src="js/main.js"></script>
 *     </body>
 * 
 * 【模式2：插件模式 】
 * 游戏作者可以直接通过 RMMZ 官方插件管理器启用 ModLoader，不需要修改 index.html！
 * - 在插件管理器中将 ModLoader.js 添加到列表中
 * - 修改 Mod 开关或排序后，需要 F5 刷新才能生效！
 * 
 * 【铁律合规性自检】
 * [✓] 本补丁已通过铁律合规检查：无顶层 $dataXxx 依赖 / 所有 Alias 均已做前置存在性检查 / 所有使用的参数均已配置 @default。
 *
 * 【使用Mod守则】
 * 1.使用Mod时出现bug，必先检查是否按Mod说明使用，不按说明使用Mod作者将不予理睬。
 * 2.按Mod说明使用的，关闭相关Mod（不知道哪些相关就全关了）并F5刷新。
 * 3.发现依然能复现bug的群里@游戏作者，发现bug消失了说明是Mod原因不要骚扰游戏作者。
 * 4.确认是Mod的bug可以@Mod作者，提供详细测试过程的描述和截图，Mod作者将尽力而为。
 * 5.若Mod作者已脱坑，Mod因版本更新失效了，你可以试着自己找Ai修复并发布到群里。
 * 6.至少看一遍整合包中的使用说明，"常见问题排查"区域的问题，Mod作者将不予理睬。
 * 7.使用本Mod即视为同意上述内容。
 * 
 * 【开源协议】
 * ============================================================================
 * MIT License (MIT 许可证)
 * ============================================================================
 * 版权所有 (c) 2026 joker
 *
 * 特此免费授予任何获得本软件及相关文档文件（下称"软件"）副本的人
 * 不受限制地处置本软件的权利，包括但不限于使用、复制、修改、合并、
 * 出版、分发、再许可及/或销售本软件副本的权利，并允许被提供本软件
 * 的人士如此行事，但须符合以下条件：
 *
 * 上述版权声明和本许可声明应包含在本软件的所有副本或实质部分中。
 *
 * 本软件按"原样"提供，不作任何明示或暗示的保证，包括但不限于对
 * 适销性、特定用途的适用性及不侵权的保证。在任何情况下，作者或版
 * 权持有人均不对因本软件或本软件中的使用或其他交易而产生或与之相
 * 关的任何索赔、损害或其他责任负责，无论是合同、侵权还是其他行为。
 *
 * ====================== 英文原版======================
 *
 * Copyright (c) 2026 joker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ============================================================================
 * 
 * 【更新日志】请查看 docs/modloader_CHANGELOG.md 文件
 * 修复了游戏游戏无法使用滚轮操作ui的问题，加上了作者和版本号
 */

(() => {
    'use strict';

    // ================================================================
    // 1. 基础配置与日志系统
    // ================================================================
    const ModName = "ModLoader";
    const VERSION = "V3.13.0";
    const DEBUG_LEVEL = 0;

    const log = (level, ...args) => {
        if (DEBUG_LEVEL < level) return;
        const prefix = `[${ModName} v${VERSION}]`;
        if (level === 1) console.error(prefix, '[ERROR]', ...args);
        else if (level === 2) console.warn(prefix, '[WARN]', ...args);
        else if (level === 3) console.log(prefix, '[INFO]', ...args);
    };

    // ================================================================
    // 2. 插件参数读取
    // ================================================================
    let BUTTON_X = 20;
    let BUTTON_Y = 20;

    void (function readPluginParams() {
        try {
            if (typeof $plugins !== 'undefined' && Array.isArray($plugins)) {
                for (const p of $plugins) {
                    if (p.name && p.name.includes('ModLoader') && p.parameters) {
                        const bx = p.parameters['Mod Button X'];
                        const by = p.parameters['Mod Button Y'];
                        if (bx !== undefined) BUTTON_X = Number(bx) || 20;
                        if (by !== undefined) BUTTON_Y = Number(by) || 20;
                        log(3, "插件参数读取完成", { BUTTON_X, BUTTON_Y });
                        break;
                    }
                }
            }
        } catch (e) {
            log(1, "读取插件参数异常", e);
        }
    })();

    // ================================================================
    // 3. Node.js 模块与路径
    // ================================================================
    const fs = require('fs');
    const pathMod = require('path');
    const MODS_DIR = pathMod.join(process.cwd(), 'js', 'mods');
    const CONFIG_PATH = pathMod.join(MODS_DIR, 'mod_config.json');
    const PLUGINS_PATH = pathMod.join(process.cwd(), 'js', 'plugins.js');
    const MOD_SECRET_FLAG = "__isMod";

    // ================================================================
    // 4. 配置与文件操作（纯逻辑，无UI依赖）
    // ================================================================
    function ensureDir(dir) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    function loadConfig() {
        if (!fs.existsSync(CONFIG_PATH)) return {};
        try {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        } catch (e) {
            log(1, "加载配置失败", e);
            return {};
        }
    }

    /**
     * 检查 plugins.js 是否被重置（所有 Mod 标记都丢失了）
     */
    function checkPluginsReset() {
        try {
            const content = fs.readFileSync(PLUGINS_PATH, 'utf-8');
            const lines = content.split('\n');
            let hasModMarkers = false;
            let hasConfigEnabledMods = false;

            // 检查 plugins.js 中是否还有 Mod 标记
            for (const line of lines) {
                const objMatch = line.match(/^\s*(\{.*\})\s*,?\s*$/);
                if (objMatch) {
                    try {
                        let obj = JSON.parse(objMatch[1]);
                        if (obj.hasOwnProperty(MOD_SECRET_FLAG)) {
                            hasModMarkers = true;
                            break;
                        }
                    } catch (jsonErr) { /* 忽略 */ }
                }
            }

            // 检查配置文件中是否有启用的 Mod
            const config = loadConfig();
            Object.keys(config).forEach(key => {
                let status = false;
                if (typeof config[key] === 'boolean') {
                    status = config[key];
                } else if (config[key] && typeof config[key] === 'object') {
                    status = config[key].status;
                }
                if (status) {
                    hasConfigEnabledMods = true;
                }
            });

            // 如果配置中有启用的 Mod 但 plugins.js 中没有标记，说明被重置了
            return hasConfigEnabledMods && !hasModMarkers;
        } catch (e) {
            log(1, "检查 plugins 重置失败", e);
            return false;
        }
    }

    // ================================================================
    // 拖放添加 Mod 功能
    // ================================================================

    /**
     * 递归复制文件夹
     */
    function copyDirRecursive(src, dest) {
        ensureDir(dest);
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = pathMod.join(src, entry.name);
            const destPath = pathMod.join(dest, entry.name);
            if (entry.isDirectory()) {
                copyDirRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    /**
     * 收集拖放内容中的所有文件（递归文件夹）
     */
    function collectFiles(items, eDataTransferFiles) {
        log(3, "=== collectFiles 开始 ===");
        log(3, "传入的 items 数量:", items ? items.length : 'undefined');
        log(3, "传入的 eDataTransferFiles:", eDataTransferFiles ? eDataTransferFiles.length : 'undefined');
        
        const files = [];
        
        // 优先尝试 items
        if (items && items.length > 0) {
            log(3, "使用 items 方式收集...");
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                log(3, `  Item[${i}]: kind=${item.kind}, type=${item.type}`);
                
                // 尝试获取 entry（NW.js 可能用 getAsEntry 也可能是 webkitGetAsEntry
                let entry;
                if (item.getAsEntry) entry = item.getAsEntry();
                else if (item.webkitGetAsEntry) entry = item.webkitGetAsEntry();
                
                log(3, `    entry: ${entry ? '存在' : '不存在'}`);
                if (entry) {
                    log(3, `    entry.isDirectory: ${entry.isDirectory}, entry.name: ${entry.name}`);
                }
                
                // 多种方式判断是否是目录
                let isDirectory = false;
                let directoryName = null;
                
                if (entry && entry.isDirectory) {
                    isDirectory = true;
                    directoryName = entry.name;
                } else if (item.kind === 'directory') {
                    isDirectory = true;
                    directoryName = item.name;
                }
                
                if (isDirectory) {
                    log(3, `    📂 检测到是目录！名称: ${directoryName}`);
                    
                    // 检查是否是 mods 文件夹（不区分大小写）
                    if (directoryName && directoryName.toLowerCase() === 'mods') {
                        log(3, "    ✅ 是 mods 文件夹！加入列表！");
                        files.push({
                            type: 'mods-folder',
                            name: directoryName,
                            entry: entry || item
                        });
                    } else {
                        log(3, `    ❌ 不是 mods 文件夹，跳过...`);
                    }
                } else if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file) {
                        log(3, `    📄 检测到是文件: ${file.name}`);
                        files.push({
                            type: 'file',
                            file: file,
                            name: file.name
                        });
                    }
                }
            }
        }
        
        // 如果 items 没收集到，尝试 files（NW.js 常见情况）
        if (files.length === 0 && eDataTransferFiles && eDataTransferFiles.length > 0) {
            log(3, "items 没收集到，尝试使用 dataTransfer.files 方式...");
            
            // 检查是否是从 mods 文件夹拖来的（通过完整路径识别）
            let allFromModsFolder = true;
            for (let i = 0; i < eDataTransferFiles.length; i++) {
                const file = eDataTransferFiles[i];
                if (file.path) {
                    log(3, `  File[${i}]: name=${file.name}, path=${file.path}`);
                    if (!file.path.includes(pathMod.sep + 'mods' + pathMod.sep)) {
                        allFromModsFolder = false;
                    }
                } else {
                    allFromModsFolder = false;
                }
            }
            
            if (eDataTransferFiles.length > 0 && allFromModsFolder) {
                log(3, "✅ 通过路径识别：这些文件都在 mods 文件夹里！");
                // 直接标记为 mods 文件夹拖放
                files.push({
                    type: 'mods-folder',
                    name: 'mods',
                    files: Array.from(eDataTransferFiles) // 直接保存所有文件
                });
            } else {
                // 正常处理单个文件
                for (let i = 0; i < eDataTransferFiles.length; i++) {
                    const file = eDataTransferFiles[i];
                    log(3, `  File[${i}]: name=${file.name}`);
                    if (file.name.endsWith('.js')) {
                        files.push({
                            type: 'file',
                            file: file,
                            name: file.name
                        });
                        log(3, "    是 .js 文件！加入列表。");
                    }
                }
            }
        }
        
        log(3, "collectFiles 完成，共收集:", files.length, "个文件/文件夹");
        return files;
    }

    /**
     * 处理拖放事件
     */
    function handleDropEvent(e) {
        log(3, "=== handleDropEvent 开始 ===");
        
        e.preventDefault();
        e.stopPropagation();

        log(3, "检查 dataTransfer...");
        log(3, "dataTransfer.files:", e.dataTransfer.files);
        log(3, "dataTransfer.items:", e.dataTransfer.items);

        const items = e.dataTransfer.items;
        if (!items) {
            log(1, "items 不存在！使用 dataTransfer 只有 files，没有 items！");
            showConfirmDialog(
                "提示",
                "您的浏览器不支持拖放文件夹，请使用单个 .js 文件拖放。",
                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
            );
            return;
        }

        log(3, "开始 collectFiles...");
        const collectedFiles = collectFiles(Array.from(items), e.dataTransfer.files);
        log(3, "collectFiles 返回结果:", collectedFiles);

        if (collectedFiles.length === 0) {
            log(2, "没有有效的文件/文件夹！");
            showConfirmDialog(
                "提示",
                "请拖放单个 .js 文件或整个 mods 文件夹！",
                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
            );
            return;
        }

        // 检查是否有 mods 文件夹
        log(3, "检查是否有 mods 文件夹...");
        const modsFolder = collectedFiles.find(f => f.type === 'mods-folder');
        if (modsFolder) {
            log(3, "发现 mods 文件夹，调用 handleModsFolderDrop");
            // 如果 entry 方式识别到的，但没有 files 属性，就强制用 dataTransfer.files
            if (!modsFolder.files && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                log(3, "entry 方式识别到，但没有 files 属性，改用 dataTransfer.files...");
                modsFolder.files = Array.from(e.dataTransfer.files);
            }
            handleModsFolderDrop(modsFolder);
            return;
        }

        // 检查是否有单个 .js 文件
        log(3, "检查是否有单个 .js 文件...");
        const jsFiles = collectedFiles.filter(f => f.type === 'file' && f.name.endsWith('.js'));
        log(3, "找到的 .js 文件数:", jsFiles.length);
        jsFiles.forEach((f, i) => log(3, `  [${i}] ${f.name}`));
        if (jsFiles.length > 0) {
            log(3, "调用 handleJsFilesDrop");
            handleJsFilesDrop(jsFiles);
            return;
        }

        if (jsFiles.length === 0) {
            showConfirmDialog(
                "提示",
                "请拖放单个 .js 文件或整个 mods 文件夹！",
                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
            );
        }
    }

    /**
     * 递归复制文件夹
     */
    function copyFolderRecursive(srcDir, destDir) {
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        const entries = fs.readdirSync(srcDir, { withFileTypes: true });
        let copiedCount = 0;
        
        for (const entry of entries) {
            const srcPath = pathMod.join(srcDir, entry.name);
            const destPath = pathMod.join(destDir, entry.name);
            
            if (entry.isDirectory()) {
                copiedCount += copyFolderRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
                log(3, "复制文件:", destPath);
                copiedCount++;
            }
        }
        
        return copiedCount;
    }

    /**
     * 处理 mods 文件夹拖放
     */
    function handleModsFolderDrop(folder) {
        log(3, "=== handleModsFolderDrop 开始 ===");
        log(3, "folder 对象属性:", Object.keys(folder));
        
        // 先找到源mods目录
        let srcModsDir = null;
        if (folder.files && folder.files.length > 0) {
            for (const file of folder.files) {
                if (file.path) {
                    log(3, "检查文件路径:", file.path);
                    const sep = pathMod.sep;
                    const pathLower = file.path.toLowerCase();
                    
                    let idx = pathLower.lastIndexOf(sep + 'mods' + sep);
                    if (idx !== -1) {
                        srcModsDir = file.path.substring(0, idx + 5 + 1);
                        log(3, "找到源mods目录:", srcModsDir);
                        break;
                    }
                    
                    if (pathLower.endsWith(sep + 'mods')) {
                        srcModsDir = file.path;
                        log(3, "找到源mods目录:", srcModsDir);
                        break;
                    }
                    
                    let parentDir = pathMod.dirname(file.path);
                    for (let i = 0; i < 5; i++) {
                        if (pathMod.basename(parentDir).toLowerCase() === 'mods') {
                            srcModsDir = parentDir;
                            log(3, "找到源mods目录:", srcModsDir);
                            break;
                        }
                        const nextParent = pathMod.dirname(parentDir);
                        if (nextParent === parentDir) break;
                        parentDir = nextParent;
                    }
                    if (srcModsDir) break;
                }
            }
        }
        
        if (!srcModsDir || !fs.existsSync(srcModsDir)) {
            showConfirmDialog(
                "提示",
                "请使用单个 .js 文件拖放，或确保拖放的是完整的 mods 文件夹！",
                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
            );
            return;
        }
        
        // 分析源目录里的js文件
        const newFiles = [];
        const updateFiles = [];
        try {
            const entries = fs.readdirSync(srcModsDir);
            for (const entry of entries) {
                if (entry.toLowerCase().endsWith('.js')) {
                    const destPath = pathMod.join(MODS_DIR, entry);
                    if (fs.existsSync(destPath)) {
                        updateFiles.push(entry);
                    } else {
                        newFiles.push(entry);
                    }
                }
            }
        } catch (e) {
            log(1, "分析mods文件夹失败", e);
        }
        
        // 构建清单
        let listText = '';
        if (newFiles.length > 0) {
            listText += `✨ 新增mod（${newFiles.length}个）:\n`;
            listText += newFiles.map(f => '  - ' + f).join('\n');
            listText += '\n\n';
        }
        if (updateFiles.length > 0) {
            listText += `🔄 更新mod（${updateFiles.length}个）:\n`;
            listText += updateFiles.map(f => '  - ' + f).join('\n');
            listText += '\n\n';
        }
        if (newFiles.length === 0 && updateFiles.length === 0) {
            listText += '未检测到js文件变化';
        }
        listText += '\n⚠️ 会覆盖整个mods文件夹的所有内容（包括非js文件）';
        
        const hasUpdates = updateFiles.length > 0;
        
        showConfirmDialog(
            "导入清单",
            listText,
            [
                { text: "取消", class: "ml-btn-secondary", action: hideConfirmDialog },
                {
                    text: hasUpdates ? "导入并覆盖" : "导入",
                    class: "ml-btn-primary",
                    action: async () => {
                        hideConfirmDialog();
                        try {
                            log(3, "开始复制文件夹:", srcModsDir, "->", MODS_DIR);
                            const count = copyFolderRecursive(srcModsDir, MODS_DIR);
                            log(3, `✅ 成功复制 ${count} 个文件/文件夹！`);
                            
                            // 刷新并排序新mod
                            _modData = scanMods();
                            const config = loadConfig();
                            let currentMaxOrder = 0;
                            
                            for (const modId in config) {
                                if (config[modId] && typeof config[modId] === 'object' && config[modId].order !== undefined) {
                                    if (config[modId].order > currentMaxOrder) {
                                        currentMaxOrder = config[modId].order;
                                    }
                                }
                            }
                            
                            for (const mod of _modData) {
                                const modId = mod.id;
                                if (!config[modId] || typeof config[modId] === 'boolean') {
                                    currentMaxOrder++;
                                    if (typeof config[modId] === 'boolean') {
                                        config[modId] = { status: config[modId], order: currentMaxOrder, params: {} };
                                    } else {
                                        config[modId] = { status: false, order: currentMaxOrder, params: {} };
                                    }
                                }
                            }
                            
                            saveConfig(config);
                            _modData = scanMods();
                            renderModList();
                            updateCounts();
                            
                            showConfirmDialog(
                                "成功",
                                `已成功复制 ${count} 个项目到 mods 目录！`,
                                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
                            );
                        } catch (e) {
                            log(1, "处理 mods 文件夹失败", e);
                            showConfirmDialog(
                                "错误",
                                "处理 mods 文件夹失败，请检查控制台日志！",
                                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
                            );
                        }
                    }
                }
            ]
        );
    }

    /**
     * 处理单个 .js 文件拖放
     */
    function handleJsFilesDrop(files) {
        log(3, "=== handleJsFilesDrop 开始 ===");
        log(3, "总文件数:", files.length);

        // 第一步：分析所有文件
        const jsFiles = [];
        const nonJsFiles = [];
        const newFiles = [];
        const updateFiles = [];

        for (const fileItem of files) {
            const file = fileItem.file;
            if (file.name.toLowerCase().endsWith('.js')) {
                jsFiles.push(file);
                const destPath = pathMod.join(MODS_DIR, file.name);
                if (fs.existsSync(destPath)) {
                    updateFiles.push(file);
                } else {
                    newFiles.push(file);
                }
            } else {
                nonJsFiles.push(file.name);
            }
        }

        log(3, "分析结果: js文件=", jsFiles.length, "非js文件=", nonJsFiles.length);
        log(3, "新增文件:", newFiles.map(f => f.name));
        log(3, "更新文件:", updateFiles.map(f => f.name));

        // 构建清单文本
        let listText = '';
        if (nonJsFiles.length > 0) {
            listText += `❌ 已排除非js文件：${nonJsFiles.join('、')}\n\n`;
        }
        if (newFiles.length > 0) {
            listText += `✨ 新增mod：\n${newFiles.map(f => '  - ' + f.name).join('\n')}\n`;
        }
        if (updateFiles.length > 0) {
            listText += `🔄 更新mod：\n${updateFiles.map(f => '  - ' + f.name).join('\n')}\n`;
        }

        // 确定按钮逻辑
        const hasUpdates = updateFiles.length > 0;
        const hasJsFiles = jsFiles.length > 0;
        const onlyNonJs = !hasJsFiles && nonJsFiles.length > 0;

        if (onlyNonJs) {
            // 只有非js文件：只有取消按钮
            showConfirmDialog(
                "导入清单",
                listText || "没有有效的js文件！",
                [
                    { text: "取消", class: "ml-btn-primary", action: hideConfirmDialog }
                ]
            );
            return;
        }

        if (!hasJsFiles) {
            // 没有任何文件
            showConfirmDialog(
                "提示",
                "没有选择任何文件！",
                [
                    { text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }
                ]
            );
            return;
        }

        // 构建按钮
        const buttons = [];
        buttons.push({
            text: "取消",
            class: "ml-btn-secondary",
            action: hideConfirmDialog
        });
        buttons.push({
            text: hasUpdates ? "导入并覆盖" : "导入",
            class: "ml-btn-primary",
            action: async () => {
                hideConfirmDialog();
                await importFiles(jsFiles);
            }
        });

        showConfirmDialog(
            "导入清单",
            listText,
            buttons
        );
    }

    async function importFiles(files) {
        log(3, "=== importFiles ===");
        let successCount = 0;

        for (const file of files) {
            const destPath = pathMod.join(MODS_DIR, file.name);
            try {
                await copyFileFromDataTransfer(file, destPath);
                successCount++;
                log(3, "成功导入:", file.name);
            } catch (err) {
                log(1, "导入失败:", file.name, err);
            }
        }

        // 刷新mod数据
        _modData = scanMods();
        
        // 将新mod排到最后并保存
        const config = loadConfig();
        let currentMaxOrder = 0;
        
        // 先找出已存在mod的最大order
        for (const modId in config) {
            if (config[modId] && typeof config[modId] === 'object' && config[modId].order !== undefined) {
                if (config[modId].order > currentMaxOrder) {
                    currentMaxOrder = config[modId].order;
                }
            }
        }
        
        // 给新mod分配order
        for (const mod of _modData) {
            const modId = mod.id;
            if (!config[modId] || typeof config[modId] === 'boolean') {
                // 新mod，排在最后
                currentMaxOrder++;
                if (typeof config[modId] === 'boolean') {
                    config[modId] = { status: config[modId], order: currentMaxOrder, params: {} };
                } else {
                    config[modId] = { status: false, order: currentMaxOrder, params: {} };
                }
            }
        }
        
        saveConfig(config);
        
        // 重新扫描并渲染
        _modData = scanMods();
        renderModList();
        updateCounts();

        // 显示成功提示
        showConfirmDialog(
            "安装成功",
            `成功导入 ${successCount} 个mod！`,
            [
                { text: "确定", class: "ml-btn-primary", action: () => { hideConfirmDialog(); hideInstallOverlay(); } }
            ]
        );
    }

    /**
     * 从 DataTransfer 复制文件
     */
    function copyFileFromDataTransfer(file, destPath) {
        log(3, "=== copyFileFromDataTransfer 开始 ===");
        log(3, "源文件名:", file.name);
        log(3, "目标路径:", destPath);
        
        return new Promise((resolve, reject) => {
            log(3, "创建 FileReader...");
            const reader = new FileReader();
            
            reader.onload = (e) => {
                log(3, "FileReader onload 触发");
                try {
                    log(3, "转换为 Buffer...");
                    const buffer = Buffer.from(e.target.result);
                    log(3, "Buffer 大小:", buffer.length, "字节");
                    
                    log(3, "写入文件到:", destPath);
                    fs.writeFileSync(destPath, buffer);
                    log(3, "✅ 成功写入！");
                    
                    log(3, "验证文件是否存在:", fs.existsSync(destPath));
                    if (fs.existsSync(destPath)) {
                        const stats = fs.statSync(destPath);
                        log(3, "文件大小:", stats.size, "字节");
                    }
                    
                    resolve();
                } catch (err) {
                    log(1, "❌ 复制文件失败:", file.name, err);
                    reject(err);
                }
            };
            
            reader.onerror = () => {
                log(1, "❌ FileReader 出错:", reader.error);
                reject(reader.error);
            };
            
            log(3, "开始 readAsArrayBuffer...");
            reader.readAsArrayBuffer(file);
        });
    }

    function saveConfig(config) {
        ensureDir(MODS_DIR);
        try {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
            log(3, "配置已保存", CONFIG_PATH);
        } catch (e) {
            log(1, "保存配置失败", e);
        }
    }

    function standardizeDefault(val, type) {
        if (type === 'boolean') {
            const lowerVal = String(val).toLowerCase();
            if (lowerVal === 'true' || lowerVal === '1' || lowerVal === 'on') return 'true';
            return 'false';
        }
        return val;
    }

    /**
     * 递归生成 struct/table 的默认值
     * 根据 Schema 模板中子参数的 default 递归拼装成嵌套 JSON 对象
     * @param {Array} schemaFields - Schema 模板的子参数数组
     * @returns {object} - 拼装好的默认值对象
     */
    function generateDefaultFromSchema(schemaFields) {
        const obj = {};
        for (const field of schemaFields) {
            if (field.type === 'struct' && field.schema) {
                // 递归生成嵌套 struct 的默认值
                const subSchema = _schemaDictionary[field.schema];
                if (subSchema) {
                    obj[field.name] = JSON.stringify(generateDefaultFromSchema(subSchema));
                } else {
                    obj[field.name] = '{}';
                }
            } else if (field.type === 'table' && field.schema) {
                // table 默认为空数组
                obj[field.name] = '[]';
            } else if (field.default !== undefined) {
                obj[field.name] = field.default;
            } else {
                // 无默认值时按类型推断
                if (field.type === 'number') obj[field.name] = '0';
                else if (field.type === 'boolean') obj[field.name] = 'false';
                else if (field.type === 'color') obj[field.name] = '#ffffff';
                else obj[field.name] = '';
            }
        }
        return obj;
    }

    /**
     * 解析 @define-schema 块，将模板存入全局 _schemaDictionary
     * 格式: @define-schema 模板名 \n JSON字符串
     * @param {string} metaContent - 清洗后的元数据内容
     */
    function parseSchemaDefinitions(metaContent) {
        // 匹配 @define-schema 模板名，下一行为 JSON 定义
        const schemaRegex = /@define-schema\s+(\w+)\s*\n\s*(.+)/g;
        let match;
        while ((match = schemaRegex.exec(metaContent)) !== null) {
            const schemaName = match[1];
            const jsonStr = match[2].trim();
            try {
                const schemaObj = JSON.parse(jsonStr);
                if (Array.isArray(schemaObj)) {
                    // 数组格式：每个元素是 { name, type, ... }
                    _schemaDictionary[schemaName] = schemaObj.map(item => ({
                        name: item.name || item.param || '',
                        type: (item.type || 'string').toLowerCase(),
                        text: item.text || item.name || item.param || '',
                        desc: item.desc || '',
                        default: item.default !== undefined ? String(item.default) : undefined,
                        min: item.min !== undefined ? Number(item.min) : undefined,
                        max: item.max !== undefined ? Number(item.max) : undefined,
                        step: item.step !== undefined ? Number(item.step) : undefined,
                        options: item.options || [],
                        schema: item.schema || undefined
                    }));
                    log(3, `[Schema字典] 注册模板: ${schemaName}, 字段数: ${_schemaDictionary[schemaName].length}`);
                } else {
                    log(2, `[Schema字典] 模板 ${schemaName} 的 JSON 不是数组格式，已跳过`);
                }
            } catch (e) {
                log(1, `[Schema字典] 解析模板 ${schemaName} 失败:`, jsonStr, e);
            }
        }
    }

    function parseModInfo(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const metaBlockMatch = content.match(/\/\*:[\s\S]*?\*\//);
            if (!metaBlockMatch) return { author: "未知作者", help: "", params: [], version: undefined, base: undefined, orderAfter: undefined, orderBefore: undefined };
            let metaContent = metaBlockMatch[0];

            const lines = metaContent.split(/\r?\n/);
            let cleanedLines = [];
            for (let line of lines) {
                line = line.trim();
                if (line.startsWith('/*:')) {
                    cleanedLines.push('/*:');
                } else if (line === '*/') {
                    cleanedLines.push('*/');
                } else if (line.startsWith('*')) {
                    cleanedLines.push(line.substring(1).replace(/^\s*/, ''));
                } else {
                    cleanedLines.push(line);
                }
            }
            metaContent = cleanedLines.join('\n');

            // ---- 阶段2新增：先扫描 @define-schema 定义，存入全局字典 ----
            parseSchemaDefinitions(metaContent);
            // ---- 阶段2新增结束 ----

            const helpBlockMatch = metaContent.match(/@help\s*\n([\s\S]*?)(?=\n@|\n\*\/|$)/);
            const helpContent = helpBlockMatch ? helpBlockMatch[1].trim() : "";
            const helpBlock = helpBlockMatch ? helpBlockMatch[0] : "";

            const contentWithoutHelp = metaContent.replace(helpBlock, '');

            const authorMatch = contentWithoutHelp.match(/@author\s+(.+?)$/m);
            const versionMatch = contentWithoutHelp.match(/@version\s+(.+?)$/m);
            const baseMatch = contentWithoutHelp.match(/@base\s+(.+?)$/m);
            const orderAfterMatch = contentWithoutHelp.match(/@orderAfter\s+(.+?)$/m);
            const orderBeforeMatch = contentWithoutHelp.match(/@orderBefore\s+(.+?)$/m);

            const paramBlocks = [];
            let currentParam = null;

            const contentLines = contentWithoutHelp.split('\n');
            for (const line of contentLines) {
                if (line === '/*:' || line === '*/') continue;
                
                // 跳过 @define-schema 行（已在 parseSchemaDefinitions 中处理）
                if (/^@define-schema\s/.test(line)) continue;

                const paramMatch = line.match(/@param\s+(.+)$/);
                if (paramMatch) {
                    if (currentParam) paramBlocks.push(currentParam);
                    let rawName = paramMatch[1].trim();
                    rawName = rawName.replace(/\{.*?\}\s*/, '');
                    const dashIndex = rawName.indexOf(' - ');
                    if (dashIndex > 0) rawName = rawName.substring(0, dashIndex).trim();
                    // 阶段2新增：text 字段默认等于 name（后续 @text 可覆盖）
                    currentParam = { name: rawName, type: "string", text: rawName, desc: "", default: undefined, min: undefined, max: undefined, step: undefined, options: [], schema: undefined };
                    continue;
                }
                if (currentParam) {
                    const typeMatch = line.match(/@type\s+(.+)$/);
                    const descMatch = line.match(/@desc\s+(.+)$/);
                    const defaultMatch = line.match(/@default\s+(.+)$/);
                    const minMatch = line.match(/@min\s+(.+)$/);
                    const maxMatch = line.match(/@max\s+(.+)$/);
                    const stepMatch = line.match(/@step\s+(.+)$/);
                    const optionMatch = line.match(/@option\s+(.+)$/);
                    // ---- 阶段2新增：@text 标签解析 ----
                    const textMatch = line.match(/@text\s+(.+)$/);
                    // ---- 阶段2新增：@schema 标签解析 ----
                    const schemaMatch = line.match(/@schema\s+(.+)$/);

                    if (typeMatch) currentParam.type = typeMatch[1].trim().toLowerCase();
                    else if (textMatch) currentParam.text = textMatch[1].trim();
                    else if (schemaMatch) currentParam.schema = schemaMatch[1].trim();
                    else if (descMatch) currentParam.desc = descMatch[1].trim();
                    else if (defaultMatch) currentParam.default = standardizeDefault(defaultMatch[1].trim(), currentParam.type);
                    else if (minMatch && currentParam.type === 'number') currentParam.min = Number(minMatch[1].trim());
                    else if (maxMatch && currentParam.type === 'number') currentParam.max = Number(maxMatch[1].trim());
                    else if (stepMatch && currentParam.type === 'number') currentParam.step = Number(stepMatch[1].trim());
                    else if (optionMatch && currentParam.type === 'select') currentParam.options.push(optionMatch[1].trim());
                }
            }
            if (currentParam) paramBlocks.push(currentParam);

            // ---- 阶段2新增：为 struct/table 类型解析 schema 子参数并自动生成默认值 ----
            for (let p of paramBlocks) {
                if ((p.type === 'struct' || p.type === 'table') && p.schema) {
                    const schemaFields = _schemaDictionary[p.schema];
                    if (schemaFields) {
                        // 将 schema 子参数列表挂载到参数上，供渲染器使用
                        p.schemaFields = schemaFields;
                        log(3, `[Schema] 参数 "${p.name}" 引用模板 "${p.schema}", 子字段数: ${schemaFields.length}`);
                    } else {
                        log(2, `[Schema] 参数 "${p.name}" 引用的模板 "${p.schema}" 不存在！`);
                        p.schemaFields = [];
                    }
                    // 自动生成默认值：若缺少 @default，则递归拼装
                    if (p.default === undefined) {
                        if (p.type === 'struct') {
                            const defaultObj = generateDefaultFromSchema(p.schemaFields);
                            p.default = JSON.stringify(defaultObj);
                        } else {
                            // table 默认为空数组的双重转义
                            p.default = '[]';
                        }
                        log(3, `[Schema] 参数 "${p.name}" 自动生成默认值: ${p.default}`);
                    }
                }
            }
            // ---- 阶段2新增结束 ----

            let isStrictLocked = false;
            for (let p of paramBlocks) {
                if (p.default === undefined) {
                    log(2, `参数严苛校验失败：Mod [${pathMod.basename(filePath)}] 的参数 [${p.name}] 缺少 @default，该Mod参数编辑功能已被锁定。`);
                    isStrictLocked = true;
                    break;
                }
            }

            return {
                author: authorMatch ? authorMatch[1].trim() : "未知作者",
                help: helpContent || "无帮助信息",
                version: versionMatch ? versionMatch[1].trim() : undefined,
                base: baseMatch ? baseMatch[1].trim() : undefined,
                orderAfter: orderAfterMatch ? orderAfterMatch[1].trim() : undefined,
                orderBefore: orderBeforeMatch ? orderBeforeMatch[1].trim() : undefined,
                params: isStrictLocked ? [] : paramBlocks
            };
        } catch (e) {
            log(1, "解析Mod信息异常", e);
            return { author: "解析失败", help: "", params: [], version: undefined, base: undefined, orderAfter: undefined, orderBefore: undefined };
        }
    }

    function scanMods() {
        ensureDir(MODS_DIR);
        // 阶段2新增：每次扫描前重置 Schema 字典
        _schemaDictionary = {};
        const config = loadConfig();
        let mods = [];
        try {
            const files = fs.readdirSync(MODS_DIR).filter(file => file.endsWith('.js') && file !== 'ModLoader.js');
            files.forEach(file => {
                const filePath = pathMod.join(MODS_DIR, file);
                const modId = "../mods/" + pathMod.parse(file).name;
                const info = parseModInfo(filePath);

                let modConfig = config[modId];
                let status = false;
                let currentParams = {};
                let order = mods.length + 1; // 默认顺序

                if (typeof modConfig === 'boolean') {
                    // 旧格式适配：只有 status
                    status = modConfig;
                } else if (modConfig && typeof modConfig === 'object') {
                    status = modConfig.status || false;
                    // 读取 order，如果没有就给默认值
                    if (modConfig.order !== undefined) {
                        order = modConfig.order;
                    }
                    // 验证并修复参数值
                    const rawParams = modConfig.params || {};
                    info.params.forEach(p => {
                        let value = rawParams.hasOwnProperty(p.name) ? rawParams[p.name] : undefined;
                        if (value === '' || value === undefined || value === null) {
                            currentParams[p.name] = p.default;
                        } else if (p.type === 'number') {
                            const numValue = Number(value);
                            if (isNaN(numValue)) {
                                currentParams[p.name] = p.default;
                            } else {
                                let finalValue = numValue;
                                if (p.min !== undefined && finalValue < p.min) finalValue = p.min;
                                if (p.max !== undefined && finalValue > p.max) finalValue = p.max;
                                currentParams[p.name] = String(finalValue);
                            }
                        } else if (p.type === 'color') {
                            if (isValidColor(value)) {
                                currentParams[p.name] = value;
                            } else {
                                currentParams[p.name] = p.default;
                            }
                        } else if (isNoteType(p.type)) {
                            // 长文本类型：保留换行符
                            currentParams[p.name] = value;
                        } else if (isDatabaseType(p.type)) {
                            // 数据库引用类型：值必须是字符串类型的 ID
                            currentParams[p.name] = String(value);
                        } else {
                            currentParams[p.name] = value;
                        }
                    });
                }

                mods.push({
                    id: modId,
                    fileName: file,
                    displayName: pathMod.parse(file).name,
                    status: status,
                    params: info.params,
                    currentParams: currentParams,
                    author: info.author,
                    help: info.help,
                    version: info.version,
                    base: info.base,
                    orderAfter: info.orderAfter,
                    orderBefore: info.orderBefore,
                    order: order
                });
            });
            // 按 order 排序
            mods.sort((a, b) => a.order - b.order);
            // 重新分配连续的 order
            reassignOrders(mods);
        } catch (e) {
            log(1, "扫描Mod目录失败", e);
        }
        return mods;
    }

    /**
     * 重新分配模组的连续顺序号
     */
    function reassignOrders(modList) {
        if (!modList) modList = _modData;
        modList.forEach((mod, index) => {
            mod.order = index + 1;
        });
    }

    function updatePluginsJs(mods) {
        try {
            let content = fs.readFileSync(PLUGINS_PATH, 'utf-8');
            const lines = content.split('\n');
            const originalPlugins = [];

            for (const line of lines) {
                const objMatch = line.match(/^\s*(\{.*\})\s*,?\s*$/);
                if (objMatch) {
                    try {
                        let obj = JSON.parse(objMatch[1]);
                        if (!obj.hasOwnProperty(MOD_SECRET_FLAG)) {
                            originalPlugins.push(obj);
                        }
                    } catch (jsonErr) { /* 忽略解析失败的行 */ }
                }
            }

            const originalPluginsStr = originalPlugins.map(p => JSON.stringify(p));
            const enabledModsStr = mods.filter(mod => mod.status).map(mod => {
                const finalParams = {};
                if (mod.params) {
                    mod.params.forEach(p => {
                        let value = mod.currentParams.hasOwnProperty(p.name)
                            ? mod.currentParams[p.name]
                            : p.default;
                        
                        // 验证值是否有效
                        if (value === '' || value === undefined || value === null) {
                            finalParams[p.name] = p.default;
                        } else if (p.type === 'number') {
                            const numValue = Number(value);
                            if (isNaN(numValue)) {
                                finalParams[p.name] = p.default;
                            } else {
                                let finalValue = numValue;
                                if (p.min !== undefined && finalValue < p.min) finalValue = p.min;
                                if (p.max !== undefined && finalValue > p.max) finalValue = p.max;
                                finalParams[p.name] = String(finalValue);
                            }
                        } else if (p.type === 'color') {
                            if (isValidColor(value)) {
                                finalParams[p.name] = value;
                            } else {
                                finalParams[p.name] = p.default;
                            }
                        } else if (isNoteType(p.type)) {
                            // 长文本类型：保留换行符，进行 XSS 净化
                            finalParams[p.name] = sanitizeText(value);
                        } else if (isDatabaseType(p.type)) {
                            // 数据库引用类型：值必须是字符串类型的 ID
                            finalParams[p.name] = String(value);
                        } else if (p.type === 'struct' || p.type === 'table') {
                            // 阶段2新增：struct/table 类型直接透传（已是 JSON 字符串）
                            finalParams[p.name] = value || p.default;
                        } else {
                            // 文本等其他类型：进行 XSS 净化
                            finalParams[p.name] = sanitizeText(value);
                        }
                    });
                }
                let modObj = {
                    "name": mod.id,
                    "status": true,
                    "description": "",
                    "parameters": finalParams,
                    [MOD_SECRET_FLAG]: true
                };
                return JSON.stringify(modObj);
            });

            const allPluginsStr = [...originalPluginsStr, ...enabledModsStr];
            let newContent = '// Generated by RPG Maker.\n// Do not edit this file directly.\nvar $plugins =\n[\n';
            newContent += allPluginsStr.join(',\n');
            newContent += '\n]\n';

            fs.writeFileSync(PLUGINS_PATH, newContent, 'utf-8');
            log(3, "plugins.js 重写完成");
        } catch (e) {
            log(1, "plugins.js 写入失败", e);
        }
    }

    // ================================================================
    // 5. 工具函数
    // ================================================================


    // 滚动修复：为特定容器绑定 wheel 事件，防止被 RMMZ 或其他插件拦截
    // =========滚动修复开始============================================
    let _wheelListeners = []; // 存储需要移除的监听器

    /**
     * 为滚动容器绑定 wheel 事件（阻止冒泡但不阻止默认滚动行为）
     * @param {HTMLElement} container - 需要滚动的 DOM 元素
     */
    function bindWheelToContainer(container) {
        if (!container || container._wheelBound) return;
        const handler = (e) => {
            // 只阻止事件冒泡到外层，不调用 preventDefault() 以保证滚动正常
            e.stopPropagation();
        };
        container.addEventListener('wheel', handler);
        container._wheelBound = true;
        _wheelListeners.push({ container, handler });
    }

    /**
     * 解绑所有 wheel 监听器
     */
    function unbindAllWheelListeners() {
        _wheelListeners.forEach(({ container, handler }) => {
            container.removeEventListener('wheel', handler);
            container._wheelBound = false;
        });
        _wheelListeners = [];
    }

    /**
     * 绑定所有 ModLoader 相关的滚动容器
     */
    function bindModLoaderScrollContainers() {
        // 主界面滚动区域
        const listScroll = document.getElementById('ml-list-scroll');
        const detailPanel = document.getElementById('ml-detail-panel');
        if (listScroll) bindWheelToContainer(listScroll);
        if (detailPanel) bindWheelToContainer(detailPanel);
        
        // 参数模态框中的滚动区域（如果存在）
        const modalBody = document.querySelector('.ml-modal-body');
        if (modalBody) bindWheelToContainer(modalBody);
    }
    // =========滚动修复结束======================================
    
    /**
     * cssEscape 兼容性 polyfill
     * 用于将参数名转为合法 CSS ID
     */
    function cssEscape(str) {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(str);
        // 简易 fallback：替换非字母数字字符
        return str.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
    
    /**
     * 验证颜色格式是否有效
     * 支持：#RRGGBB, #RGB, rgb/rgba, hsl/hsla, 或有效的颜色名
     */
    function isValidColor(color) {
        if (!color || color === '') return false;
        
        // 检查 #RRGGBB 或 #RGB
        if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color)) return true;
        
        // 检查 rgb/rgba
        if (/^rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*(0|1|0?\.\d+))?\s*\)$/i.test(color)) return true;
        
        // 检查 hsl/hsla
        if (/^hsla?\s*\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?(\s*,\s*(0|1|0?\.\d+))?\s*\)$/i.test(color)) return true;
        
        // 检查常见颜色名（简化版）
        const colorNames = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 
                            'gray', 'grey', 'orange', 'purple', 'pink', 'brown', 'lightgray', 
                            'darkgray', 'lightgrey', 'darkgrey', 'transparent', 'aqua', 
                            'lime', 'maroon', 'navy', 'olive', 'silver', 'teal', 'violet'];
        if (colorNames.includes(color.toLowerCase())) return true;
        
        return false;
    }

    // ====================================================================
    // 通用输入验证与安全函数（顶层 / struct / table 共用）
    // ====================================================================

    /**
     * 验证并修正数值输入框的值
     * - NaN → 回退到 fallback
     * - 超出 [min, max] → clamp 到边界
     * - 空值 → 回退到 fallback
     * @param {HTMLInputElement} inputEl - 数值输入框元素
     * @param {object} opts - 选项 { min, max, fallback }
     * @returns {string} 修正后的合法值（字符串形式）
     */
    function validateNumberInput(inputEl, opts) {
        const raw = inputEl.value.trim();
        const { min, max, fallback } = opts;
        const defaultVal = fallback !== undefined ? fallback : '0';

        if (raw === '' || raw === undefined || raw === null) {
            inputEl.value = defaultVal;
            log(3, `[validateNumber] 空值，回退到: ${defaultVal}`);
            return defaultVal;
        }

        let num = Number(raw);
        if (isNaN(num)) {
            inputEl.value = defaultVal;
            log(3, `[validateNumber] 非法数字 "${raw}"，回退到: ${defaultVal}`);
            return defaultVal;
        }

        // clamp 到范围
        if (min !== undefined && num < min) { num = min; }
        if (max !== undefined && num > max) { num = max; }
        const result = String(num);
        inputEl.value = result;
        return result;
    }

    /**
     * 验证并修正颜色输入框的值
     * - 非法颜色 → 回退到 fallback
     * @param {HTMLInputElement} textInputEl - 颜色文本输入框元素
     * @param {HTMLInputElement} [colorInputEl] - 颜色选择器元素（可选，用于同步）
     * @param {string} fallback - 回退默认值
     * @returns {string} 修正后的合法颜色值
     */
    function validateColorInput(textInputEl, colorInputEl, fallback) {
        const raw = textInputEl.value.trim();
        const defaultVal = fallback || '#ffffff';

        if (!raw || !isValidColor(raw)) {
            textInputEl.value = defaultVal;
            if (colorInputEl) {
                colorInputEl.value = defaultVal.startsWith('#') ? defaultVal : '#ffffff';
            }
            log(3, `[validateColor] 非法颜色 "${raw}"，回退到: ${defaultVal}`);
            return defaultVal;
        }

        // 合法颜色，同步到颜色选择器
        if (colorInputEl && raw.startsWith('#')) {
            colorInputEl.value = raw;
        }
        return raw;
    }

    /**
     * 验证并修正文本输入框的值（含 XSS 防护）
     * - 空值 → 回退到 fallback
     * - 含危险字符 → sanitize
     * @param {HTMLInputElement} inputEl - 文本输入框元素
     * @param {string} fallback - 回退默认值
     * @returns {string} 修正后的安全文本值
     */
    function validateTextInput(inputEl, fallback) {
        let raw = inputEl.value;
        const defaultVal = fallback !== undefined ? fallback : '';

        if (raw === '' || raw === undefined || raw === null) {
            inputEl.value = defaultVal;
            return defaultVal;
        }

        // XSS 防护：移除危险内容
        const sanitized = sanitizeText(raw);
        if (sanitized !== raw) {
            inputEl.value = sanitized;
            log(3, `[validateText] 文本已净化，移除了潜在危险内容`);
        }
        return sanitized;
    }

    /**
     * 文本 XSS 净化函数
     * 移除/转义可能被用于注入攻击的内容：
     * - <script> 标签
     * - javascript: 协议
     * - 事件处理器属性 (onxxx=)
     * - <iframe>, <embed>, <object> 等危险标签
     * - data: 协议中的 HTML
     * 
     * 注意：此函数用于净化"存储到配置文件"的文本值，
     * 防止恶意 Mod 作者通过参数值注入脚本攻击玩家。
     * 渲染时仍使用 escapeHtml() 进行二次防护。
     * 
     * @param {string} text - 原始文本
     * @returns {string} 净化后的安全文本
     */
    function sanitizeText(text) {
        if (!text || typeof text !== 'string') return text;

        let result = text;

        // 1. 移除 <script> 标签及其内容
        result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // 2. 移除危险 HTML 标签（iframe, embed, object, applet, form, base, link, meta）
        result = result.replace(/<\/?(iframe|embed|object|applet|form|base|link|meta)\b[^>]*>/gi, '');

        // 3. 移除事件处理器属性 (onclick, onerror, onload, etc.)
        result = result.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

        // 4. 移除 javascript: 协议
        result = result.replace(/javascript\s*:/gi, '');

        // 5. 移除 data:text/html 协议
        result = result.replace(/data\s*:\s*text\/html/gi, '');

        // 6. 移除 vbscript: 协议
        result = result.replace(/vbscript\s*:/gi, '');

        return result;
    }

    /**
     * 为数值输入框绑定通用 blur 验证事件
     * @param {HTMLInputElement} inputEl - 数值输入框元素
     * @param {object} opts - 选项 { min, max, fallback, onChange? }
     */
    function bindNumberValidation(inputEl, opts) {
        if (!inputEl) return;
        inputEl.addEventListener('blur', () => {
            const val = validateNumberInput(inputEl, opts);
            if (opts.onChange) opts.onChange(val);
        });
        // input 事件实时更新（不验证，仅传递值）
        inputEl.addEventListener('input', () => {
            if (opts.onChange) opts.onChange(inputEl.value);
        });
    }

    /**
     * 为颜色输入框组（文本框 + 颜色选择器）绑定通用验证事件
     * @param {HTMLInputElement} textInputEl - 颜色文本输入框
     * @param {HTMLInputElement} colorInputEl - 颜色选择器
     * @param {string} fallback - 回退默认值
     * @param {object} opts - 选项 { onChange? }
     */
    function bindColorValidation(textInputEl, colorInputEl, fallback, opts) {
        if (!textInputEl) return;

        // 文本框 blur 验证
        textInputEl.addEventListener('blur', () => {
            const val = validateColorInput(textInputEl, colorInputEl, fallback);
            if (opts && opts.onChange) opts.onChange(val);
        });

        // 文本框 input 实时同步到颜色选择器
        textInputEl.addEventListener('input', () => {
            const val = textInputEl.value.trim();
            if (isValidColor(val) && val.startsWith('#') && colorInputEl) {
                colorInputEl.value = val;
            }
            if (opts && opts.onChange) opts.onChange(val);
        });

        // 颜色选择器 input 实时同步到文本框
        if (colorInputEl) {
            colorInputEl.addEventListener('input', () => {
                textInputEl.value = colorInputEl.value;
                if (opts && opts.onChange) opts.onChange(colorInputEl.value);
            });
        }
    }

    /**
     * 为文本输入框绑定通用 blur 验证事件（含 XSS 防护）
     * @param {HTMLInputElement} inputEl - 文本输入框元素
     * @param {string} fallback - 回退默认值
     * @param {object} opts - 选项 { onChange? }
     */
    function bindTextValidation(inputEl, fallback, opts) {
        if (!inputEl) return;
        inputEl.addEventListener('blur', () => {
            const val = validateTextInput(inputEl, fallback);
            if (opts && opts.onChange) opts.onChange(val);
        });
        inputEl.addEventListener('input', () => {
            if (opts && opts.onChange) opts.onChange(inputEl.value);
        });
    }

    /**
     * 数据库引用类型映射表
     * 将 @type actor/skill/item/weapon/armor/enemy/state 映射到 RMMZ 全局变量和中文名
     */
    const DB_TYPE_MAP = {
        actor:  { global: '$dataActors',  label: '角色' },
        skill:  { global: '$dataSkills',  label: '技能' },
        item:   { global: '$dataItems',   label: '物品' },
        weapon: { global: '$dataWeapons', label: '武器' },
        armor:  { global: '$dataArmors',  label: '防具' },
        enemy:  { global: '$dataEnemies', label: '敌人' },
        state:  { global: '$dataStates',  label: '状态' }
    };

    /**
     * 判断参数类型是否为数据库引用类型
     */
    function isDatabaseType(type) {
        return DB_TYPE_MAP.hasOwnProperty(type);
    }

    /**
     * 获取数据库引用类型对应的 RMMZ 数据数组
     * 返回 null 表示数据库未加载
     */
    function getDatabaseArray(type) {
        const mapping = DB_TYPE_MAP[type];
        if (!mapping) return null;
        try {
            const data = window[mapping.global];
            if (data && Array.isArray(data)) return data;
        } catch (e) { /* 忽略 */ }
        return null;
    }

    /**
     * 判断参数类型是否为长文本类型
     */
    function isNoteType(type) {
        return type === 'note' || type === 'multiline_string';
    }

    /**
     * 计算数值参数的合适步长
     * 优先使用 @step 标签，否则根据 min/max 自动计算
     */
    function calculateStep(param) {
        // 优先使用自定义 step
        if (param.step !== undefined && !isNaN(param.step) && param.step > 0) {
            return param.step;
        }

        // 如果没有 min/max，默认步长 1
        if (param.min === undefined || param.max === undefined) {
            return 1;
        }

        const min = param.min;
        const max = param.max;
        const range = max - min;

        // 计算小数位数
        function getDecimalPlaces(num) {
            const str = num.toString();
            const dotIndex = str.indexOf('.');
            return dotIndex === -1 ? 0 : str.length - dotIndex - 1;
        }

        const minDecimals = getDecimalPlaces(min);
        const maxDecimals = getDecimalPlaces(max);
        const maxDecimalPlaces = Math.max(minDecimals, maxDecimals);

        // 根据范围和小数位数计算合适的步长
        if (maxDecimalPlaces > 0) {
            // 有小数的情况
            if (range <= 1) {
                return 0.1;
            } else if (range <= 10) {
                return 0.5;
            } else {
                // 范围较大时，根据小数位数确定步长
                return Math.pow(10, -maxDecimalPlaces);
            }
        }

        // 整数的情况
        return 1;
    }

    // ================================================================
    // 6. @color 标签解析器
    // ================================================================
    /**
     * 解析 @color 标签并转换为 HTML <span> 标签
     * 支持格式：
     *   @color[#ff0000]红色文字@/color       → <span style="color:#ff0000">红色文字</span>
     *   @color[24]RMMZ色号文字@/color        → <span style="color:rgb(r,g,b)">RMMZ色号文字</span>
     *   @color[red]CSS颜色名文字@/color      → <span style="color:red">CSS颜色名文字</span>
     *   @color[#ff0,bold]复合样式@/color      → <span style="color:#ff0;font-weight:bold">复合样式</span>
     * 同时兼容 RMMZ 标准 \c[n] 格式
     */
    function parseColorTags(text) {
        if (!text) return '';
        let result = text;

        // 解析 @color[value]...@/color 格式
        result = result.replace(/@color\[([^\]]+)\]([\s\S]*?)@\/color/g, (match, colorVal, content) => {
            let cssColor = colorVal;
            let extraStyle = '';

            // 如果是纯数字，使用 RMMZ ColorManager 色号映射
            if (/^\d+$/.test(colorVal.trim())) {
                const idx = parseInt(colorVal.trim());
                try {
                    if (typeof ColorManager !== 'undefined' && ColorManager.textColor) {
                        cssColor = ColorManager.textColor(idx);
                    }
                } catch (e) {
                    log(2, "ColorManager.textColor 调用失败，使用原始值", idx, e);
                    cssColor = String(idx);
                }
            }

            return `<span style="color:${cssColor}${extraStyle}">${content}</span>`;
        });

        // 兼容 RMMZ 标准 \c[n] 格式（简单映射为 span）
        result = result.replace(/\\c\[(\d+)\]/g, (match, idxStr) => {
            const idx = parseInt(idxStr);
            let cssColor = '';
            try {
                if (typeof ColorManager !== 'undefined' && ColorManager.textColor) {
                    cssColor = ColorManager.textColor(idx);
                }
            } catch (e) {
                cssColor = '';
            }
            if (cssColor) {
                return `</span><span style="color:${cssColor}">`;
            }
            return '</span><span>';
        });

        return result;
    }

    /**
     * HTML 转义，防止 XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 安全渲染文本：先转义 HTML 实体，再解析 @color 标签
     */
    function renderSafeText(text) {
        if (!text) return '';
        // 先转义所有 HTML 特殊字符，防止注入
        let safe = escapeHtml(text);
        // 然后解析 @color 标签（@color 标签本身是自定义格式，需要还原）
        // 由于 escapeHtml 会把 < > & 转义，但 @color 不含这些字符，所以直接解析即可
        // 但 @color 解析后会生成 <span>，所以我们需要在转义之前解析 @color
        // 重新设计：先解析 @color 生成 HTML，对非 @color 部分转义
        return parseColorTagsFromRaw(text);
    }

    /**
     * 从原始文本中解析 @color 标签，非标签部分进行 HTML 转义
     */
    function parseColorTagsFromRaw(text) {
        if (!text) return '';
        let result = '';
        let remaining = text;

        // 匹配 @color[value]...@/color
        const colorRegex = /@color\[([^\]]+)\]([\s\S]*?)@\/color/g;
        let lastIndex = 0;
        let match;

        while ((match = colorRegex.exec(text)) !== null) {
            // 转义标签之前的普通文本
            result += escapeHtml(text.substring(lastIndex, match.index));

            let colorVal = match[1];
            let content = match[2];
            let cssColor = colorVal;

            // RMMZ 色号映射
            if (/^\d+$/.test(colorVal.trim())) {
                const idx = parseInt(colorVal.trim());
                try {
                    if (typeof ColorManager !== 'undefined' && ColorManager.textColor) {
                        cssColor = ColorManager.textColor(idx);
                    }
                } catch (e) {
                    log(2, "ColorManager.textColor 调用失败", idx, e);
                }
            }

            // 标签内容也需要转义（但保留内部嵌套的 @color）
            result += `<span style="color:${cssColor}">${escapeHtml(content)}</span>`;
            lastIndex = match.index + match[0].length;
        }

        // 转义剩余的普通文本
        result += escapeHtml(text.substring(lastIndex));

        // 兼容 \c[n] 格式
        result = result.replace(/\\c\[(\d+)\]/g, (m, idxStr) => {
            const idx = parseInt(idxStr);
            let cssColor = '';
            try {
                if (typeof ColorManager !== 'undefined' && ColorManager.textColor) {
                    cssColor = ColorManager.textColor(idx);
                }
            } catch (e) { /* 忽略 */ }
            return cssColor ? `</span><span style="color:${cssColor}">` : '';
        });

        return result;
    }

    // ================================================================
    // 6. CSS 样式注入
    // ================================================================
    function injectStyles() {
        if (document.getElementById('ml-styles')) return; // 防止重复注入

        const styleEl = document.createElement('style');
        styleEl.id = 'ml-styles';
        styleEl.textContent = `
/* ===== ModLoader V3 DOM UI 样式系统 ===== */

/* ---------- CSS 变量（主题色） ---------- */
:root {
    --ml-bg-overlay: rgba(8, 8, 18, 0.88);
    --ml-bg-primary: rgba(18, 18, 32, 1);
    --ml-bg-secondary: rgba(28, 28, 48, 0.95);
    --ml-bg-tertiary: rgba(38, 38, 58, 0.90);
    --ml-bg-hover: rgba(255, 255, 255, 0.06);
    --ml-bg-active: rgba(74, 158, 255, 0.12);
    --ml-bg-selected: rgba(74, 158, 255, 0.18);
    --ml-border: rgba(255, 255, 255, 0.08);
    --ml-border-light: rgba(255, 255, 255, 0.15);
    --ml-text-primary: #e8e8ec;
    --ml-text-secondary: #9a9ab0;
    --ml-text-muted: #666680;
    --ml-accent: #4a9eff;
    --ml-accent-hover: #5cb0ff;
    --ml-success: #4caf50;
    --ml-success-bg: rgba(76, 175, 80, 0.15);
    --ml-danger: #ef5350;
    --ml-danger-bg: rgba(239, 83, 80, 0.15);
    --ml-warning: #ffa726;
    --ml-warning-bg: rgba(255, 167, 38, 0.15);
    --ml-radius-sm: 6px;
    --ml-radius: 10px;
    --ml-radius-lg: 14px;
    --ml-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    --ml-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.6);
    --ml-transition: 0.2s ease;
    --ml-font: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ---------- 遮罩层 ---------- */
.ml-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 9999;
    background: var(--ml-bg-overlay);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: mlFadeIn 0.25s ease;
    font-family: var(--ml-font);
    color: var(--ml-text-primary);
    user-select: none;
}

/* ---------- 主容器 ---------- */
.ml-container {
    width: 88%;
    max-width: 1060px;
    height: 82%;
    max-height: 720px;
    display: flex;
    flex-direction: column;
    background: var(--ml-bg-primary);
    border-radius: var(--ml-radius-lg);
    border: 1px solid var(--ml-border-light);
    box-shadow: var(--ml-shadow-lg);
    overflow: hidden;
    animation: mlSlideUp 0.3s ease;
}

/* ---------- 头部 ---------- */
.ml-header {
    padding: 18px 24px;
    background: var(--ml-bg-secondary);
    border-bottom: 1px solid var(--ml-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.ml-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--ml-text-primary);
    letter-spacing: 1px;
}

.ml-header-info {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 13px;
    color: var(--ml-text-secondary);
}

.ml-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.ml-badge-success {
    background: var(--ml-success-bg);
    color: var(--ml-success);
}

.ml-badge-warning {
    background: var(--ml-warning-bg);
    color: var(--ml-warning);
}

/* ---------- 内容区域 ---------- */
.ml-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
}

/* ---------- 模组列表面板 ---------- */
.ml-list-panel {
    width: 42%;
    min-width: 280px;
    border-right: 1px solid var(--ml-border);
    display: flex;
    flex-direction: column;
    background: var(--ml-bg-secondary);
}

.ml-list-header {
    padding: 12px 16px;
    font-size: 12px;
    color: var(--ml-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid var(--ml-border);
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ml-list-header span:nth-child(2) {
    font-size: 14px;
    font-weight: 600;
    color: var(--ml-text-primary);
    flex: 1;
    text-align: center;
    text-transform: none;
    letter-spacing: normal;
}

.ml-list-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}

/* ---------- 模组条目 ---------- */
.ml-mod-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    cursor: pointer;
    transition: background var(--ml-transition), border-color var(--ml-transition);
    border-left: 3px solid transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    gap: 10px;
}

.ml-mod-item:hover {
    background: var(--ml-bg-hover);
}

.ml-mod-item.selected {
    background: var(--ml-bg-selected);
    border-left-color: var(--ml-accent);
}

/* ---------- Toggle 开关 ---------- */
.ml-toggle {
    position: relative;
    width: 40px;
    height: 22px;
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.15);
    cursor: pointer;
    transition: background 0.3s ease;
    flex-shrink: 0;
}

.ml-toggle.on {
    background: var(--ml-success);
}

.ml-toggle-thumb {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    top: 2px;
    left: 2px;
    transition: transform 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.ml-toggle.on .ml-toggle-thumb {
    transform: translateX(18px);
}

/* ---------- 模组名称 ---------- */
.ml-mod-name {
    flex: 1;
    font-size: 14px;
    color: var(--ml-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
}

.ml-mod-name span {
    /* @color 渲染的 span 继承行高 */
    line-height: inherit;
}

/* ---------- 齿轮图标 ---------- */
.ml-gear {
    font-size: 20px;
    color: var(--ml-text-muted);
    cursor: pointer;
    transition: color var(--ml-transition), transform var(--ml-transition);
    flex-shrink: 0;
    padding: 2px 4px;
    border-radius: 4px;
}

.ml-gear:hover {
    color: var(--ml-accent);
    transform: rotate(45deg);
}

/* ========== 序号显示 ========== */
.ml-order-text {
    width: 40px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ml-text-secondary);
    font-size: 13px;
    font-weight: 500;
    flex-shrink: 0;
}

.ml-order-input {
    width: 40px;
    height: 28px;
    border: 1px solid var(--ml-border-light);
    border-radius: 4px;
    background: var(--ml-bg-tertiary);
    color: var(--ml-text-primary);
    font-size: 13px;
    text-align: center;
    flex-shrink: 0;
    outline: none;
    transition: all var(--ml-transition);
}

.ml-order-input:hover {
    border-color: var(--ml-accent);
}

.ml-order-input:focus {
    border-color: var(--ml-accent);
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2);
}

/* ========== 拖拽效果 ========== */
.ml-mod-item.dragging {
    opacity: 0.5;
    transform: scale(0.97);
    background: var(--ml-bg-tertiary) !important;
}

/* 拖放到上半部分：顶部边框提示 */
.ml-mod-item.drag-over-top {
    border-top: 2px solid var(--ml-accent);
    background: var(--ml-bg-active);
}

/* 拖放到下半部分：底部边框提示 */
.ml-mod-item.drag-over-bottom {
    border-bottom: 2px solid var(--ml-accent);
    background: var(--ml-bg-active);
}

/* ========== 未保存提示样式 ========== */
.ml-unsaved-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--ml-warning);
}

.ml-unsaved-indicator.hidden {
    display: none;
}

/* ---------- 详情面板 ---------- */
.ml-detail-panel {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: var(--ml-bg-primary);
}

.ml-detail-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--ml-text-muted);
    font-size: 15px;
}

.ml-detail-section {
    margin-bottom: 20px;
}

.ml-detail-label {
    font-size: 11px;
    color: var(--ml-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
}

.ml-detail-value {
    font-size: 15px;
    color: var(--ml-text-primary);
    line-height: 1.6;
}

.ml-detail-value span {
    line-height: inherit;
}

.ml-detail-help {
    font-size: 13px;
    color: var(--ml-text-secondary);
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: break-word;
}

.ml-detail-help span {
    line-height: inherit;
}

.ml-detail-params {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ml-detail-param-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    background: var(--ml-bg-tertiary);
    border-radius: var(--ml-radius-sm);
    font-size: 13px;
}

.ml-detail-param-name {
    color: var(--ml-text-secondary);
    min-width: 100px;
}

.ml-detail-param-value {
    color: var(--ml-accent);
    font-weight: 500;
}

.ml-detail-param-type {
    color: var(--ml-text-muted);
    font-size: 11px;
    margin-left: auto;
}

/* ---------- 底部栏 ---------- */
.ml-footer {
    padding: 14px 24px;
    background: var(--ml-bg-secondary);
    border-top: 1px solid var(--ml-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.ml-restart-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--ml-warning);
    animation: mlPulse 2s ease infinite;
}

.ml-restart-hint.hidden {
    display: none;
}

.ml-footer-actions {
    display: flex;
    gap: 10px;
}

/* ---------- 按钮 ---------- */
.ml-btn {
    padding: 8px 20px;
    border-radius: var(--ml-radius-sm);
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    font-family: var(--ml-font);
    transition: all var(--ml-transition);
    outline: none;
}

.ml-btn:focus-visible {
    box-shadow: 0 0 0 2px var(--ml-accent);
}

.ml-btn-primary {
    background: var(--ml-accent);
    color: #fff;
    border-color: var(--ml-accent);
}

.ml-btn-primary:hover {
    background: var(--ml-accent-hover);
    border-color: var(--ml-accent-hover);
}

.ml-btn-secondary {
    background: rgba(255, 255, 255, 0.06);
    color: var(--ml-text-secondary);
    border-color: var(--ml-border-light);
}

.ml-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.12);
    color: var(--ml-text-primary);
}

.ml-btn-danger {
    background: var(--ml-danger-bg);
    color: var(--ml-danger);
    border-color: rgba(239, 83, 80, 0.3);
}

.ml-btn-danger:hover {
    background: rgba(239, 83, 80, 0.25);
}

.ml-btn-warning {
    background: var(--ml-warning-bg);
    color: var(--ml-warning);
    border-color: rgba(255, 167, 38, 0.3);
}

.ml-btn-warning:hover {
    background: rgba(255, 167, 38, 0.25);
}

/* ---------- 参数编辑模态框 ---------- */
.ml-modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 10001;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: mlFadeIn 0.15s ease;
    font-family: var(--ml-font);
    color: var(--ml-text-primary);
    user-select: none;
}

.ml-modal {
    background: var(--ml-bg-primary);
    border-radius: var(--ml-radius-lg);
    border: 1px solid var(--ml-border-light);
    box-shadow: var(--ml-shadow-lg);
    width: 520px;
    max-width: 92vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: mlSlideUp 0.2s ease;
    overflow: hidden;
}

.ml-modal-header {
    padding: 18px 24px;
    background: var(--ml-bg-secondary);
    border-bottom: 1px solid var(--ml-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.ml-modal-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--ml-text-primary);
}

.ml-modal-close {
    background: none;
    border: none;
    color: var(--ml-text-muted);
    font-size: 22px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    transition: color var(--ml-transition);
}

.ml-modal-close:hover {
    color: var(--ml-text-primary);
}

.ml-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
}

.ml-modal-footer {
    padding: 14px 24px;
    background: var(--ml-bg-secondary);
    border-top: 1px solid var(--ml-border);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
}

/* ---------- 表单控件 ---------- */
.ml-form-group {
    margin-bottom: 18px;
}

.ml-form-group:last-child {
    margin-bottom: 0;
}

.ml-form-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    color: var(--ml-text-secondary);
}

.ml-form-label-type {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 4px;
    background: var(--ml-bg-tertiary);
    color: var(--ml-text-muted);
}

.ml-form-desc {
    font-size: 11px;
    color: var(--ml-text-muted);
    margin-top: 4px;
}

.ml-form-default {
    font-size: 11px;
    color: var(--ml-text-muted);
    margin-top: 2px;
}

.ml-form-input {
    width: 100%;
    padding: 9px 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--ml-border-light);
    border-radius: var(--ml-radius-sm);
    color: var(--ml-text-primary);
    font-size: 14px;
    font-family: var(--ml-font);
    outline: none;
    transition: border-color var(--ml-transition), box-shadow var(--ml-transition);
    box-sizing: border-box;
}

.ml-form-input:focus {
    border-color: var(--ml-accent);
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2);
}

.ml-form-input::placeholder {
    color: var(--ml-text-muted);
}

.ml-form-select {
    width: 100%;
    padding: 9px 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--ml-border-light);
    border-radius: var(--ml-radius-sm);
    color: var(--ml-text-primary);
    font-size: 14px;
    font-family: var(--ml-font);
    outline: none;
    cursor: pointer;
    transition: border-color var(--ml-transition);
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239a9ab0' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
}

.ml-form-select:focus {
    border-color: var(--ml-accent);
}

.ml-form-select option {
    background: #1a1a2e;
    color: var(--ml-text-primary);
}

/* 布尔值行内切换 */
.ml-form-toggle-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.ml-form-toggle-status {
    font-size: 13px;
    font-weight: 500;
}

.ml-form-toggle-status.on {
    color: var(--ml-success);
}

.ml-form-toggle-status.off {
    color: var(--ml-danger);
}

/* 数值输入行 */
.ml-form-number-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.ml-form-number-input {
    flex: 1;
}

.ml-form-number-btn {
    min-width: 70px;
    height: 32px;
    padding: 0 10px;
    border-radius: var(--ml-radius-sm);
    border: 1px solid var(--ml-border-light);
    background: rgba(255, 255, 255, 0.06);
    color: var(--ml-text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--ml-transition);
    white-space: nowrap;
}

.ml-form-number-btn:hover:not(.disabled) {
    background: rgba(74, 158, 255, 0.25);
    border-color: var(--ml-accent);
    color: var(--ml-accent);
}

.ml-form-number-btn.disabled {
    opacity: 0.35;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.03);
}

.ml-form-number-btn.disabled:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: var(--ml-border-light);
    color: var(--ml-text-secondary);
}

/* 数值滑动条 */
.ml-form-slider-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.ml-form-slider-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.ml-form-slider-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--ml-accent);
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    min-width: 40px;
    text-align: center;
    transition: background var(--ml-transition);
}

.ml-form-slider-value:hover {
    background: rgba(74, 158, 255, 0.15);
}

.ml-form-slider-range {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
}

.ml-form-slider-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--ml-accent);
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    transition: transform 0.15s ease;
}

.ml-form-slider-range::-webkit-slider-thumb:hover {
    transform: scale(1.15);
}

.ml-form-slider-range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--ml-accent);
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.ml-form-slider-number-input {
    width: 80px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--ml-accent);
    border-radius: var(--ml-radius-sm);
    color: var(--ml-text-primary);
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    outline: none;
    box-sizing: border-box;
}

.ml-form-slider-bounds {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--ml-text-muted);
}

/* 长文本 textarea */
.ml-form-textarea {
    width: 100%;
    min-height: 100px;
    padding: 9px 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--ml-border-light);
    border-radius: var(--ml-radius-sm);
    color: var(--ml-text-primary);
    font-size: 14px;
    font-family: var(--ml-font);
    outline: none;
    transition: border-color var(--ml-transition), box-shadow var(--ml-transition);
    box-sizing: border-box;
    white-space: pre;
    font-family: monospace;
    resize: vertical;
}

.ml-form-textarea:focus {
    border-color: var(--ml-accent);
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2);
}

/* 数据库引用下拉 */
.ml-form-db-hint {
    font-size: 11px;
    color: var(--ml-danger);
    margin-top: 4px;
    font-style: italic;
}

/* ---------- 标题画面按钮 ---------- */
.ml-title-btn {
    position: fixed;
    z-index: 9998;
    padding: 10px 18px;
    background: rgba(18, 18, 32, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--ml-radius);
    color: var(--ml-text-primary);
    font-size: 14px;
    font-family: var(--ml-font);
    cursor: pointer;
    transition: all var(--ml-transition);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    user-select: none;
    display: none;
}

.ml-title-btn:hover {
    background: rgba(74, 158, 255, 0.2);
    border-color: var(--ml-accent);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.ml-title-btn:active {
    transform: translateY(0);
}

/* ---------- 自定义滚动条 ---------- */
.ml-list-scroll::-webkit-scrollbar,
.ml-detail-panel::-webkit-scrollbar,
.ml-modal-body::-webkit-scrollbar {
    width: 6px;
}

.ml-list-scroll::-webkit-scrollbar-track,
.ml-detail-panel::-webkit-scrollbar-track,
.ml-modal-body::-webkit-scrollbar-track {
    background: transparent;
}

.ml-list-scroll::-webkit-scrollbar-thumb,
.ml-detail-panel::-webkit-scrollbar-thumb,
.ml-modal-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
}

.ml-list-scroll::-webkit-scrollbar-thumb:hover,
.ml-detail-panel::-webkit-scrollbar-thumb:hover,
.ml-modal-body::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* ---------- 动画 ---------- */
@keyframes mlFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes mlSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes mlPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

/* ---------- 空状态 ---------- */
.ml-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px;
    color: var(--ml-text-muted);
    text-align: center;
}

.ml-drop-zone {
    border: 2px dashed var(--ml-border-light);
    border-radius: var(--ml-radius-lg);
    padding: 30px 40px;
    margin-top: 20px;
    transition: all var(--ml-transition);
}

.ml-drop-zone.drag-over {
    border-color: var(--ml-accent);
    background: var(--ml-bg-active);
}

.ml-drop-zone-icon {
    font-size: 48px;
    margin-bottom: 10px;
}

.ml-drop-zone-text {
    font-size: 16px;
    color: var(--ml-text-secondary);
}

.ml-drop-zone-hint {
    font-size: 12px;
    margin-top: 8px;
}

.ml-empty-state-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.4;
}

.ml-empty-state-text {
    font-size: 14px;
    line-height: 1.6;
}

/* ================================================================
   阶段2新增：struct 折叠面板 + table 表格列表 样式
   ================================================================ */

/* ---- 外层容器加宽（当模态框包含 struct/table 时通过 JS 添加此类） ---- */
.ml-modal.ml-modal-wide {
    width: 90vw !important;
    max-width: 1200px !important;
}

/* ---- struct 折叠面板 ---- */
.ml-struct-details {
    border: 1px solid var(--ml-border);
    border-radius: 6px;
    margin: 4px 0;
    transition: background 0.2s;
}

/* 一级折叠：带背景色和左边距 */
.ml-struct-depth-1 {
    padding-left: 15px;
    background: var(--ml-bg-tertiary);
}

/* 二级折叠：透明背景，更大左边距 */
.ml-struct-depth-2 {
    padding-left: 30px;
    background: transparent;
}

/* 三级及更深：最大 40px 左边距 */
.ml-struct-depth-3 {
    padding-left: 40px;
    background: transparent;
}

.ml-struct-summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    padding: 6px 10px;
    user-select: none;
    color: var(--ml-text);
    outline: none;
}

.ml-struct-summary:hover {
    color: var(--ml-primary);
}

.ml-struct-summary::marker {
    color: var(--ml-primary);
}

.ml-struct-body {
    padding: 4px 0 8px 0;
}

.ml-struct-field {
    margin: 4px 0;
}

.ml-struct-field .ml-form-label {
    font-size: 12px;
    margin-bottom: 2px;
}

.ml-struct-field .ml-form-label-type {
    font-size: 10px;
}

.ml-struct-input {
    max-width: 280px;
}

.ml-struct-select {
    max-width: 280px;
}

/* ---- table 表格列表 ---- */
.ml-table-container {
    margin: 8px 0;
    width: 100%;
}

.ml-table-scroll-wrapper {
    overflow-x: auto;
    width: 100%;
    border: 1px solid var(--ml-border);
    border-radius: 6px;
}

.ml-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    table-layout: auto;
}

.ml-table thead {
    background: var(--ml-bg-hover);
}

.ml-table th {
    padding: 6px 8px;
    text-align: left;
    font-weight: 600;
    font-size: 11px;
    color: var(--ml-text);
    white-space: nowrap;
    border-bottom: 2px solid var(--ml-border);
}

.ml-table-action-th {
    text-align: center;
    width: 90px;
    min-width: 90px;
}

.ml-table-row {
    border-bottom: 1px solid var(--ml-border);
    transition: background 0.15s;
}

.ml-table-row:hover {
    background: var(--ml-bg-hover);
}

.ml-table-cell {
    padding: 4px 6px;
    vertical-align: middle;
    white-space: nowrap;
}

.ml-table-action-cell {
    text-align: center;
    white-space: nowrap;
}

/* 表格内微型输入框 */
.ml-table-input {
    width: 80px;
    min-width: 60px;
    max-width: 140px;
    padding: 2px 4px;
    font-size: 11px;
    border: 1px solid var(--ml-border);
    border-radius: 3px;
    background: var(--ml-bg);
    color: var(--ml-text);
}

.ml-table-input:focus {
    border-color: var(--ml-primary);
    outline: none;
}

.ml-table-number {
    width: 60px;
    min-width: 50px;
    max-width: 90px;
}

/* 表格内微型色块 */
.ml-table-color {
    width: 28px;
    height: 22px;
    border: 1px solid var(--ml-border);
    border-radius: 3px;
    cursor: pointer;
    padding: 0;
}

/* 表格内微型下拉框 */
.ml-table-select {
    max-width: 120px;
    padding: 2px 4px;
    font-size: 11px;
    border: 1px solid var(--ml-border);
    border-radius: 3px;
    background: var(--ml-bg);
    color: var(--ml-text);
}

.ml-table-select option { background: #1a1a2e; color: var(--ml-text-primary); }


.ml-table-select:focus {
    border-color: var(--ml-primary);
    outline: none;
}

/* 表格内微型拨动开关 */
.ml-table-switch {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 18px;
}

.ml-table-switch .ml-form-switch-slider {
    width: 32px;
    height: 18px;
}

.ml-table-switch .ml-form-switch-slider::before {
    height: 14px;
    width: 14px;
    left: 2px;
    bottom: 2px;
}

.ml-table-switch input:checked + .ml-form-switch-slider::before {
    transform: translateX(14px);
}

/* 表格操作按钮 */
.ml-table-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid var(--ml-border);
    border-radius: 3px;
    background: var(--ml-bg);
    color: var(--ml-text);
    cursor: pointer;
    font-size: 10px;
    margin: 0 1px;
    padding: 0;
    transition: all 0.15s;
}

.ml-table-action-btn:hover {
    background: var(--ml-bg-hover);
    border-color: var(--ml-primary);
    color: var(--ml-primary);
}

.ml-table-delete-btn:hover {
    background: #fff0f0;
    border-color: #e74c3c;
    color: #e74c3c;
}

/* 表格只读降级提示 */
.ml-table-readonly {
    font-size: 10px;
    color: var(--ml-text-muted);
    font-style: italic;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
}

/* 添加行按钮区域 */
.ml-table-add-row {
    margin-top: 6px;
    display: flex;
    justify-content: flex-start;
}

.ml-table-add-btn {
    font-size: 12px;
    padding: 4px 12px;
}
        `;
        document.head.appendChild(styleEl);
        log(3, "CSS 样式注入完成");
    }

    // ================================================================
    // 7. DOM UI 系统
    // ================================================================
    let _overlay = null;       // 主遮罩层
    let _modalOverlay = null;  // 参数编辑模态遮罩
    let _modData = [];         // 当前模组数据
    let _selectedIndex = -1;   // 当前选中索引
    let _needsRestart = false; // 是否需要重启提示
    let _titleBtn = null;     // 标题画面按钮
    let _hasUnsavedChanges = false; // 是否有未保存的修改
    let _draggedIndex = null;  // 当前拖拽的索引
    let _confirmModal = null;  // 确认对话框
    let _dragEnabled = false;  // 拖拽功能是否启用（默认关闭）
    let _dropPosition = null;  // 拖放位置：'before' 或 'after'
    let _keyboardCaptureActive = false;  // 是否开启了通用键盘捕获
    let _deleteMode = false;   // 删除模式是否启用
    let _installOverlay = null; // 安装mod的全屏拖放遮罩
    
    // RMMZ 输入拦截备份
    let _originalInputUpdate = null;
    let _originalTouchInputUpdate = null;

    // 跟踪当前是否有输入框获得焦点
    let _isInputFocused = false;

    // Schema 字典：存储 @define-schema 定义的模板，供 @schema 引用
    // 格式: { 模板名: [ { name, type, text, default, min, max, step, options, schema, ... }, ... ] }
    let _schemaDictionary = {};
    
    /**
     * 检查是否有输入框获得焦点
     */
    function checkInputFocus() {
        const activeElement = document.activeElement;
        return activeElement && 
            (activeElement.tagName === 'INPUT' || 
             activeElement.tagName === 'TEXTAREA' || 
             activeElement.tagName === 'SELECT');
    }
    
    /**
     * 拦截 RMMZ 输入（防止穿透）
     */
    function blockRMMZInput() {
        // 备份原始函数
        if (typeof Input !== 'undefined' && !_originalInputUpdate) {
            _originalInputUpdate = Input.update;
            Input.update = function() {
                // 检查是否有输入框获得焦点
                _isInputFocused = checkInputFocus();
                
                // 如果有输入框获得焦点，完全不拦截 - 让浏览器处理所有输入
                if (_isInputFocused) {
                    return; // 直接返回，不做任何处理
                }
                
                // 没有输入框焦点时才拦截
                if (typeof Input !== 'undefined') Input.clear();
            };
        }
        if (typeof TouchInput !== 'undefined' && !_originalTouchInputUpdate) {
            _originalTouchInputUpdate = TouchInput.update;
            TouchInput.update = function() {
                // 检查是否有输入框获得焦点
                _isInputFocused = checkInputFocus();
                
                // 如果有输入框获得焦点，完全不拦截
                if (_isInputFocused) {
                    return;
                }
                
                // 没有输入框焦点时才拦截
                if (typeof TouchInput !== 'undefined') TouchInput.clear();
            };
        }
        
        // 清除当前状态
        if (typeof Input !== 'undefined') Input.clear();
        if (typeof TouchInput !== 'undefined') TouchInput.clear();
    }

    /**
     * 恢复 RMMZ 输入
     */
    function restoreRMMZInput() {
        // 恢复原始函数
        if (_originalInputUpdate && typeof Input !== 'undefined') {
            Input.update = _originalInputUpdate;
            _originalInputUpdate = null;
        }
        if (_originalTouchInputUpdate && typeof TouchInput !== 'undefined') {
            TouchInput.update = _originalTouchInputUpdate;
            _originalTouchInputUpdate = null;
        }
        
        // 清除状态
        if (typeof Input !== 'undefined') Input.clear();
        if (typeof TouchInput !== 'undefined') TouchInput.clear();
    }

    /**
     * 创建主遮罩层与容器
     */
    function createOverlay() {
        if (_overlay) return _overlay;

        _overlay = document.createElement('div');
        _overlay.className = 'ml-overlay';
        _overlay.id = 'ml-overlay';
        _overlay.style.display = 'none';

        _overlay.innerHTML = `
            <div class="ml-container">
                <div class="ml-header">
            <div style="display: flex; align-items: baseline; gap: 12px;">
                <h2 style="margin: 0;">模组管理器</h2>
                <span class="ml-list-header" style="font-size: 12px; color: var(--ml-text-muted); text-transform: uppercase; letter-spacing: 1px; background: none; padding: 0;">
                    作者: joker ${VERSION}
                </span>
            </div>
                    <div class="ml-header-info" style="gap: 8px; align-items: center;">
                        <button class="ml-btn ml-btn-secondary" id="ml-btn-disable-all" style="font-size: 13px; padding: 4px 12px;">一键全关</button>
                        <button class="ml-btn ml-btn-secondary" id="ml-btn-install" style="font-size: 13px; padding: 4px 12px;">安装mod</button>
                        <button class="ml-btn ml-btn-secondary" id="ml-btn-delete" style="font-size: 13px; padding: 4px 12px;">删除mod</button>
                        <button class="ml-btn ml-btn-secondary" id="ml-btn-sort" style="font-size: 13px; padding: 4px 12px;">排序Mod</button>
                        <span class="ml-badge ml-badge-success" id="ml-enabled-count">已启用: 0</span>
                        <span class="ml-badge ml-badge-warning" id="ml-total-count">总计: 0</span>
                    </div>
                </div>
                <div class="ml-content">
                    <div class="ml-list-panel">
                        <div class="ml-list-header">
                            <span style="font-size:13px;opacity:0.9">序号</span>
                            <span>模组列表</span>
                            <span style="font-size:13px;opacity:0.9">点击⚙修改参数</span>
                        </div>
                        <div class="ml-list-scroll" id="ml-list-scroll"></div>
                    </div>
                    <div class="ml-detail-panel" id="ml-detail-panel">
                        <div class="ml-detail-empty">点击左侧模组查看详情</div>
                    </div>
                </div>
                <div class="ml-footer">
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        <div class="ml-restart-hint hidden" id="ml-restart-hint">
                            &#9888; 修改需重启游戏后生效（F5）
                        </div>
                        <div class="ml-unsaved-indicator hidden" id="ml-unsaved-indicator">
                            &#8226; 有未保存的修改
                        </div>
                    </div>
                    <div class="ml-footer-actions">
                        <button class="ml-btn ml-btn-primary" id="ml-btn-save">保存</button>
                        <button class="ml-btn ml-btn-secondary" id="ml-btn-close">关闭</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(_overlay);

        // 绑定保存和关闭按钮
        document.getElementById('ml-btn-save').addEventListener('click', saveAllChanges);
        document.getElementById('ml-btn-close').addEventListener('click', tryCloseModManager);
        
        // 绑定安装、删除、排序按钮
        document.getElementById('ml-btn-disable-all').addEventListener('click', disableAllMods);
        document.getElementById('ml-btn-install').addEventListener('click', showInstallOverlay);
        document.getElementById('ml-btn-delete').addEventListener('click', toggleDeleteMode);
        document.getElementById('ml-btn-sort').addEventListener('click', toggleDrag);
        
        // 初始化按钮状态
        updateButtonStates();

        // ESC 关闭
        _overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (_modalOverlay) {
                    hideParamEditor();
                } else {
                    tryCloseModManager();
                }
            }
        });

        // 阻止事件穿透到底层（但不影响我们自己的界面）
        const blockToBelow = function(e) {
            // 只有点击的是 _overlay 本身时才阻止（不包括子元素）
            if (e.target === _overlay) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        _overlay.addEventListener('mousedown', blockToBelow);
        _overlay.addEventListener('mouseup', blockToBelow);
        _overlay.addEventListener('click', blockToBelow);
        _overlay.addEventListener('touchstart', blockToBelow);
        _overlay.addEventListener('touchend', blockToBelow);

        log(3, "DOM 遮罩层创建完成");
        // 绑定滚动容器
        bindModLoaderScrollContainers();
        return _overlay;
    }

    /**
     * 显示模组管理器
     */
    function showModManager() {
        const overlay = createOverlay();
        _modData = scanMods();
        _selectedIndex = -1;
        _needsRestart = false;
        _hasUnsavedChanges = false;

        renderModList();
        renderDetail(null);
        updateCounts();
        updateRestartHint();
        updateSaveButton();

        overlay.style.display = 'flex';
        bindModLoaderScrollContainers();   //  添加这一行修复进出管理器后的列表滚动失效
        overlay.focus();

        // 拦截 RMMZ 输入，防止穿透
        blockRMMZInput();
        
        // 开启通用键盘事件捕获，修复输入框方向键、删除键等问题
        if (!_keyboardCaptureActive) {
            document.addEventListener('keydown', keyboardCaptureHandler, true);
            document.addEventListener('keyup', keyboardCaptureHandler, true);
            document.addEventListener('keypress', keyboardCaptureHandler, true);
            _keyboardCaptureActive = true;
        }

        log(3, "模组管理器已打开，共", _modData.length, "个模组");

        // 检测 plugins.js 是否被重置
        if (checkPluginsReset()) {
            log(3, "检测到 plugins.js 已被重置，正在提示用户...");
            showConfirmDialog(
                "检测到游戏更新",
                "检测到游戏更新了 plugins.js 文件！\nMod 因未注册而失效，是否一键还原 Mod 配置？",
                [
                    { text: "稍后再说", class: "ml-btn-secondary", action: hideConfirmDialog },
                    { 
                        text: "一键还原并保存", 
                        class: "ml-btn-primary", 
                        action: () => { 
                            hideConfirmDialog(); 
                            saveAllChanges();
                        } 
                    }
                ]
            );
        }
    }



    /**
     * 隐藏模组管理器
     */
    function hideModManager() {
        log(3, "=== hideModManager 开始 ===");
        
        if (_overlay) {
            _overlay.style.display = 'none';
        }
        
        unbindAllWheelListeners();//滚轮修复
        // 恢复 RMMZ 输入
        restoreRMMZInput();
        
        // 移除通用键盘事件捕获
        if (_keyboardCaptureActive) {
            document.removeEventListener('keydown', keyboardCaptureHandler, true);
            document.removeEventListener('keyup', keyboardCaptureHandler, true);
            document.removeEventListener('keypress', keyboardCaptureHandler, true);
            _keyboardCaptureActive = false;
        }
        
        log(3, "模组管理器已关闭");
    }

    /**
     * 渲染模组列表
     */
    function renderModList() {
        const container = document.getElementById('ml-list-scroll');
        if (!container) return;

        container.innerHTML = '';

        // 先渲染Mod列表（如果有）
        if (_modData.length > 0) {
            _modData.forEach((mod, index) => {
                const item = document.createElement('div');
                item.className = 'ml-mod-item' + (index === _selectedIndex ? ' selected' : '');
                item.dataset.index = index;
                item.draggable = _dragEnabled;

                const hasParams = mod.params && mod.params.length > 0;
                
                // 根据拖拽是否启用显示输入框或纯文本
                let orderHtml;
                if (_dragEnabled) {
                    orderHtml = `<input type="number" class="ml-order-input" value="${mod.order}" min="1" max="${_modData.length}" data-index="${index}">`;
                } else {
                    orderHtml = `<div class="ml-order-text" data-index="${index}">${mod.order}</div>`;
                }

                // 删除模式下添加红底🗑️
                let deleteHtml = '';
                if (_deleteMode) {
                    deleteHtml = `<div class="ml-delete-btn" data-action="delete" data-index="${index}" style="margin-left: 8px; background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 14px; line-height: 1;">🗑️</div>`;
                }

                item.innerHTML = `
                    ${orderHtml}
                    <div class="ml-toggle ${mod.status ? 'on' : ''}" data-action="toggle" data-index="${index}">
                        <div class="ml-toggle-thumb"></div>
                    </div>
                    <div class="ml-mod-name" data-action="select" data-index="${index}">
                        ${parseColorTagsFromRaw(mod.displayName)}
                    </div>
                    ${hasParams ? `<div class="ml-gear" data-action="params" data-index="${index}" title="编辑参数">&#9881;</div>` : ''}
                    ${deleteHtml}
                `;

                container.appendChild(item);
            });
        }

        // 如果是空状态，添加空状态提示
        if (_modData.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'ml-empty-state';
            emptyState.style.paddingBottom = '0';
            emptyState.innerHTML = `
                <div class="ml-empty-state-icon">&#128230;</div>
                <div class="ml-empty-state-text">
                    未发现任何模组
                </div>
            `;
            container.insertBefore(emptyState, container.firstChild);
        }

        // 事件委托（仅绑定一次）
        if (!container._mlListenerAdded) {
            container.addEventListener('click', handleListClick);
            // 序号输入事件
            container.addEventListener('input', handleOrderInput);
            container.addEventListener('blur', handleOrderBlur, true);
            container.addEventListener('keydown', handleOrderKeydown, true);
            // 拖拽事件
            container.addEventListener('dragstart', handleDragStart);
            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('dragleave', handleDragLeave);
            container.addEventListener('drop', handleDrop);
            container.addEventListener('dragend', handleDragEnd);
            container._mlListenerAdded = true;
        }
    }

    /**
     * 列表点击事件处理（事件委托）
     */
    function handleListClick(e) {
        const target = e.target.closest('[data-action]');
        if (!target) {
            // 点击了行但没点到具体控件，视为选中
            const item = e.target.closest('.ml-mod-item');
            if (item) {
                selectMod(parseInt(item.dataset.index));
            }
            return;
        }

        const action = target.dataset.action;
        const index = parseInt(target.dataset.index);

        e.stopPropagation();

        switch (action) {
            case 'toggle':
                toggleMod(index);
                break;
            case 'select':
                selectMod(index);
                break;
            case 'params':
                selectMod(index);
                const mod = _modData[index];
                if (mod && mod.params && mod.params.length > 0) {
                    showParamEditor(mod);
                }
                break;
            case 'delete':
                deleteMod(index);
                break;
        }
    }

    /**
     * 选中模组
     */
    function selectMod(index) {
        if (index < 0 || index >= _modData.length) return;
        _selectedIndex = index;

        // 更新选中样式
        const items = document.querySelectorAll('.ml-mod-item');
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });

        // 渲染详情
        renderDetail(_modData[index]);
        log(3, "选中模组:", _modData[index].displayName);
    }

    /**
     * 切换模组开关
     */
    function toggleMod(index) {
        if (index < 0 || index >= _modData.length) return;
        const mod = _modData[index];
        mod.status = !mod.status;
        _hasUnsavedChanges = true;
        updateSaveButton();

        // 更新 UI
        const toggleEl = document.querySelector(`.ml-toggle[data-index="${index}"]`);
        if (toggleEl) {
            toggleEl.classList.toggle('on', mod.status);
        }

        updateCounts();

        // 如果当前选中的就是这个模组，刷新详情
        if (_selectedIndex === index) {
            renderDetail(mod);
        }

        // 播放音效
        try {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playOk();
            }
        } catch (e) { /* 忽略 */ }

        log(3, "模组切换:", mod.displayName, mod.status ? "ON" : "OFF");
    }

    /**
     * 一键全关所有模组
     */
    function disableAllMods() {
        if (_modData.length === 0) return;

        let anyChanged = false;
        _modData.forEach((mod, index) => {
            if (mod.status) {
                mod.status = false;
                anyChanged = true;
                // 更新 UI
                const toggleEl = document.querySelector(`.ml-toggle[data-index="${index}"]`);
                if (toggleEl) {
                    toggleEl.classList.remove('on');
                }
                // 如果当前选中的就是这个模组，刷新详情
                if (_selectedIndex === index) {
                    renderDetail(mod);
                }
                log(3, "模组关闭:", mod.displayName);
            }
        });

        if (anyChanged) {
            _hasUnsavedChanges = true;
            updateSaveButton();
            updateCounts();
        }

        // 播放音效
        try {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.playOk();
            }
        } catch (e) { /* 忽略 */ }

        log(3, "一键全关完成");
    }

    /**
     * 渲染详情面板
     */
    function renderDetail(mod) {
        const panel = document.getElementById('ml-detail-panel');
        if (!panel) return;

        if (!mod) {
            panel.innerHTML = '<div class="ml-detail-empty">点击左侧模组查看详情</div>';
            return;
        }

        const hasParams = mod.params && mod.params.length > 0;

        let paramsHtml = '';
        if (hasParams) {
            paramsHtml = `
                <div class="ml-detail-section">
                    <div class="ml-detail-label">参数列表（默认值蓝色，修改后变黄色）</div>
                    <div class="ml-detail-params">
                        ${mod.params.map(p => {
                            const curVal = mod.currentParams.hasOwnProperty(p.name) ? mod.currentParams[p.name] : p.default;
                            let displayVal = curVal;
                            let typeLabel = '文本';
                            if (p.type === 'boolean') {
                                displayVal = curVal === 'true' ? 'ON (开)' : 'OFF (关)';
                                typeLabel = '开关';
                            } else if (p.type === 'number') {
                                typeLabel = '数值';
                            } else if (p.type === 'select') {
                                typeLabel = '单选';
                            } else if (p.type === 'color') {
                                typeLabel = '颜色';
                            } else if (isNoteType(p.type)) {
                                typeLabel = '长文本';
                                // 截断显示过长的值
                                if (String(displayVal).length > 40) {
                                    displayVal = String(displayVal).substring(0, 40) + '...';
                                }
                            } else if (isDatabaseType(p.type)) {
                                const dbMapping = DB_TYPE_MAP[p.type];
                                typeLabel = dbMapping ? dbMapping.label : p.type;
                                // 尝试显示名称而非 ID
                                const dbArray = getDatabaseArray(p.type);
                                if (dbArray) {
                                    const id = Number(curVal);
                                    if (id > 0 && id < dbArray.length && dbArray[id] && dbArray[id].name) {
                                        displayVal = `${curVal}: ${dbArray[id].name}`;
                                    }
                                }
                            } else if (p.type === 'struct') {
                                // 阶段2新增：struct 类型在详情页显示为摘要
                                typeLabel = '结构体';
                                try {
                                    const obj = typeof curVal === 'string' ? JSON.parse(curVal) : curVal;
                                    const keys = Object.keys(obj || {});
                                    displayVal = `{${keys.length}字段: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}}`;
                                } catch (e) {
                                    displayVal = String(curVal).substring(0, 40);
                                }
                            } else if (p.type === 'table') {
                                // 阶段2新增：table 类型在详情页显示为行数摘要
                                typeLabel = '表格列表';
                                try {
                                    const arr = typeof curVal === 'string' ? JSON.parse(curVal) : curVal;
                                    displayVal = Array.isArray(arr) ? `${arr.length} 行数据` : String(curVal).substring(0, 40);
                                } catch (e) {
                                    displayVal = String(curVal).substring(0, 40);
                                }
                            }
                            const isModified = curVal !== p.default;
                            return `
                                <div class="ml-detail-param-row">
                                    <span class="ml-detail-param-name">${escapeHtml(p.text || p.name)}</span>
                                    <span class="ml-detail-param-value" ${isModified ? 'style="color:var(--ml-warning)"' : ''}>${escapeHtml(String(displayVal))}</span>
                                    <span class="ml-detail-param-type">${typeLabel}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        let metaHtml = '';
        if (mod.version) {
            metaHtml += `
                <div class="ml-detail-section">
                    <div class="ml-detail-label">版本</div>
                    <div class="ml-detail-value">${escapeHtml(mod.version)}</div>
                </div>
            `;
        }
        if (mod.base) {
            metaHtml += `
                <div class="ml-detail-section">
                    <div class="ml-detail-label">依赖基础(没有将奔溃报错!)</div>
                    <div class="ml-detail-value">${escapeHtml(mod.base)}</div>
                </div>
            `;
        }
        if (mod.orderAfter) {
            metaHtml += `
                <div class="ml-detail-section">
                    <div class="ml-detail-label">加载在下述插件之下(否则会出现BUG)</div>
                    <div class="ml-detail-value">${escapeHtml(mod.orderAfter)}</div>
                </div>
            `;
        }
        if (mod.orderBefore) {
            metaHtml += `
                <div class="ml-detail-section">
                    <div class="ml-detail-label">加载在下述插件之上(否则会出现BUG)</div>
                    <div class="ml-detail-value">${escapeHtml(mod.orderBefore)}</div>
                </div>
            `;
        }

        panel.innerHTML = `
            <div class="ml-detail-section">
                <div class="ml-detail-label">模组名称</div>
                <div class="ml-detail-value">${parseColorTagsFromRaw(mod.displayName)}</div>
            </div>
            <div class="ml-detail-section">
                <div class="ml-detail-label">作者</div>
                <div class="ml-detail-value">${escapeHtml(mod.author || '未知')}</div>
            </div>
            ${metaHtml}
            <div class="ml-detail-section">
                <div class="ml-detail-label">状态</div>
                <div class="ml-detail-value">
                    <span class="ml-badge ${mod.status ? 'ml-badge-success' : 'ml-badge-danger'}" style="${mod.status ? '' : 'background:var(--ml-danger-bg);color:var(--ml-danger);'}">
                        ${mod.status ? '已启用' : '已禁用'}
                    </span>
                </div>
            </div>
            ${paramsHtml}
            <div class="ml-detail-section">
                <div class="ml-detail-label">帮助说明</div>
                <div class="ml-detail-help">${parseColorTagsFromRaw(mod.help || '无帮助信息')}</div>
            </div>
        `;
        
        // 切换时滚动条重置到最顶部
        panel.scrollTop = 0;
    }

    /**
     * 更新计数
     */
    function updateCounts() {
        const enabledEl = document.getElementById('ml-enabled-count');
        const totalEl = document.getElementById('ml-total-count');
        if (enabledEl) {
            const count = _modData.filter(m => m.status).length;
            enabledEl.textContent = `已启用: ${count}`;
        }
        if (totalEl) {
            totalEl.textContent = `总计: ${_modData.length}`;
        }
    }

    /**
     * 更新重启提示
     */
    function updateRestartHint() {
        const hint = document.getElementById('ml-restart-hint');
        if (hint) {
            hint.classList.toggle('hidden', !_needsRestart);
        }
    }

    /**
     * 更新保存按钮状态和未保存提示
     */
    function updateSaveButton() {
        const saveBtn = document.getElementById('ml-btn-save');
        const unsavedHint = document.getElementById('ml-unsaved-indicator');
        if (saveBtn) {
            saveBtn.disabled = !_hasUnsavedChanges;
        }
        if (unsavedHint) {
            unsavedHint.classList.toggle('hidden', !_hasUnsavedChanges);
        }
    }

    /**
     * 保存所有修改
     */
    function saveAllChanges() {
        const config = loadConfig();
        _modData.forEach(mod => {
            config[mod.id] = {
                status: mod.status,
                params: mod.currentParams,
                order: mod.order
            };
        });
        saveConfig(config);
        updatePluginsJs(_modData);
        _needsRestart = true;
        _hasUnsavedChanges = false;
        updateRestartHint();
        updateSaveButton();
        log(3, "所有修改已保存");
        try {
            if (typeof SoundManager !== 'undefined') SoundManager.playOk();
        } catch (e) { /* 忽略 */ }
    }

    /**
     * 尝试关闭管理器（检查未保存）
     */
    function tryCloseModManager() {
        if (_hasUnsavedChanges) {
            showConfirmDialog(
                "确认关闭",
                "您有未保存的修改，是否继续关闭？\n（关闭后修改将丢失）",
                [
                    { text: "取消", class: "ml-btn-secondary", action: hideConfirmDialog },
                    { text: "关闭不保存", class: "ml-btn-danger", action: () => { hideConfirmDialog(); hideModManager(); } }
                ]
            );
        } else {
            hideModManager();
        }
    }

    /**
     * 显示确认对话框
     */
    function showConfirmDialog(title, message, buttons) {
        if (_confirmModal) return;
        
        _confirmModal = document.createElement('div');
        _confirmModal.className = 'ml-modal-overlay';
        _confirmModal.innerHTML = `
            <div class="ml-modal" style="width: 420px;">
                <div class="ml-modal-header">
                    <h3>${escapeHtml(title)}</h3>
                </div>
                <div class="ml-modal-body">
                    <p style="white-space: pre-line; margin: 0;">${escapeHtml(message)}</p>
                </div>
                <div class="ml-modal-footer" style="justify-content: flex-end;">
                    ${buttons.map((btn, idx) => `
                        <button class="ml-btn ${btn.class || 'ml-btn-secondary'}" data-action="${idx}">
                            ${escapeHtml(btn.text)}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        _confirmModal.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (actionBtn) {
                const idx = parseInt(actionBtn.dataset.action);
                if (buttons[idx] && buttons[idx].action) {
                    buttons[idx].action();
                }
            }
        });
        
        document.body.appendChild(_confirmModal);
    }

    /**
     * 隐藏确认对话框
     */
    function hideConfirmDialog() {
        if (_confirmModal) {
            _confirmModal.remove();
            _confirmModal = null;
        }
    }
    
    /**
     * 切换拖拽功能
     */
    function updateButtonStates() {
        const btnSort = document.getElementById('ml-btn-sort');
        const btnDelete = document.getElementById('ml-btn-delete');
        
        // 更新排序按钮
        btnSort.textContent = _dragEnabled ? '可拖拽排序' : '排序Mod';
        btnSort.classList.remove('ml-btn-secondary');
        if (_dragEnabled) {
            btnSort.style.backgroundColor = 'var(--ml-success)';
            btnSort.style.color = 'white';
        } else {
            btnSort.classList.add('ml-btn-secondary');
            btnSort.style.backgroundColor = '';
            btnSort.style.color = '';
        }
        
        // 更新删除按钮
        btnDelete.textContent = _deleteMode ? '可删除Mod' : '删除mod';
        btnDelete.classList.remove('ml-btn-secondary');
        if (_deleteMode) {
            btnDelete.style.backgroundColor = 'var(--ml-danger)';
            btnDelete.style.color = 'white';
        } else {
            btnDelete.classList.add('ml-btn-secondary');
            btnDelete.style.backgroundColor = '';
            btnDelete.style.color = '';
        }
    }

    function toggleDrag() {
        _dragEnabled = !_dragEnabled;
        updateButtonStates();
        
        // 重新渲染列表（切换输入框/纯文本显示）
        renderModList();
        
        log(3, "拖拽功能", _dragEnabled ? "已启用" : "已禁用");
    }

    // ========== 拖拽排序功能 ==========
    
    /**
     * 开始拖拽
     */
    function handleDragStart(e) {
        // 检查拖拽是否启用
        if (!_dragEnabled) {
            e.preventDefault();
            return;
        }
        const item = e.target.closest('.ml-mod-item');
        if (!item) return;
        _draggedIndex = parseInt(item.dataset.index);
        _dropPosition = null;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    /**
     * 拖拽经过
     */
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (!_dragEnabled) return;
        
        const item = e.target.closest('.ml-mod-item');
        if (!item) return;
        
        const index = parseInt(item.dataset.index);
        if (index === _draggedIndex) {
            // 拖拽到自己，清除所有样式
            document.querySelectorAll('.ml-mod-item.drag-over, .ml-mod-item.drag-over-top, .ml-mod-item.drag-over-bottom').forEach(el => {
                el.classList.remove('drag-over', 'drag-over-top', 'drag-over-bottom');
            });
            _dropPosition = null;
            return;
        }
        
        // 计算鼠标在目标元素的 Y 位置，判断是上半部分还是下半部分
        const rect = item.getBoundingClientRect();
        const mouseY = e.clientY;
        const midY = rect.top + rect.height / 2;
        
        // 清除其他元素的样式
        document.querySelectorAll('.ml-mod-item.drag-over, .ml-mod-item.drag-over-top, .ml-mod-item.drag-over-bottom').forEach(el => {
            el.classList.remove('drag-over', 'drag-over-top', 'drag-over-bottom');
        });
        
        // 设置对应的位置和样式
        if (mouseY < midY) {
            _dropPosition = 'before';
            item.classList.add('drag-over-top');
        } else {
            _dropPosition = 'after';
            item.classList.add('drag-over-bottom');
        }
    }

    /**
     * 拖拽离开
     */
    function handleDragLeave(e) {
        const item = e.target.closest('.ml-mod-item');
        if (item) {
            item.classList.remove('drag-over', 'drag-over-top', 'drag-over-bottom');
        }
    }

    /**
     * 放下
     */
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!_dragEnabled) return;
        
        const item = e.target.closest('.ml-mod-item');
        if (!item || _draggedIndex === null || _dropPosition === null) return;
        
        const dropIndex = parseInt(item.dataset.index);
        if (dropIndex === _draggedIndex) return;
        
        // 根据位置确定插入点
        let insertIndex = _dropPosition === 'before' ? dropIndex : dropIndex + 1;
        // 如果被拖拽的元素在插入位置前面，索引要减一
        if (_draggedIndex < insertIndex) {
            insertIndex--;
        }
        
        // 移动元素
        const draggedMod = _modData[_draggedIndex];
        _modData.splice(_draggedIndex, 1);
        _modData.splice(insertIndex, 0, draggedMod);
        
        // 重新分配序号
        reassignOrders();
        _hasUnsavedChanges = true;
        updateSaveButton();
        
        // 重新渲染
        renderModList();
        renderDetail(_modData[insertIndex]);
        _selectedIndex = insertIndex;
        
        log(3, "排序已更新");
    }

    /**
     * 拖拽结束
     */
    function handleDragEnd(e) {
        _draggedIndex = null;
        _dropPosition = null;
        document.querySelectorAll('.ml-mod-item.dragging, .ml-mod-item.drag-over, .ml-mod-item.drag-over-top, .ml-mod-item.drag-over-bottom').forEach(el => {
            el.classList.remove('dragging', 'drag-over', 'drag-over-top', 'drag-over-bottom');
        });
    }

    // ========== 序号编辑功能 ==========
    
    /**
     * 序号输入事件
     */
    function handleOrderInput(e) {
        if (!e.target.classList.contains('ml-order-input')) return;
        // 只记录输入，不立即处理
    }

    /**
     * 序号失焦事件
     */
    function handleOrderBlur(e) {
        if (!e.target.classList.contains('ml-order-input')) return;
        processOrderInput(e.target);
    }

    /**
     * 序号键盘事件
     */
    function handleOrderKeydown(e) {
        if (!e.target.classList.contains('ml-order-input')) return;
        
        if (e.key === 'Enter') {
            e.preventDefault();
            processOrderInput(e.target);
            e.target.blur();
        } else if (e.key === 'Escape') {
            e.target.blur();
        }
    }

    /**
     * 处理序号输入
     */
    function processOrderInput(inputEl) {
        const index = parseInt(inputEl.dataset.index);
        let newOrder = parseInt(inputEl.value);
        
        // 验证输入
        if (isNaN(newOrder) || newOrder < 1 || newOrder > _modData.length) {
            // 恢复原值
            inputEl.value = _modData[index].order;
            return;
        }
        
        const currentMod = _modData[index];
        if (currentMod.order === newOrder) return;
        
        // 移除当前元素
        _modData.splice(index, 1);
        // 插入到新位置
        _modData.splice(newOrder - 1, 0, currentMod);
        
        // 重新分配序号
        reassignOrders();
        _hasUnsavedChanges = true;
        updateSaveButton();
        
        // 重新渲染
        renderModList();
        renderDetail(_modData[newOrder - 1]);
        _selectedIndex = newOrder - 1;
        
        log(3, "序号已更新:", currentMod.displayName, "→", newOrder);
    }

    // ================================================================
    // 8. DOM 参数编辑器
    // ================================================================

    /**
     * 键盘事件捕获监听器 - 在捕获阶段阻止事件传播到 RMMZ
     */
    function keyboardCaptureHandler(e) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && 
            (activeElement.tagName === 'INPUT' || 
             activeElement.tagName === 'TEXTAREA' || 
             activeElement.tagName === 'SELECT');
        
        if (isInputFocused) {
            // 有输入框获得焦点时，阻止事件传播，让浏览器正常处理
            e.stopPropagation();
            e.stopImmediatePropagation();
            // 注意：不调用 preventDefault()，让输入框能正常工作
        }
    }

    // ====================================================================
    // 阶段2新增：struct 递归渲染函数
    // ====================================================================

    /**
     * 递归渲染 struct 的子字段
     * @param {object} field - Schema 子字段定义 { name, type, text, default, min, max, step, options, schema, schemaFields }
     * @param {string|any} curVal - 当前值
     * @param {number} depth - 嵌套深度（1=顶层, 2=一级嵌套, ...）
     * @param {string} parentPath - 父级参数路径，用于 data 属性定位
     * @returns {HTMLElement} - 渲染好的 DOM 元素
     */
    function renderStructField(field, curVal, depth, parentPath) {
        const group = document.createElement('div');
        group.className = 'ml-form-group ml-struct-field';
        group.setAttribute('data-field-name', field.name);
        group.setAttribute('data-field-type', field.type);
        group.setAttribute('data-field-path', parentPath + '.' + field.name);

        const fieldLabel = field.text || field.name;

        if (field.type === 'struct' && field.schema) {
            // ---- 嵌套 struct：递归渲染 ----
            const subSchemaFields = _schemaDictionary[field.schema] || field.schemaFields || [];
            let structObj = {};
            try {
                structObj = typeof curVal === 'string' ? JSON.parse(curVal) : (curVal || {});
            } catch (e) {
                try { structObj = JSON.parse(field.default || '{}'); } catch (e2) { structObj = {}; }
            }

            const clampedDepth = Math.min(depth, 3); // CSS class 最多到 depth-3
            const details = document.createElement('details');
            details.open = true;
            details.className = `ml-struct-details ml-struct-depth-${clampedDepth}`;
            details.setAttribute('data-param-name', field.name);
            details.setAttribute('data-param-type', 'struct');
            details.setAttribute('data-field-path', parentPath + '.' + field.name);

            const summary = document.createElement('summary');
            summary.className = 'ml-struct-summary';
            summary.textContent = fieldLabel;
            details.appendChild(summary);

            const structBody = document.createElement('div');
            structBody.className = 'ml-struct-body';
            structBody.setAttribute('data-struct-param', field.name);

            subSchemaFields.forEach(subField => {
                const subVal = structObj[subField.name] !== undefined ? structObj[subField.name] : (subField.default !== undefined ? subField.default : '');
                const subGroup = renderStructField(subField, subVal, depth + 1, parentPath + '.' + field.name);
                structBody.appendChild(subGroup);
            });

            details.appendChild(structBody);
            group.appendChild(details);

            log(3, `[struct] 递归渲染嵌套字段 "${field.name}", 深度: ${depth}, 子字段数: ${subSchemaFields.length}`);

        } else if (field.type === 'boolean') {
            // ---- 布尔类型：拨动开关 ----
            const isOn = curVal === 'true' || curVal === true;
            group.innerHTML = `
                <div class="ml-form-label">
                    ${escapeHtml(fieldLabel)}
                    <span class="ml-form-label-type">开关</span>
                </div>
                <label class="ml-form-switch">
                    <input type="checkbox" data-field-name="${escapeHtml(field.name)}" data-field-path="${escapeHtml(parentPath + '.' + field.name)}" ${isOn ? 'checked' : ''}>
                    <span class="ml-form-switch-slider"></span>
                </label>
            `;

        } else if (field.type === 'number') {
            // ---- 数值类型：短输入框（struct 内禁用滑动条） ----
            group.innerHTML = `
                <div class="ml-form-label">
                    ${escapeHtml(fieldLabel)}
                    <span class="ml-form-label-type">数值</span>
                </div>
                <input type="number" class="ml-form-input ml-struct-input"
                       data-field-name="${escapeHtml(field.name)}"
                       data-field-path="${escapeHtml(parentPath + '.' + field.name)}"
                       value="${escapeHtml(String(curVal !== undefined && curVal !== '' ? curVal : (field.default || '0')))}"
                       ${field.min !== undefined ? `min="${field.min}"` : ''}
                       ${field.max !== undefined ? `max="${field.max}"` : ''}
                       step="${field.step || 1}">
            `;
            // ---- 通用验证绑定 ----
            setTimeout(() => {
                const numInput = group.querySelector('input[type="number"]');
                if (numInput) {
                    bindNumberValidation(numInput, {
                        min: field.min,
                        max: field.max,
                        fallback: field.default || '0'
                    });
                    log(3, `[struct-validate] 已为数值字段 "${field.name}" 绑定 blur 验证`);
                }
            }, 0);

        } else if (field.type === 'color') {
            // ---- 颜色类型 ----
            const colorVal = String(curVal || field.default || '#ffffff');
            group.innerHTML = `
                <div class="ml-form-label">
                    ${escapeHtml(fieldLabel)}
                    <span class="ml-form-label-type">颜色</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center;">
                    <input type="color" data-field-name="${escapeHtml(field.name)}" data-field-path="${escapeHtml(parentPath + '.' + field.name)}"
                           value="${colorVal.startsWith('#') ? colorVal : '#ffffff'}"
                           style="width:36px;height:28px;border:none;cursor:pointer;padding:0;">
                    <input type="text" class="ml-form-input ml-struct-input"
                           data-field-name="${escapeHtml(field.name)}" data-field-path="${escapeHtml(parentPath + '.' + field.name)}"
                           value="${escapeHtml(colorVal)}" style="flex:1;" placeholder="#RRGGBB">
                </div>
            `;
            // ---- 通用验证绑定 ----
            setTimeout(() => {
                const colorPicker = group.querySelector('input[type="color"]');
                const textInput = group.querySelector('input[type="text"]');
                if (textInput) {
                    bindColorValidation(textInput, colorPicker, field.default || '#ffffff');
                    log(3, `[struct-validate] 已为颜色字段 "${field.name}" 绑定 blur 验证`);
                }
            }, 0);

        } else if (field.type === 'select') {
            // ---- 下拉选择类型 ----
            let optionsHtml = '';
            if (field.options && field.options.length > 0) {
                field.options.forEach(opt => {
                    const selected = String(opt) === String(curVal) ? ' selected' : '';
                    optionsHtml += `<option value="${escapeHtml(opt)}"${selected}>${escapeHtml(opt)}</option>`;
                });
            }
            group.innerHTML = `
                <div class="ml-form-label">
                    ${escapeHtml(fieldLabel)}
                    <span class="ml-form-label-type">选择</span>
                </div>
                <select class="ml-form-select ml-struct-select"
                        data-field-name="${escapeHtml(field.name)}"
                        data-field-path="${escapeHtml(parentPath + '.' + field.name)}">
                    ${optionsHtml}
                </select>
            `;

        } else if (isDatabaseType(field.type)) {
            // ---- 数据库引用类型 ----
            const dbArray = getDatabaseArray(field.type);
            const dbMapping = DB_TYPE_MAP[field.type];
            const dbLabel = dbMapping ? dbMapping.label : field.type;

            if (dbArray) {
                let optionsHtml = '<option value="" style="color:var(--ml-text-muted);">-- 无 --</option>';
                for (let i = 1; i < dbArray.length; i++) {
                    const entry = dbArray[i];
                    if (entry && entry.name && entry.name.trim() !== '') {
                        const selected = String(i) === String(curVal) ? ' selected' : '';
                        optionsHtml += `<option value="${i}"${selected}>${i}: ${escapeHtml(entry.name)}</option>`;
                    }
                }
                group.innerHTML = `
                    <div class="ml-form-label">
                        ${escapeHtml(fieldLabel)}
                        <span class="ml-form-label-type">${dbLabel}</span>
                    </div>
                    <select class="ml-form-select ml-struct-select"
                            data-field-name="${escapeHtml(field.name)}"
                            data-field-path="${escapeHtml(parentPath + '.' + field.name)}">
                        ${optionsHtml}
                    </select>
                `;
            } else {
                // 降级为文本输入
                group.innerHTML = `
                    <div class="ml-form-label">
                        ${escapeHtml(fieldLabel)}
                        <span class="ml-form-label-type">${dbLabel} (文本降级)</span>
                    </div>
                    <input type="text" class="ml-form-input ml-struct-input"
                           data-field-name="${escapeHtml(field.name)}"
                           data-field-path="${escapeHtml(parentPath + '.' + field.name)}"
                           value="${escapeHtml(String(curVal || field.default || ''))}"
                           placeholder="输入${dbLabel}ID">
                `;
                // ---- 通用文本验证绑定（含 XSS 防护） ----
                setTimeout(() => {
                    const textInput = group.querySelector('input[type="text"]');
                    if (textInput) {
                        bindTextValidation(textInput, field.default || '');
                        log(3, `[struct-validate] 已为数据库降级文本字段 "${field.name}" 绑定 blur 验证`);
                    }
                }, 0);
            }

        } else {
            // ---- 默认：文本输入 ----
            group.innerHTML = `
                <div class="ml-form-label">
                    ${escapeHtml(fieldLabel)}
                    <span class="ml-form-label-type">文本</span>
                </div>
                <input type="text" class="ml-form-input ml-struct-input"
                       data-field-name="${escapeHtml(field.name)}"
                       data-field-path="${escapeHtml(parentPath + '.' + field.name)}"
                       value="${escapeHtml(String(curVal !== undefined && curVal !== '' ? curVal : (field.default || '')))}">
            `;
            // ---- 通用文本验证绑定（含 XSS 防护） ----
            setTimeout(() => {
                const textInput = group.querySelector('input[type="text"]');
                if (textInput) {
                    bindTextValidation(textInput, field.default || '');
                    log(3, `[struct-validate] 已为文本字段 "${field.name}" 绑定 blur 验证`);
                }
            }, 0);
        }

        if (field.desc) {
            const descDiv = document.createElement('div');
            descDiv.className = 'ml-form-desc';
            descDiv.textContent = field.desc;
            group.appendChild(descDiv);
        }

        return group;
    }

    // ====================================================================
    // 阶段2新增：table 行创建函数
    // ====================================================================

    /**
     * 创建表格的一行（<tr>）
     * @param {HTMLTableSectionElement} tbody - 表体元素，用于行移动操作
     * @param {Array} schemaFields - Schema 子字段定义
     * @param {object} rowData - 当前行数据
     * @param {string} paramName - 所属参数名
     * @returns {HTMLTableRowElement} - 渲染好的 <tr> 元素
     */
    function createTableRow(tbody, schemaFields, rowData, paramName) {
        const tr = document.createElement('tr');
        tr.className = 'ml-table-row';
        tr.setAttribute('data-table-param', paramName);

        // 收集需要延迟绑定验证的元素
        const pendingValidations = [];

        schemaFields.forEach(field => {
            const td = document.createElement('td');
            td.className = 'ml-table-cell';
            td.setAttribute('data-field-name', field.name);
            td.setAttribute('data-field-type', field.type);

            const cellValue = rowData[field.name] !== undefined ? rowData[field.name] : (field.default !== undefined ? field.default : '');

            // ---- 严禁在 table 的 schema 中嵌套 struct 或 note ----
            if (field.type === 'struct' || field.type === 'note' || field.type === 'multiline_string') {
                // 降级为只读文本提示
                td.innerHTML = `<span class="ml-table-readonly" title="表格内不支持嵌套结构体/长文本">${escapeHtml(String(cellValue))}</span>`;
                log(2, `[table] 字段 "${field.name}" 类型为 ${field.type}，在表格中降级为只读`);
            } else if (field.type === 'boolean') {
                // 微型拨动开关
                const isOn = cellValue === 'true' || cellValue === true;
                td.innerHTML = `
                    <label class="ml-form-switch ml-table-switch">
                        <input type="checkbox" data-field-name="${escapeHtml(field.name)}" ${isOn ? 'checked' : ''}>
                        <span class="ml-form-switch-slider"></span>
                    </label>
                `;
            } else if (field.type === 'number') {
                // 微型数值输入框（禁用滑动条）
                td.innerHTML = `
                    <input type="number" class="ml-table-input ml-table-number"
                           data-field-name="${escapeHtml(field.name)}"
                           value="${escapeHtml(String(cellValue || '0'))}"
                           ${field.min !== undefined ? `min="${field.min}"` : ''}
                           ${field.max !== undefined ? `max="${field.max}"` : ''}
                           step="${field.step || 1}">
                `;
                // ---- 延迟绑定数值验证 ----
                pendingValidations.push({ type: 'number', td, field });

            } else if (field.type === 'color') {
                // 微型色块（表格内仅用 color picker，不配文本框）
                const colorVal = String(cellValue || field.default || '#ffffff');
                td.innerHTML = `
                    <input type="color" class="ml-table-color"
                           data-field-name="${escapeHtml(field.name)}"
                           value="${colorVal.startsWith('#') ? colorVal : '#ffffff'}">
                `;
                // 表格内颜色选择器自带浏览器验证，无需额外 blur 验证

            } else if (field.type === 'select') {
                // 微型下拉框
                let optionsHtml = '';
                if (field.options && field.options.length > 0) {
                    field.options.forEach(opt => {
                        const selected = String(opt) === String(cellValue) ? ' selected' : '';
                        optionsHtml += `<option value="${escapeHtml(opt)}"${selected}>${escapeHtml(opt)}</option>`;
                    });
                }
                td.innerHTML = `
                    <select class="ml-table-select" data-field-name="${escapeHtml(field.name)}">
                        ${optionsHtml}
                    </select>
                `;
            } else if (isDatabaseType(field.type)) {
                // 微型数据库下拉框
                const dbArray = getDatabaseArray(field.type);
                if (dbArray) {
                    let optionsHtml = '<option value="">--</option>';
                    for (let i = 1; i < dbArray.length; i++) {
                        const entry = dbArray[i];
                        if (entry && entry.name && entry.name.trim() !== '') {
                            const selected = String(i) === String(cellValue) ? ' selected' : '';
                            optionsHtml += `<option value="${i}"${selected}>${i}:${escapeHtml(entry.name)}</option>`;
                        }
                    }
                    td.innerHTML = `
                        <select class="ml-table-select" data-field-name="${escapeHtml(field.name)}">
                            ${optionsHtml}
                        </select>
                    `;
                } else {
                    td.innerHTML = `
                        <input type="text" class="ml-table-input"
                               data-field-name="${escapeHtml(field.name)}"
                               value="${escapeHtml(String(cellValue))}">
                    `;
                    // ---- 延迟绑定文本验证（含 XSS 防护） ----
                    pendingValidations.push({ type: 'text', td, field });
                }
            } else {
                // 默认：短文本输入框
                td.innerHTML = `
                    <input type="text" class="ml-table-input"
                           data-field-name="${escapeHtml(field.name)}"
                           value="${escapeHtml(String(cellValue))}">
                `;
                // ---- 延迟绑定文本验证（含 XSS 防护） ----
                pendingValidations.push({ type: 'text', td, field });
            }

            tr.appendChild(td);
        });

        // 操作列：上移、下移、删除
        const actionTd = document.createElement('td');
        actionTd.className = 'ml-table-cell ml-table-action-cell';

        const moveUpBtn = document.createElement('button');
        moveUpBtn.className = 'ml-table-action-btn';
        moveUpBtn.textContent = '▲';
        moveUpBtn.title = '上移';
        moveUpBtn.addEventListener('click', () => {
            const prev = tr.previousElementSibling;
            if (prev) {
                tbody.insertBefore(tr, prev);
                log(3, `[table] 行上移`);
            }
        });

        const moveDownBtn = document.createElement('button');
        moveDownBtn.className = 'ml-table-action-btn';
        moveDownBtn.textContent = '▼';
        moveDownBtn.title = '下移';
        moveDownBtn.addEventListener('click', () => {
            const next = tr.nextElementSibling;
            if (next) {
                tbody.insertBefore(next, tr);
                log(3, `[table] 行下移`);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'ml-table-action-btn ml-table-delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.title = '删除';
        deleteBtn.addEventListener('click', () => {
            tr.remove();
            log(3, `[table] 行删除`);
        });

        actionTd.appendChild(moveUpBtn);
        actionTd.appendChild(moveDownBtn);
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);

        // ---- 延迟绑定验证事件（确保 DOM 已插入） ----
        setTimeout(() => {
            for (const pv of pendingValidations) {
                if (pv.type === 'number') {
                    const numInput = pv.td.querySelector('input[type="number"]');
                    if (numInput) {
                        bindNumberValidation(numInput, {
                            min: pv.field.min,
                            max: pv.field.max,
                            fallback: pv.field.default || '0'
                        });
                        log(3, `[table-validate] 已为数值单元格 "${pv.field.name}" 绑定 blur 验证`);
                    }
                } else if (pv.type === 'text') {
                    const textInput = pv.td.querySelector('input[type="text"]');
                    if (textInput) {
                        bindTextValidation(textInput, pv.field.default || '');
                        log(3, `[table-validate] 已为文本单元格 "${pv.field.name}" 绑定 blur 验证`);
                    }
                }
            }
        }, 0);

        return tr;
    }

    // ====================================================================
    // 阶段2新增：struct 数据收集函数
    // ====================================================================

    /**
     * 从 struct 的 DOM 容器中收集子字段值，返回 JS 对象
     * @param {HTMLElement} structBody - struct-body 容器元素
     * @returns {object} - 收集到的对象
     */
    function collectStructData(structBody) {
        const obj = {};
        const fieldGroups = structBody.querySelectorAll(':scope > .ml-struct-field');
        fieldGroups.forEach(fg => {
            const fieldName = fg.getAttribute('data-field-name');
            const fieldType = fg.getAttribute('data-field-type');

            if (fieldType === 'struct') {
                // 递归收集嵌套 struct
                const subDetails = fg.querySelector(':scope > .ml-struct-details');
                if (subDetails) {
                    const subBody = subDetails.querySelector(':scope > .ml-struct-body');
                    if (subBody) {
                        obj[fieldName] = JSON.stringify(collectStructData(subBody));
                    }
                }
            } else if (fieldType === 'boolean') {
                const checkbox = fg.querySelector('input[type="checkbox"]');
                obj[fieldName] = checkbox ? String(checkbox.checked) : 'false';
            } else if (fieldType === 'number') {
                const input = fg.querySelector('input[type="number"]');
                obj[fieldName] = input ? input.value : '0';
            } else if (fieldType === 'color') {
                const colorInput = fg.querySelector('input[type="color"]');
                const textInput = fg.querySelector('input[type="text"]');
                obj[fieldName] = textInput ? textInput.value : (colorInput ? colorInput.value : '#ffffff');
            } else if (fieldType === 'select' || isDatabaseType(fieldType)) {
                const select = fg.querySelector('select');
                obj[fieldName] = select ? select.value : '';
            } else {
                // 文本等默认类型 —— 收集时进行 XSS 净化
                const input = fg.querySelector('input[type="text"]');
                const rawVal = input ? input.value : '';
                obj[fieldName] = sanitizeText(rawVal);
            }
        });
        return obj;
    }

    // ====================================================================
    // 阶段2新增：table 数据收集函数
    // ====================================================================

    /**
     * 从 table 的 tbody 中收集所有行数据
     * 返回双重转义 JSON 数组：JSON.stringify([JSON.stringify(row1), JSON.stringify(row2), ...])
     * @param {HTMLTableSectionElement} tbody - 表体元素
     * @param {Array} schemaFields - Schema 子字段定义
     * @returns {string} - 双重转义的 JSON 字符串
     */
    function collectTableData(tbody, schemaFields) {
        const rows = tbody.querySelectorAll(':scope > tr.ml-table-row');
        const arr = [];
        rows.forEach(tr => {
            const rowObj = {};
            schemaFields.forEach(field => {
                const td = tr.querySelector(`td[data-field-name="${field.name}"]`);
                if (!td) return;

                if (field.type === 'struct' || field.type === 'note' || field.type === 'multiline_string') {
                    // 只读字段，跳过或使用原始值
                    const span = td.querySelector('.ml-table-readonly');
                    rowObj[field.name] = span ? span.textContent : '';
                } else if (field.type === 'boolean') {
                    const checkbox = td.querySelector('input[type="checkbox"]');
                    rowObj[field.name] = checkbox ? String(checkbox.checked) : 'false';
                } else if (field.type === 'number') {
                    const input = td.querySelector('input[type="number"]');
                    rowObj[field.name] = input ? input.value : '0';
                } else if (field.type === 'color') {
                    const colorInput = td.querySelector('input[type="color"]');
                    rowObj[field.name] = colorInput ? colorInput.value : '#ffffff';
                } else if (field.type === 'select' || isDatabaseType(field.type)) {
                    const select = td.querySelector('select');
                    rowObj[field.name] = select ? select.value : '';
                } else {
                    const input = td.querySelector('input[type="text"]');
                    // 收集时进行 XSS 净化
                    const rawVal = input ? input.value : '';
                    rowObj[field.name] = sanitizeText(rawVal);
                }
            });
            // 每行对象 JSON.stringify 后放入数组
            arr.push(JSON.stringify(rowObj));
        });
        // 最终返回 JSON.stringify(数组)
        return JSON.stringify(arr);
    }

    /**
     * 显示参数编辑模态框
     */
    function showParamEditor(mod) {
        if (_modalOverlay) hideParamEditor(); // 防止重复
        
        unbindAllWheelListeners(); // 解绑所有，之后重新绑定主界面的即可
        // 重新绑定主界面滚动容器（因为模态框关闭后可能被清空）
        bindModLoaderScrollContainers();

        // 键盘事件捕获已经在打开管理器时由通用代码处理了，这里不需要再重复添加

        // 创建编辑用的参数副本（取消时不影响原数据）
        const editParams = {};
        mod.params.forEach(p => {
            editParams[p.name] = mod.currentParams.hasOwnProperty(p.name)
                ? mod.currentParams[p.name]
                : p.default;
        });

        _modalOverlay = document.createElement('div');
        _modalOverlay.className = 'ml-modal-overlay';
        _modalOverlay.tabIndex = -1; // 允许获得焦点

        const modal = document.createElement('div');
        modal.className = 'ml-modal';
        modal.tabIndex = -1;

        // 头部
        const header = document.createElement('div');
        header.className = 'ml-modal-header';
        header.innerHTML = `
            <h3>参数编辑 - ${escapeHtml(mod.displayName)}</h3>
            <button class="ml-modal-close" id="ml-modal-close">&times;</button>
        `;

        // 主体
        const body = document.createElement('div');
        body.className = 'ml-modal-body';

        mod.params.forEach(p => {
            const group = document.createElement('div');
            group.className = 'ml-form-group';

            const curVal = editParams[p.name];

            if (p.type === 'boolean') {
                const isOn = curVal === 'true';
                group.innerHTML = `
                    <div class="ml-form-label">
                        ${escapeHtml(p.text || p.name)}
                        <span class="ml-form-label-type">开关</span>
                    </div>
                    <div class="ml-form-toggle-row">
                        <div class="ml-toggle ${isOn ? 'on' : ''}" id="ml-param-${cssEscape(p.name)}">
                            <div class="ml-toggle-thumb"></div>
                        </div>
                        <span class="ml-form-toggle-status ${isOn ? 'on' : 'off'}" id="ml-param-status-${cssEscape(p.name)}">
                            ${isOn ? 'ON (开)' : 'OFF (关)'}
                        </span>
                    </div>
                    ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                `;
                // 绑定切换事件
                setTimeout(() => {
                    const toggleEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                    const statusEl = document.getElementById(`ml-param-status-${cssEscape(p.name)}`);
                    if (toggleEl) {
                        toggleEl.addEventListener('click', () => {
                            const currentVal = editParams[p.name];
                            const newVal = currentVal === 'true' ? 'false' : 'true';
                            editParams[p.name] = newVal;
                            toggleEl.classList.toggle('on', newVal === 'true');
                            if (statusEl) {
                                statusEl.textContent = newVal === 'true' ? 'ON (开)' : 'OFF (关)';
                                statusEl.className = `ml-form-toggle-status ${newVal === 'true' ? 'on' : 'off'}`;
                            }
                        });
                    }
                }, 0);
            } else if (p.type === 'select') {
                group.innerHTML = `
                    <div class="ml-form-label">
                        ${escapeHtml(p.text || p.name)}
                        <span class="ml-form-label-type">单选 (${p.options.length}项)</span>
                    </div>
                    <select class="ml-form-select" id="ml-param-${cssEscape(p.name)}">
                        ${p.options.map(opt =>
                            `<option value="${escapeHtml(opt)}" ${opt === curVal ? 'selected' : ''}>${escapeHtml(opt)}</option>`
                        ).join('')}
                    </select>
                    ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                `;
                setTimeout(() => {
                    const selEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                    if (selEl) {
                        selEl.addEventListener('change', () => {
                            editParams[p.name] = selEl.value;
                        });
                    }
                }, 0);
            } else if (p.type === 'number') {
                const min = p.min !== undefined ? p.min : '';
                const max = p.max !== undefined ? p.max : '';
                const hasMin = p.min !== undefined;
                const hasMax = p.max !== undefined;
                const hasSlider = hasMin && hasMax; // 同时存在 min 和 max 时启用滑动条
                const step = hasSlider ? calculateStep(p) : 1;

                if (hasSlider) {
                    // 升级 UI：滑动条 + 数值显示
                    const sliderVal = Math.min(Math.max(Number(curVal) || 0, p.min), p.max);
                    group.innerHTML = `
                        <div class="ml-form-label">
                            ${escapeHtml(p.text || p.name)}
                            <span class="ml-form-label-type">数值 (${p.min}~${p.max})</span>
                        </div>
                        <div class="ml-form-slider-row">
                            <div class="ml-form-slider-header">
                                <span class="ml-form-slider-value" id="ml-param-display-${cssEscape(p.name)}">${sliderVal}</span>
                            </div>
                            <input type="range" class="ml-form-slider-range"
                                   id="ml-param-slider-${cssEscape(p.name)}"
                                   value="${sliderVal}"
                                   min="${p.min}"
                                   max="${p.max}"
                                   step="${step}">
                            <div class="ml-form-slider-bounds">
                                <span>${p.min}</span>
                                <span>${p.max}</span>
                            </div>
                        </div>
                        <input type="hidden" id="ml-param-${cssEscape(p.name)}" value="${sliderVal}">
                        ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                    `;
                    setTimeout(() => {
                        const sliderEl = document.getElementById(`ml-param-slider-${cssEscape(p.name)}`);
                        const displayEl = document.getElementById(`ml-param-display-${cssEscape(p.name)}`);
                        const hiddenEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);

                        if (sliderEl && displayEl && hiddenEl) {
                            // 滑动条滑动时实时更新文本
                            sliderEl.addEventListener('input', () => {
                                const val = sliderEl.value;
                                displayEl.textContent = val;
                                hiddenEl.value = val;
                                editParams[p.name] = String(val);
                            });

                            // 点击文本，原地替换为 input[type=number]
                            displayEl.addEventListener('click', () => {
                                const currentVal = Number(hiddenEl.value) || 0;
                                const numInput = document.createElement('input');
                                numInput.type = 'number';
                                numInput.className = 'ml-form-slider-number-input';
                                numInput.value = currentVal;
                                numInput.min = p.min;
                                numInput.max = p.max;
                                numInput.step = step;

                                displayEl.style.display = 'none';
                                displayEl.parentNode.insertBefore(numInput, displayEl.nextSibling);
                                numInput.focus();
                                numInput.select();

                                _isInputFocused = true;

                                const finishEdit = () => {
                                    _isInputFocused = false;
                                    // ---- 通用数值验证 ----
                                    const val = validateNumberInput(numInput, {
                                        min: p.min,
                                        max: p.max,
                                        fallback: String(Number(p.default) || p.min)
                                    });
                                    displayEl.textContent = val;
                                    hiddenEl.value = val;
                                    sliderEl.value = val;
                                    editParams[p.name] = val;
                                    numInput.remove();
                                    displayEl.style.display = '';
                                };

                                numInput.addEventListener('blur', finishEdit);
                                numInput.addEventListener('keydown', (e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        numInput.blur();
                                    } else if (e.key === 'Escape') {
                                        e.preventDefault();
                                        numInput.value = currentVal;
                                        numInput.blur();
                                    }
                                });
                            });
                        }
                    }, 0);
                } else {
                    // 原有渲染逻辑：无滑动条，保持不变
                    group.innerHTML = `
                        <div class="ml-form-label">
                            ${escapeHtml(p.text || p.name)}
                            <span class="ml-form-label-type">数值${hasMin || hasMax ? ` (${hasMin ? p.min : '...'}~${hasMax ? p.max : '...'})` : ''}</span>
                        </div>
                        <div class="ml-form-number-row">
                            <button class="ml-form-number-btn ml-form-min-btn ${!hasMin ? 'disabled' : ''}"
                                    data-action="min"
                                    data-param="${escapeHtml(p.name)}"
                                    ${!hasMin ? 'disabled' : ''}>
                                ${hasMin ? `Min (${p.min})` : 'Min'}
                            </button>

                            <input type="number" class="ml-form-input ml-form-number-input"
                                   id="ml-param-${cssEscape(p.name)}"
                                   value="${escapeHtml(String(curVal))}"
                                   ${hasMin ? `min="${p.min}"` : ''}
                                   ${hasMax ? `max="${p.max}"` : ''}
                                   step="1">

                            <button class="ml-form-number-btn ml-form-max-btn ${!hasMax ? 'disabled' : ''}"
                                    data-action="max"
                                    data-param="${escapeHtml(p.name)}"
                                    ${!hasMax ? 'disabled' : ''}>
                                ${hasMax ? `Max (${p.max})` : 'Max'}
                            </button>
                        </div>
                        ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                    `;
                    setTimeout(() => {
                        const inputEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                        if (inputEl) {
                            inputEl.addEventListener('focus', () => {
                                _isInputFocused = true;
                            });
                            inputEl.addEventListener('blur', () => {
                                _isInputFocused = false;
                                // ---- 通用数值验证 ----
                                const val = validateNumberInput(inputEl, {
                                    min: hasMin ? p.min : undefined,
                                    max: hasMax ? p.max : undefined,
                                    fallback: p.default
                                });
                                editParams[p.name] = val;
                            });

                            inputEl.addEventListener('input', () => {
                                let num = Number(inputEl.value);
                                if (!isNaN(num)) {
                                    if (hasMin && num < p.min) num = p.min;
                                    if (hasMax && num > p.max) num = p.max;
                                    editParams[p.name] = String(num);
                                }
                            });
                        }
                        const minBtn = group.querySelector('[data-action="min"]');
                        const maxBtn = group.querySelector('[data-action="max"]');
                        if (minBtn) {
                            minBtn.addEventListener('click', () => {
                                if (hasMin) {
                                    editParams[p.name] = String(p.min);
                                    if (inputEl) inputEl.value = p.min;
                                }
                            });
                        }
                        if (maxBtn) {
                            maxBtn.addEventListener('click', () => {
                                if (hasMax) {
                                    editParams[p.name] = String(p.max);
                                    if (inputEl) inputEl.value = p.max;
                                }
                            });
                        }
                    }, 0);
                }
            } else if (p.type === 'color') {
                // 颜色类型
                group.innerHTML = `
                    <div class="ml-form-label">
                        ${escapeHtml(p.text || p.name)}
                        <span class="ml-form-label-type">颜色</span>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input type="color" 
                               id="ml-param-${cssEscape(p.name)}-color"
                               value="${escapeHtml(String(curVal)).startsWith('#') ? escapeHtml(String(curVal)) : '#ffffff'}"
                               style="width:50px;height:36px;border:none;cursor:pointer;padding:0;">
                        <input type="text" class="ml-form-input"
                               id="ml-param-${cssEscape(p.name)}"
                               value="${escapeHtml(String(curVal))}"
                               style="flex:1;"
                               placeholder="#RRGGBB 或颜色名">
                    </div>
                    ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                `;
                setTimeout(() => {
                    const textInput = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                    const colorInput = document.getElementById(`ml-param-${cssEscape(p.name)}-color`);
                    if (textInput) {
                        // 添加焦点事件监听
                        textInput.addEventListener('focus', () => {
                            _isInputFocused = true;
                        });
                        textInput.addEventListener('blur', () => {
                            _isInputFocused = false;
                            // ---- 通用颜色验证 ----
                            const val = validateColorInput(textInput, colorInput, p.default);
                            editParams[p.name] = val;
                        });
                        
                        textInput.addEventListener('input', () => {
                            const value = textInput.value;
                            // 只有有效的颜色格式才同步到调色板
                            if (isValidColor(value)) {
                                editParams[p.name] = value;
                                // 如果是 #RRGGBB 或 #RGB 格式，同步到调色板
                                if (colorInput && (value.startsWith('#'))) {
                                    // 将 #RGB 转换为 #RRGGBB
                                    let colorValue = value;
                                    if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
                                        colorValue = '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
                                    }
                                    if (/^#[0-9A-Fa-f]{6}$/.test(colorValue)) {
                                        colorInput.value = colorValue;
                                    }
                                }
                            } else {
                                // 无效格式，只更新 editParams，但不更新调色板
                                editParams[p.name] = value;
                            }
                        });
                    }
                    if (colorInput) {
                        colorInput.addEventListener('input', () => {
                            editParams[p.name] = colorInput.value;
                            if (textInput) {
                                textInput.value = colorInput.value;
                            }
                        });
                    }
                }, 0);
            } else if (isNoteType(p.type)) {
                // 长文本类型 (note / multiline_string)
                group.innerHTML = `
                    <div class="ml-form-label">
                        ${escapeHtml(p.text || p.name)}
                        <span class="ml-form-label-type">长文本</span>
                    </div>
                    <textarea class="ml-form-textarea"
                              id="ml-param-${cssEscape(p.name)}"
                              placeholder="${escapeHtml(p.desc || '')}">${escapeHtml(String(curVal))}</textarea>
                    ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                `;
                setTimeout(() => {
                    const textareaEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                    if (textareaEl) {
                        textareaEl.addEventListener('focus', () => {
                            _isInputFocused = true;
                        });
                        textareaEl.addEventListener('blur', () => {
                            _isInputFocused = false;
                            // 失焦时保存值，处理换行符转义 + XSS 防护
                            let value = textareaEl.value;
                            if (value === '' || value === undefined || value === null) {
                                textareaEl.value = p.default;
                                editParams[p.name] = p.default;
                            } else {
                                // XSS 净化
                                const sanitized = sanitizeText(value);
                                if (sanitized !== value) {
                                    textareaEl.value = sanitized;
                                    log(3, `[note-validate] 长文本已净化，移除了潜在危险内容`);
                                }
                                editParams[p.name] = sanitized;
                            }
                        });
                        textareaEl.addEventListener('input', () => {
                            editParams[p.name] = textareaEl.value;
                        });
                    }
                }, 0);
            } else if (isDatabaseType(p.type)) {
                // 数据库引用类型 (actor/skill/item/weapon/armor/enemy/state)
                const dbMapping = DB_TYPE_MAP[p.type];
                const dbArray = getDatabaseArray(p.type);
                const dbLabel = dbMapping ? dbMapping.label : p.type;

                if (dbArray) {
                    // 数据库已加载：渲染 select 下拉框
                    let optionsHtml = '<option value="" style="color:var(--ml-text-muted);">-- 无 --</option>';
                    for (let i = 1; i < dbArray.length; i++) {
                        const entry = dbArray[i];
                        if (entry && entry.name && entry.name.trim() !== '') {
                            const selected = String(i) === String(curVal) ? ' selected' : '';
                            optionsHtml += `<option value="${i}"${selected}>${i}: ${escapeHtml(entry.name)}</option>`;
                        } else if (entry) {
                            // 空位：显示但禁用选中
                            const selected = String(i) === String(curVal) ? ' selected' : '';
                            optionsHtml += `<option value="${i}"${selected} disabled style="color:var(--ml-text-muted);">${i}: (空)</option>`;
                        }
                        // entry 为 null 的直接跳过
                    }
                    group.innerHTML = `
                        <div class="ml-form-label">
                            ${escapeHtml(p.text || p.name)}
                            <span class="ml-form-label-type">${dbLabel}</span>
                        </div>
                        <select class="ml-form-select" id="ml-param-${cssEscape(p.name)}">
                            ${optionsHtml}
                        </select>
                        ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                    `;
                    setTimeout(() => {
                        const selectEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                        if (selectEl) {
                            selectEl.addEventListener('focus', () => {
                                _isInputFocused = true;
                            });
                            selectEl.addEventListener('blur', () => {
                                _isInputFocused = false;
                            });
                            selectEl.addEventListener('change', () => {
                                editParams[p.name] = selectEl.value;
                            });
                        }
                    }, 0);
                } else {
                    // 降级容错：数据库未加载，渲染为普通文本输入
                    group.innerHTML = `
                        <div class="ml-form-label">
                            ${escapeHtml(p.text || p.name)}
                            <span class="ml-form-label-type">${dbLabel} (文本降级)</span>
                        </div>
                        <input type="text" class="ml-form-input"
                               id="ml-param-${cssEscape(p.name)}"
                               value="${escapeHtml(String(curVal))}"
                               placeholder="输入${dbLabel}ID">
                        <div class="ml-form-db-hint">⚠ 数据库未加载，请输入${dbLabel}ID</div>
                        ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                    `;
                    setTimeout(() => {
                        const inputEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                        if (inputEl) {
                            inputEl.addEventListener('focus', () => {
                                _isInputFocused = true;
                            });
                            inputEl.addEventListener('blur', () => {
                                _isInputFocused = false;
                                // ---- 通用文本验证（含 XSS 防护） ----
                                const val = validateTextInput(inputEl, p.default);
                                editParams[p.name] = val;
                            });
                            inputEl.addEventListener('input', () => {
                                editParams[p.name] = inputEl.value;
                            });
                        }
                    }, 0);
                }
            } else if (p.type === 'struct') {
                // ---- 阶段2新增：struct 折叠面板渲染 ----
                const schemaFields = p.schemaFields || [];
                // 解析当前值（struct 保存为转义 JSON 对象）
                let structObj = {};
                try {
                    structObj = typeof curVal === 'string' ? JSON.parse(curVal) : (curVal || {});
                } catch (e) {
                    log(2, `[struct] 参数 "${p.name}" 的当前值解析失败，使用默认值`, e);
                    try { structObj = JSON.parse(p.default); } catch (e2) { structObj = {}; }
                }

                // 检测是否需要加宽模态框
                modal.classList.add('ml-modal-wide');

                const details = document.createElement('details');
                details.open = true;
                details.className = 'ml-struct-details ml-struct-depth-1';
                details.setAttribute('data-param-name', p.name);
                details.setAttribute('data-param-type', 'struct');

                const summary = document.createElement('summary');
                summary.className = 'ml-struct-summary';
                summary.textContent = p.text || p.name;
                details.appendChild(summary);

                // 递归渲染子参数
                const structContainer = document.createElement('div');
                structContainer.className = 'ml-struct-body';
                structContainer.setAttribute('data-struct-param', p.name);

                schemaFields.forEach(field => {
                    const fieldGroup = renderStructField(field, structObj[field.name] !== undefined ? structObj[field.name] : (field.default !== undefined ? field.default : ''), 2, p.name);
                    structContainer.appendChild(fieldGroup);
                });

                details.appendChild(structContainer);
                group.appendChild(details);

                if (p.desc) {
                    const descDiv = document.createElement('div');
                    descDiv.className = 'ml-form-desc';
                    descDiv.textContent = p.desc;
                    group.appendChild(descDiv);
                }

                log(3, `[struct] 渲染参数 "${p.name}", 子字段数: ${schemaFields.length}`);

            } else if (p.type === 'table') {
                // ---- 阶段2新增：table 表格化列表渲染 ----
                const schemaFields = p.schemaFields || [];
                // 解析当前值（table 保存为双重转义 JSON 数组）
                let tableRows = [];
                try {
                    const arr = typeof curVal === 'string' ? JSON.parse(curVal) : (curVal || []);
                    if (Array.isArray(arr)) {
                        tableRows = arr.map(row => {
                            try {
                                return typeof row === 'string' ? JSON.parse(row) : (row || {});
                            } catch (e) {
                                return {};
                            }
                        });
                    }
                } catch (e) {
                    log(2, `[table] 参数 "${p.name}" 的当前值解析失败，使用空数组`, e);
                    tableRows = [];
                }

                // 检测是否需要加宽模态框
                modal.classList.add('ml-modal-wide');

                const tableContainer = document.createElement('div');
                tableContainer.className = 'ml-table-container';
                tableContainer.setAttribute('data-table-param', p.name);

                // 标题行
                const titleLabel = document.createElement('div');
                titleLabel.className = 'ml-form-label';
                titleLabel.innerHTML = `${escapeHtml(p.text || p.name)} <span class="ml-form-label-type">表格列表</span>`;
                tableContainer.appendChild(titleLabel);

                // 滚动包裹层 + 表格
                const scrollWrapper = document.createElement('div');
                scrollWrapper.className = 'ml-table-scroll-wrapper';

                const table = document.createElement('table');
                table.className = 'ml-table';

                // 表头
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                schemaFields.forEach(field => {
                    const th = document.createElement('th');
                    th.textContent = field.text || field.name;
                    headerRow.appendChild(th);
                });
                // 操作列表头
                const actionTh = document.createElement('th');
                actionTh.className = 'ml-table-action-th';
                actionTh.textContent = '操作';
                headerRow.appendChild(actionTh);
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // 表体
                const tbody = document.createElement('tbody');
                tbody.setAttribute('data-table-body', p.name);

                // 渲染已有行
                tableRows.forEach((rowData, rowIndex) => {
                    const tr = createTableRow(tbody, schemaFields, rowData, p.name);
                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
                scrollWrapper.appendChild(table);
                tableContainer.appendChild(scrollWrapper);

                // 添加按钮
                const addBtnRow = document.createElement('div');
                addBtnRow.className = 'ml-table-add-row';
                const addBtn = document.createElement('button');
                addBtn.className = 'ml-btn ml-btn-primary ml-table-add-btn';
                addBtn.textContent = '+ 添加';
                addBtn.addEventListener('click', () => {
                    // 新增一行，使用 schema 默认值
                    const newRowData = {};
                    schemaFields.forEach(field => {
                        newRowData[field.name] = field.default !== undefined ? field.default : '';
                    });
                    const tr = createTableRow(tbody, schemaFields, newRowData, p.name);
                    tbody.appendChild(tr);
                    log(3, `[table] 参数 "${p.name}" 新增行`);
                });
                addBtnRow.appendChild(addBtn);
                tableContainer.appendChild(addBtnRow);

                if (p.desc) {
                    const descDiv = document.createElement('div');
                    descDiv.className = 'ml-form-desc';
                    descDiv.textContent = p.desc;
                    tableContainer.appendChild(descDiv);
                }

                group.appendChild(tableContainer);
                log(3, `[table] 渲染参数 "${p.name}", 列数: ${schemaFields.length}, 行数: ${tableRows.length}`);

            } else {
                // 文本类型
                group.innerHTML = `
                    <div class="ml-form-label">
                        ${escapeHtml(p.text || p.name)}
                        <span class="ml-form-label-type">文本</span>
                    </div>
                    <input type="text" class="ml-form-input"
                           id="ml-param-${cssEscape(p.name)}"
                           value="${escapeHtml(String(curVal))}">
                    ${p.desc ? `<div class="ml-form-desc">${escapeHtml(p.desc)}</div>` : ''}
                `;
                setTimeout(() => {
                    const inputEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                    if (inputEl) {
                        // 添加焦点事件监听
                        inputEl.addEventListener('focus', () => {
                            _isInputFocused = true;
                        });
                        inputEl.addEventListener('blur', () => {
                            _isInputFocused = false;
                            // ---- 通用文本验证（含 XSS 防护） ----
                            const val = validateTextInput(inputEl, p.default);
                            editParams[p.name] = val;
                        });
                        
                        inputEl.addEventListener('input', () => {
                            editParams[p.name] = inputEl.value;
                        });
                    }
                }, 0);
            }

            // 显示默认值（如果当前值与默认值不同）
            if (curVal !== p.default) {
                let defDisplay = p.default;
                if (p.type === 'boolean') defDisplay = p.default === 'true' ? 'ON (开)' : 'OFF (关)';
                const defaultHint = document.createElement('div');
                defaultHint.className = 'ml-form-default';
                defaultHint.textContent = `默认值: ${defDisplay}`;
                group.appendChild(defaultHint);
            }

            body.appendChild(group);
        });

        // 底部
        const footer = document.createElement('div');
        footer.className = 'ml-modal-footer';
        footer.innerHTML = `
            <button class="ml-btn ml-btn-warning" id="ml-modal-reset">恢复默认</button>
            <button class="ml-btn ml-btn-secondary" id="ml-modal-cancel">取消</button>
            <button class="ml-btn ml-btn-primary" id="ml-modal-save">保存</button>
        `;

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        _modalOverlay.appendChild(modal);
        document.body.appendChild(_modalOverlay);
        // 绑定模态框内的滚动容器
        const modalBody = document.querySelector('.ml-modal-body');
        if (modalBody) bindWheelToContainer(modalBody);

        // 绑定事件
        document.getElementById('ml-modal-close').addEventListener('click', () => hideParamEditor());
        document.getElementById('ml-modal-cancel').addEventListener('click', () => hideParamEditor());
        document.getElementById('ml-modal-save').addEventListener('click', () => {
            // ---- 阶段2新增：在保存前收集 struct/table 类型的数据 ----
            mod.params.forEach(p => {
                if (p.type === 'struct') {
                    // 收集 struct 数据：遍历 DOM 收集成 JS 对象，返回 JSON.stringify(对象)
                    const detailsEl = modal.querySelector(`details[data-param-name="${cssEscape(p.name)}"][data-param-type="struct"]`);
                    if (detailsEl) {
                        const structBody = detailsEl.querySelector(':scope > .ml-struct-body');
                        if (structBody) {
                            const structObj = collectStructData(structBody);
                            editParams[p.name] = JSON.stringify(structObj);
                            log(3, `[struct] 收集参数 "${p.name}" 数据:`, editParams[p.name]);
                        }
                    }
                } else if (p.type === 'table') {
                    // 收集 table 数据：双重转义 JSON 数组
                    const tbody = modal.querySelector(`tbody[data-table-body="${cssEscape(p.name)}"]`);
                    if (tbody) {
                        const schemaFields = p.schemaFields || [];
                        editParams[p.name] = collectTableData(tbody, schemaFields);
                        log(3, `[table] 收集参数 "${p.name}" 数据:`, editParams[p.name]);
                    }
                }
            });
            // ---- 阶段2新增结束 ----

            // 保存参数前处理空值
            const finalParams = {};
            mod.params.forEach(p => {
                let value = editParams[p.name];
                // ---- 阶段2新增：struct/table 类型直接透传（已在上一步序列化） ----
                if (p.type === 'struct' || p.type === 'table') {
                    finalParams[p.name] = value || p.default;
                    log(3, `[${p.type}] 参数 "${p.name}" 保存值:`, finalParams[p.name]);
                    return; // 跳过后续验证
                }
                // ---- 阶段2新增结束 ----
                // 检查值是否为空
                if (value === '' || value === undefined || value === null) {
                    // 空值时使用默认值
                    finalParams[p.name] = p.default;
                    log(3, `参数 "${p.name}" 为空，使用默认值:`, p.default);
                } else if (p.type === 'number') {
                    // 数值类型额外验证
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                        finalParams[p.name] = p.default;
                        log(3, `参数 "${p.name}" 不是有效数字，使用默认值:`, p.default);
                    } else {
                        // 检查是否有最小/最大值限制
                        let finalValue = numValue;
                        if (p.min !== undefined && finalValue < p.min) finalValue = p.min;
                        if (p.max !== undefined && finalValue > p.max) finalValue = p.max;
                        finalParams[p.name] = String(finalValue);
                    }
                } else if (p.type === 'color') {
                    // 颜色类型额外验证
                    if (isValidColor(value)) {
                        finalParams[p.name] = value;
                    } else {
                        finalParams[p.name] = p.default;
                        log(3, `参数 "${p.name}" 颜色格式无效 (${value})，使用默认值:`, p.default);
                    }
                } else if (isNoteType(p.type)) {
                    // 长文本类型：保留换行符，进行 XSS 净化
                    finalParams[p.name] = sanitizeText(value);
                } else if (isDatabaseType(p.type)) {
                    // 数据库引用类型：值必须是字符串类型的 ID
                    finalParams[p.name] = String(value);
                } else {
                    // 文本等其他类型：进行 XSS 净化
                    finalParams[p.name] = sanitizeText(value);
                }
            });
            
            // 保存参数
            mod.currentParams = { ...finalParams };
            const config = loadConfig();
            config[mod.id] = {
                status: mod.status,
                params: mod.currentParams,
                order: mod.order
            };
            saveConfig(config);
            updatePluginsJs(_modData);

            _needsRestart = true;
            updateRestartHint();
            _hasUnsavedChanges = false;
            updateSaveButton();

            // 刷新详情
            if (_selectedIndex >= 0 && _modData[_selectedIndex] === mod) {
                renderDetail(mod);
            }

            hideParamEditor();

            try {
                if (typeof SoundManager !== 'undefined') SoundManager.playOk();
            } catch (e) { /* 忽略 */ }

            log(3, "参数已保存:", mod.displayName, finalParams);
        });

        document.getElementById('ml-modal-reset').addEventListener('click', () => {
            // 恢复默认值
            mod.params.forEach(p => {
                editParams[p.name] = p.default;
                
                // ---- 阶段2修复：struct 和 table 的一键还原重绘 ----
                if (p.type === 'struct') {
                    const oldDetails = modal.querySelector(`details[data-param-name="${cssEscape(p.name)}"][data-param-type="struct"]`);
                    if (oldDetails) {
                        const group = oldDetails.closest('.ml-form-group');
                        group.innerHTML = ''; // 清空旧 DOM
                        // 重新按默认值渲染
                        let structObj = {};
                        try { structObj = JSON.parse(p.default); } catch(e) { structObj = {}; }
                        const details = document.createElement('details');
                        details.open = true;
                        details.className = 'ml-struct-details ml-struct-depth-1';
                        details.setAttribute('data-param-name', p.name);
                        details.setAttribute('data-param-type', 'struct');
                        const summary = document.createElement('summary');
                        summary.className = 'ml-struct-summary';
                        summary.textContent = p.text || p.name;
                        details.appendChild(summary);
                        const structContainer = document.createElement('div');
                        structContainer.className = 'ml-struct-body';
                        structContainer.setAttribute('data-struct-param', p.name);
                        p.schemaFields.forEach(field => {
                            const fieldGroup = renderStructField(field, structObj[field.name] !== undefined ? structObj[field.name] : (field.default !== undefined ? field.default : ''), 2, p.name);
                            structContainer.appendChild(fieldGroup);
                        });
                        details.appendChild(structContainer);
                        group.appendChild(details);
                    }
                    return; // 处理完毕，跳过后续基础类型逻辑
                } 
                else if (p.type === 'table') {
                    const oldContainer = modal.querySelector(`div[data-table-param="${cssEscape(p.name)}"]`);
                    if (oldContainer) {
                        const group = oldContainer.closest('.ml-form-group');
                        group.innerHTML = ''; // 清空旧 DOM
                        // 重新按默认值渲染
                        let tableRows = [];
                        try {
                            const arr = JSON.parse(p.default);
                            if (Array.isArray(arr)) {
                                tableRows = arr.map(row => {
                                    try { return typeof row === 'string' ? JSON.parse(row) : (row || {}); } catch (e) { return {}; }
                                });
                            }
                        } catch (e) { tableRows = []; }

                        const tableContainer = document.createElement('div');
                        tableContainer.className = 'ml-table-container';
                        tableContainer.setAttribute('data-table-param', p.name);
                        const titleLabel = document.createElement('div');
                        titleLabel.className = 'ml-form-label';
                        titleLabel.innerHTML = `${escapeHtml(p.text || p.name)} <span class="ml-form-label-type">表格列表</span>`;
                        tableContainer.appendChild(titleLabel);
                        const scrollWrapper = document.createElement('div');
                        scrollWrapper.className = 'ml-table-scroll-wrapper';
                        const table = document.createElement('table');
                        table.className = 'ml-table';
                        const thead = document.createElement('thead');
                        const headerRow = document.createElement('tr');
                        p.schemaFields.forEach(field => {
                            const th = document.createElement('th');
                            th.textContent = field.text || field.name;
                            headerRow.appendChild(th);
                        });
                        const actionTh = document.createElement('th');
                        actionTh.className = 'ml-table-action-th';
                        actionTh.textContent = '操作';
                        headerRow.appendChild(actionTh);
                        thead.appendChild(headerRow);
                        table.appendChild(thead);
                        const tbody = document.createElement('tbody');
                        tbody.setAttribute('data-table-body', p.name);
                        tableRows.forEach(rowData => {
                            const tr = createTableRow(tbody, p.schemaFields, rowData, p.name);
                            tbody.appendChild(tr);
                        });
                        table.appendChild(tbody);
                        scrollWrapper.appendChild(table);
                        tableContainer.appendChild(scrollWrapper);
                        const addBtnRow = document.createElement('div');
                        addBtnRow.className = 'ml-table-add-row';
                        const addBtn = document.createElement('button');
                        addBtn.className = 'ml-btn ml-btn-primary ml-table-add-btn';
                        addBtn.textContent = '+ 添加';
                        addBtn.addEventListener('click', () => {
                            const newRowData = {};
                            p.schemaFields.forEach(field => { newRowData[field.name] = field.default !== undefined ? field.default : ''; });
                            const tr = createTableRow(tbody, p.schemaFields, newRowData, p.name);
                            tbody.appendChild(tr);
                        });
                        addBtnRow.appendChild(addBtn);
                        tableContainer.appendChild(addBtnRow);
                        group.appendChild(tableContainer);
                    }
                    return; // 处理完毕，跳过后续基础类型逻辑
                }
                // ---- 阶段2修复结束 ----

                // 更新UI中的输入元素
                const inputEl = document.getElementById(`ml-param-${cssEscape(p.name)}`);
                if (inputEl) {
                    if (p.type === 'boolean') {
                        // 布尔开关
                        const isOn = p.default === 'true';
                        inputEl.classList.toggle('on', isOn);
                        const statusEl = document.getElementById(`ml-param-status-${cssEscape(p.name)}`);
                        if (statusEl) {
                            statusEl.textContent = isOn ? 'ON (开)' : 'OFF (关)';
                            statusEl.className = `ml-form-toggle-status ${isOn ? 'on' : 'off'}`;
                        }
                    } else if (p.type === 'select') {
                        // 下拉选择
                        inputEl.value = p.default;
                    } else if (p.type === 'color') {
                        // 颜色类型
                        inputEl.value = p.default;
                        const colorInput = document.getElementById(`ml-param-${cssEscape(p.name)}-color`);
                        if (colorInput) {
                            colorInput.value = String(p.default).startsWith('#') ? String(p.default) : '#ffffff';
                        }
                    } else if (p.type === 'number' && p.min !== undefined && p.max !== undefined) {
                        // 带滑动条的数值类型
                        inputEl.value = p.default;
                        const sliderEl = document.getElementById(`ml-param-slider-${cssEscape(p.name)}`);
                        const displayEl = document.getElementById(`ml-param-display-${cssEscape(p.name)}`);
                        if (sliderEl) sliderEl.value = p.default;
                        if (displayEl) displayEl.textContent = p.default;
                    } else if (isNoteType(p.type)) {
                        // 长文本类型
                        inputEl.value = p.default;
                    } else if (isDatabaseType(p.type)) {
                        // 数据库引用类型
                        inputEl.value = p.default;
                    } else {
                        // 文本或数值输入
                        inputEl.value = p.default;
                    }
                }
                
                // 更新默认值提示
                const group = inputEl?.closest('.ml-form-group');
                if (group) {
                    // 移除现有默认值提示
                    const existingHint = group.querySelector('.ml-form-default');
                    if (existingHint) existingHint.remove();
                }
            });
            
            log(3, "参数已恢复默认:", mod.displayName);
            try {
                if (typeof SoundManager !== 'undefined') SoundManager.playOk();
            } catch (e) { /* 忽略 */ }
        });

        // 移除点击遮罩关闭功能，用户必须点击确认或取消按钮

        // 设置初始焦点到第一个输入框
        setTimeout(() => {
            const firstInput = body.querySelector('input[type="text"], input[type="number"], input[type="color"], select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 50);

        log(3, "参数编辑器已打开:", mod.displayName);
    }

    /**
     * 隐藏参数编辑模态框
     */
    function hideParamEditor() {
        if (_modalOverlay) {
            _modalOverlay.remove();
            _modalOverlay = null;
        }
        
        // 键盘事件捕获由管理器统一管理，这里不需要再处理
    }

    /**
     * 显示安装mod的全屏拖放界面
     */
    function showInstallOverlay() {
        // 检查是否有未保存的修改
        if (_hasUnsavedChanges) {
            showConfirmDialog(
                "提示",
                "保存已修改的Mod配置后，进入安装界面。",
                [
                    {
                        text: "保存并进入",
                        class: "ml-btn-primary",
                        action: () => {
                            hideConfirmDialog();
                            saveAllChanges();
                            openInstallOverlay();
                        }
                    },
                    {
                        text: "取消",
                        class: "ml-btn-secondary",
                        action: hideConfirmDialog
                    }
                ]
            );
            return;
        }
        openInstallOverlay();
    }

    function openInstallOverlay() {
        if (_installOverlay) hideInstallOverlay();

        _installOverlay = document.createElement('div');
        _installOverlay.className = 'ml-overlay';
        _installOverlay.style.display = 'flex';
        _installOverlay.style.alignItems = 'center';
        _installOverlay.style.justifyContent = 'center';
        _installOverlay.style.flexDirection = 'column';
        _installOverlay.style.zIndex = '9999';

        _installOverlay.innerHTML = `
            <div style="text-align: center; background: rgba(20,20,28,0.95); padding: 40px; border-radius: 12px; min-width: 450px;">
                <div id="ml-drop-zone" style="border: 2px dashed white; border-radius: 12px; padding: 40px 20px; transition: all 0.3s ease;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📁</div>
                    <div style="font-size: 20px; margin-bottom: 10px; color: white;">拖放.js文件或者mods文件夹至游戏窗口内</div>
                </div>
                <div style="font-size: 14px; color: white; margin: 20px 0;">或点击下方按钮浏览文件，只支持单选&amp;多选js文件导入</div>
                <button class="ml-btn ml-btn-primary" id="ml-btn-browse" style="margin-bottom: 15px;">浏览本地文件</button>
                <br>
                <button class="ml-btn ml-btn-secondary" id="ml-btn-exit-install">退出</button>
            </div>
        `;

        document.body.appendChild(_installOverlay);

        const dropZone = document.getElementById('ml-drop-zone');

        // 绑定事件
        document.getElementById('ml-btn-browse').addEventListener('click', browseFiles);
        document.getElementById('ml-btn-exit-install').addEventListener('click', hideInstallOverlay);

        // 绑定拖放事件
        _installOverlay.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        _installOverlay.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--ml-accent)';
            dropZone.style.backgroundColor = 'rgba(74, 158, 255, 0.1)';
        });

        _installOverlay.addEventListener('dragleave', (e) => {
            e.preventDefault();
            // 只有离开 overlay 时才重置
            if (!_installOverlay.contains(e.relatedTarget)) {
                dropZone.style.borderColor = 'white';
                dropZone.style.backgroundColor = 'transparent';
            }
        });

        _installOverlay.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.style.borderColor = 'white';
            dropZone.style.backgroundColor = 'transparent';
            handleInstallDrop(e);
        });

        // ESC 关闭
        _installOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') hideInstallOverlay();
        });

        log(3, "安装mod界面已打开");
    }

    /**
     * 隐藏安装mod界面
     */
    function hideInstallOverlay() {
        if (_installOverlay) {
            _installOverlay.remove();
            _installOverlay = null;
        }
    }

    /**
     * 浏览本地文件（通过 NW.js）
     */
    function browseFiles() {
        // NW.js 有打开文件对话框的API
        try {
            const nwGui = require('nw.gui');
            const win = nwGui.Window.get();
            if (DEBUG_LEVEL >= 3) {
                win.showDevTools(); // 仅调试级别3及以上
            }
            
            // 弹出文件选择对话框
            const dialog = document.createElement('input');
            dialog.type = 'file';
            dialog.accept = '.js';
            dialog.multiple = true;
            dialog.onchange = async (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const files = Array.from(e.target.files);
                    handleJsFilesDrop(files.map(f => ({ type: 'file', file: f, name: f.name })));
                }
            };
            dialog.click();
        } catch (err) {
            log(2, "无法打开文件浏览器：", err);
            showConfirmDialog(
                "提示",
                "请直接拖放文件到窗口中！",
                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
            );
        }
    }

    /**
     * 处理安装拖放
     */
    function handleInstallDrop(e) {
        log(3, "=== handleInstallDrop ===");
        
        const items = e.dataTransfer.items;
        const files = collectFiles(items ? Array.from(items) : [], e.dataTransfer.files);

        if (files.length === 0) {
            showConfirmDialog(
                "提示",
                "请拖放 .js 文件或 mods 文件夹！",
                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
            );
            return;
        }

        const modsFolder = files.find(f => f.type === 'mods-folder');
        if (modsFolder) {
            // 如果 entry 方式识别，强制用 dataTransfer.files
            if (!modsFolder.files && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                modsFolder.files = Array.from(e.dataTransfer.files);
            }
            handleModsFolderDrop(modsFolder);
            return;
        }

        const jsFiles = files.filter(f => f.type === 'file' && f.name.toLowerCase().endsWith('.js'));
        if (jsFiles.length > 0) {
            handleJsFilesDrop(jsFiles);
        }
    }

    /**
     * 切换删除模式
     */
    function toggleDeleteMode() {
        _deleteMode = !_deleteMode;
        updateButtonStates();
        log(3, "删除模式:", _deleteMode ? "开启" : "关闭");

        // 重新渲染列表
        renderModList();
    }

    /**
     * 删除模组
     */
    function deleteMod(index) {
        const mod = _modData[index];
        if (!mod) return;

        let extraWarning = '';
        if (_hasUnsavedChanges) {
            extraWarning = '\n⚠️ 警告：删除后将自动保存所有未保存的配置修改！';
        }

        showConfirmDialog(
            "确认删除",
            `确定要删除模组「${mod.displayName}」吗？\n\n此操作将不可恢复！${extraWarning}`,
            [
                { text: "取消", class: "ml-btn-secondary", action: hideConfirmDialog },
                {
                    text: "确认删除",
                    class: "ml-btn-primary",
                    action: async () => {
                        hideConfirmDialog();
                        try {
                            // 如果有未保存，先保存
                            if (_hasUnsavedChanges) {
                                saveAllChanges();
                            }

                            // 删除文件
                            const filePath = pathMod.join(MODS_DIR, mod.fileName);
                            log(3, "删除文件:", filePath);
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                            }

                            // 从配置中删除
                            const config = loadConfig();
                            delete config[mod.id];
                            saveConfig(config);

                            // 重写 plugins.js
                            _modData = scanMods();
                            updatePluginsJs(_modData);

                            // 重新渲染
                            renderModList();
                            updateCounts();

                            log(3, "模组已删除:", mod.displayName);
                            showConfirmDialog(
                                "成功",
                                `已删除模组「${mod.displayName}」！`,
                                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
                            );
                        } catch (err) {
                            log(1, "删除模组失败:", err);
                            showConfirmDialog(
                                "错误",
                                "删除模组失败，请检查控制台日志！",
                                [{ text: "确定", class: "ml-btn-primary", action: hideConfirmDialog }]
                            );
                        }
                    }
                }
            ]
        );
    }

    // ================================================================
    // 9. 标题画面按钮（DOM 化）
    // ================================================================
    function setupTitleButton() {
        // 创建 DOM 按钮
        _titleBtn = document.createElement('button');
        _titleBtn.className = 'ml-title-btn';
        _titleBtn.id = 'ml-title-btn';
        _titleBtn.textContent = '模组管理';
        _titleBtn.style.left = BUTTON_X + 'px';
        _titleBtn.style.top = BUTTON_Y + 'px';
        document.body.appendChild(_titleBtn);

        _titleBtn.addEventListener('click', () => {
            showModManager();
            try {
                if (typeof SoundManager !== 'undefined') SoundManager.playOk();
            } catch (e) { /* 忽略 */ }
        });

        // 定时检测场景，仅在标题画面显示按钮
        let lastSceneName = '';
        const sceneTimer = setInterval(() => {
            try {
                if (typeof SceneManager !== 'undefined' && SceneManager._scene) {
                    const currentName = SceneManager._scene.constructor.name;
                    if (currentName !== lastSceneName) {
                        lastSceneName = currentName;
                        const isTitle = currentName === 'Scene_Title';
                        _titleBtn.style.display = isTitle ? 'block' : 'none';
                        log(3, "场景切换:", currentName, isTitle ? "显示按钮" : "隐藏按钮");
                    }
                }
            } catch (e) {
                log(2, "场景检测异常", e);
            }
        }, 200);

        log(3, "标题画面按钮已创建 (DOM)");
    }

    // ================================================================
    // 10. 键盘快捷键支持
    // ================================================================
    document.addEventListener('keydown', (e) => {
        if (!_overlay || _overlay.style.display === 'none') return;

        // 如果确认对话框打开，ESC关闭它
        if (_confirmModal) {
            if (e.key === 'Escape') {
                hideConfirmDialog();
                e.preventDefault();
            }
            return;
        }

        // 如果模态框打开了，让键盘捕获监听器处理
        if (_modalOverlay) {
            const isInputFocused = checkInputFocus();
            // 只有ESC键可以关闭模态框，而且只有输入框没有获得焦点时
            if (!isInputFocused && e.key === 'Escape') {
                hideParamEditor();
                e.preventDefault();
            }
            return;
        }

        // 检查是否有输入框获得焦点
        const isInputFocused = checkInputFocus();
        
        // 如果有输入框获得焦点，完全不处理 - 让浏览器正常处理所有键盘事件
        if (isInputFocused) {
            return;
        }

        switch (e.key) {
            case 'Escape':
                tryCloseModManager();
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (_modData.length > 0) {
                    const newIdx = Math.max(0, _selectedIndex - 1);
                    selectMod(newIdx);
                    scrollToIndex(newIdx);
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (_modData.length > 0) {
                    const newIdx = Math.min(_modData.length - 1, _selectedIndex + 1);
                    selectMod(newIdx);
                    scrollToIndex(newIdx);
                }
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (_selectedIndex >= 0) {
                    toggleMod(_selectedIndex);
                }
                break;
            case 'e':
            case 'E':
                if (_selectedIndex >= 0) {
                    const mod = _modData[_selectedIndex];
                    if (mod && mod.params && mod.params.length > 0) {
                        showParamEditor(mod);
                    }
                }
                break;
        }
    });

    /**
     * 滚动列表到指定索引
     */
    function scrollToIndex(index) {
        const container = document.getElementById('ml-list-scroll');
        const item = container?.children[index];
        if (item) {
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    // ================================================================
    // 11. 初始化
    // ================================================================
    injectStyles();
    setupTitleButton();
    log(3, `ModLoader ${VERSION} 初始化完成`);

})();
