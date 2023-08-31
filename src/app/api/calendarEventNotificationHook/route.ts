import { NextRequest, NextResponse } from "next/server";
import { calendar_v3, google } from 'googleapis';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;
import Schema$Events = calendar_v3.Schema$Events;
import Params$Resource$Events$List = calendar_v3.Params$Resource$Events$List;
import { syncEvents } from '@/app/lib/googleApi';
import { sendWhatsappMessage } from "@/app/lib/greenApi";




async function pushEventChangeNotification(request: Request) {
    //1 parse result from Google Calendar
    const uri = request.headers.get('x-goog-resource-uri');
    const calendarId: string = uri?.split('/calendars/')[1].split('/events?')[0] as string;

    if (calendarId == undefined || calendarId.length == 0)
        return;
    //2 api call to Google Calendar API
    const recepientId = "120363150028724722@g.us";
    const message = await syncEvents(calendarId);

    //3 api call to green api to boradcast whatsapp message
    const resp = await sendWhatsappMessage(recepientId, message);
    console.log(resp);
}

export async function POST(request: Request): Promise<Response> {
    try {
        await pushEventChangeNotification(request);
        return new Response("Hello World", { status: 200, })
    }
    catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
    // return new Response(JSON.stringify(request));
}

export async function GET(request: Request): Promise<Response> {
    return new Response('You should use POST method instead of GET!');
}