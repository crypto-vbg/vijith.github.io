// Minimal in-process Upstash Redis REST double for tests.
// Implements only the commands the rate limiter pipelines use.

export function createFakeUpstash() {
  const zsets = new Map(); // key -> Map<member, score>
  const strings = new Map(); // key -> { value, expireAt }

  const zset = (key) => {
    if (!zsets.has(key)) zsets.set(key, new Map());
    return zsets.get(key);
  };

  function exec([cmd, ...args]) {
    switch (cmd.toUpperCase()) {
      case "ZREMRANGEBYSCORE": {
        const [key, min, max] = args;
        const z = zset(key);
        let removed = 0;
        for (const [member, score] of z) {
          if (score >= Number(min) && score <= Number(max)) {
            z.delete(member);
            removed++;
          }
        }
        return removed;
      }
      case "ZADD": {
        const [key, score, member] = args;
        zset(key).set(member, Number(score));
        return 1;
      }
      case "ZCARD":
        return zset(args[0]).size;
      case "ZRANGE": {
        // Only the "0 0 WITHSCORES" (oldest entry) form is supported.
        const sorted = [...zset(args[0])].sort((a, b) => a[1] - b[1]);
        if (!sorted.length) return [];
        return [sorted[0][0], String(sorted[0][1])];
      }
      case "ZREM":
        return zset(args[0]).delete(args[1]) ? 1 : 0;
      case "PEXPIRE":
        return 1;
      case "PTTL": {
        const entry = strings.get(args[0]);
        if (!entry) return -2;
        const remaining = entry.expireAt - Date.now();
        if (remaining <= 0) {
          strings.delete(args[0]);
          return -2;
        }
        return remaining;
      }
      case "SET": {
        const [key, value, px, ms] = args;
        if (px !== "PX") throw new Error("fake redis: only SET ... PX supported");
        strings.set(key, { value, expireAt: Date.now() + Number(ms) });
        return "OK";
      }
      default:
        throw new Error(`fake redis: unsupported command ${cmd}`);
    }
  }

  const fetchImpl = async (url, init) => {
    if (!String(url).endsWith("/pipeline")) {
      return new Response("not found", { status: 404 });
    }
    const commands = JSON.parse(init.body);
    const rows = commands.map((c) => {
      try {
        return { result: exec(c) };
      } catch (err) {
        return { error: String(err.message ?? err) };
      }
    });
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  return { fetchImpl, zsets, strings };
}
