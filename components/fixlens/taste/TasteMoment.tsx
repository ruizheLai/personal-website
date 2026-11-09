'use client';

import { useLayoutEffect, useRef } from 'react';
import { useImageZoom } from '../NaturalImageZoom';
import { tasteAssets } from '@/lib/fixlens-taste-assets';

type MomentApi = { destroy?: () => void };
const preferenceForScroll = (): ScrollBehavior => matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
/** Taste's unmodified modules own only this isolated HTML subtree, never React children. */
export default function TasteMoment({ kind, html, className='' }: { kind:'pinned-chapters'|'counter-rolls'; html:string; className?:string }) {
  const root = useRef<HTMLDivElement>(null);
  const enlarge = useImageZoom();
  useLayoutEffect(() => {
    const element=root.current;
    if(!element)return;
    let disposed=false;
    let instance:MomentApi|undefined;
    let generation=0;
    let observer:MutationObserver|undefined;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const original=element.innerHTML;
    const syncLinks=()=>element.querySelectorAll<HTMLElement>('.mo-pc__visual').forEach(figure=>{
      figure.inert=element.classList.contains('is-live')&&!figure.classList.contains('is-on');
    });
    const mount=async()=>{
      const version=++generation;
      observer?.disconnect();instance?.destroy?.();instance=undefined;
      element.innerHTML=original;
      if(preference.matches){element.dataset.momentStill='reduced';return;}
      try{
        const modulePath='/taste/moments/'+kind+'/moment.js';
        const libPath='/taste/moments/lib.js';
        const [moment,lib]=await Promise.all([import(/* webpackIgnore: true */ modulePath),import(/* webpackIgnore: true */ libPath)]);
        if(disposed||version!==generation)return;
        instance=moment.default(element,{}, {...lib,reduced:()=>disposed||version!==generation||lib.still()}) as MomentApi;
        element.dataset.momentMounted='true';
        observer=new MutationObserver(syncLinks);
        observer.observe(element,{attributes:true,subtree:true,attributeFilter:['class']});
        syncLinks();
      }catch(error){
        element.innerHTML=original;
        element.dataset.momentFailed=String(error);
        console.warn('Taste moment uses its readable static fallback:',error);
      }
    };
    void mount();
    preference.addEventListener('change',mount);
    return()=>{
      disposed=true;generation++;preference.removeEventListener('change',mount);
      observer?.disconnect();instance?.destroy?.();element.innerHTML=original;
    };
  },[html,kind]);
  return <div ref={root} className={className} data-moment={kind} dangerouslySetInnerHTML={{__html:html}} onClick={event=>{
    const target=event.target as HTMLElement;
    const chapter=target.closest<HTMLElement>('[data-chapter]');
    const element=root.current;
    if(chapter&&element){
      if(!element.classList.contains('is-live')){
        chapter.closest('.mo-pc__step')?.querySelector('.mo-pc__visual')?.scrollIntoView({block:'center',behavior:preferenceForScroll()});
        return;
      }
      const index=Number(chapter.dataset.chapter);
      const top=scrollY+element.getBoundingClientRect().top+(index+.15)/3*innerHeight;
      window.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
    const link=target.closest<HTMLAnchorElement>('a[data-asset]');
    if(link&&enlarge&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){
      const asset=tasteAssets[link.dataset.asset as keyof typeof tasteAssets];
      if(asset){event.preventDefault();enlarge({asset,opener:link});}
    }
  }}/>;
}
