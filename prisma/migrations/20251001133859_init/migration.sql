-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teleUserId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "condidtion" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL,
    CONSTRAINT "Rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Wallets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL,
    CONSTRAINT "Wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "txnHash" TEXT NOT NULL,
    "logsstatus" TEXT NOT NULL,
    "gas" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL,
    CONSTRAINT "Logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Rules_userId_idx" ON "Rules"("userId");

-- CreateIndex
CREATE INDEX "Logs_userId_idx" ON "Logs"("userId");
