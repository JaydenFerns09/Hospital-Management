-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `Fname` VARCHAR(255) NOT NULL,
    `Mname` VARCHAR(255) NULL,
    `Lname` VARCHAR(255) NULL,
    `report` VARCHAR(255) NULL,
    `dob` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `phone` BIGINT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `room` VARCHAR(255) NOT NULL,
    `sex` VARCHAR(10) NOT NULL,
    `blood_group` VARCHAR(255) NOT NULL,
    `allergies` VARCHAR(255) NOT NULL,
    `treatment` VARCHAR(255) NOT NULL,
    `discharged` BOOLEAN NOT NULL,

    UNIQUE INDEX `Patient_phone_key`(`phone`),
    UNIQUE INDEX `Patient_email_key`(`email`),
    INDEX `unique_phone`(`phone`),
    INDEX `unique_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_no` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` VARCHAR(191) NOT NULL,
    `inital_cost` DOUBLE NOT NULL,
    `extra_cost` DOUBLE NULL,
    `total_amount` DOUBLE NOT NULL,
    `paid_amount` DOUBLE NOT NULL,
    `due_amount` DOUBLE NOT NULL,
    `mode_of_payment` VARCHAR(191) NOT NULL,
    `patientid` VARCHAR(191) NOT NULL,

    INDEX `idx_mode_of_payment`(`mode_of_payment`),
    INDEX `idx_transactions`(`transaction_no`, `patientid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `Fname` VARCHAR(255) NOT NULL,
    `Mname` VARCHAR(255) NULL,
    `Lname` VARCHAR(255) NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `StartDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dob` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `phone` BIGINT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `blood_group` VARCHAR(255) NOT NULL,
    `sex` VARCHAR(10) NOT NULL,
    `room` VARCHAR(255) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `designation` VARCHAR(255) NOT NULL,
    `speciality` VARCHAR(255) NOT NULL,
    `field` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Doctor_username_key`(`username`),
    UNIQUE INDEX `Doctor_phone_key`(`phone`),
    UNIQUE INDEX `Doctor_email_key`(`email`),
    INDEX `unique_doctor_username`(`username`),
    INDEX `unique_doctor_email`(`email`),
    INDEX `unique_doctor_phone`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `Fname` VARCHAR(255) NOT NULL,
    `Mname` VARCHAR(255) NULL,
    `Lname` VARCHAR(255) NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dob` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `phone` BIGINT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `room` VARCHAR(255) NOT NULL,
    `sex` VARCHAR(10) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `blood_group` VARCHAR(255) NOT NULL,
    `designation` VARCHAR(255) NOT NULL,
    `salary` DOUBLE NOT NULL,

    UNIQUE INDEX `Staff_username_key`(`username`),
    UNIQUE INDEX `Staff_phone_key`(`phone`),
    UNIQUE INDEX `Staff_email_key`(`email`),
    INDEX `unique_staff_username`(`username`),
    INDEX `unique_staff_email`(`email`),
    INDEX `unique_staff_phone`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Qualifications` (
    `id` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(191) NULL,
    `staffId` VARCHAR(191) NULL,
    `degree` VARCHAR(255) NOT NULL,
    `degree_img` VARCHAR(255) NOT NULL,
    `year` VARCHAR(255) NOT NULL,
    `institute` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medication` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `dosage` VARCHAR(255) NOT NULL,
    `frequency` VARCHAR(255) NOT NULL,
    `patientid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dependant` (
    `id` VARCHAR(191) NOT NULL,
    `Fname` VARCHAR(255) NOT NULL,
    `Lname` VARCHAR(255) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `phone` BIGINT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `sex` VARCHAR(10) NOT NULL,
    `relation` VARCHAR(255) NOT NULL,
    `patientid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DoctorOnPatient` (
    `id` VARCHAR(191) NOT NULL,
    `patientid` VARCHAR(191) NOT NULL,
    `doctorid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffOnPatient` (
    `id` VARCHAR(191) NOT NULL,
    `patientid` VARCHAR(191) NOT NULL,
    `staffid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `Fname` VARCHAR(255) NOT NULL,
    `Mname` VARCHAR(255) NULL,
    `Lname` VARCHAR(255) NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `phone` BIGINT NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    UNIQUE INDEX `Admin_phone_key`(`phone`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChangeLog` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `userID` VARCHAR(255) NOT NULL,
    `tableName` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_patientid_fkey` FOREIGN KEY (`patientid`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Qualifications` ADD CONSTRAINT `Qualifications_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Qualifications` ADD CONSTRAINT `Qualifications_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_patientid_fkey` FOREIGN KEY (`patientid`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dependant` ADD CONSTRAINT `Dependant_patientid_fkey` FOREIGN KEY (`patientid`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorOnPatient` ADD CONSTRAINT `DoctorOnPatient_patientid_fkey` FOREIGN KEY (`patientid`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DoctorOnPatient` ADD CONSTRAINT `DoctorOnPatient_doctorid_fkey` FOREIGN KEY (`doctorid`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffOnPatient` ADD CONSTRAINT `StaffOnPatient_patientid_fkey` FOREIGN KEY (`patientid`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffOnPatient` ADD CONSTRAINT `StaffOnPatient_staffid_fkey` FOREIGN KEY (`staffid`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
