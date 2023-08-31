// import { cache } from 'react'

import { Event, EventAttendee, PrismaClient, Account } from '@prisma/client'

const prisma = new PrismaClient()

export const revalidate = 10 // revalidate the data at most every hour

// export const fetchAllReservations = async () => {
//     const allreservations = await prisma.reservation.findMany(); //db.item.findUnique({ id })
//     const allInternalReservations = await prisma.internalReservation.findMany(); //db.item.findUnique({ id })
//     const res = [...allreservations, ...allInternalReservations];
//     // console.log(res);
//     return res;
//     // return [{ startTime: new Date(), endTime: new Date() }, { startTime: new Date(), endTime: new Date() }]
// }

// for nextjs
// export const fetchAllReservations = cache(async () => {
//     const allreservations = await prisma.reservation.findMany(); //db.item.findUnique({ id })
//     const allInternalReservations = await prisma.internalReservation.findMany(); //db.item.findUnique({ id })
//     const res = [...allreservations, ...allInternalReservations];
//     console.log(res);
//     return res;
//     // return [{ startTime: new Date(), endTime: new Date() }, { startTime: new Date(), endTime: new Date() }]
// })

// export async function deleteAllData() {
//     const a = await prisma.event.deleteMany();
//     const b = await prisma.eventAttendee.deleteMany();
//     const c = await prisma.internalReservation.deleteMany();
//     const d = await prisma.payment.deleteMany();
//     const e = await prisma.reservation.deleteMany();
//     const f = await prisma.user.deleteMany();
//     const g = await prisma.deposit.deleteMany();
// }

// export async function fetchAllData(): Promise<string> {
//     let all: string = "";
//     try {

//         const a = await prisma.event.findMany();
//         const b = await prisma.eventAttendee.findMany();
//         const c = await prisma.internalReservation.findMany();
//         const d = await prisma.payment.findMany();
//         const e = await prisma.reservation.findMany();
//         const f = await prisma.user.findMany();
//         const g = await prisma.deposit.findMany();

//         all = "EVENT\n " + JSON.stringify(a) + "\n" +
//             "EVENT_ATTENDEE\n " + JSON.stringify(b) + "\n" +
//             "INTERNAL_RESERVATION\n " + JSON.stringify(c) + "\n" +
//             "PAYMENT\n " + JSON.stringify(d) + "\n" +
//             "RESERVATION\n " + JSON.stringify(e) + "\n" +
//             "USER\n " + JSON.stringify(f) + "\n" +
//             "DEPOSIT\n " + JSON.stringify(g);
//     }
//     catch (e) {
//         console.log(e);

//     }

//     return all;
// }

// async function addUser(user: any): Promise<User | undefined> {
//     try {
//         const user8 = await prisma.user.create({
//             data: {
//                 name: user.name, twitterId: user.twitterId, whatsappId: user.whatsappId
//             }
//         });

//         return user8;
//     }
//     catch (e) {
//         console.log(e)
//     }
//     return undefined;
// }

// async function addEventAttendee(user: User, attendee: any, event: Event): Promise<EventAttendee | undefined> {
//     try {
//         const eventAttendee5 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user.id }, },
//                 event: { connect: { id: event.id }, },
//                 payments: {
//                     create: [{
//                         method: attendee.method, recordAmount: attendee.recordAmount, recordPayerId: attendee.recordPayerId, recordTime: attendee.recordTime, recordRemark: attendee.recordRemark,
//                         paymentFor: attendee.paymentFor, receiverName: attendee.receiverName, receivedConfirmedByRecipient: attendee.receivedConfirmedByRecipient, receivedConfirmedBySystem: attendee.receivedConfirmedBySystem,
//                         user: { connect: { id: user.id }, },
//                     }]
//                 }
//             }
//         });
//         return eventAttendee5;
//     }
//     catch (e) {
//         console.log(e)
//     }
//     return undefined;
// }


