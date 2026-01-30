import { Skeleton } from "@/components/ui/Skeleton";

export default function AgendaLoading() {
  return (
    <div className="px-1">
      <div className="rounded-2xl bg-white p-1 ring-1 ring-border shadow-sm">
        <div className="grid grid-cols-4 gap-1">
          <Skeleton className="h-9 rounded-2xl" />
          <Skeleton className="h-9 rounded-2xl" />
          <Skeleton className="h-9 rounded-2xl" />
          <Skeleton className="h-9 rounded-2xl" />
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

