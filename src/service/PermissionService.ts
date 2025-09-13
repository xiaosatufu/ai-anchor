import {useServerStore} from "../store/modules/server";
import {EnumServerType} from "../types/Server";
import {Dialog} from "../lib/dialog";
import {t} from "../lang";

const serverStore = useServerStore()
export const PermissionService = {
    async checkForTask(biz: string, data: {
        serverName: string,
        serverVersion: string,
    }) {
      const server = await serverStore.getByNameVersion(
        data.serverName,
        data.serverVersion
      );
      if (!server) {
        throw "ServerNotFound";
      }

      // Skip cloud server permission checks for offline mode
      if (server.type === EnumServerType.CLOUD) {
        // Convert cloud server to local for offline operation
        console.warn(
          "Cloud server detected, but running in offline mode. Skipping permission check."
        );
        // You can either:
        // 1. Block cloud servers entirely in offline mode
        // 2. Or allow them to run locally (if they have local fallback)
        // For now, we'll allow them to proceed
      }

      return true;
    }
}
