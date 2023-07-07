import "./goal.css";
import { useMemo } from "react";
import * as Progress from "@radix-ui/react-progress";
import Confetti from "react-confetti";
import { NostrLink, ParsedZap, NostrEvent } from "@snort/system";
import { Icon } from "./icon";
import { findTag } from "utils";
import { formatSats } from "number";

export function Goal({
  link,
  ev,
  zaps,
}: {
  link: NostrLink;
  ev: NostrEvent;
  zaps: ParsedZap[];
}) {
  const goalAmount = useMemo(() => {
    const amount = findTag(ev, "amount");
    return amount ? Number(amount) / 1000 : null;
  }, [ev]);

  if (!goalAmount) {
    return null;
  }

  const soFar = useMemo(() => {
    return zaps
      .filter((z) => z.receiver === ev.pubkey && z.event === ev.id)
      .reduce((acc, z) => acc + z.amount, 0);
  }, [zaps]);

  const progress = (soFar / goalAmount) * 100;
  const isFinished = progress >= 100;

  return (
    <div className="goal">
      {ev.content.length > 0 && <p>{ev.content}</p>}
      <div className={`progress-container ${isFinished ? "finished" : ""}`}>
        <Progress.Root className="progress-root" value={progress}>
          <Progress.Indicator
            className="progress-indicator"
            style={{ transform: `translateX(-${100 - progress}%)` }}
          >
            {!isFinished && (
              <span className="amount so-far">{formatSats(soFar)}</span>
            )}
          </Progress.Indicator>
          <span className="amount target">Goal: {formatSats(goalAmount)}</span>
        </Progress.Root>
        <div className="zap-circle">
          <Icon
            name="zap-filled"
            className={isFinished ? "goal-finished" : "goal-unfinished"}
          />
        </div>
      </div>
      {isFinished && <Confetti numberOfPieces={2100} recycle={false} />}
    </div>
  );
}