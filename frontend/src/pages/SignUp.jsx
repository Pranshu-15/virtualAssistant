import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from "axios"
function SignUp() {
  const [showPassword,setShowPassword]=useState(false)
  const {serverUrl,userData,setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
    const [loading,setLoading]=useState(false)
    const [password,setPassword]=useState("")
const [err,setErr]=useState("")
  const handleSignUp=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
try {
  let result=await axios.post(`${serverUrl}/api/auth/signup`,{
    name,email,password
  },{withCredentials:true} )
 setUserData(result.data)
  setLoading(false)
  navigate("/customize")
} catch (error) {
  console.log(error)
  setUserData(null)
  setLoading(false)
  setErr(error?.response?.data?.message || "Something went wrong")
}
    }
  return (
    <div className='w-full min-h-screen relative flex justify-center lg:justify-end items-center overflow-hidden bg-gray-900 px-6 lg:pr-32'>
      {/* Background Image with animated subtle zoom and pan */}
      <div className='absolute inset-0 z-0 opacity-40 mix-blend-luminosity scale-110' style={{backgroundImage:`url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center'}} ></div>
      
      {/* Colorful gradient overlay to make it dazzling */}
      <div className='absolute inset-0 z-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black/80'></div>

      {/* Animated glowing orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-pulse z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-pulse z-0" style={{animationDelay: "2s"}}></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse z-0" style={{animationDelay: "4s"}}></div>

 <form className='relative z-10 w-full max-w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-3xl flex flex-col items-center justify-center gap-6 p-8 transform transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:-rotate-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)]' onSubmit={handleSignUp}>
<h1 className='text-white text-3xl font-bold mb-4 tracking-wide'>Register to <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'>Virtual Assistant</span></h1>
<input type="text" placeholder='Enter your Name' className='w-full h-14 outline-none border border-white/20 bg-black/20 text-white placeholder-gray-400 px-6 rounded-xl text-lg focus:border-blue-400 focus:bg-black/40 transition-all duration-300' required onChange={(e)=>setName(e.target.value)} value={name}/>
<input type="email" placeholder='Email' className='w-full h-14 outline-none border border-white/20 bg-black/20 text-white placeholder-gray-400 px-6 rounded-xl text-lg focus:border-blue-400 focus:bg-black/40 transition-all duration-300' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
<div className='w-full h-14 border border-white/20 bg-black/20 rounded-xl relative focus-within:border-blue-400 focus-within:bg-black/40 transition-all duration-300'>
<input type={showPassword?"text":"password"} placeholder='Password' className='w-full h-full rounded-xl outline-none bg-transparent text-white placeholder-gray-400 px-6 text-lg' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
{!showPassword && <IoEye className='absolute top-4 right-5 w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors' onClick={()=>setShowPassword(true)}/>}
  {showPassword && <IoEyeOff className='absolute top-4 right-5 w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors' onClick={()=>setShowPassword(false)}/>}
</div>
{err.length>0 && <p className='text-red-400 text-sm bg-red-900/30 px-4 py-2 rounded-lg border border-red-500/50 w-full text-center'>
  {err}
  </p>}
<button className='w-full h-14 mt-4 text-white font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:-translate-y-1' disabled={loading}>{loading?"Processing...":"Sign Up"}</button>

<p className='text-gray-300 text-md mt-4'>Already have an account? <span className='text-blue-400 font-semibold cursor-pointer hover:text-blue-300 hover:underline transition-all' onClick={()=>navigate("/signin")}>Sign In</span></p>
 </form>
    </div>
  )
}

export default SignUp
