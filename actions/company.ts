"use server";

import { userExists } from "@/utils/hooks";

export const createCopany = async () => {
    const user = await userExists()

    
}; 
