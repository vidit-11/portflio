import { StackGroup } from "@/lib/schemas";
import { Card } from "./Section";

export default function Skills({ stack }: { stack: StackGroup[] }) {
  return (
    <Card className="p-0">
      <dl className="divide-y">
        {stack.map((group) => (
          <div
            key={group.category}
            className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <dt className="w-32 shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {group.category}
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-secondary px-2.5 py-1 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
