import Image from 'next/image';
import { Rubik_Moonrocks } from 'next/font/google';
import Link from 'next/link'


const rubik = Rubik_Moonrocks({
    
        weight: '400',
        subsets: ['latin'],
    
})

export const Maincomp = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 px-4 sm:px-12">
      {/* Left Side */}
      <div className="sm:w-1/2 flex flex-col justify-center items-center sm:items-start mb-8 sm:mb-0">
        <h1 className={`text-4xl sm:text-6xl font-bold text-center sm:text-left mb-4 ${rubik.className}` }>Feel the Beat of Your Emotions.</h1>
        <h2 className="text-lg sm:text-xl text-center sm:text-left mb-6 ">Elevate your mood with EMUSiC - where music meets emotions. Our advanced AI tailors playlists to match your feelings in real-time. Try it now and let the melodies resonate with your emotions!</h2>
        <Link href={'/music'}>
        <button className="bg-green-800 hover:bg-green-600 text-white w-72 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Give it a Try!! 
        </button>
        </Link>
      </div>
      {/* Right Side */}
      <div className="sm:w-1/2">
        <div className="flex justify-center">
          <div className="max-w-xs sm:max-w-md">
            <Image
              src="/images/facescan.gif"
              width={300}
              height={300}
              alt="Aiscan.gif"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
