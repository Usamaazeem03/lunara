# Client Dashboard Pages & Components Documentation

Professional documentation for all Client Dashboard pages and their integrated components.

---

## 📑 Table of Contents

1. [HomePage](#homepage)
2. [BookAppointmentPage](#bookappointmentpage)
3. [MyAppointmentPage](#myappointmentpage)
4. [NotificationPage](#notificationpage)
5. [OffersLoyaltyPage](#offersandloyaltypage)
6. [PaymentHistoryPage](#paymenthistorypage)
7. [Component Inventory](#component-inventory)

---

## HomePage

**Status:** ✅ Ready & Implemented  
**Location:** `/src/Dashboard/Client/ClientPages/HomePage.jsx`  
**Purpose:** Main landing page for authenticated client users - displays welcome section, statistics, appointment summary, and quick actions.

### Component Structure

```
HomePage
├── DashboardHeader (Header Section)
├── StatCards (Statistics Display)
└── Appointment + Side Panel Section
    ├── NextAppointmentPanel (Left Column)
    └── Side Panels (Right Column)
        ├── RedeemPointsPanal
        └── QuickActionPanal
```

### Sub-Components Used

| Component                | Location                       | Purpose                                                |
| ------------------------ | ------------------------------ | ------------------------------------------------------ |
| **DashboardHeader**      | `../../Shared/DashboardHeader` | Displays welcome message and action buttons            |
| **Button**               | `../../Shared/Button`          | Custom button component (primary & secondary variants) |
| **StatCards**            | `../StatCards`                 | Shows appointment stats and key metrics                |
| **NextAppointmentPanel** | `../NextAppointmentPanel`      | Displays upcoming appointment details                  |
| **RedeemPointsPanal**    | `../RedeemPointsPanal`         | Loyalty points redemption panel                        |
| **QuickActionPanal**     | `../QuickAction`               | Quick action shortcuts for common tasks                |

### Features Implemented

- ✅ Welcome header with personalized greeting ("Welcome back, Alex")
- ✅ Key statistics cards
- ✅ Next appointment display
- ✅ Points redemption interface
- ✅ Quick action buttons ("Book Appointment", "Contact Salon")
- ✅ Responsive grid layout (mobile, tablet, desktop)
- ✅ Scrollable content area
- ✅ Dynamic menu navigation via `setActiveMenu` prop

### Props

```jsx
{
  setActiveMenu: (menuName: string) => void  // Function to switch active menu sections
}
```

### Component Sections Breakdown

#### 1️⃣ Welcome Section

- **Component:** `DashboardHeader`
- **Eyebrow:** "Welcome back"
- **Title:** Client name (e.g., "Alex")
- **Description:** Journey description text
- **Actions:** "Book Appointment" & "Contact Salon" buttons

#### 2️⃣ Statistics Section

- **Component:** `StatCards`
- **Purpose:** Display key metrics and statistics
- **Location Link:** [`../StatCards`](../StatCards.jsx)

#### 3️⃣ Main Content Grid

- **Left Column (1.4fr):** `NextAppointmentPanel` - Shows upcoming appointment
- **Right Column (1fr):** Two stacked panels
  - `RedeemPointsPanal` - Loyalty points management
  - `QuickActionPanal` - Quick navigation shortcuts

### Styling

- **Padding:** `px-4 py-4` (mobile), `sm:px-6 sm:py-6` (tablet), `lg:px-10 lg:py-8` (desktop)
- **Layout:** Flexbox column with overflow auto for scrolling
- **Grid Gap:** 4 units between sections
- **Responsive:** Mobile-first approach with Tailwind breakpoints

### Usage Example

```jsx
import HomePage from "./ClientPages/HomePage";

function ClientDashboard() {
  const [activeMenu, setActiveMenu] = useState("Home");

  return <HomePage setActiveMenu={setActiveMenu} />;
}
```

---

## BookAppointmentPage

**Status:** 🔗 Component Available  
**Location:** `/src/Dashboard/Client/ClientPages/BookAppointmentPage.jsx`  
**Purpose:** Multi-step appointment booking interface

> Related component: `StepConfirm.jsx`

---

## MyAppointmentPage

**Status:** 🔗 Component Available  
**Location:** `/src/Dashboard/Client/ClientPages/MyAppointmentPage.jsx`  
**Purpose:** View and manage existing appointments

---

## NotificationPage

**Status:** 🔗 Component Available  
**Location:** `/src/Dashboard/Client/ClientPages/NotificationPage.jsx`  
**Purpose:** Display appointment reminders and system notifications

---

## OffersAndLoyaltyPage

**Status:** 🔗 Component Available  
**Location:** `/src/Dashboard/Client/ClientPages/OffersLoyaltyPage.jsx`  
**Purpose:** Browse special offers and manage loyalty rewards program

---

## PaymentHistoryPage

**Status:** 🔗 Component Available  
**Location:** `/src/Dashboard/Client/ClientPages/PaymentHistoryPage.jsx`  
**Purpose:** View transaction history and payment records

---

## Component Inventory

### Shared Components (Used Across Pages)

| Component       | Location                       | Status    |
| --------------- | ------------------------------ | --------- |
| DashboardHeader | `../../Shared/DashboardHeader` | ✅ Active |
| Button          | `../../Shared/Button`          | ✅ Active |
| Sidebar         | `../../Shared/Sidebar`         | ✅ Active |
| Dashboard       | `../../Shared/Dashboard`       | ✅ Active |
| DashboardHeader | `../../Shared/DashboardHeader` | ✅ Active |
| ProfileModal    | `../../Shared/ProfileModal`    | ✅ Active |
| BackgroundText  | `../../Shared/BackgroundText`  | ✅ Active |

### Client-Specific Components

| Component            | Location                  | Used In   | Status    |
| -------------------- | ------------------------- | --------- | --------- |
| StatCards            | `../StatCards`            | HomePage  | ✅ Active |
| NextAppointmentPanel | `../NextAppointmentPanel` | HomePage  | ✅ Active |
| QuickActionPanal     | `../QuickAction`          | HomePage  | ✅ Active |
| RedeemPointsPanal    | `../RedeemPointsPanal`    | HomePage  | ✅ Active |
| AppointmentCard      | `../AppointmentCard`      | Various   | ✅ Active |
| InfoCard             | `../InfoCard`             | Various   | ✅ Active |
| SummaryPanal         | `../SummaryPanal`         | Dashboard | ✅ Active |
| QuickAction          | `../QuickAction`          | Dashboard | ✅ Active |

---

## Directory Structure

```
src/Dashboard/Client/
├── ClientPages/
│   ├── HomePage.jsx (Main Landing)
│   ├── BookAppointmentPage.jsx
│   ├── MyAppointmentPage.jsx
│   ├── NotificationPage.jsx
│   ├── OffersLoyaltyPage.jsx
│   ├── PaymentHistoryPage.jsx
│   ├── StepConfirm.jsx
│   └── CLINT_PAGES_OR_COMPONENTS_README.MD (This File)
├── StatCards.jsx
├── NextAppointmentPanel.jsx
├── QuickAction.jsx
├── RedeemPointsPanal.jsx
├── AppointmentCard.jsx
├── InfoCard.jsx
├── SummaryPanal.jsx
└── [Other Components]
```

---

## Development Notes

### Props Flow in HomePage

- `setActiveMenu` - Passed from parent (Dashboard) to enable page navigation
- Used in Button components to trigger menu switches
- Example: `onClick={() => setActiveMenu("Book Appointment")}`

### Responsive Design

- Mobile: Full width, stacked layout
- Tablet (sm): Enhanced padding, grid adjustments
- Desktop (lg): Multi-column layout with optimized spacing

### Performance Considerations

- Components use React.memo for optimization where applicable
- Lazy loading can be implemented for sub-panels if needed
- Consider implementing virtualization for large lists

---

## Navigation Map

```mermaid
HomePage
├── Click "Book Appointment" → Navigate to BookAppointmentPage
├── Click "Contact Salon" → Open Contact Form
└── StatCards/Panels → Navigate to respective detail pages
    ├── NextAppointmentPanel → MyAppointmentPage
    ├── RedeemPointsPanal → OffersLoyaltyPage
    └── QuickActionPanal → Contextual Navigation
```

---

## Last Updated

**Date:** March 2026  
**Version:** 1.0 (Release Ready)

---

**For questions or updates, please refer to the component implementations directly.**
