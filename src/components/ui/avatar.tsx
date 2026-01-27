"use client";

import { cn, getInitials } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "circle" | "rounded";
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = "md", variant = "circle", ...props }, ref) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    const variants = {
      circle: "rounded-full",
      rounded: "rounded-xl",
    };

    const gradients = [
      "from-brand-400 to-accent-purple",
      "from-accent-purple to-accent-orange",
      "from-accent-green to-brand-400",
      "from-accent-orange to-accent-yellow",
      "from-brand-500 to-brand-700",
    ];

    // Generate consistent gradient based on name
    const gradientIndex = name ? name.charCodeAt(0) % gradients.length : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center font-bold text-white overflow-hidden",
          sizes[size],
          variants[variant],
          !src && `bg-gradient-to-br ${gradients[gradientIndex]}`,
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{name ? getInitials(name) : "?"}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  avatars: { name: string; src?: string }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 4, size = "md", ...props }, ref) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const sizes = {
      sm: "w-8 h-8 text-xs -ml-2",
      md: "w-10 h-10 text-sm -ml-3",
      lg: "w-12 h-12 text-base -ml-4",
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            name={avatar.name}
            src={avatar.src}
            size={size}
            className={cn(
              "ring-2 ring-white",
              index > 0 && sizes[size]
            )}
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              "flex items-center justify-center font-bold text-slate-600 bg-slate-100 rounded-full ring-2 ring-white",
              sizes[size]
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