// async function addReservation(clientObject: any) {
//     const reservationUser = await prisma.user.create({
//         data: {
//             name: clientObject.user.name, whatsappId: clientObject.user.whatsappId, twitterId: clientObject.user.twitterId
//         },
//     });
//     const reservation = await prisma.reservation.create({
//         data: {
//             user: { connect: { id: reservationUser.id } },
//             startTime: clientObject.reservation.startTime, endTime: clientObject.reservation.endTime, orderStatus: clientObject.reservation.orderStatus,
//             referrer: clientObject.reservation.referrer, orderTaker: clientObject.reservation.orderTaker, afterCleaner: clientObject.reservation.afterCleaner,
//             payments: {
//                 create:
//                     clientObject.payments.map((payment: any) => {
//                         return {
//                             user: { connect: { id: reservationUser.id } },
//                             method: payment.method,
//                             recordAmount: payment.recordAmount, recordPayerId: payment.recordPayerId, recordTime: payment.recordTime, recordRemark: payment.recordRemark,
//                             paymentFor: payment.paymentFor, receiverName: payment.receiverName, receivedConfirmedByRecipient: payment.receivedConfirmedByRecipient, receivedConfirmedBySystem: payment.receivedConfirmedBySystem,
//                         };
//                     })
//             },
//         }
//     });
//     const deposit = await prisma.deposit.create({
//         data: {
//             reservation: { connect: { id: reservation.id } },
//             amount: clientObject.deposit.amount, isReturned: clientObject.deposit.isReturned, recipientName: clientObject.deposit.recipientName,
//             returnerName: clientObject.deposit.returnerName, recordTime: clientObject.deposit.recordTime, recordRemark: clientObject.deposit.recordRemark,
//         }
//     })
// }

// export async function importAllData() {

//     await prisma.internalReservation.createMany({
//         data: [
//             { startTime: '2023-08-09T19:00:00+08:00', endTime: '2023-08-09T23:00:00+08:00', userName: Ocean },
//             { startTime: '2023-08-16T19:00:00+08:00', endTime: '2023-08-16T23:00:00+08:00', userName: Owen },
//             { startTime: '2023-08-18T14:00:00+08:00', endTime: '2023-08-18T18:00:00+08:00', userName: Kam },
//             { startTime: '2023-08-21T14:00:00+08:00', endTime: '2023-08-18T18:00:00+08:00', userName: Kam },
//             { startTime: '2023-08-21T19:00:00+08:00', endTime: '2023-08-18T23:00:00+08:00', userName: Ocean },
//         ]
//     })

//     const clientObject1 = {
//         user: { name: 'Razellazaro', whatsappId: '91952242', },
//         reservation: { startTime: '2023-08-04T18:00:00+08:00', endTime: '2023-08-04T21:00:00+08:00', orderStatus: OrderStatus[OrderStatus.COMPLETED], referrer: Ocean, orderTaker: OrderTaker[OrderTaker.GOOGLE_FORM], afterCleaner: Owen, },
//         deposit: { amount: 300, isReturned: true, recipientName: 'K S', returnerName: Kam, recordTime: '2023-08-04T21:48:00+08:00', recordRemark: 'thanks!', },
//         payments: [
//             {
//                 method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 800, recordPayerId: 'K S', recordTime: '2023-08-03T12:30:00+08:00', recordRemark: '4/8 1800-2100',
//                 paymentFor: PaymentFor[PaymentFor.RESERVATION], receiverName: Kam, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//             },
//         ],
//     }
//     addReservation(clientObject1);

