"use server"

import { db } from "@/server";
import { posts } from "../schema";


export default async function createPosts(formData: FormData){
    await db.insert(posts).values({
        title: formData.get("title") as string
    })
    
}