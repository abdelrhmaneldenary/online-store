import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ELSOM3A'} text2={'ELTAYEBA'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Mamno3aat isnot just a fashion brand—its a statement. Born from the idea of breaking boundaries, we bring you bold, daring, and unapologetic styles that stand out in every crowd.
              .</p>
              <p>Our collection is designed for individuals who refuse to be boxed in by societal norms. From streetwear to high fashion, every piece is curated with attitude, creativity, and a touch of rebellion.

At Mamno3aat, we believe fashion is more than clothing; its your voice, your identity, and your freedom to express yourself without limits. Dare to be different. Dare to be eMamno3aat</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>At Mamno3aat, our mission is to empower individuals to embrace their uniqueness through fashion. We aim to break stereotypes and redefine style by offering bold, creative, and boundary-pushing designs.</p>{/*nekteb 7aga*/}
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>{/*nekteb 7aga*/}
            <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>{/*nekteb 7aga*/}
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>{/*nekteb 7aga*/}
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>{/*nekteb 7aga*/}
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
