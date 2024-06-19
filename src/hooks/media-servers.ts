import { EventKind, UnknownTag } from "@snort/system";
import { useLogin } from "./login";
import { removeUndefined, sanitizeRelayUrl } from "@snort/shared";
import { Nip96Uploader } from "@/service/upload/nip96";

export function useMediaServerList() {
  const login = useLogin();

  const servers = login?.state?.getList(EventKind.StorageServerList) ?? [];

  return {
    servers: removeUndefined(servers.map(a => a.toEventTag()))
      .filter(a => a[0] === "server")
      .map(a => a[1]),
    addServer: async (s: string) => {
      const pub = login?.publisher();
      if (!pub) return;

      const u = sanitizeRelayUrl(s);
      if (!u) return;
      const server = new Nip96Uploader(u, pub);
      await server.loadInfo();
      await login?.state?.addToList(EventKind.StorageServerList, new UnknownTag(["server", u]), true);
    },
    removeServer: async (s: string) => {
      const u = sanitizeRelayUrl(s);
      if (!u) return;
      await login?.state?.removeFromList(EventKind.StorageServerList, new UnknownTag(["server", u]), true);
    },
  };
}