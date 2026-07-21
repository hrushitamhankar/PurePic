"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface ScaleOnHoverProps extends HTMLMotionProps<"div"> {
  scale?: number;
}

export function ScaleOnHover({
  children,
  scale = 1.02,
  className,
  ...props
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
