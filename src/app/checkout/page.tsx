import { Suspense } from "react";
import MultiStepForm from "./multiStepForm";
import dayjs, { Dayjs } from "dayjs";
import moment from 'moment-timezone';
import { calendar_v3 } from "googleapis";
import { fetchAllEvents } from "../lib/googleApi";
import Loading from "@/components/loading";
import { Alert } from "antd";
import NoLoginAlert from "./noLoginAlert";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(utc)
dayjs.extend(timezone)
// interface Event {
//     startTime: number,
//     endTime: number,
// }

const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};


function addToList(item: calendar_v3.Schema$Event, res: Map<number, number[]>): void {
    const start = dayjs(item.start?.dateTime).tz(item.start?.timeZone as string);
    const end = dayjs(item.end?.dateTime).tz(item.end?.timeZone as string);
    if (item.status == 'cancelled' || end < dayjs())
        return;
    if (start.get("date") !== end.get("date")) {
        const startKey = start.startOf("date").unix();
        // const startKey: string = "" + start.get("year") + "-" + start.get("month") + "-" + start.get("date");
        let newStartVal = res.get(startKey) || [];
        const startStartHour = start.get('hour');
        newStartVal = [...newStartVal, ...range(startStartHour, 23)];
        const uniqNewStartVal: number[] = Array.from(new Set(newStartVal));
        res.set(startKey, uniqNewStartVal);

        // const endKey: string = "" + end.get("year") + "-" + end.get("month") + "-" + end.get("date");
        const endKey = end.startOf("date").unix();
        let newEndVal = res.get(endKey) || [];
        const endEndHour = end.get('hour');
        newEndVal = [...newEndVal, ...range(0, endEndHour)];
        const uniqNewEndVal: number[] = Array.from(new Set(newEndVal));
        res.set(endKey, uniqNewEndVal);
    }
    else {
        // const key: string = "" + start.get("year") + "-" + start.get("month") + "-" + start.get("date");
        const key = start.startOf("date").unix();
        let newVal = res.get(key) || [];
        const startHour = start.tz(item.start?.timeZone as string).get('hour');
        const endHour = end.tz(item.end?.timeZone as string).get('hour');
        newVal = [...newVal, ...range(startHour, endHour)];
        const uniqNewVal: number[] = Array.from(new Set(newVal));
        res.set(key, uniqNewVal);
    }
}

async function filterValidEventList(): Promise<Map<number, number[]>> {
    let res = new Map<number, number[]>();
    // try {
    //     const internalEvents = await fetchAllEvents(process.env.GOOGLE_CALENDAR_ID_INTERNAL_RESERVATION as string, "");
    //     const clientEvents = await fetchAllEvents(process.env.GOOGLE_CALENDAR_ID_CLIENT_RESERVATION as string, "");

    //     for (const item of internalEvents.items || []) {
    //         addToList(item, res);
    //     }
    //     for (const item of clientEvents.items || []) {
    //         addToList(item, res);
    //     }
    // }
    // catch (e) {
    //     console.error(e);
    // }

    res.set(dayjs().startOf("date").unix(), Array.from(new Set([...res.get(dayjs().startOf("date").unix()) || [], ...range(0, dayjs().get("hour"))])));
    return res;
}
const Checkout: React.FC = async () => {
    const disabledHours: Map<number, number[]> = await filterValidEventList();
    return (
        <>
            <NoLoginAlert />
            <MultiStepForm mapYYYYMMDD2DisbledHours={disabledHours} />
        </>
    )
}
export default Checkout;
