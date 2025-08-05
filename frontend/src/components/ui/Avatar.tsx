import * as React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({ className, src, fallback, alt, ...props }) => (
  <div
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    {src ? (
      <img className="aspect-square h-full w-full" src={src} alt={alt} />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
        {fallback}
      </div>
    )}
  </div>
);

export { Avatar };