//     const clientObject2 = {
//         user: { name: 'Terence Lam', },
//         reservation: { startTime: '2023-08-12T14:00:00+08:00', endTime: '2023-08-12T17:00:00+08:00', orderStatus: OrderStatus[OrderStatus.COMPLETED], referrer: Owen, orderTaker: Owen, afterCleaner: Owen, },
//         deposit: { amount: 500, isReturned: true, recipientName: 'Terence Lam', returnerName: Killian, recordTime: '2023-08-12T17:40:00+08:00', recordRemark: 'Return deposit', },
//         payments: [
//             {
//                 method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 500, recordPayerId: 'Terence Lam', recordTime: '2023-08-12T12:16:00+08:00', recordRemark: '2~5pm',
//                 paymentFor: PaymentFor[PaymentFor.RESERVATION], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//             },
//             {
//                 method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 500, recordPayerId: 'Terence Lam', recordTime: '2023-08-12T12:18:00+08:00', recordRemark: 'deposit',
//                 paymentFor: PaymentFor[PaymentFor.RESERVATION], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//             },
//         ],
//     }
//     addReservation(clientObject2);

//     const clientObject3 = {
//         user: { name: 'Ben', twitterId: 'bfut641', },
//         reservation: { startTime: '2023-08-15T14:00:00+08:00', endTime: '2023-08-15T17:00:00+08:00', orderStatus: OrderStatus[OrderStatus.PAYMENT_RECEIVED], referrer: Ocean, orderTaker: OrderTaker[OrderTaker.GOOGLE_FORM], afterCleaner: Owen, },
//         deposit: { amount: 300, isReturned: false, },
//         payments: [
//             {
//                 method: PaymentMethod[PaymentMethod.FPS], recordAmount: 1000, recordPayerId: 'YUK W** T****', recordTime: '2023-08-10T18:47:00+08:00', recordRemark: 'FRN20230810PAYC0101183062573',
//                 paymentFor: PaymentFor[PaymentFor.RESERVATION], receiverName: Kam, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//             },
//         ],
//     }
//     addReservation(clientObject3);

//     const clientObject4 = {
//         user: { name: 'ginger00112', whatsappId: '69267842', },
//         reservation: { startTime: '2023-08-16T11:00:00+08:00', endTime: '2023-08-16T14:00:00+08:00', orderStatus: OrderStatus[OrderStatus.PAYMENT_RECEIVED], referrer: Ocean, orderTaker: OrderTaker[OrderTaker.GOOGLE_FORM], },
//         deposit: { amount: 500, isReturned: false, },
//         payments: [
//             {
//                 method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 800, recordPayerId: 'Chi Yeung Samuel Lo', recordTime: '2023-08-06T08:46:00+08:00', recordRemark: '8月14 11-2',
//                 paymentFor: PaymentFor[PaymentFor.RESERVATION], receiverName: Kam, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//             },
//         ],
//     }
//     addReservation(clientObject4);

//     const clientObject5 = {
//         user: { name: 'William', whatsappId: '97332307', },
//         reservation: { startTime: '2023-08-18T18:30:00+08:00', endTime: '2023-08-18T20:30:00+08:00', orderStatus: OrderStatus[OrderStatus.PAYMENT_RECEIVED], referrer: Ocean, orderTaker: OrderTaker[OrderTaker.GOOGLE_FORM], },
//         deposit: { amount: 500, isReturned: false },
//         payments: [
//             {
//                 method: PaymentMethod[PaymentMethod.FPS], recordAmount: 1500, recordPayerId: 'MR CHANG C** Y*** R******', recordTime: '2023-08-12T00:00:00+08:00', recordRemark: 'HC12381255762190',
//                 paymentFor: PaymentFor[PaymentFor.RESERVATION], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//             },
//         ],
//     }
//     addReservation(clientObject5);

//     const event1 = await prisma.event.create({
//         data: {
//             name: '首次體驗日', startTime: '2023-09-02T19:00:00+08:00', endTime: '2023-09-02T22:00:00+08:00',
//         }
//     })

//     try {


//         const user1 = await prisma.user.create({
//             data: {
//                 name: '鹿仔', twitterId: 'deer6green',
//             }
//         });
//         const eventAttendee1 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user1.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Gaon Lam', recordTime: '2023-08-10T21:59:00+08:00', recordRemark: '9月2日體驗營',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user1.id }, },
//                     }]
//                 }
//             }
//         });

