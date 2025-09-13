import {t} from "../lang";

export function mapError(msg: any) {
    if (typeof msg !== 'string') {
        msg = msg.toString()
    }
    const map = {
      FileAlreadyExists: t("文件已存在"),
      FileNotFound: t("文件未找到"),
      ProcessTimeout: t("处理超时"),
      RequestError: t("请求错误"),
      ServerNotRunning: t("模型服务未运行"),
      "Token not found": t("网络连接失败 - 请使用本地模型或检查网络连接"),
      "Network unavailable": t(
        "网络不可用 - 程序已切换到离线模式，请使用本地模型"
      ),
      ResponseError: t("网络响应错误 - 建议使用本地模型"),
    };
    for (let key in map) {
      if (msg.includes(key)) {
        let error = map[key];
        // regex PluginReleaseDocFormatError:-11
        const regex = new RegExp(`${key}:(-?\\d+)`);
        const match = msg.match(regex);
        if (match) {
          error += `(${match[1]})`;
        }
        return error;
      }
    }

    // Handle common network-related errors
    if (
      msg.includes("fetch") ||
      msg.includes("network") ||
      msg.includes("ENOTFOUND") ||
      msg.includes("ECONNREFUSED")
    ) {
      return t("网络连接失败 - 建议使用本地模型进行离线操作");
    }

    return msg
}
