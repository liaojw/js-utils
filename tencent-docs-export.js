/**
 * 腾讯文档导出下载工具 - 纯 HTTP 版本
 * 不依赖 mcporter，直接通过 HTTP API 调用（MCP 协议）
 *
 * 使用方法：
 *   node tencent-docs-export.js --token <token> --file-id <file_id> [--output <path>]
 *
 * 示例：
 *   node tencent-docs-export.js --token YOUR_TOKEN --file-id DAJpzYoLEpWS
 *   node tencent-docs-export.js --token YOUR_TOKEN --file-id DAJpzYoLEpWS --output ./report.docx
 *
 * Token 获取：https://docs.qq.com/scenario/open-claw.html
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 腾讯文档 MCP API 端点
const MCP_API_URL = 'https://docs.qq.com/openapi/mcp';

// 轮询间隔（毫秒）
const POLL_INTERVAL = 3000;

// 最大轮询次数
const MAX_POLL_RETRIES = 60;

/**
 * 解析命令行参数
 * @returns {{token: string|null, fileId: string|null, output: string|null}} 解析后的参数对象
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    token: null,
    fileId: null,
    output: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--token' || arg === '-t') {
      options.token = args[++i];
    } else if (arg === '--file-id' || arg === '-f') {
      options.fileId = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    } else if (!options.fileId && !arg.startsWith('-')) {
      // 第一个非参数值作为 file_id
      options.fileId = arg;
    }
  }

  return options;
}

/**
 * 显示帮助信息
 * @returns {void}
 */
function showHelp() {
  console.log(`
腾讯文档导出下载工具 - 纯 HTTP 版本
不依赖 mcporter，直接通过 HTTP API 调用（MCP 协议）

用法:
  node tencent-docs-export.js --token <token> --file-id <file_id> [options]
  node tencent-docs-export.js -t <token> -f <file_id> [options]

参数:
  --token, -t <token>      Authorization Token（必填）
                           获取地址: https://docs.qq.com/scenario/open-claw.html
  --file-id, -f <id>       腾讯文档 file_id（必填）
  --output, -o <path>      输出路径（可选，默认桌面）
  --help, -h               显示帮助信息

示例:
  # 导出到桌面
  node tencent-docs-export.js --token YOUR_TOKEN --file-id DAJpzYoLEpWS

  # 指定输出路径
  node tencent-docs-export.js -t YOUR_TOKEN -f DAJpzYoLEpWS -o ./report.docx

注意事项:
  1. 下载链接有效期约 30 分钟，需及时下载
  2. 导出格式: doc/smartcanvas → .docx, sheet → .xlsx, slide → .pptx
  3. Token 需要腾讯文档 VIP 权限才能使用导出功能

MCP 协议格式:
  POST https://docs.qq.com/openapi/mcp
  Authorization: <token>
  Content-Type: application/json

  {
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "manage.export_file",
      "arguments": { "file_id": "xxx" }
    },
    "id": 1
  }
`);
}

/**
 * 主函数：导出腾讯文档并下载到本地（纯 HTTP 版本）
 * @param {string} token - Authorization Token
 * @param {string} fileId - 腾讯文档 file_id
 * @param {string} outputPath - 输出路径（可选，默认桌面）
 * @returns {Promise<string>} - 返回本地保存路径
 */
