'use client';
import { useState } from 'react';
export default function LanguageToggle(){ const [lang,setLang]=useState<'en'|'hi'>('en'); return <button className="lang" onClick={()=>{const next=lang==='en'?'hi':'en';setLang(next);document.documentElement.lang=next;window.dispatchEvent(new CustomEvent('site-language',{detail:next}));}} aria-label="Switch language">{lang==='en'?'हिन्दी':'English'}</button> }
