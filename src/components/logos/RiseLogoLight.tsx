/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function RiseLogoLight() {
  return (
    <Link href={"#"}>
      <div>
        <img
          className="h-4 w-auto sm:h-4"
          src="/rise_transparent_light.png"
          alt="Rise logo"
        />
      </div>
    </Link>
    // <Link href={'#'}>
    //   <Image
    //     src="/rise_transparent_light.png"
    //     alt="Rise Finance Dark Logo"
    //     height={}
    //     width={1000}
    //     className="h-4 w-auto sm:h-6"
    //   />
    // </Link>
  );
}
