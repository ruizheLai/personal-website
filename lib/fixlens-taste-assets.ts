import { fixlensAssets } from '@/lib/fixlens-assets';
export const tasteAssets = {
  ...fixlensAssets,
  property: { src:'/images/projects/fixlens/taste-property.webp',width:390,height:844,title:'Property confirmation prototype',alt:'Authentic Hi-fi property and contact confirmation; all demonstration values authorized for publication.' },
  description: { src:'/images/projects/fixlens/taste-description.webp',width:390,height:844,title:'Issue description prototype',alt:'Authentic Hi-fi conversation retaining the confirmed property and the renter’s issue description.' },
  overview: { src:'/images/projects/fixlens/taste-overview.webp',width:390,height:844,title:'Overview camera prototype',alt:'Authentic Hi-fi overview camera guidance, framing guide, shutter, gallery and flash. Interior photograph authorized for publication.' },
  closeup: { src:'/images/projects/fixlens/taste-closeup.webp',width:390,height:844,title:'Close-up camera prototype',alt:'Authentic Hi-fi close-up guidance over a texture photograph authorized for publication.' },
} as const;
