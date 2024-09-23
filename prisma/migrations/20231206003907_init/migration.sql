/*
  Warnings:

  - The primary key for the `doctoronpatient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `doctoronpatient` table. All the data in the column will be lost.
  - The primary key for the `staffonpatient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `staffonpatient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dependant` MODIFY `age` INTEGER NULL;

-- AlterTable
ALTER TABLE `doctoronpatient` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`doctorid`, `patientid`);

-- AlterTable
ALTER TABLE `staffonpatient` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`staffid`, `patientid`);
