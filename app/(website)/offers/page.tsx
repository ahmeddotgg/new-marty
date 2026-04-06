export default function Page() {
  return (
    <div className="wrapper space-y-10 py-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-black">العروض</h1>
        <p className="text-sm font-medium text-muted-foreground">
          تصفح أفضل العروض المتاحة.
        </p>
      </header>
      <h2 className="rounded-4xl bg-accent py-22 text-center text-2xl font-bold text-background dark:text-foreground">
        لا توجد عروض معروضة حالياً
      </h2>
    </div>
  )
}
