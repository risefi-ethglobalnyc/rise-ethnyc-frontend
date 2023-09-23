/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function RiseLogoDark() {
  return (
    <Link href={"#"}>
      <div>
        <img
          className="h-4 w-auto sm:h-4"
          src="/rise_transparent_dark.png"
          alt="Rise logo"
        />
      </div>
    </Link>
    // <Link href={'#'}>
    //   <Image
    //     src="/rise_transparent_dark.png"
    //     width={101}
    //     height={27}
    //     alt="Rise Finance Dark Logo"
    //   />
    // </Link>
  );
}
