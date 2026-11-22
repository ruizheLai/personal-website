import Phase5NLayout from "../phase5n/layout";
import "./phase5o.css";

export { metadata } from "../phase5n/layout";

export default function Phase5OLayout({ children }: { children: React.ReactNode }) {
  return <Phase5NLayout><div className="po-study">{children}</div></Phase5NLayout>;
}
