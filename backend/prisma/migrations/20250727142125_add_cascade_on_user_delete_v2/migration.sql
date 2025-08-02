-- DropForeignKey
ALTER TABLE "BillComponents" DROP CONSTRAINT "BillComponents_userBillid_fkey";

-- DropForeignKey
ALTER TABLE "UserBill" DROP CONSTRAINT "UserBill_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBillTypeConfiguration" DROP CONSTRAINT "UserBillTypeConfiguration_billTypeConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "UserBillTypeConfiguration" DROP CONSTRAINT "UserBillTypeConfiguration_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserBill" ADD CONSTRAINT "UserBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillComponents" ADD CONSTRAINT "BillComponents_userBillid_fkey" FOREIGN KEY ("userBillid") REFERENCES "UserBill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBillTypeConfiguration" ADD CONSTRAINT "UserBillTypeConfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBillTypeConfiguration" ADD CONSTRAINT "UserBillTypeConfiguration_billTypeConfigurationId_fkey" FOREIGN KEY ("billTypeConfigurationId") REFERENCES "BillTypeConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
