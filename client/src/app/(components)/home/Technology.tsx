import Image from "next/image";
import React from "react";

type Props = {};

const Technology = (props: Props) => {
  return (
    <div className="bg-white">
      <p className="font-display text-base text-slate-900">
        Trusted by these six companies so far
      </p>
      <ul
        role="list"
        className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
      >
        <li>
          <ul
            role="list"
            className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
          >
            <li className="flex">
              <Image
                alt="Transistor"
                loading="lazy"
                width={158}
                height={48}
                decoding="async"
                data-nimg={1}
                style={{ color: "transparent" }}
                src="/_next/static/media/transistor.7274e6c3.svg"
              />
            </li>
            <li className="flex">
              <Image
                alt="Tuple"
                loading="lazy"
                width={105}
                height={48}
                decoding="async"
                data-nimg={1}
                style={{ color: "transparent" }}
                src="/_next/static/media/tuple.74eb0ae0.svg"
              />
            </li>
            <li className="flex">
              <Image
                alt="StaticKit"
                loading="lazy"
                width={127}
                height={48}
                decoding="async"
                data-nimg={1}
                style={{ color: "transparent" }}
                src="/_next/static/media/statickit.d7937794.svg"
              />
            </li>
          </ul>
        </li>
        <li>
          <ul
            role="list"
            className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
          >
            <li className="flex">
              <Image
                alt="Mirage"
                loading="lazy"
                width={138}
                height={48}
                decoding="async"
                data-nimg={1}
                style={{ color: "transparent" }}
                src="/_next/static/media/mirage.18d2ec4e.svg"
              />
            </li>
            <li className="flex">
              <Image
                alt="Laravel"
                loading="lazy"
                width={136}
                height={48}
                decoding="async"
                data-nimg={1}
                style={{ color: "transparent" }}
                src="/_next/static/media/laravel.7deed17e.svg"
              />
            </li>
            <li className="flex">
              <Image
                alt="Statamic"
                loading="lazy"
                width={147}
                height={48}
                decoding="async"
                data-nimg={1}
                style={{ color: "transparent" }}
                src="/_next/static/media/statamic.6da5ebfb.svg"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Technology;
