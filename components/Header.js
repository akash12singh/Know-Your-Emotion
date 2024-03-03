import Image from 'next/image';
import Link from 'next/link'

export const Header = () => {
  return (
    <div className="flex flex-1 mt-5 justify-center items-center align-center sm:justify-start sm:ml-14 sm:mt-7">
      <Link href='/'>
      <Image
        src="/images/logo.png"
        width={90}
        height={90}
        alt="Logo"
      />
      </Link>
    </div>
  );
};
