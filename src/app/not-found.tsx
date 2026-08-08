import { Calavera, Sunburst } from "@/components/Motifs";
import { ButtonLink } from "@/components/Ui";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden bg-turquoise px-5 py-24 text-center">
      <Sunburst className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[130%] w-[160%] -translate-x-1/2 opacity-80" />
      <div className="relative mx-auto max-w-xl">
        <Calavera className="mx-auto w-28" />
        <h1 className="mt-7 text-5xl text-vermillion sm:text-6xl">
          Wrong parking lot
        </h1>
        <p className="mt-5 text-lg font-semibold text-ink">
          This page is not here. The truck probably is, though.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/schedule" tone="primary">
            Find today&apos;s stop
          </ButtonLink>
          <ButtonLink href="/" tone="dark">
            Back home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
