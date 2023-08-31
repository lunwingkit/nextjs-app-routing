import { gmail_v1, calendar_v3, google } from 'googleapis';
import { OAuth2Client, Credentials, GoogleAuth, JWT, auth } from 'google-auth-library';
import { NextResponse } from "next/server";
import moment from 'moment-timezone';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;
import Schema$Events = calendar_v3.Schema$Events;
import Schema$Message = gmail_v1.Schema$Message;
import Params$Resource$Events$List = calendar_v3.Params$Resource$Events$List;
// import { PrismaClient } from '@prisma/client'
// import { parseEmail } from './emailParser';
import { timeZoneHongKong } from '@/types/constants';

// const prisma = new PrismaClient()
const outputDateTimeFormat = "DD MMM yy HH:mm:ss";

export async function fetchAllPaymeRecords(from: number = 1672502400, to: number = 1704038400): Promise<PaymentRecord[]> {
    const allMails = await fetchAllEmails(from, to);
    const paymentRecords: PaymentRecord[] = [];
    for (const mail of allMails) {
        // paymentRecords.push(parseEmail(mail.snippet as string));
    }
    return paymentRecords;
}
export async function fetchAllEmails(from: number, to: number, paymentMethod: string = "payme"): Promise<Schema$Message[]> {
    const clientID = process.env.GOOGLE_OAUTH2_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
    // const redirectUri = "https://www.membersonlyhk.com";

    const oauth2Client = new google.auth.OAuth2(
        clientID,
        clientSecret,
        // redirectUri,
    )

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN,
    });

    const { token } = await oauth2Client.getAccessToken();
    console.log(token);
    const config = {
        header: {
            Authorization: `Bearer ${token}`,
        }
    }

    const userId = "me";
    const payme = "from:no-reply@secure-app.payme.hsbc.com.hk";
    const fps = "(from:HSBC@notification.hsbc.com.hk subject:Fund transfer credit advice 轉賬存款通知書)";
    const union = `(${payme} OR ${fps})`;

    let paymentQ = "";
    if (paymentMethod === "fps") {
        paymentQ = fps;
    }
    else if (paymentMethod === "payment") {
        paymentQ = payme;
    }
    else {
        paymentQ = union;
    }

    const epochTimeFrom = from;
    const epochTimeTo = to;
    const timeRange = `(after:${epochTimeFrom} before:${epochTimeTo})`
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client, headers: config.header });
    const q = `${union} AND ${timeRange}`;
    // console.log(q);
    const emailIDList = await gmail.users.messages.list({
        userId: userId,
        q: q,
    });
    const emailList: gmail_v1.Schema$Message[] = [];
    //https://developers.google.com/oauthplayground/?code=4/0Adeu5BVq6xmrJKCJMpyYR3KDOeKo-ZAKV4gajxNeUlaAHLy0HASgdidZ_oIqvRYmhxi2og&scope=https://mail.google.com/%20https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.com/auth/gmail.addons.current.action.compose%20https://www.googleapis.com/auth/gmail.addons.current.message.action%20https://www.googleapis.com/auth/gmail.addons.current.message.readonly%20https://www.googleapis.com/auth/gmail.addons.current.message.metadata%20https://www.googleapis.com/auth/gmail.metadata%20https://www.googleapis.com/auth/gmail.send%20https://www.googleapis.com/auth/gmail.labels%20https://www.googleapis.com/auth/gmail.insert%20https://www.googleapis.com/auth/gmail.settings.sharing%20https://www.googleapis.com/auth/gmail.settings.basic%20https://www.googleapis.com/auth/gmail.compose%20https://www.googleapis.com/auth/gmail.modify
    //(from:no-reply@secure-app.payme.hsbc.com.hk OR (from:HSBC@notification.hsbc.com.hk subject:Fund transfer credit advice 轉賬存款通知書)) AND (after:1690193182 before:1692953182 ) 
    // console.log(res);

    for (const message of emailIDList.data.messages as gmail_v1.Schema$Message[]) {
        const mail = (await gmail.users.messages.get({
            userId: userId,
            id: message.id as string,
        })).data;
        emailList.push(mail);
    }
    //https://stateful.com/blog/gmail-api-node-tutorial
    return emailList;
}

