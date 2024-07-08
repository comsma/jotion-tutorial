"use client";

import React from "react";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;

  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}
const Item = ({
  id,
  label,
  icon: Icon,
  onClick,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const { user } = useUser();

  const router = useRouter();

  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  // archive note
  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() => router.push("/documents"));
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });
  };

  // create a new document under a parent document
  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    // expand document list for parent document if not already expanded
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${documentId}`);
      },
    );

    toast.promise(promise, {
      loading: "Creating note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role={"button"}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full" +
          " hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary",
      )}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
    >
      {!!id && (
        <div
          role={"button"}
          className={
            "h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          }
          onClick={handleExpand}
        >
          <ChevronIcon
            className={"h-4 w-4 shrink-0 text-muted-foreground/50"}
          />
        </div>
      )}
      {documentIcon ? (
        <div>{documentIcon}</div>
      ) : (
        <Icon
          className={"shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"}
        />
      )}

      <span className={"truncate"}>{label}</span>
      {isSearch && (
        <kbd
          className={
            "ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
          }
        >
          <span className={"text-xs"}>⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className={"ml-auto flex items-center gap-x-2"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                className={
                  "opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                }
                role={"button"}
              >
                <MoreHorizontal className={"w-4 h-4 text-muted-foreground"} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={"w-60"}
              align={"start"}
              side={"right"}
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className={"h-4 w-4 mr-2"} />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className={"text-xs text-muted-foreground p-2"}>
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role={"button"}
            onClick={onCreate}
            className={
              "opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 "
            }
          >
            <Plus className={"h-4 w-4 text-muted-foreground"} />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className={"flex gap-x-2 py-[3px]"}
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
    >
      <Skeleton className={"h-4 w-4"} />
      <Skeleton className={"h-4 w-[30%]"} />
    </div>
  );
};

export default Item;
