import { Prisma, Payment, PrismaClient, Reservation, Account } from '@prisma/client'
import { Kam, Killian, Ocean, OrderStatus, OrderTaker, Owen, PaymentFor, PaymentMethod, SYSTEM, PAYME, RESERVATION } from '@/utils/variables';

const prisma = new PrismaClient()

const newUser: Account = {
    accountId: 1,
    name: '',
    email: '',
    image: '',
    sub: '',
    id: '',
    provider: '',
    createTime: new Date(),
}

export async function upsertAccount(account : Account) {
    const user = await prisma.account.upsert({
        where: {
            sub: account.sub,
        },
        update: {
            name: account.name,
            email: account.email,
            image: account.image,
            id: account.id,
            provider: account.provider,
        },
        create: {
            name: account.name,
            email: account.email,
            image: account.image,
            sub: account.sub,
            id: account.id,
            provider: account.provider,
            createTime: new Date(),
        }
    });
    return user;
}

const newRe: Reservation = {
    id: 1,
    startTime: new Date(),
    endTime: new Date(),
    orderStatus: "",
    accountId: 1,
    orderTaker: "",
    referrer: null,
    afterCleaner: null,
}

const newPay: Payment = {
    id: 1,
    method: "",
    recordAmount: new Prisma.Decimal(1),
    recordPayerId: "",
    recordTime: new Date(),
    recordRemark: "",
    accountId: 1,
    paymentFor: "",
    reservationId: null,
    eventAttendeeId: null,
    receiverName: "",
    receivedConfirmedByRecipient: true,
    receivedConfirmedBySystem: true,
}

export async function createReservation(reservation: Reservation, payment: Payment,) {
    const newReservation = await prisma.reservation.create({
        data: {
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            orderStatus: reservation.orderStatus,
            accountId: reservation.accountId, //foreign key
            referrer: reservation.referrer,
            orderTaker: reservation.orderTaker,
            payments: {
                create: [
                    {
                        method: PAYME,
                        recordAmount: payment.recordAmount,
                        recordPayerId: payment.recordPayerId,
                        recordTime: payment.recordTime,
                        recordRemark: payment.recordRemark,
                        accountId: reservation.accountId,//foreign key
                        paymentFor: payment.paymentFor,
                        receiverName: payment.receiverName,
                        receivedConfirmedByRecipient: payment.receivedConfirmedByRecipient,
                        receivedConfirmedBySystem: payment.receivedConfirmedBySystem,
                    }
                ]
            },
            deposit: {
                create: {
                    amount: 500,
                    isReturned: false,
                    recipientName: Killian,
                }
            },
        }
    })
}