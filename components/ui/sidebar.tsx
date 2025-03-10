"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}>({
  expanded: true,
  setExpanded: () => undefined,
})

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="grid lg:grid-cols-[auto_1fr]">{children}</div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = React.useContext(SidebarContext)

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-white transition-all duration-300 ease-in-out",
        expanded ? "w-[280px]" : "w-[80px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-16 items-center border-b px-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenuButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { expanded } = React.useContext(SidebarContext)

  return (
    <button
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100",
        expanded ? "justify-start" : "justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-4 h-px bg-gray-200", className)} {...props} />
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { expanded, setExpanded } = React.useContext(SidebarContext)

  return (
    <button
      className={cn("h-9 w-9 rounded-md hover:bg-gray-100", className)}
      onClick={() => setExpanded((prev) => !prev)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

export function SidebarRail({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = React.useContext(SidebarContext)

  if (expanded) {
    return null
  }

  return <div className={cn("absolute inset-y-0 left-[80px] w-px bg-gray-200", className)} {...props} />
}

export function SidebarInset({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-screen flex-col", className)} {...props}>
      {children}
    </div>
  )
}

