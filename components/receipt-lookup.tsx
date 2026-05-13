"use client";

import { startTransition, useState, type FormEvent } from "react";

import { receipts, residents } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export function ReceiptLookup() {
  const [houseNumber, setHouseNumber] = useState("A-31");
  const [cnic, setCnic] = useState("35202-1234567-1");
  const [mobile, setMobile] = useState("0312-555-0101");
  const [residentId, setResidentId] = useState<string | null>("R-001");
  const [error, setError] = useState<string | null>(null);

  const matchedResident = residents.find((resident) => resident.id === residentId) ?? null;
  const matchedReceipts = receipts.filter((receipt) => receipt.houseNumber === matchedResident?.houseNumber);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      const matched = residents.find(
        (resident) =>
          resident.houseNumber.toLowerCase() === houseNumber.trim().toLowerCase() &&
          resident.cnic === cnic.trim() &&
          resident.mobile === mobile.trim()
      );

      if (!matched) {
        setResidentId(null);
        setError("No record matched these details. Check the house number, CNIC, and mobile.");
        return;
      }

      setError(null);
      setResidentId(matched.id);
    });
  }

  return (
    <div className="lookup-card">
      <form className="lookup-form" onSubmit={handleSubmit}>
        <label>
          House number
          <input value={houseNumber} onChange={(event) => setHouseNumber(event.target.value)} />
        </label>
        <label>
          CNIC
          <input value={cnic} onChange={(event) => setCnic(event.target.value)} />
        </label>
        <label>
          Mobile number
          <input value={mobile} onChange={(event) => setMobile(event.target.value)} />
        </label>
        <button type="submit" className="primary-button">
          Verify and view receipts
        </button>
      </form>

      <p className="helper-note">
        Demo values are pre-filled so you can test the resident flow immediately.
      </p>

      {error ? <p className="error-note">{error}</p> : null}

      {matchedResident ? (
        <div className="lookup-result">
          <div className="lookup-result__head">
            <div>
              <p className="eyebrow">Verified resident</p>
              <h3>{matchedResident.name}</h3>
            </div>
            <span className={`status-chip status-chip--${matchedResident.status.toLowerCase().replace(/\s+/g, "-")}`}>
              {matchedResident.status}
            </span>
          </div>

          <div className="mini-grid">
            <div className="mini-card">
              <span>House</span>
              <strong>{matchedResident.houseNumber}</strong>
            </div>
            <div className="mini-card">
              <span>Street</span>
              <strong>{matchedResident.street}</strong>
            </div>
            <div className="mini-card">
              <span>Monthly fee</span>
              <strong>{formatCurrency(matchedResident.monthlyDue)}</strong>
            </div>
            <div className="mini-card">
              <span>Outstanding</span>
              <strong>{formatCurrency(matchedResident.outstanding)}</strong>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <caption>Resident receipt history</caption>
              <thead>
                <tr>
                  <th>Receipt no</th>
                  <th>House no</th>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Street no</th>
                  <th className="align-right">Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {matchedReceipts.map((receipt) => (
                  <tr key={receipt.receiptNo}>
                    <td>{receipt.receiptNo}</td>
                    <td>{receipt.houseNumber}</td>
                    <td>{receipt.year}</td>
                    <td>{receipt.month}</td>
                    <td>{receipt.street}</td>
                    <td className="align-right">{formatCurrency(receipt.amount)}</td>
                    <td>{receipt.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
