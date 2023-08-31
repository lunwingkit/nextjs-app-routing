import { fetchAllPaymeRecords } from "./googleApi";

export async function verifyPayment(from: number, to: number, amount: number, payerName?: string): Promise<PaymentVerification> {
    const records = await fetchAllPaymeRecords(from, to);
    for (const record of records) {
        if (record.amount === amount) {

            return {
                success: "success",
            };
        }
    }
    return {
        success: "failed",
    };
}