-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "state" TEXT,
    "message" TEXT,
    "details" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT true,
    "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consentPrivacyVersion" TEXT NOT NULL,
    "consentTermsVersion" TEXT NOT NULL,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "consentIpHash" TEXT,
    "retainUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_kind_createdAt_idx" ON "Lead"("kind", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_retainUntil_idx" ON "Lead"("retainUntil");
