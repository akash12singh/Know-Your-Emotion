import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Maincomp } from "@/components/Maincomp";
import { Nanum_Gothic_Coding } from "next/font/google";

const nanum = Nanum_Gothic_Coding({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  return (
    <div className={`${nanum.className} ` }>
      <Header/>
      <Maincomp/>
     
      <Footer/>
    </div>
  )
}