async function exportTencentDocHttp(token, fileId, outputPath) {
  console.log('\n🚀 腾讯文档导出任务启动');
  console.log(`   API 端点: ${MCP_API_URL}`);
  console.log(`   文档 ID: ${fileId}`);

  // 验证 Token
  if (!token) {
    throw new Error('Token is required. Get it from: https://docs.qq.com/scenario/open-claw.html');
  }

  // 0. 尝试获取文档标题
  let docTitle = null;
  try {
    console.log('📖 尝试获取文档标题...');
    const contentResult = await callMcpApi(token, 'get_content', { file_id: fileId });
    docTitle = extractTitleFromContent(contentResult.content);
    if (docTitle) {
      console.log(`   文档标题: ${docTitle}`);
    }
  } catch (err) {
    console.log(`   ⚠️ 无法获取标题: ${err.message}`);
  }

  // 1. 发起导出任务
  const taskId = await startExportTask(token, fileId);

  // 2. 轮询导出进度
  const { fileName, fileUrl } = await pollExportProgress(token, taskId);

  // 3. 确定输出文件名
  let finalFileName = fileName;

  // 如果获取到了文档标题，优先使用标题作为文件名
  if (docTitle) {
    // 从导出 URL 中提取扩展名
    const urlPath = fileUrl.split('?')[0];
    const extMatch = urlPath.match(/\.(xlsx|docx|pptx|pdf)$/i);
    const ext = extMatch ? extMatch[1] : 'docx';

    finalFileName = `${docTitle}.${ext}`;
    if (!outputPath) {
      console.log(`   使用文档标题作为文件名: ${finalFileName}`);
    }
  }

  // 4. 确定输出路径
  if (!outputPath) {
    outputPath = path.join(getDesktopPath(), finalFileName);
  }

  // 5. 下载文件（下载链接不需要 Authorization，直接 GET）
  const savedPath = await downloadFileWithAxios(fileUrl, outputPath);
  console.log(`   文件已保存到: ${savedPath}`);

  return savedPath;
}

/**
 * 调用腾讯文档 MCP API（JSON-RPC 2.0 + MCP 协议）
 * @param {string} token - Authorization Token
 * @param {string} toolName - MCP 工具名，如 manage.export_file
 * @param {object} args - 参数对象
 * @returns {Promise<object>} - 返回结果
 */
async function callMcpApi(token, toolName, args) {
  const requestId = Date.now();

  // MCP 标准协议格式：method=tools/call, params.name=工具名, params.arguments=参数
  const requestBody = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args,
    },
    id: requestId,
  };

  try {
    const response = await axios({
      method: 'POST',
      url: MCP_API_URL,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      data: requestBody,
      timeout: 30000,
    });

    const result = response.data;

    // JSON-RPC 错误处理
    if (result.error) {
      const errorMsg = result.error.message || JSON.stringify(result.error);
      throw new Error(`MCP API Error (${result.error.code}): ${errorMsg}`);
    }

    // MCP 返回结构: result.structuredContent 或 result.content
    if (result.result) {
      if (result.result.structuredContent) {
        return result.result.structuredContent;
      }
      if (result.result.content && Array.isArray(result.result.content)) {
        // 从 content 数组中提取文本内容
        const textContent = result.result.content.find((c) => c.type === 'text');
        if (textContent && textContent.text) {
          try {
            return JSON.parse(textContent.text);
          } catch {
            return { text: textContent.text };
          }
        }
      }
      return result.result;
    }

    return result;
  } catch (err) {
    if (err.response) {
      // HTTP 错误响应
      const status = err.response.status;
      const data = err.response.data;
      throw new Error(`HTTP Error ${status}: ${JSON.stringify(data)}`);
    }
    throw new Error(`API call failed: ${err.message}`);
  }
}

/**
 * 从文档内容中提取标题
 * @param {string} content - 文档内容
 * @returns {string|null} - 提取的标题
 */
