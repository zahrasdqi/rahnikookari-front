//src/pages/PaymentResult/PaymentResult.jsx
// src/pages/PaymentResult/PaymentResult.jsx
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "../../components/ui/Container/Container";
import "./PaymentResult.scss";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("fa-IR");
}

export default function PaymentResult() {
  const query = useQuery();

  const status = query.get("status");
  const amount = query.get("amount");
  const refId = query.get("ref_id");
  const message = query.get("message");
  const campaignId = query.get("campaign_id");

  const isSuccess = status === "success";

  return (
    <div className="payment-result-page">
      <Container>
        <div className={`payment-result-card ${isSuccess ? "success" : "failed"}`}>
          <div className="payment-result-icon">
            {isSuccess ? "✅" : "❌"}
          </div>

          <h1 className="payment-result-title">
            {isSuccess ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}
          </h1>

          <p className="payment-result-subtitle">
            {isSuccess
              ? "حمایت مالی شما با موفقیت ثبت شد. از همراهی ارزشمند شما ممنونیم."
              : message || "متأسفانه پرداخت تکمیل نشد یا توسط کاربر لغو شد."}
          </p>

          {isSuccess && (
            <div className="payment-result-meta">
              <div className="meta-row">
                <span>مبلغ پرداختی</span>
                <strong>{formatNumber(amount)} تومان</strong>
              </div>

              <div className="meta-row">
                <span>کد رهگیری</span>
                <strong>{refId || "-"}</strong>
              </div>
            </div>
          )}

          <div className="payment-result-actions">
            {campaignId && (
              <Link to={`/campaigns/${campaignId}`} className="btn btn-secondary">
                بازگشت به پویش
              </Link>
            )}

            <Link to="/" className="btn btn-primary">
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