//         const user2 = await prisma.user.create({
//             data: {
//                 name: 'TanSam', twitterId: 'TanSam73784063',
//             }
//         });
//         const eventAttendee2 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user2.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Alan Chan', recordTime: '2023-08-11T00:52:00+08:00', recordRemark: '9月2號報名費',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user2.id }, },
//                     }]
//                 }
//             }
//         });

//         const user3 = await prisma.user.create({
//             data: {
//                 name: 'Ben Ng', twitterId: 'HeiNg95063250',
//             }
//         });
//         const eventAttendee3 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user3.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Tak Hei ng', recordTime: '2023-08-12T13:20:00+08:00', recordRemark: '報名費',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user3.id }, },
//                     }]
//                 }
//             }
//         });

//         const user4 = await prisma.user.create({
//             data: {
//                 name: 'JIZBAR', twitterId: 'JIZBAR',
//             }
//         });
//         const eventAttendee4 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user4.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: '.casper .cheng', recordTime: '2023-08-12T16:33:00+08:00', recordRemark: '[MO] 體驗日 @JIZBAR',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user4.id }, },
//                     }]
//                 }
//             }
//         });


//         const user5 = await prisma.user.create({
//             data: {
//                 name: 'Aris Lam', twitterId: '',
//             }
//         });
//         const eventAttendee5 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user5.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'LAM C*** H***', recordTime: '2023-08-13T00:00:00+08:00', recordRemark: 'HC12381356596201',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user5.id }, },
//                     }]
//                 }
//             }
//         });

//         const user6 = await prisma.user.create({
//             data: {
//                 name: 'Jacky Lui', twitterId: '',
//             }
//         });
//         const eventAttendee6 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user6.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Jacky Lui', recordTime: '2023-08-14T17:20:00+08:00', recordRemark: '2023年9月2日 啟驗Day',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user6.id }, },
//                     }]
//                 }
//             }
//         });

//         const user7 = await prisma.user.create({
//             data: {
//                 name: 'Chun Seng Hong', twitterId: '',
//             }
//         });
//         const eventAttendee7 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user7.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Chun Seng Hong', recordTime: '2023-08-15T01:09:00+08:00', recordRemark: `tachibanana for 2/9`,
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user7.id }, },
//                     }]
//                 }
//             }
//         });

//         const user8 = await prisma.user.create({
//             data: {
//                 name: 'Adam Lo', twitterId: '',
//             }
//         });
//         const eventAttendee8 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user8.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Adam Lo', recordTime: '2023-08-15T18:04:00+08:00', recordRemark: '92',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user8.id }, },
//                     }]
//                 }
//             }
//         });

//         const user9 = await prisma.user.create({
//             data: {
//                 name: 'Jason D', twitterId: '',
//             }
//         });
//         const eventAttendee9 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user9.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Jason D', recordTime: '2023-08-15T20:37:00+08:00', recordRemark: 'Event admission fee',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user9.id }, },
//                     }]
//                 }
//             }
//         });

//         const user10 = await prisma.user.create({
//             data: {
//                 name: 'Mark Chan', twitterId: '',
//             }
//         });
//         const eventAttendee10 = await prisma.eventAttendee.create({
//             data: {
//                 user: { connect: { id: user10.id }, },
//                 event: { connect: { id: event1.id }, },
//                 payments: {
//                     create: [{
//                         method: PaymentMethod[PaymentMethod.PAYME], recordAmount: 200, recordPayerId: 'Mark Chan', recordTime: '2023-08-16T22:12:00+08:00', recordRemark: '2/9',
//                         paymentFor: PaymentFor[PaymentFor.EVENT], receiverName: Killian, receivedConfirmedByRecipient: true, receivedConfirmedBySystem: true,
//                         user: { connect: { id: user10.id }, },
//                     }]
//                 }
//             }
//         });
//     }
//     catch (e) {
//         console.log(e);
//     }

// }