import Layout from "../phase5l/layout";
import "./phase5n.css";

export { metadata } from "../phase5l/layout";

export default function Phase5NLayout({ children }: { children: React.ReactNode }) {
  return <Layout><div className="pn-study">{children}</div></Layout>;
}
