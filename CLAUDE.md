# CLAUDE.md — E-commerce Refactor Context

## Project Overview

This is a refactor of an existing Shopify-based e-commerce project.

We are migrating away from Shopify to a custom stack for cost and flexibility reasons.

---

## Current Target Architecture

* Frontend: Next.js (App Router)
* Backend: Supabase (Postgres)
* Payments: Stripe Checkout (HOSTED CHECKOUT ONLY)
* Hosting: Vercel

---

## IMPORTANT CONSTRAINTS

### Payments

* Use Stripe Hosted Checkout only
* DO NOT implement Stripe Payment Intents
* DO NOT implement Stripe Elements
* DO NOT build custom checkout UI for payment processing

Stripe handles:

* Apple Pay
* Google Pay
* 3D Secure
* card payments

We only redirect to Stripe Checkout.

---

### Emails

* Email system is OUT OF SCOPE
* Do NOT implement Resend, Postmark, or any email sending

---

### Shopify Removal

All Shopify dependencies must be removed:

* Shopify Storefront API
* Shopify SDKs
* GraphQL Shopify queries
* Shopify-specific types (GIDs, edges/nodes)

---

## Data Layer

Supabase is the source of truth for:

* products
* product_variants
* orders
* order_items

Cart is stored in localStorage only.

Cart must NOT contain Shopify IDs.

---

## Checkout Flow

1. User builds cart in localStorage
2. User clicks checkout
3. Backend creates Stripe Checkout Session
4. User is redirected to Stripe-hosted checkout page
5. Stripe confirms payment
6. Stripe webhook writes order to Supabase

NO custom payment UI.

---

## Critical Rules

* Prefer refactor over rewrite
* Preserve existing UI, layout, animations
* Keep changes surgical
* Avoid overengineering admin panel initially
* Maintain TypeScript strictness
* Keep App Router structure intact

---

## Webhook Handling

Stripe webhook MUST be:

* idempotent
* safe against duplicate events
* source of truth for order creation

---

## What is explicitly OUT OF SCOPE (for now)

* Email system
* Admin panel complexity
* Custom checkout UI
* Payment Intents / Elements
* Advanced inventory logic

---

## Migration Strategy

Phase 1:

* remove Shopify integration
* introduce Supabase schema
* replace product APIs

Phase 2:

* refactor cart system (remove Shopify IDs)

Phase 3:

* implement Stripe Checkout Session flow

Phase 4:

* implement webhook → Supabase orders
