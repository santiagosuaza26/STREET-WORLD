"use client";

import { Suspense } from "react";
import CheckoutStatusContent from "./status-content";

export default function CheckoutStatusPage() {
  return (
    <Suspense fallback={<div className="section"><div className="container"><p>Cargando...</p></div></div>}>
      <CheckoutStatusContent />
    </Suspense>
  );
}
