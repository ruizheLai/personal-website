'use client';
import { useRef } from 'react';
import { AssetFigure } from '../CaseStudyExperience';
import { tasteAssets as A } from '@/lib/fixlens-taste-assets';

const states=[['property','Confirm the property'],['description','Describe the issue'],['FX38','Review the summary'],['FX39','Check for danger'],['FX41','Continue to capture']] as const;
export default function ReportingJourney(){
 const rail=useRef<HTMLDivElement>(null);
 const move=(direction:number)=>{const element=rail.current;if(!element)return;const slide=element.querySelector<HTMLElement>('.tc-report-screen');if(slide)element.scrollBy({left:direction*(slide.offsetWidth+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 return <div className="tc-reporting">
  <div className="tc-journey-heading"><div><h3>A conversation, with checkpoints.</h3><p>The Hi-fi prototype keeps the renter’s description in context.</p></div><div className="tc-rail-controls"><button aria-label="Previous reporting screen" onClick={()=>move(-1)}>←</button><button aria-label="Next reporting screen" onClick={()=>move(1)}>→</button></div></div>
  <div ref={rail} className="tc-report-rail" role="region" aria-label="Hi-fi reporting journey" tabIndex={0} onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(['ArrowRight','ArrowLeft'].includes(event.key)){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}}}>
   {states.map(([key,label],index)=><div className="tc-report-screen" key={key}><p><span>{String(index+1).padStart(2,'0')}</span>{label}</p><AssetFigure asset={A[key]}/></div>)}
  </div>
  <details className="tc-note"><summary>The alternative safety path</summary><div className="tc-danger"><p>Danger guidance branches from the safety choice. The renter is advised to avoid approaching the area and contact relevant help. It is an alternative to guided capture.</p><AssetFigure asset={A.FX40}/></div></details>
 </div>;
}
