-- AlterTable
ALTER TABLE `dependant` MODIFY `dob` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `patient` MODIFY `age` INTEGER NULL,
    MODIFY `discharged` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `staff` MODIFY `age` INTEGER NULL;
