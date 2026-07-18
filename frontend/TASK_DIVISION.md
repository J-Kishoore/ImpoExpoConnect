# Team Task Division — B2B Ordering Platform UI

I refactored the original single-file `App.tsx` (1,700 lines, everything mashed
together) into separate files per page/component, grouped into folders. This is
what makes a real 5-way git split possible — with one giant file, only one
person can ever edit it at a time without merge conflicts.

## Folder structure

```
src/app/
  types.ts                     shared TypeScript types
  data.ts                      shared mock data (products, orders, buyers...)
  App.tsx                      root shell — routes between views
  components/
    shared/                    Badge, Btn, Card, StatCard, Toast, ChatWidget
    layout/                    PublicHeader, Sidebar, PortalTopBar
    ui/                        (pre-existing shadcn primitives, untouched)
  views/
    public/                    HomeView, ProductsView, AboutView, ContactView
    buyer/                     BuyerDashboard, BuyerCatalog, BuyerOrderForm,
                                BuyerTracking, BuyerQuotations, BuyerPayment
    admin/                     AdminDashboard, AdminBuyers, AdminProducts,
                                AdminOrders, AdminPayments, AdminReports
```

Every file already compiles and builds (`npx vite build` succeeds) — I split it
by copy/paste, not by rewriting logic, so nobody is starting from broken code.

## Suggested 5-way split

| Member | Owns (folder/files) | Pages |
|---|---|---|
| **1** | `views/public/` + `components/layout/PublicHeader.tsx` | Home, Products, About, Contact |
| **2** | `views/buyer/BuyerDashboard.tsx`, `BuyerCatalog.tsx`, `BuyerOrderForm.tsx` | Buyer Dashboard, Catalog, New Order |
| **3** | `views/buyer/BuyerTracking.tsx`, `BuyerQuotations.tsx`, `BuyerPayment.tsx` | Order Tracking, Quotations, Payment Upload |
| **4** | `views/admin/AdminDashboard.tsx`, `AdminBuyers.tsx`, `AdminProducts.tsx` | Admin Dashboard, Buyer Mgmt, Product Mgmt |
| **5** | `views/admin/AdminOrders.tsx`, `AdminPayments.tsx`, `AdminReports.tsx` | Order Approvals, Payment Verification, Reports |

That's 16 pages split roughly evenly (3–4 each). The shared bits
(`types.ts`, `data.ts`, `components/shared/`, `components/layout/Sidebar.tsx`
+ `PortalTopBar.tsx`, and `App.tsx` itself) are infrastructure — whoever sets
up the repo (likely the project leader) should push those first as an initial
commit, since every page imports from them. Everyone then branches off that.

## Verifying it still runs

```bash
npm install
npm run dev
```

If a teammate's file has a mistake, `npm run dev` will show the error with the
exact filename — easy to trace back to whoever owns that file.
