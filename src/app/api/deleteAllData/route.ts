// import { deleteAllData } from "@/utils/prisma";

export async function GET(request: Request): Promise<Response> {
    // deleteAllData();
    return new Response('Hello World!');
}