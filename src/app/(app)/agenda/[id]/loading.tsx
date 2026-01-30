import { Skeleton } from "@/components/ui/Skeleton";

export default function AgendaDetailLoading() {
  return (
    <div className="px-1">
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="p-5">
          <Skeleton className="h-6 w-4/5" />
          <div className="mt-4 space-y-2 rounded-2xl bg-zinc-50 p-4 ring-1 ring-border">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
          <div className="mt-6">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

