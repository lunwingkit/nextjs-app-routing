import { NextRequest, NextResponse } from "next/server";
import { calendar_v3, google } from 'googleapis';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;
import Schema$Events = calendar_v3.Schema$Events;
import Params$Resource$Events$List = calendar_v3.Params$Resource$Events$List;
import { syncEvents } from '@/app/lib/googleApi';
import { sendWhatsappMessage } from "@/app/lib/greenApi";

import { gmail_v1, } from "googleapis";
import { addGoogleCalendarEvents, fetchAllPaymeRecords } from "@/app/lib/googleApi";
import { verifyPayment } from '@/app/lib/paymentGateway';
import { Prisma, Reservation, Payment } from '@prisma/client';
import { createReservation } from '@/app/lib/prisma';

export async function POST(request: Request): Promise<Response> {
    try {
        const data = request.headers.get('abc');
        const newRe: Reservation = {
            id: 999,//useless
            startTime: new Date(),
            endTime: new Date(),
            orderStatus: "",//hardcode
            accountId: 999,//useless
            orderTaker: 'SYSTEM',//hardcode
            referrer: '',//hardcode
            afterCleaner: null,//useless
        }

        const newPay: Payment = {
            id: 999, //useless
            method: "",//hardcode
            recordAmount: new Prisma.Decimal(1),
            recordPayerId: "",
            recordTime: new Date(),
            recordRemark: "",
            accountId: 1, //useless
            paymentFor: "",//hardcode
            reservationId: null, //useless
            eventAttendeeId: null,//useless
            receiverName: "",//hardcode
            receivedConfirmedByRecipient: true,//hardcode
            receivedConfirmedBySystem: true,//hardcode
        }

        createReservation(newRe, newPay);
        addGoogleCalendarEvents();


        return new Response("Hello World", { status: 200, })
    }
    catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
    // return new Response(JSON.stringify(request));
}