import Journey from "./Journey";
import { About, Contact, FixLens, Sippy, WillDo } from "./Destinations";

export default function Page() {
  return <Journey panels={[<FixLens key="fixlens" />, <Sippy key="sippy" />, <WillDo key="willdo" />, <About key="about" />, <Contact key="contact" />]} />;
}
