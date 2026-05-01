import React, { useContext, useState, useEffect, useRef } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import image1 from "../assets/image1.png"

function Customize2() {
    const {userData, backendImage, frontendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")
    const [loading, setLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const navigate = useNavigate()
    
    const containerRef = useRef()
    const inputWrapperRef = useRef()
    const buttonRef = useRef()

    const activeDisplay = frontendImage || (selectedImage === "input" ? null : (selectedImage || image1));

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background fade in
            gsap.fromTo(".bg-blur", { opacity: 0 }, { opacity: 0.5, duration: 2 });
            
            // Avatar profile image float in
            gsap.fromTo(".profile-img", 
                { y: -100, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.7)", delay: 0.2 }
            );

            // Input wrapper slide up
            gsap.fromTo(inputWrapperRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6 }
            );

            // Floating animation for the profile
            gsap.to(".profile-img", {
                y: "-=10",
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                delay: 1.7
            });
            
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Button reveal animation
    useEffect(() => {
        if (assistantName.trim().length > 0 && buttonRef.current) {
            gsap.to(buttonRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.5)"
            });
        } else if (buttonRef.current) {
             gsap.to(buttonRef.current, {
                y: 30,
                opacity: 0,
                scale: 0.9,
                duration: 0.3
            });
        }
    }, [assistantName]);

    // Focus animation
    useEffect(() => {
        if (isFocused) {
            gsap.to(".bg-blur", { filter: "blur(90px) brightness(0.2)", duration: 0.5 });
            gsap.to(".input-field", { scale: 1.05, duration: 0.4, ease: "power2.out" });
        } else {
            gsap.to(".bg-blur", { filter: "blur(60px) brightness(0.4)", duration: 0.5 });
            gsap.to(".input-field", { scale: 1, duration: 0.4, ease: "power2.out" });
        }
    }, [isFocused]);

    const handleUpdateAssistant = async () => {
        if (!assistantName.trim()) return;
        setLoading(true)
        
        // Exit animation
        gsap.to(containerRef.current, {
            scale: 1.1,
            opacity: 0,
            filter: "blur(20px)",
            duration: 1,
            ease: "power2.inOut"
        });

        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if (backendImage) {
                 formData.append("assistantImage", backendImage)
            } else if (selectedImage) {
                 formData.append("imageUrl", selectedImage)
            }
            
            // Simulated delay for dramatic exit effect if network is too fast
            const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
            const request = axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials:true});
            
            const [, result] = await Promise.all([minDelay, request]);

            setLoading(false)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
            // Revert animation on error
            gsap.to(containerRef.current, {
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.5
            });
        }
    }

  return (
    <div ref={containerRef} className='w-full h-screen bg-black flex justify-center items-center flex-col relative font-sans overflow-hidden'>
        
        {/* Dynamic Background */}
        {activeDisplay && (
          <div 
            className="bg-blur absolute inset-0 bg-cover bg-center pointer-events-none z-0"
            style={{ backgroundImage: `url(${activeDisplay})`, filter: "blur(60px) brightness(0.4)" }}
          ></div>
        )}
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>

        {/* Back Button */}
        <button 
            className="absolute top-6 left-6 md:top-10 md:left-10 z-30 group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-xl transition-all shadow-lg hover:shadow-white/20"
            onClick={()=>navigate("/customize")}
        >
            <MdKeyboardBackspace className="text-white/70 group-hover:text-white w-5 h-5 md:w-6 md:h-6 transition-colors"/>
        </button>

        {/* Main Content Interface */}
        <div className="z-20 flex flex-col items-center justify-center w-full max-w-4xl px-6">
            
            {/* Avatar Preview */}
            <div className="profile-img relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-white/10 backdrop-blur-xl mb-12 flex-shrink-0">
                {activeDisplay ? (
                    <img src={activeDisplay} className="w-full h-full object-cover" alt="Avatar"/>
                ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-purple-600"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 mix-blend-overlay"></div>
            </div>

            {/* Input Wrapper */}
            <div ref={inputWrapperRef} className="w-full flex flex-col items-center">
                <h2 className="text-white/60 uppercase tracking-[0.3em] text-xs md:text-sm mb-6 font-light drop-shadow-md">Initialize Identity</h2>
                
                <input 
                    type="text" 
                    placeholder="e.g. Shifra" 
                    className="input-field w-full text-center bg-transparent border-b-2 border-white/20 text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight outline-none placeholder-white/20 pb-4 md:pb-6 transition-colors focus:border-white/80"
                    required 
                    onChange={(e)=>setAssistantName(e.target.value)} 
                    value={assistantName}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    spellCheck="false"
                />
            </div>

            {/* Button Wrapper - using opacity-0 initially for GSAP to animate */}
            <div className="mt-16 h-20 flex items-center justify-center w-full">
                <button 
                    ref={buttonRef}
                    className='opacity-0 scale-90 translate-y-8 px-10 py-4 w-full md:w-auto bg-white text-black font-bold text-lg md:text-xl rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] transition-shadow duration-300 disabled:opacity-50 cursor-pointer tracking-wider' 
                    disabled={loading} 
                    onClick={handleUpdateAssistant} 
                >
                    {loading ? "INITIALIZING..." : "AWAKEN ASSISTANT"}
                </button>
            </div>
            
        </div>
    </div>
  )
}

export default Customize2