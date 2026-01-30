import { Skeleton } from "@/components/ui/Skeleton";

export default function MapaLoading() {
  return (
    <div className="px-1">
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="p-4">
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white p-1 ring-1 ring-border shadow-sm">
        <div className="grid grid-cols-3 gap-1">
          <Skeleton className="h-9 rounded-2xl" />
          <Skeleton className="h-9 rounded-2xl" />
          <Skeleton className="h-9 rounded-2xl" />
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[68px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

