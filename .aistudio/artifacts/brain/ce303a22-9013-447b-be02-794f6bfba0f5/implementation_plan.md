# Implementation Plan: Unified Single Layout UX, Direct Bus Seat Booking Flow & Dark/Light Theme Audit

Deliver a clean, unified single-layout UX across all views, transition directly into seat booking when any bus card or "Select Seats" button is tapped, eliminate clumsy collapsible components, and resolve all dark/light mode visual errors in Profile and booking flows.

## Proposed Changes

### 1. Dedicated Step-by-Step Bus Booking Flow in `TicketBookingView.tsx`
- **State Management**:
  - Introduce `bookingStep: 'ROUTE_AND_BUSES' | 'SEAT_SELECTION'` state in `TicketBookingView`.
  - Default view displays only Step 1: Route selection (From/To cities + Date) and Available Buses.
- **Card Tap & CTA Trigger**:
  - Make the entire bus card clickable (`cursor-pointer`) as well as the "Select Seats" button.
  - Tapping anywhere on a bus card or its "Select Seats" button selects the bus, clears any stale seat selections for other buses, and transitions into Step 2 (`'SEAT_SELECTION'`).
- **Clean Step 2 Interface**:
  - Add a crisp top breadcrumb/header with a `← Back to Available Buses` button and a summary pill (`Operator`, `Time`, `₹ Fare`).
  - Render the 30-seat interactive bus cabin layout, price calculation, and passenger details in a single streamlined card without accordion collapse.

### 2. Streamlined Single-Layout UX Across All Views
- **Layout Consistency**:
  - Standardize all main view containers (`HomeView`, `TicketBookingView`, `HomeStaysView`, `MyBookingsView`, `ProfileView`) to share the same responsive flex container (`max-w-[1280px] w-full mx-auto px-4 sm:px-6`).
  - Replace any nested accordion collapses with clear, flat, beautifully spaced card sections.
  - Keep explanations concise, clear, and scannable without lengthy walls of text.

### 3. Light & Dark Theme Polish & UI Error Remediation in `ProfileView.tsx` and Booking Screens
- **Profile Screen Contrast**:
  - Ensure all input fields, labels, and modal backgrounds in `ProfileView.tsx` have crisp, high-contrast borders and readable typography in both light mode (`border-slate-300 bg-white text-slate-900`) and dark mode (`border-white/15 bg-slate-950 text-white`).
  - Fix `<select>` dropdown styles to avoid white-on-white or dark-on-dark browser select glitches.
  - Enhance the Edit Profile and Reset Demo Data modals with clean high-contrast styling and proper backdrop blur.
- **Booking & Passbook Components**:
  - Audit `TicketBookingView`, `HomeStaysView`, `MyBookingsView`, and `SeatLegend` for theme consistency, ensuring badges, seat states (Available, Selected, Reserved), and price tags remain crisp in both modes.

### 4. Verification & Build
- Verify TypeScript compilation via `lint_applet` (`tsc --noEmit`).
- Verify production bundle via `compile_applet` (`npm run build`).
- Validate interactions in both light and dark themes.

## Verification Plan

### Automated Checks
- `lint_applet`: Check for 0 TypeScript errors.
- `compile_applet`: Check for 0 Vite build errors.

### Manual Verification Flow
1. **Bus Booking Flow**:
   - Navigate to "Bus Tickets". Observe that only route selection and bus list cards are visible initially.
   - Tap any bus card or "Select Seats" button -> verify smooth transition to seat selection.
   - Select seats, enter passenger details, book seats -> verify ticket generation.
   - Click "← Back to Available Buses" -> verify return to bus list.
2. **Theme Switching**:
   - Toggle Dark/Light mode in Top Bar.
   - Check Profile view: text, inputs, edit modal, and reset modal.
   - Check Bus Booking view and Homestays view in both modes.
3. **Layout Uniformity**:
   - Check mobile and desktop viewports to ensure consistent 1280px flexbox layout and docked bottom bar.
