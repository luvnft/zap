import { Layer1Button, WarningButton } from "@/element/buttons";
import { NostrEvent, TaggedNostrEvent } from "@snort/system";
import { SnortContext } from "@snort/system-react";
import { useContext, useState } from "react";

export function DebugPage() {
  const system = useContext(SnortContext);
  const [filter, setFilter] = useState("");
  const [event, setEvent] = useState("");
  const [results, setResult] = useState<Array<TaggedNostrEvent>>([]);

  async function search() {
    if (filter && system.cacheRelay) {
      const r = await system.cacheRelay.query(["REQ", "test", JSON.parse(filter)]);
      setResult(r.map(a => ({ ...a, relays: [] })));
    }
  }

  async function insert() {
    if (event && system.cacheRelay) {
      const r = await system.cacheRelay.event(JSON.parse(event) as NostrEvent);
      setResult([
        {
          content: JSON.stringify(r),
        } as unknown as TaggedNostrEvent,
      ]);
    }
  }

  async function removeEvents() {
    if (filter && system.cacheRelay) {
      const r = await system.cacheRelay.delete(["REQ", "delete-events", JSON.parse(filter)]);
      setResult(r.map(a => ({ id: a }) as TaggedNostrEvent));
    }
  }
  return (
    <div className="flex flex-col gap-2 w-full p-8">
      <h3>Cache Query</h3>
      <textarea value={filter} onChange={e => setFilter(e.target.value)} placeholder="nostr filter" />
      <Layer1Button onClick={() => search()}>Query</Layer1Button>
      <WarningButton onClick={() => removeEvents()}>Delete</WarningButton>

      <h3>Manual Insert</h3>
      <textarea value={event} onChange={e => setEvent(e.target.value)} placeholder="nostr event" />
      <Layer1Button onClick={() => insert()}>Insert</Layer1Button>
      <div className="p-4 overflow-hidden">
        <h4>Results: {results.length}</h4>
        {results?.map(a => (
          <pre key={a.id} className="text-mono text-xs text-pretty">
            {JSON.stringify(a, undefined, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
}
