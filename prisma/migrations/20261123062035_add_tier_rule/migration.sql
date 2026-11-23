-- CreateTable
CREATE TABLE "TierRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "minQuantity" INTEGER NOT NULL,
    "percentOff" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "TierRule_shop_idx" ON "TierRule"("shop");