//TODO: move to EV
const credentials = `{
    "type": "service_account",
    "project_id": "membersonly-396801",
    "private_key_id": "46967cc4d7da0c9519d842ff04f8273ae2ccd50b",
    "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLS6DxLDcgSfzj\\n/SITq251lebCtv2fLPC+/jQ5N2MAVZdVl881nJMvvhfOoJHdKLoMYAkVAZFf1+Xd\\ngKxNXyDZmj5cCwf19MCwe1YCDcNCV+f/qB3b58UacjRRFbX7MzNlOhJ1Vww0so2W\\nm2hS2nzxcTEPlgW70LmQczNVqv8ugqrVEZ3t6fBc4Z/fu9XHUkhaQXERTqfVCnO+\\nQPVhDr2/e5eJ7kNR7jrjhvYleLGHhda10Xia7jbRJvA8Ipq3fzW45EWRKnVDvePb\\nMBH9OhfMz2WrwDbQkWTsqQgH544UEBnT0uegz5/EGNivF84hdqOH5EQCYO+ZYmDq\\n3inBm8vjAgMBAAECggEADJF4uhBFZDNOytA2esgpbw7nvPf6hrcM4dyYtposU7P2\\n7tgQ0RFaBCSYwjHTyBF21xcE2LidF94ixuaSlcH2J53NPHwuGiWZ2A9NSkPhjh4d\\n01oTESpWBC7f+cysJdiM1TWZjd7mJp03UFf77iC12BNrDg9J/B+I/rDbO/DzZRjw\\nuU4dUuP+zJHRgaa+8Q75HOS/FOlmuXs2RtpzpgHqVdj2TTE9s5H+in0M8hvsC5RJ\\n4AF1djHY2MiVZYfQ7LjT1P2q3TM5ForZcu3Og3AY5vjeRjhcI3PdQRzSoZho4QtA\\njpZ+D1lxyapZdq7VPb2/f9oHgylpQ18mDQ3fScMOaQKBgQDsxBayky1x27q6FndC\\nfJMcuuTHjkBye7cCDf538Yw/17MTAGkhrWNuviU3Co55/Tbbam0N8IT0o5JVenf5\\nZlJcKBZu+Qt+EVy4b9RfcK9LQD6V7ojHoOMvMK5SYHoirtV0maCjI4l/+zZQibQf\\n+jwVvMBclOaWyXR+gVdF6Yy6DQKBgQDbz3f70vR+oyXhwT+m1AIymisw1M5U182S\\nn86UPKydIhqwgN8nck8lFBL98SM9viPsuPlf7NxwqaAXtLiw/qw28RtaXK400N6n\\nQLFjkyNNq+X3v/+plHrL90h2hyiwBs2SuXzYxVW4zyGk9LKvnMBctDExFoVLAn4Q\\ne0Pvg5TRrwKBgA0RMXN/nfV3vBGDJefcej4Orou49SOcYlhRr2atRSFM5Uw6LJM4\\nP5GgGuuzwHNJH1ryv7wSNzRNRslC7hYsqIT/jWVoh1LY4HYpbd4qmPIdRJb/yDrE\\nTWWQWT6gpnz9izhZNj1qu679jVzajL9rDx/f//ncGfHegnhs6QUpw6ONAoGAX21+\\nxZEcHC5wL8ZZ/+9i1N0hix2YRjU6RkGiybBdsAoyVBZeyx1RRuOkKyMZDaESr57O\\nhNqsCS1bF2+aDx1BXsjl+yDpcHyNbUcku/oRBZNvT1PHhrOzbAF7MBoVi/YoIV7t\\n2J4zTPx/usGRIbSHvrdr88e3Lo1ydW1OXRle7nkCgYEAhxcSctnyYic/KaTPBcxU\\nYFBPj0KXnZt/960BdL3Da5XMzIPY9WDkdyeE1/rGLbOUpaJAqle01yIEKjGwdW01\\nTZWXsTvVnFhR/SZ6N+1EEfOecFh2eDtYsG8QMmjdrpE1zz/8cxOscd8fPwU7ZTSY\\naY+uAd+MScKBhU1XiwQrX/A=\\n-----END PRIVATE KEY-----\\n",
    "client_email": "membersonly@membersonly-396801.iam.gserviceaccount.com",
    "client_id": "106248559322986728124",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/membersonly%40membersonly-396801.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
    }`;

