"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Object3D } from "three";
import { SECONDARY_CONFIG } from "@/lib/secondary-config";
export default function BackpackInteraction({ model, open, reducedMotion }: { model: Object3D; open: boolean; reducedMotion: boolean }) {
  const { invalidate } = useThree();
  const amount = useRef(0);
  const parts = useMemo(() => {
    const names = ["Backpack_FrontPocket", "Backpack_PocketPull", "Backpack_PocketPull_Eye", "Backpack_PocketZipUpper", "Backpack_MainPull_Left", "Backpack_MainPull_Left_Eye", "Backpack_MainPull_Right", "Backpack_MainPull_Right_Eye"];
    return names.map(name => {
      const object = model.getObjectByName(name);
      if (!object) throw new Error("Missing backpack animation node: " + name);
      return { object, position: object.position.clone(), rotation: object.rotation.clone() };
    });
  }, [model]);
  useEffect(() => { invalidate(); }, [open, invalidate]);
  useEffect(() => () => { parts.forEach(({ object, position, rotation }) => { object.position.copy(position); object.rotation.copy(rotation); }); }, [parts]);
  useFrame((_, delta) => {
    const target = open ? 1 : 0;
    const next = reducedMotion ? target : MathUtils.damp(amount.current, target, 9, Math.min(delta, .06));
    amount.current = Math.abs(next - target) < .0001 ? target : next;
    const a = amount.current;
    for (const { object, position, rotation } of parts) {
      object.position.copy(position); object.rotation.copy(rotation);
      if (object.name === "Backpack_FrontPocket") object.rotation.x += a * SECONDARY_CONFIG.pocketAngle;
      else if (object.name.startsWith("Backpack_PocketPull")) object.position.x += a * .19;
      else if (object.name === "Backpack_PocketZipUpper") object.position.y += a * .007;
      else {
        object.position.x += a * (object.name.includes("Left") ? -.055 : .055);
        object.position.y -= a * .018;
      }
    }
    if (amount.current !== target) invalidate();
  });
  return null;
}
