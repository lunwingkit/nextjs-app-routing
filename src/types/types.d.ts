interface PaymentRecord {
    success: boolean;
    payerName?: string;
    amount?: number;
    time?: Date;
    message?: string;
    errorDescription?: string;
    errorType?: string;
}

interface PaymentVerification {
    success: string;
}
interface User {
    firstName: string;
    lastName: string;
    email: string;
    image: string;
}

interface Reservation {
    startTime: number;
    endTime: number;
    headCount: number;
}