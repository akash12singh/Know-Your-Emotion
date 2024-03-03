import Image from 'next/image';

export const Footer = () => {
  return (
    <div className="flex flex-col mt-14 justify-center items-center align-center  sm:ml-14 sm:mt-7">
    <Image
      src="/images/logo.png"
      width={90}
      height={90}
      alt="Logo"
    />
    <p className=' mt-2'> EMUSIC © 2024</p>
  </div>
  )
}
