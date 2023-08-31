
import { useSearchParams } from 'next/navigation'
import { NextRequest, NextResponse } from "next/server";
import { gmail_v1, } from "googleapis";
import { addGoogleCalendarEvents, fetchAllPaymeRecords } from "@/app/lib/googleApi";
import { verifyPayment } from '@/app/lib/paymentGateway';
import { Prisma, Reservation, Payment } from '@prisma/client';
import { createReservation } from '@/app/lib/prisma';

export async function GET(request: NextRequest): Promise<Response> {
    try {
        // const { from, to, amount, payerId } = params;
        const from = Number(request.nextUrl.searchParams.get("from"));
        const to = Number(request.nextUrl.searchParams.get("to"));
        const amount = Number(request.nextUrl.searchParams.get("amount"));
        const payerName = request.nextUrl.searchParams.get("payerName");
        const result: PaymentVerification = await verifyPayment(from, to, amount, payerName || undefined);
        
        return NextResponse.json(result);
        // const records = await fetchAllPaymeRecords();
        // let str = "";
        // for (const record of records) {
        //     str += JSON.stringify(record) + '\n';
        // }
        // return new Response(str);
    }
    catch (err) {
        console.log(err);
        const failed: PaymentVerification = { success: "error" };
        return NextResponse.json(failed);
        // return NextResponse.json({ error: err }, { status: 500 });
    }
}