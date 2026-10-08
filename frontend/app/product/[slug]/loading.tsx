export default function ProductLoading() {
  return (
    <div className="bg-white">
      {/* Breadcrumb skeleton */}
      <div className="container-x pt-6 pb-4">
        <div className="h-3 w-64 bg-gray-100 rounded-full animate-pulse" />
      </div>

      <div className="container-x pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <div className="aspect-square rounded-[32px] bg-gray-100 animate-pulse" />
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gray-100 animate-pulse"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-5">
            <div className="h-3 w-32 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-12 w-4/5 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-10 w-1/3 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
            </div>
            <div className="h-14 bg-gray-100 rounded-full mt-6 animate-pulse" />
            <div className="h-14 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}