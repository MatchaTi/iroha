import { cn } from "cn"

type Props = React.ComponentPropsWithoutRef<"div">

export function SideDots() {
  return (
    <>
      <div className="absolute top-0 left-0 size-3 -translate-x-1/2 -translate-y-1/2 border-2 border-purple-500 bg-background" />
      <div className="absolute top-0 right-0 size-3 translate-x-1/2 -translate-y-1/2 border-2 border-purple-500 bg-background" />
      <div className="absolute right-0 bottom-0 size-3 translate-x-1/2 translate-y-1/2 border-2 border-purple-500 bg-background" />
      <div className="absolute bottom-0 left-0 size-3 -translate-x-1/2 translate-y-1/2 border-2 border-purple-500 bg-background" />
    </>
  )
}

export function ComponentContainer({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-purple-500",
        className
      )}
      {...props}
    >
      <SideDots />
      {children}
    </div>
  )
}
