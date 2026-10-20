"use client";

import { useState } from "react";
import { FilterPill } from "@/components/filter-pill";
import { Check } from "@/components/icons";
import { SectionHeader } from "@/components/section-header";
import { BRIDGE_PLAN, type BridgeBillingInterval } from "@/lib/constants";

const INTERVALS: { id: BridgeBillingInterval; label: string }[] = [
  { id: "yearly", label: "Yearly" },
  { id: "monthly", label: "Monthly" },
];

const FEATURES = [
  `${BRIDGE_PLAN.storage} of encrypted storage`,
  `Files up to ${BRIDGE_PLAN.maxFileSize} each`,
  "End-to-end encryption",
  "Atlas pages and chats on all your computers",
  "Choose which projects sync",
  "Approve or revoke devices at any time",
];

function formatPrice(amount: number) {
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

export function BridgePricingSection() {
  const [billing, setBilling] = useState<BridgeBillingInterval>("yearly");
  const { monthly, yearly } = BRIDGE_PLAN.prices;
  const price = BRIDGE_PLAN.prices[billing];
  const hasPrices = monthly !== null && yearly !== null;
  const yearlySaving = hasPrices && monthly > yearly ? Math.round((1 - yearly / monthly) * 100) : null;

  return (
    <section id="pricing" aria-label="Bridge pricing" className="relative mx-auto max-w-304 scroll-mt-24 px-5 pb-28 sm:px-8 lg:pb-36">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          layout="column"
          title="Pricing"
          description="One plan with everything Bridge does. Pay monthly or yearly, with the same limits either way."
          titleClassName="max-w-4xl leading-tight text-primary-50"
          descriptionClassName="mt-1 max-w-xl text-lg leading-relaxed sm:text-xl"
        />
        {hasPrices && (
          <div role="group" aria-label="Billing cycle" className="flex shrink-0 gap-2">
            {INTERVALS.map(({ id, label }) => (
              <FilterPill
                key={id}
                label={label}
                isActive={billing === id}
                onClick={() => setBilling(id)}
                // On this dark canvas the pill's own active tint reads as the quieter one.
                className={billing === id ? "bg-primary-50 text-primary-950" : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <div className="glass-card mt-12 grid gap-10 rounded-4xl p-6 sm:mt-16 sm:p-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div className="flex flex-col">
          <h3 className="text-2xl font-medium tracking-tight text-primary-50">{BRIDGE_PLAN.name}</h3>

          {price !== null ? (
            <div className="mt-6">
              <p className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight text-primary-50">{formatPrice(price)}</span>
                <span className="text-base text-primary-400">per month</span>
              </p>
              <p className="mt-2 text-sm text-primary-500">
                {billing === "yearly"
                  ? `Billed yearly${yearlySaving ? `, save ${yearlySaving}%` : ""}`
                  : "Billed monthly"}
              </p>
            </div>
          ) : (
            <p className="mt-6 text-xl tracking-tight text-primary-300">Pricing announced at launch</p>
          )}

          <div className="mt-8 lg:mt-auto lg:pt-10">
            {BRIDGE_PLAN.checkoutUrl ? (
              <a
                href={BRIDGE_PLAN.checkoutUrl}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary-50 px-6 py-3 text-sm font-medium text-primary-950 transition-opacity hover:opacity-90 sm:w-auto"
              >
                Get Bridge
              </a>
            ) : (
              // Until checkout exists, Bridge is a beta joined from the app.
              <a
                href="#join"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary-50/10 px-6 py-3 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-50/15 sm:w-auto"
              >
                Join the beta
              </a>
            )}
          </div>
        </div>

        <ul className="grid content-start gap-x-8 gap-y-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex gap-3 text-base text-primary-200">
              <Check aria-hidden className="mt-1 size-4 shrink-0 text-blue-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
