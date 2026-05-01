import React, { useContext, useRef, useEffect } from 'react'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
import gsap from "gsap"

function Customize() {
  const {setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
  const navigate = useNavigate()
  const inputImage = useRef()
  const containerRef = useRef()
  const mainImageRef = useRef()
  
  const images = [image1, image2, image3, image4, image5, image6, image7];
  // Default to image1 if none selected
  const activeDisplay = frontendImage || (selectedImage === "input" ? null : (selectedImage || image1));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background entrance
      gsap.fromTo(".bg-blur", { opacity: 0 }, { opacity: 0.5, duration: 2 });
      
      // Hero image elegant float
      gsap.fromTo(".hero-image", 
        { y: 50, opacity: 0, scale: 0.9, rotateX: 10 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: "power4.out" }
      );

      // Dock slides up
      gsap.fromTo(".dock-container",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "back.out(1.2)" }
      );
      
      // Floating animation for the hero image
      gsap.to(".hero-wrapper", {
        y: "-=15",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Animate hero image when selection changes
  useEffect(() => {
    gsap.fromTo(mainImageRef.current, 
      { opacity: 0.5, scale: 0.95, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
    );
  }, [activeDisplay]);

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
    setSelectedImage("input")
  }

  return (
    <div ref={containerRef} className='w-full h-screen bg-black flex flex-col justify-between items-center overflow-hidden relative font-sans'>
        {/* Dynamic Blurred Background based on selected image */}
        {activeDisplay && (
          <div 
            className="bg-blur absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out pointer-events-none z-0"
            style={{ backgroundImage: `url(${activeDisplay})`, filter: "blur(80px) brightness(0.4)" }}
          ></div>
        )}
        
        {/* Ambient Noise overlay for cinematic texture */}
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>

        {/* Top Header */}
        <div className="w-full flex justify-between items-center p-6 z-20">
          <button 
            className="group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-xl transition-all shadow-lg hover:shadow-white/20"
            onClick={()=>navigate("/")}
          >
            <MdKeyboardBackspace className="text-white/70 group-hover:text-white w-5 h-5 md:w-6 md:h-6 transition-colors"/>
          </button>
          
          {selectedImage && (
             <button 
                className='px-6 py-2 md:px-8 md:py-3 text-sm md:text-base text-white font-medium tracking-wide bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300' 
                onClick={()=>navigate("/customize2")}
             >
               Confirm Avatar
             </button>
          )}
        </div>

        {/* Main Hero Stage */}
        <div className="flex-1 w-full flex flex-col items-center justify-center z-10 perspective-[1000px]">
           <h1 className='text-white/80 text-xs tracking-[0.4em] uppercase mb-6 font-light drop-shadow-md'>
              Avatar Interface
           </h1>
           
           <div className="hero-wrapper relative group cursor-pointer">
              {/* Glowing halo behind the image that matches the image colors implicitly via blur */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-white/5 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 scale-[1.1]"></div>
              
              <div className="hero-image relative h-[45vh] max-h-[400px] aspect-[2.5/3.5] rounded-3xl overflow-hidden border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-black/50 backdrop-blur-md flex items-center justify-center">
                 {activeDisplay ? (
                    <img 
                      ref={mainImageRef}
                      src={activeDisplay} 
                      className="w-full h-full object-cover"
                      alt="Selected Avatar"
                    />
                 ) : (
                    <div className="flex flex-col items-center text-white/40">
                       <RiImageAddLine className="w-12 h-12 mb-2" />
                       <p className="tracking-widest uppercase text-[10px]">Awaiting Upload</p>
                    </div>
                 )}
                 {/* Premium Inner glass reflection */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"></div>
              </div>
           </div>
        </div>

        {/* Bottom Dock / Filmstrip */}
        <div className="dock-container z-20 w-full pb-6 pt-2 px-4 flex justify-center">
           <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-black/40 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-x-auto max-w-[95vw] items-center [&::-webkit-scrollbar]:hidden">
              
              {/* Preset Images */}
              {images.map((img, idx) => (
                 <button 
                   key={idx}
                   onClick={() => {
                      setSelectedImage(img);
                      setFrontendImage(null);
                      setBackendImage(null);
                   }}
                   className={`relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden transition-all duration-400 ease-out transform hover:scale-125 hover:-translate-y-4 hover:z-30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] hover:border hover:border-white/40 ${selectedImage === img ? 'ring-2 ring-white scale-110 -translate-y-2 opacity-100' : 'opacity-50 hover:opacity-100'}`}
                 >
                    <img src={img} className="w-full h-full object-cover" />
                 </button>
              ))}

              {/* Separator */}
              <div className="w-[1px] h-10 bg-white/20 mx-1 md:mx-2 shrink-0"></div>

              {/* Custom Upload Button */}
              <button 
                onClick={() => inputImage.current.click()}
                className={`relative shrink-0 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-400 ease-out transform hover:scale-125 hover:-translate-y-4 hover:z-30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] hover:border-white/40 hover:bg-white/10 ${selectedImage === "input" ? 'ring-2 ring-white scale-110 -translate-y-2 opacity-100' : 'opacity-50 hover:opacity-100'}`}
              >
                {frontendImage ? (
                   <img src={frontendImage} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                   <RiImageAddLine className="w-6 h-6 text-white/70" />
                )}
              </button>
              <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>

           </div>
        </div>
    </div>
  )
}

export default Customize
