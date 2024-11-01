"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from 'framer-motion'

export default function DashboardNav({
    allLinks
}: {
    allLinks: { label: string, path: string, icon: JSX.Element }[]
}) {
    const pathName = usePathname();
    return (
        <nav className="mb-4 py-2 overflow-auto">
            <ul className="flex gap-6 text-xs font-semibold">
                {
                    allLinks.map((link) => (
                        <Link
                            className={
                                cn("flex gap-1 flex-col items-center",
                                    pathName === link.path && 'text-primary')
                            }
                            href={link.path}
                            key={link.path}
                        >
                            {link.icon}
                            {link.label}
                            {
                                pathName === link.path ? (
                                    <motion.div
                                        className="h-[2px] bg-primary w-full"
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        layoutId="underline"
                                        transition={{ type: "spring", stiffness: 35 }}
                                    />
                                ) : (
                                    null
                                )
                            }
                        </Link>
                    ))
                }
            </ul>
        </nav>
    )
}