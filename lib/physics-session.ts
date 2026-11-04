import type {PhysicsBodyId} from "./secondary-config";
type Vec={x:number;y:number;z:number};
export type PhysicsPose={position:Vec;rotation:Vec&{w:number};linear:Vec;angular:Vec;sleeping:boolean};
let snapshot:Partial<Record<PhysicsBodyId,PhysicsPose>>|null=null;
// In-memory only: client route changes preserve play; a full reload starts a fresh scene.
export function readPhysicsSession(){return snapshot;}
export function savePhysicsSession(value:Partial<Record<PhysicsBodyId,PhysicsPose>>){snapshot=value;}