function getCalendar(): Calendar {
    const client = <JWT>auth.fromJSON(JSON.parse(credentials));
    client.scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar',
    ];
    const calendar: Calendar = google.calendar({ version: "v3", auth: client });
    return calendar;
}

export async function addEvents(){

}

export async function fetchAllEvents(calendarId: string, syncToken: string): Promise<Schema$Events> {
    const params: Params$Resource$Events$List = {
        calendarId: calendarId,
        syncToken: syncToken,
    }
    return (await getCalendar().events.list(params)).data;
}

async function fetchDeletedEvent(calendarId: string, eventId: string): Promise<Schema$Event> {
    return (await getCalendar().events.get({ calendarId, eventId })).data;
}



async function getEventDetail(calendarId: string, event: Schema$Event): Promise<string> {
    var title: string = "";

    if (event.status === "confirmed") {
        title = "以下活動已被新增/修改:";
    }
    else if (event.status === "cancelled") {
        event = await fetchDeletedEvent(calendarId, event?.id as string);
        title = "以下活動已被刪除:";
    }
    else {
        title = "未知活動狀態類別:";
    }

    console.log(event);

    const calendarName = event.organizer?.displayName || "";
    const startTime = moment(event.start?.dateTime)?.tz(event.start?.timeZone as string)?.format(outputDateTimeFormat) || moment(event.start?.date)?.tz(timeZoneHongKong)?.format(outputDateTimeFormat) || "";
    const endTime = moment(event.end?.dateTime)?.tz(event.end?.timeZone as string)?.format(outputDateTimeFormat) || moment(event.end?.date)?.tz(timeZoneHongKong)?.format(outputDateTimeFormat) || "";
    const createdTime = moment(event.created)?.tz(timeZoneHongKong)?.format(outputDateTimeFormat) || "";
    const eventTitle = event.summary;
    const eventDescription = event.description || "N/A";
    const eventCreator = event.creator?.email || "N/A";
    const tmp = `${title}
日曆${calendarName}
標題:${eventTitle}
內容:${eventDescription}
由${startTime}
至${endTime}
由使用者${eventCreator}於${createdTime}建立
`;
    return tmp;
}



export async function syncEvents(calendarId: string): Promise<string> {
    // const syncToken = await getSyncToken(calendarId);


    // const params: Params$Resource$Events$List = {
    //     calendarId: calendarId,
    //     syncToken: syncToken,
    // }

    // const events: Schema$Events = await fetchAllEvents(calendarId, syncToken);
    // if (events.nextSyncToken != null && events.nextSyncToken?.trim().length !== 0) {
    //     await insertSyncToken(events.nextSyncToken, calendarId);
    // }

    let res = "";
    // console.log(events);
    // // const event: Schema$Event = (await calendar.events.get({ calendarId, eventId })).data;
    // if (events.items == undefined || events.items?.length === 0) {
    //     res = "No update. Unknown error occured.";
    // }
    // else {
    //     for (const item of events.items) {
    //         res += await getEventDetail(calendarId, item);
    //     }
    // }
    return res;
}


// async function getSyncToken(calendarId: string): Promise<string> {
//     const syncToken = await prisma.syncToken.findFirst({
//         where: {
//             calendarId: {
//                 equals: calendarId,
//             },
//         },
//         orderBy: {
//             createTime: 'desc',
//         },
//     });
//     return syncToken?.syncToken || "";
// }

// async function insertSyncToken(syncToken: string, calendarId: string) {
//     try {
//         await prisma.syncToken.create({
//             data: {
//                 syncToken: syncToken,
//                 createTime: new Date(),
//                 calendarId: calendarId,
//             }
//         })
//     } catch (e) {
//         console.log(e);
//     }
// }