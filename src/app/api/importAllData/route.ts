import { NextRequest, NextResponse } from "next/server";
// import { importAllData } from "@/utils/prisma";

export async function GET(request: Request): Promise<Response> {
    try {
        // importAllData();
        return new Response(JSON.stringify(request.headers), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}

export const runtime = "nodejs";