'use server'

import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function userExists() {
    const session = await auth();
  
    if (!session?.user) {
      redirect("/login");
    }
  
    return session.user;
  }