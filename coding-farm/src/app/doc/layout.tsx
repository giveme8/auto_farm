// src/app/doc/layout.tsx
import Sidebar from "./Sidebar";
import "../globals.css";
import { ReactNode } from "react";

export default function DocLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
      <Sidebar />
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
