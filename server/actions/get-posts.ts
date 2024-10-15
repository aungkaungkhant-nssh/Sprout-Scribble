"use server"

import { db } from "@/server";
import { posts } from "../schema";
// import { sql } from "drizzle-orm";


export default async function getPosts(){
    try {
        const data = await db.select().from(posts).execute();
        console.log("Posts:", data);
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}