import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import gsap from 'gsap'
import { IoCloseOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5"
import { RiHistoryLine } from "react-icons/ri"

function Home() {
  const { userData, serverUrl, setUserData, getGroqResponse } = useContext(userDataContext)
  const navigate = useNavigate()

  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")

  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  // GSAP refs
  const containerRef = useRef()
  const topBarRef = useRef()
  const avatarWrapRef = useRef()
  const waveRef = useRef()
  const textBoxRef = useRef()
  const sidebarRef = useRef()
  const overlayRef = useRef()
  const orb1Ref = useRef()
  const orb2Ref = useRef()
  const orb3Ref = useRef()
  const ringRefs = useRef([])
  const barRefs = useRef([])

  // ─── Speech logic (unchanged) ────────────────────────────────────────────────

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try { recognitionRef.current?.start() }
      catch (e) { if (e.name !== "InvalidStateError") console.error(e) }
    }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const indianVoice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN')
    if (indianVoice) utterance.voice = indianVoice
    else utterance.lang = 'en-US'

    isSpeakingRef.current = true
    setSpeaking(true)
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setSpeaking(false)
      setTimeout(() => startRecognition(), 800)
    }
    synth.cancel()
    synth.speak(utterance)
  }

  const handleCommand = (data) => {
    if (!data) return
    const { type, userInput, response } = data
    if (response) speak(response)
    if (type === 'google-search')  window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')
    if (type === 'calculator-open') window.open('https://www.google.com/search?q=calculator', '_blank')
    if (type === 'instagram-open') window.open('https://www.instagram.com/', '_blank')
    if (type === 'facebook-open')  window.open('https://www.facebook.com/', '_blank')
    if (type === 'weather-show')   window.open('https://www.google.com/search?q=weather', '_blank')
    if (type === 'youtube-search' || type === 'youtube-play')
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition
    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try { recognition.start() } catch (e) { if (e.name !== "InvalidStateError") console.error(e) }
      }
    }, 1000)

    recognition.onstart = () => { isRecognizingRef.current = true; setListening(true) }
    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (isMounted && !isSpeakingRef.current)
        setTimeout(() => { if (isMounted) try { recognition.start() } catch (e) { if (e.name !== "InvalidStateError") console.error(e) } }, 1000)
    }
    recognition.onerror = (event) => {
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current)
        setTimeout(() => { if (isMounted) try { recognition.start() } catch (e) { if (e.name !== "InvalidStateError") console.error(e) } }, 1000)
    }
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log("🎙️ Heard:", transcript, "| Expected wake word:", userData.assistantName)
      
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGroqResponse(transcript)
        if (data) { handleCommand(data); setAiText(data.response || "No response received") }
        else setAiText("I couldn't process that command right now.")
        
        setTimeout(() => setUserText(""), 3000)
      } else {
        setUserText(`(Heard: "${transcript}")`)
      }
    }

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`)
    greeting.lang = 'hi-IN'
    window.speechSynthesis.speak(greeting)

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [])

  // ─── GSAP: entrance + ambient ─────────────────────────────────────────────────

  useEffect(() => {
    // Sidebar starts off-screen
    gsap.set(sidebarRef.current, { x: '100%' })
    gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' })

    // Ambient orb drift
    gsap.to(orb1Ref.current, { x: 90, y: -55, duration: 9,  yoyo: true, repeat: -1, ease: "sine.inOut" })
    gsap.to(orb2Ref.current, { x: -70, y: 75, duration: 11, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.5 })
    gsap.to(orb3Ref.current, { x: 50, y: -65, duration: 13, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 3 })

    // Entrance sequence
    const tl = gsap.timeline()
    tl.fromTo(topBarRef.current,
        { y: -28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
      .fromTo(avatarWrapRef.current,
        { y: 50, opacity: 0, scale: 0.93 },
        { y: 0, opacity: 1, scale: 1, duration: 0.95, ease: "power3.out" }, "-=0.35")
      .fromTo(waveRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.35")
      .fromTo(textBoxRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.3")

    // Avatar gentle float (starts after entrance)
    gsap.to(avatarWrapRef.current, {
      y: -14, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.2
    })

    // Idle bars
    barRefs.current.filter(Boolean).forEach(bar => {
      gsap.set(bar, { scaleY: 0.12, transformOrigin: 'bottom' })
    })
  }, [])

  // ─── GSAP: waveform + rings reactive to state ─────────────────────────────────

  useEffect(() => {
    const bars = barRefs.current.filter(Boolean)
    bars.forEach(b => gsap.killTweensOf(b))

    if (listening) {
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: () => 0.2 + Math.random() * 0.8,
          duration: () => 0.14 + Math.random() * 0.22,
          transformOrigin: 'bottom',
          repeat: -1, yoyo: true,
          ease: "power1.inOut",
          delay: i * 0.045,
        })
      })
      ringRefs.current.filter(Boolean).forEach((ring, i) => {
        gsap.killTweensOf(ring)
        gsap.fromTo(ring,
          { scale: 1, opacity: 0.55 },
          { scale: 1.28 + i * 0.14, opacity: 0, duration: 1.8 + i * 0.45, ease: "power2.out", repeat: -1, delay: i * 0.55 }
        )
      })
    } else if (speaking) {
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: () => 0.3 + Math.random() * 0.65,
          duration: () => 0.28 + Math.random() * 0.18,
          transformOrigin: 'bottom',
          repeat: -1, yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.055,
        })
      })
      ringRefs.current.filter(Boolean).forEach(r => { gsap.killTweensOf(r); gsap.to(r, { opacity: 0, duration: 0.3 }) })
    } else {
      bars.forEach(bar => gsap.to(bar, { scaleY: 0.12, transformOrigin: 'bottom', duration: 0.5, ease: "power2.out" }))
      ringRefs.current.filter(Boolean).forEach(r => { gsap.killTweensOf(r); gsap.to(r, { opacity: 0, duration: 0.3 }) })
    }
  }, [listening, speaking])

  // ─── GSAP: text pop-in ────────────────────────────────────────────────────────

  useEffect(() => {
    if (textBoxRef.current)
      gsap.fromTo(textBoxRef.current, { opacity: 0.55, y: 5 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" })
  }, [userText, aiText])

  // ─── Sidebar helpers ──────────────────────────────────────────────────────────

  const openSidebar = () => {
    gsap.to(sidebarRef.current, { x: 0, duration: 0.45, ease: "power3.out" })
    gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3 })
  }
  const closeSidebar = () => {
    gsap.to(sidebarRef.current, { x: '100%', duration: 0.38, ease: "power2.in" })
    gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3 })
  }

  // ─── Derived display values ───────────────────────────────────────────────────

  const displayText = userText || aiText || `Say "${userData?.assistantName}" to wake me up`
  const statusLabel = listening ? 'Listening' : speaking ? 'Speaking' : 'Idle'

  const barColor = listening
    ? 'linear-gradient(to top, #3b82f6, #a78bfa)'
    : speaking
    ? 'linear-gradient(to top, #8b5cf6, #ec4899)'
    : 'rgba(255,255,255,0.15)'

  const ringClass = listening ? 'border-blue-400/50' : 'border-violet-400/40'
  const dotClass  = listening ? 'bg-blue-400' : speaking ? 'bg-violet-400' : 'bg-white/20'
  const pillClass = listening
    ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
    : speaking
    ? 'bg-violet-500/20 border-violet-400/30 text-violet-300'
    : 'bg-white/5 border-white/10 text-white/35'

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="w-full h-screen bg-[#04040c] overflow-hidden relative flex flex-col select-none">

      {/* ── Ambient orbs ── */}
      <div ref={orb1Ref} className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-blue-700/20 blur-[140px] pointer-events-none" />
      <div ref={orb2Ref} className="absolute -bottom-40 -right-24 w-[560px] h-[560px] rounded-full bg-violet-700/15 blur-[160px] pointer-events-none" />
      <div ref={orb3Ref} className="absolute top-1/3 left-1/2 w-[340px] h-[340px] rounded-full bg-cyan-600/8 blur-[120px] pointer-events-none" />

      {/* ── Top bar ── */}
      <div ref={topBarRef} className="relative z-10 flex justify-between items-center px-6 pt-6 pb-2">
        <div>
          <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase font-light">Virtual Assistant</p>
          <h1 className="text-white font-semibold text-xl tracking-tight mt-0.5">Hey, {userData?.name}</h1>
        </div>
        <button
          onClick={openSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        >
          <RiHistoryLine className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* ── Main stage ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 z-10 px-4 pb-6">

        {/* Avatar + rings */}
        <div ref={avatarWrapRef} className="relative">

          {/* Pulse rings (behind card) */}
          {[0, 1, 2].map(i => (
            <div
              key={i}
              ref={el => ringRefs.current[i] = el}
              className={`absolute inset-0 rounded-[2.4rem] border pointer-events-none ${ringClass}`}
              style={{ opacity: 0 }}
            />
          ))}

          {/* Avatar card */}
          <div className="w-[200px] h-[272px] md:w-[240px] md:h-[320px] rounded-[2.4rem] overflow-hidden relative
            border border-white/10
            shadow-[0_32px_64px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]
            bg-black/60">

            <img src={userData?.assistantImage} alt="Assistant" className="w-full h-full object-cover" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />

            {/* Name + status pill */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-5 gap-2.5">
              <h2 className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                {userData?.assistantName}
              </h2>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border backdrop-blur-md ${pillClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotClass} ${(listening || speaking) ? 'animate-pulse' : ''}`} />
                {statusLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Waveform bars */}
        <div ref={waveRef} className="flex items-end gap-[4px] h-10">
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              ref={el => barRefs.current[i] = el}
              className="w-[4px] rounded-full"
              style={{
                height: '40px',
                background: barColor,
                transformOrigin: 'bottom',
                transition: 'background 0.5s ease',
              }}
            />
          ))}
        </div>

        {/* Text display */}
        <div
          ref={textBoxRef}
          className="w-full max-w-[430px] min-h-[74px] flex items-center justify-center px-6 py-4
            bg-white/[0.025] backdrop-blur-2xl
            border border-white/[0.07]
            rounded-2xl
            shadow-[0_4px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <p className={`text-center text-sm md:text-base leading-relaxed font-light tracking-wide
            ${userText ? 'text-white/90' : aiText ? 'text-blue-200/85' : 'text-white/25'}`}>
            {displayText}
          </p>
        </div>

      </div>

      {/* ── Sidebar overlay ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/55 backdrop-blur-[3px] z-40"
        onClick={closeSidebar}
      />

      {/* ── Sidebar ── */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 h-full w-72
          bg-[#080813]/95 backdrop-blur-3xl
          border-l border-white/[0.06]
          z-50 flex flex-col p-5 gap-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center pt-1 pb-1">
          <h2 className="text-white font-semibold text-base tracking-tight">Menu</h2>
          <button
            onClick={closeSidebar}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
          >
            <IoCloseOutline className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/customize")}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-xl
              bg-white/[0.03] hover:bg-white/[0.07]
              border border-white/[0.07] hover:border-white/15
              text-white/55 hover:text-white
              text-sm font-medium transition-all"
          >
            <IoSettingsOutline className="w-[17px] h-[17px] shrink-0" />
            Customize Assistant
          </button>
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-xl
              bg-red-500/[0.05] hover:bg-red-500/15
              border border-red-500/15 hover:border-red-500/30
              text-red-400/70 hover:text-red-300
              text-sm font-medium transition-all"
          >
            <IoLogOutOutline className="w-[17px] h-[17px] shrink-0" />
            Log Out
          </button>
        </div>

        <div className="h-px bg-white/[0.05]" />

        {/* History */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden flex flex-col gap-2">
          <p className="text-white/25 text-[9px] tracking-[0.35em] uppercase font-light mb-1">History</p>
          {userData?.history?.length > 0
            ? userData.history.slice().reverse().map((cmd, i) => (
                <div
                  key={i}
                  className="text-white/45 text-xs leading-relaxed
                    bg-white/[0.02] border border-white/[0.04]
                    rounded-xl px-3 py-2.5"
                >
                  {cmd}
                </div>
              ))
            : <p className="text-white/15 text-xs text-center mt-10">No commands yet</p>
          }
        </div>
      </div>

    </div>
  )
}

export default Home
