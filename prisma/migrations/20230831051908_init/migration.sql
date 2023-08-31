-- CreateTable
CREATE TABLE "Widget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncToken" (
    "syncToken" STRING NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL,
    "calendarId" STRING NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "GoogleOAuth2RefreshToken" (
    "refreshToken" STRING NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "name" STRING NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "accountId" INT4 NOT NULL,
    "eventId" INT4 NOT NULL,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "orderStatus" STRING NOT NULL,
    "accountId" INT4 NOT NULL,
    "referrer" STRING,
    "orderTaker" STRING NOT NULL,
    "afterCleaner" STRING,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "method" STRING NOT NULL,
    "recordAmount" DECIMAL(65,30) NOT NULL,
    "recordPayerId" STRING NOT NULL,
    "recordTime" TIMESTAMP(3) NOT NULL,
    "recordRemark" STRING NOT NULL,
    "accountId" INT4 NOT NULL,
    "paymentFor" STRING NOT NULL,
    "reservationId" INT4,
    "eventAttendeeId" INT4,
    "receiverName" STRING NOT NULL,
    "receivedConfirmedByRecipient" BOOL NOT NULL DEFAULT false,
    "receivedConfirmedBySystem" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "reservationId" INT4 NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 500,
    "isReturned" BOOL NOT NULL DEFAULT false,
    "recipientName" STRING,
    "returnerName" STRING,
    "recordTime" TIMESTAMP(3),
    "recordRemark" STRING,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "accountId" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "name" STRING,
    "email" STRING,
    "image" STRING,
    "sub" STRING NOT NULL,
    "id" STRING,
    "provider" STRING NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Contact" (
    "accountId" INT4 NOT NULL,
    "channel" STRING NOT NULL,
    "contactId" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SyncToken_syncToken_calendarId_key" ON "SyncToken"("syncToken", "calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleOAuth2RefreshToken_refreshToken_createTime_key" ON "GoogleOAuth2RefreshToken"("refreshToken", "createTime");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_reservationId_key" ON "Deposit"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountId_key" ON "Account"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_sub_key" ON "Account"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_accountId_channel_contactId_key" ON "Contact"("accountId", "channel", "contactId");

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_eventAttendeeId_fkey" FOREIGN KEY ("eventAttendeeId") REFERENCES "EventAttendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;
