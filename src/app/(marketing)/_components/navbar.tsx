"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/(marketing)/_components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {
  // use convex auth to get user data
  const { isAuthenticated, isLoading } = useConvexAuth();
  // monitor if user has scrolled to change the navbar style
  const scrolled = useScrollTop();
  return (
    <div
      className={cn(
        "z-50 dark:bg-[#1f1f1f] bg-background fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm",
      )}
    >
      <Logo />
      <div
        className={
          "md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2"
        }
      >
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode={"modal"}>
              <Button variant={"ghost"} size={"sm"}>
                Login
              </Button>
            </SignInButton>
            <SignInButton mode={"modal"}>
              <Button size={"sm"}>Get Jotion Free</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href={"/documents"}>Enter Jotion</Link>
            </Button>
            <UserButton afterSignOutUrl={"/"}></UserButton>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
