import { cn } from "@/lib/utils";
import { Card } from "./card";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };

export const LayoutSkeleton = ({
  children,
  form,
}: {
  children: React.ReactNode;
  form?: boolean;
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center fixed w-full px-8 pt-10 pb-6 z-10 bg-white">
        {form ? (
          <Skeleton className="h-8 w-[250px]" />
        ) : (
          <>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[250px]" />
          </>
        )}
      </div>
      <div className="px-8">
        <div className="pb-4 pt-32">{children}</div>
      </div>
    </div>
  );
};

export const HomeSkeleton = () => {
  return (
    <LayoutSkeleton>
      <div className="flex flex-col gap-y-5">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-8 w-1/5" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-7">
            {Array.from({ length: 10 })?.map((item: any, index: number) => {
              return (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </LayoutSkeleton>
  );
};

export const ListSkeleton = () => {
  return (
    <LayoutSkeleton>
      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="rounded-md">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[250px]" />
        </div>
      </div>
    </LayoutSkeleton>
  );
};

export const FormSkeleton = () => {
  return (
    <LayoutSkeleton form>
      <Card className="p-8 w-3/4 m-auto">
        <form>
          <div className="grid grid-cols-2 gap-y-3 gap-x-10 mb-4 items-start">
            {Array.from({ length: 8 })?.map((item: any, index: number) => {
              return (
                <div key={index} className="mb-7">
                  <Skeleton className="h-8 w-full" />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end w-full">
            <Skeleton className="h-8 w-[200px]" />
          </div>
        </form>
      </Card>
    </LayoutSkeleton>
  );
};
