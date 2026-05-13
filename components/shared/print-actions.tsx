"use client";

import { Button } from "@/components/ui/button";

export function PrintActions() {
  return (
    <>
      <Button type="button" variant="secondary" className="no-print" onClick={() => window.print()}>
        Print receipt
      </Button>
      <Button type="button" variant="outline" className="no-print" onClick={() => window.print()}>
        Save as PDF
      </Button>
    </>
  );
}
