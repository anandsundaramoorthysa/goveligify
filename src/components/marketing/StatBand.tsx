import { Users } from "lucide-react";
import { SpotIllustration } from "@/components/illustrations/SpotIllustration";
import { SCHEMES } from "@/data/schemes";
import { CERTIFICATES } from "@/data/certificates";

const STATS = [
  { value: `${SCHEMES.length}+`, label: "Government schemes explained" },
  { value: `${CERTIFICATES.length}`, label: "Essential certificates covered" },
  { value: "100%", label: "Linked to official government portals" },
];

/** Bold navy-gradient impact band with white text + community motif. */
export function StatBand() {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-navy-gradient px-6 py-14 text-white sm:px-12 sm:py-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        {/* Phone: centered to match the centered illustration. Desktop (lg): left. */}
        <div className="text-center lg:text-left">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-saffron">
            The scale of support
          </p>
          <h2 className="mx-auto mt-3 max-w-xl text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:mx-0">
            Benefits built for a billion lives.
          </h2>
          <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-4xl font-extrabold tracking-tight text-saffron sm:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-sm text-white/80">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-xs text-white/60">
            Figures illustrative; live data coming soon.
          </p>
        </div>

        <SpotIllustration
          icon={Users}
          tone="saffron"
          label="Citizens supported by government schemes"
          className="mx-auto w-40 sm:w-48 lg:w-56"
        />
      </div>
    </div>
  );
}
