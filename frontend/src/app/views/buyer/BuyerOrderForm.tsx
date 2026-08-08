import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle } from "lucide-react";
import { Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { ApiError, createOrder, getProducts } from "../../lib/api";
import type { Order, PublicProduct } from "../../lib/api";

// minOrder is admin-entered free text like "5 MT" — pull the leading number out of it.
function parseMinOrderQuantity(minOrder: string): number | null {
  const match = minOrder.match(/[\d,.]+/);
  if (!match) return null;
  const num = parseFloat(match[0].replace(/,/g, ""));
  return Number.isFinite(num) ? num : null;
}

export function BuyerOrderForm({ showToast }: { showToast: (m: string, t: "success" | "error" | "info") => void }) {
  const { token } = useAuth();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [deliveryPort, setDeliveryPort] = useState("");
  const [shipmentDate, setShipmentDate] = useState("");
  const [tradeTerm, setTradeTerm] = useState("FOB Mumbai");
  const [qualitySpec, setQualitySpec] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.products))
      .catch(err => showToast(err instanceof ApiError ? err.message : "Failed to load products.", "error"))
      .finally(() => setLoadingProducts(false));
  }, []);

  const selectedProduct = products.find(p => p.id === productId) ?? null;
  const minOrderQty = selectedProduct ? parseMinOrderQuantity(selectedProduct.minOrder) : null;

  const resetForm = () => {
    setProductId(""); setQty(""); setDeliveryPort(""); setShipmentDate("");
    setTradeTerm("FOB Mumbai"); setQualitySpec(""); setNotes("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);

    if (minOrderQty !== null && Number(qty) < minOrderQty) {
      setError(`Quantity must be at least the minimum order of ${selectedProduct?.minOrder}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await createOrder(token, { productId, qty: Number(qty), deliveryPort, shipmentDate, tradeTerm, qualitySpec, notes });
      setCreatedOrder(res.order);
      showToast("Order request submitted! Quotation will arrive within 24 hours.", "success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5" data-testid="buyer-order-form">
      <div>
        <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>Bulk Order Request</h2>
        <p className="text-sm text-muted-foreground">Fill in the details and we'll send a formal quotation within 24 hours.</p>
      </div>
      {createdOrder ? (
        <Card className="p-8 text-center" data-testid="buyer-order-form-success">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: "Fraunces, serif" }}>Request Submitted!</h3>
          <p className="text-sm text-muted-foreground mb-1">Order ID: <span className="font-mono font-medium text-foreground" data-testid="buyer-order-form-order-code">{createdOrder.orderCode}</span></p>
          <p className="text-sm text-muted-foreground mb-6">Our team will review and send a quotation to your registered email within 24 business hours.</p>
          <Btn variant="secondary" onClick={() => { setCreatedOrder(null); resetForm(); }} data-testid="buyer-order-form-submit-another-button">Submit Another Request</Btn>
        </Card>
      ) : (
        <Card className="p-6" data-testid="buyer-order-form-card">
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="buyer-order-form-error">{error}</div>}
          <form onSubmit={submit} className="space-y-5" data-testid="buyer-order-form-form">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-order-form-product">Product *</label>
              <select required id="buyer-order-form-product" name="productId" value={productId} onChange={e => setProductId(e.target.value)} disabled={loadingProducts} data-testid="buyer-order-form-product-select"
                className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]">
                <option value="">{loadingProducts ? "Loading products..." : "Select a product"}</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.price} (min {p.minOrder})</option>)}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-order-form-qty">Quantity (MT) *</label>
                <input required id="buyer-order-form-qty" name="qty" type="number" min={minOrderQty ?? 1} step="any" value={qty} onChange={e => setQty(e.target.value)} data-testid="buyer-order-form-qty-input"
                  className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="e.g. 10" />
                {selectedProduct && (
                  <p className="text-xs text-muted-foreground mt-1">Minimum order: {selectedProduct.minOrder}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-order-form-delivery-port">Delivery Port</label>
                <input id="buyer-order-form-delivery-port" name="deliveryPort" value={deliveryPort} onChange={e => setDeliveryPort(e.target.value)} data-testid="buyer-order-form-delivery-port-input"
                  className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="e.g. Port Rashid, Dubai" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-order-form-shipment-date">Preferred Shipment Date</label>
                <input id="buyer-order-form-shipment-date" name="shipmentDate" type="date" value={shipmentDate} onChange={e => setShipmentDate(e.target.value)} data-testid="buyer-order-form-shipment-date-input"
                  className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-order-form-trade-term">Trade Term</label>
                <select id="buyer-order-form-trade-term" name="tradeTerm" value={tradeTerm} onChange={e => setTradeTerm(e.target.value)} data-testid="buyer-order-form-trade-term-select"
                  className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]">
                  <option>FOB Mumbai</option>
                  <option>CIF Destination</option>
                  <option>CFR Destination</option>
                  <option>EXW Factory</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-order-form-quality-spec">Quality Specification</label>
              <input id="buyer-order-form-quality-spec" name="qualitySpec" value={qualitySpec} onChange={e => setQualitySpec(e.target.value)} data-testid="buyer-order-form-quality-spec-input"
                className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a]" placeholder="e.g. Grade A, 5% broken max, moisture 12%" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="buyer-order-form-notes">Additional Notes</label>
              <textarea id="buyer-order-form-notes" name="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} data-testid="buyer-order-form-notes-input"
                className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm outline-none focus:ring-2 focus:ring-[#1e5c3a]/30 focus:border-[#1e5c3a] resize-none" placeholder="Any special requirements, packing preferences, certifications needed..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Btn type="submit" variant="primary" size="lg" disabled={submitting || loadingProducts} data-testid="buyer-order-form-submit-button">
                {submitting ? "Submitting..." : "Submit Request"}
              </Btn>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