function extractTitleFromContent(content) {
  if (!content) return null;

  // 提取第一行非空内容
  const lines = content.split('\n').filter((line) => line.trim());
  if (lines.length === 0) return null;

  // 第一行通常是标题
  let title = lines[0].trim();

  // 如果是表格，去掉 | 符号
  if (title.startsWith('|')) {
    title = title.replace(/^\|+|\|+$/g, '').trim();
  }

  // 去掉 markdown 标题符号
  title = title.replace(/^#+\s*/, '').trim();

  // 截取前50个字符作为标题
  if (title.length > 50) {
    title = title.substring(0, 50) + '...';
  }

  // 清理文件名中的非法字符
  title = title.replace(/[\\/:*?"<>|]/g, '_');

  return title;
}

/**
 * 发起导出任务
 * @param {string} token - Authorization Token
 * @param {string} fileId - 腾讯文档 file_id
 * @returns {Promise<string>} - 返回 task_id
 */
async function startExportTask(token, fileId) {
  console.log(`📤 发起云端导出任务: ${fileId}`);

  const result = await callMcpApi(token, 'manage.export_file', { file_id: fileId });

  if (!result.task_id) {
    throw new Error('No task_id returned from export_file');
  }

  console.log(`✅ 云端导出任务已创建, task_id: ${result.task_id}`);
  return result.task_id;
}

/**
 * 轮询导出进度直到完成
 * @param {string} token - Authorization Token
 * @param {string} taskId - 导出任务 ID
 * @returns {Promise<{fileName: string, fileUrl: string}>} - 返回文件名和下载链接
 */
async function pollExportProgress(token, taskId) {
  console.log(`⏳ 开始轮询云端导出进度...`);

  let progress = 0;
  let retries = 0;

  while (progress < 100 && retries < MAX_POLL_RETRIES) {
    await sleep(POLL_INTERVAL);

    const result = await callMcpApi(token, 'manage.export_progress', { task_id: taskId });
    progress = result.progress || 0;

    console.log(`📊 云端导出进度: ${progress}%`);

    if (progress === 100) {
      if (!result.file_url) {
        throw new Error('Export completed but no file_url returned');
      }

      // 如果没有 file_name，从 URL 中提取
      let fileName = result.file_name;
      if (!fileName) {
        const urlPath = result.file_url.split('?')[0];
        const pathParts = urlPath.split('/');
        fileName = pathParts[pathParts.length - 1] || 'exported_document.docx';
      }

      console.log(`✅ 云端导出完成!`);
      console.log(`   文件名: ${fileName}`);
      console.log(`   下载链接: ${result.file_url.substring(0, 80)}...`);

      return {
        fileName: fileName,
        fileUrl: result.file_url,
      };
    }

    if (result.error) {
      throw new Error(`Export failed: ${result.error}`);
    }

    retries++;
  }

  throw new Error('Export timeout: exceeded max retries (约3分钟)');
}

/**
 * 简单的 sleep 函数
 * @param {number} ms - 毫秒
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取用户桌面路径
 * @returns {string} - 当前用户桌面目录绝对路径
 */
function getDesktopPath() {
  const homeDir = require('os').homedir();
  return path.join(homeDir, 'Desktop');
}

/**
 * 使用 axios 下载文件到本地
 * @param {string} fileUrl - 下载链接（带签名的临时URL）
 * @param {string} outputPath - 本地保存路径
 * @returns {Promise<string>} - 返回保存路径
 */
async function downloadFileWithAxios(fileUrl, outputPath) {
  console.log(`📥 开始下载文件到本地...`);
  console.log(`   本地目标路径: ${outputPath}`);

  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
      timeout: 120000, // 2分钟超时（大文件可能需要更长时间）
      maxRedirects: 5,
    });

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 创建写入流
    const writer = fs.createWriteStream(outputPath);

    // 管道传输
    response.data.pipe(writer);

    // 返回 Promise
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // 获取文件大小
    const stats = fs.statSync(outputPath);
    const fileSizeKB = Math.round(stats.size / 1024);
    const fileSizeMB = Math.round(stats.size / 1024 / 1024);

    console.log(`✅ 本地文件下载完成!`);
    if (fileSizeMB > 1) {
      console.log(`   大小: ${fileSizeMB} MB`);
    } else {
      console.log(`   大小: ${fileSizeKB} KB`);
    }

    return outputPath;
  } catch (err) {
    throw new Error(`Download failed: ${err.message}`);
  }
}

/**
 * 命令行入口：
 * 当脚本被直接执行时，解析参数并运行导出流程。
 */
if (require.main === module) {
  const options = parseArgs();

  if (!options.token || !options.fileId) {
    console.log('❌ 缺少必要参数');
    console.log('');
    showHelp();
    process.exit(1);
  }

  exportTencentDocHttp(options.token, options.fileId, options.output)
    .then((_savedPath) => {
      console.log(`✓ 腾讯文档导出任务完成！`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`\n✗ 错误: ${err.message}`);

      // 特殊错误提示
      if (err.message.includes('400006')) {
        console.log('\n💡 Token 鉴权失败，请重新获取 Token:');
        console.log('   https://docs.qq.com/scenario/open-claw.html');
      } else if (err.message.includes('400007')) {
        console.log('\n💡 VIP 权限不足，请升级 VIP:');
        console.log('   https://docs.qq.com/vip?immediate_buy=1?part_aid=persnlspace_mcp');
      }

      process.exit(1);
    });
}

/**
 * 导出模块函数，供其他脚本通过 require() 调用。
 */
module.exports = {
  exportTencentDocHttp,
};
