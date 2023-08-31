// import { fetchAllData } from "@/utils/prisma";

export async function GET(request: Request): Promise<Response> {
    // const res = await fetchAllData();
    // return new Response(res);
    return new Response("Hellow World");
}