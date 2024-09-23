/*
  Warnings:

  - You are about to alter the column `sex` on the `dependant` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Char(1)`.
  - You are about to alter the column `sex` on the `doctor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Char(1)`.
  - You are about to alter the column `sex` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Char(1)`.
  - You are about to alter the column `sex` on the `staff` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Char(1)`.
  - Added the required column `Mname` to the `Dependant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quote` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientType` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dependant` ADD COLUMN `Mname` VARCHAR(255) NOT NULL,
    MODIFY `sex` CHAR(1) NOT NULL;

-- AlterTable
ALTER TABLE `doctor` ADD COLUMN `experience` VARCHAR(255) NOT NULL,
    ADD COLUMN `quote` VARCHAR(255) NOT NULL,
    MODIFY `age` INTEGER NULL,
    MODIFY `sex` CHAR(1) NOT NULL,
    MODIFY `employed` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `patient` ADD COLUMN `address` VARCHAR(255) NOT NULL,
    ADD COLUMN `patientType` VARCHAR(255) NOT NULL,
    MODIFY `sex` CHAR(1) NOT NULL;

-- AlterTable
ALTER TABLE `staff` ADD COLUMN `experience` VARCHAR(255) NOT NULL,
    MODIFY `sex` CHAR(1) NOT NULL;

-- CreateTable
CREATE TABLE `Count` (
    `id` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
