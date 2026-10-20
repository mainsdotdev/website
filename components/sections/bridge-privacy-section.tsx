import { Check } from "@/components/icons";
import { SectionHeader } from "@/components/section-header";

// What the hub can and can't read, per the Bridge architecture's metadata table.
const VISIBLE = [
  "Your account email",
  "Your device names and when they were last online",
  "How much storage you use, and when things change",
];

const ENCRYPTED = [
  "Your chats, Atlas pages, and their history",
  "Your files, including their names and types",
  "Your account key and recovery code",
];

const APPROVAL_CODE = "K7QF4P";

function ApprovalCard() {
  return (
    <div className="glass-card rounded-4xl p-6 sm:p-8">
      <p className="text-xs font-medium text-primary-500">Device approval requests</p>
      <p className="mt-4 text-base text-primary-100">Mac Studio</p>
      <p className="text-sm text-primary-500">macOS · Waiting for approval</p>
      <p
        aria-label={`Approval code ${APPROVAL_CODE.split("").join(" ")}`}
        className="mt-5 w-fit rounded-2xl glass-input border border-primary-700 bg-primary-900/60 px-4 py-2 font-mono text-2xl tracking-[0.25em] text-primary-50"
      >
        {APPROVAL_CODE}
      </p>
      <p className="mt-5 flex items-center gap-2.5 text-sm text-primary-200">
        <span aria-hidden className="grid size-4 place-items-center rounded bg-blue-600 text-white">
          <Check className="size-3" />
        </span>
        This code matches the new device’s screen
      </p>
      <div aria-hidden className="mt-6 flex flex-wrap gap-2 text-sm">
        <span className="rounded-lg bg-primary-50 px-3.5 py-1.5 font-medium text-primary-950">Approve device</span>
        <span className="rounded-lg border border-primary-700 px-3.5 py-1.5 text-primary-300">Reject</span>
      </div>
    </div>
  );
}

export function BridgePrivacySection() {
  return (
    <section aria-label="Bridge privacy" className="relative mx-auto max-w-304 px-5 pb-28 sm:px-8 lg:pb-36">
      <SectionHeader
        layout="column"
        title="Private by design."
        description="Bridge encrypts everything on your computer with a key that only your devices hold. We carry and store the encrypted data, but we can’t read."
        titleClassName="max-w-4xl leading-tight text-primary-50"
        descriptionClassName="mt-1 max-w-2xl text-lg leading-relaxed sm:text-xl"
      />

      <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-4xl p-6 sm:p-8">
          <h3 className="text-xl font-medium tracking-tight text-primary-50">What we can’t see</h3>
          <ul className="mt-5 space-y-3">
            {ENCRYPTED.map((item) => (
              <li key={item} className="flex gap-3 text-base text-primary-200">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-blue-400" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-xl font-medium tracking-tight text-primary-50">What we can</h3>
          <p className="mt-2 text-sm leading-relaxed text-primary-400">
            Enough to deliver your data to the right devices and count your storage.
          </p>
          <ul className="mt-5 space-y-3">
            {VISIBLE.map((item) => (
              <li key={item} className="flex gap-3 text-base text-primary-300">
                <span aria-hidden className="flex w-4 shrink-0 justify-center pt-2.5">
                  <span className="size-1.5 rounded-full bg-primary-500" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <ApprovalCard />
          <div className="grid gap-8 pt-4 sm:grid-cols-2 sm:gap-10">
            <div>
              <h3 className="text-lg font-medium tracking-tight text-primary-50">Approve every device</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-400 sm:text-base">
                A new computer can’t read anything until you let it in. Check that both screens show the same code, then approve. Revoke a device at any time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium tracking-tight text-primary-50">Keep your recovery code</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-400 sm:text-base">
                It lets a new device in when your others aren’t around. Store it somewhere safe: without a device or the code, nobody can unlock your data, including us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
