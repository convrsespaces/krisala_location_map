"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsiblePanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export default function CollapsiblePanel({
  title,
  children,
  className = "",
  defaultOpen = true,
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "w-fit rounded-tl-[10px] rounded-tr-[10px] shadow-2xl border border-gray-800/50 bg-gray-950/15 backdrop-blur-lg",
        className
      )}
    >
      <CollapsibleContent className="overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-2 text-gray-300"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
      <CollapsibleTrigger asChild>
        <motion.button
          className="w-40 flex items-center justify-between px-4 py-2 text-sm text-white/90 backdrop-blur-lg rounded-tl-[10px] rounded-tr-[10px]"
        >
          {title}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-gray-400" />
          </motion.div>
        </motion.button>
      </CollapsibleTrigger>
    </Collapsible>
  );
}
