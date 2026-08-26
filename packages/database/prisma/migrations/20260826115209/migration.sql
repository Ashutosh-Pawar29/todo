/*
  Warnings:

  - You are about to drop the `_UsersTotodos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userid` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UsersTotodos" DROP CONSTRAINT "_UsersTotodos_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsersTotodos" DROP CONSTRAINT "_UsersTotodos_B_fkey";

-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "userid" TEXT NOT NULL;

-- DropTable
DROP TABLE "_UsersTotodos";

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
