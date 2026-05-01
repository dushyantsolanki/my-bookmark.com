"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface XInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string | boolean;
}

export function XInputField({
  id,
  label,
  icon,
  rightElement,
  error,
  className,
  ...props
}: XInputFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center justify-center">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<any>, {
                  className: cn("h-4 w-4", (icon.props as any)?.className),
                })
              : icon}
          </div>
        )}
        <Input
          id={id}
          className={cn(
            "w-full h-10",
            icon && "pl-10",
            rightElement && "pr-10",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-1 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && typeof error === "string" && (
        <p className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
