# Project Contributions Guide

Each team member should use this guide to explain their role and contributions to the project.

---

## **Person 1: Scanner Module Lead**
**Focus:** Camera, barcode detection, user permissions

### What to say:
> "I'm responsible for the scanning functionality. I built the camera integration using the Expo Camera library, which handles real-time barcode detection. My work includes managing camera permissions, handling the user permission flow, and preventing duplicate scans. I also optimized the camera to reset when users return to the scanner screen."

### Key files:
- `src/ScannerScreen.js`
- Barcode detection logic
- Camera permission handling

### Features to highlight:
- ✅ Real-time barcode scanning
- ✅ Permission request flow
- ✅ Duplicate scan prevention
- ✅ State management (permission, scan lock)
- ✅ Loading states

### Git commits to reference:
```
- Added CameraView component integration
- Implemented camera permission flow
- Added scan lock to prevent duplicates
- Optimized screen focus handling
```

---

## **Person 2: Results & Display Lead**
**Focus:** UI/UX, price display, store information

### What to say:
> "I handle the user interface for displaying price results. I created the results screen that shows products from different stores with their prices sorted from best to worst deal. My components include a store badge system, price formatting in USD currency, and a flat list for smooth scrolling through many results. I also highlighted the best price to help users quickly identify the best deal."

### Key files:
- `src/ResultsScreen.js`
- StoreBadge component
- Results layout and styling

### Features to highlight:
- ✅ Price sorting (best → worst)
- ✅ Store badge creation with initials
- ✅ Currency formatting (USD)
- ✅ Loading state during data fetch
- ✅ Flat list optimization for performance
- ✅ Best price highlighting

### Git commits to reference:
```
- Created StoreBadge component
- Implemented price list UI
- Added currency formatting
- Optimized with useMemo for performance
```

---

## **Person 3: Data & Backend Lead**
**Focus:** Price data, API integration, data management

### What to say:
> "I manage all the data infrastructure for this app. Currently, I'm working with mock price data using the `mockPrices` function, but my role is to eventually connect this to a real backend API. I handle fetching price data based on barcode codes, caching responses to improve performance, and managing loading states. I also implement error handling so the app gracefully handles API failures."

### Key files:
- `src/mockPrices.js` (transitioning to real API)
- Price fetching logic in ResultsScreen
- Data transformation and formatting

### Features to highlight:
- ✅ Price data retrieval by barcode
- ✅ API latency simulation (850ms timeout)
- ✅ Data caching strategy
- ✅ Error handling
- ✅ Loading state management
- ✅ Ability to scale to real API

### Git commits to reference:
```
- Created mockPrices service
- Implemented price fetching with timeout
- Added data caching layer
- Error handling for failed API calls
```

---

## **Person 4: Styling & Components Lead**
**Focus:** Reusable components, design system, theming

### What to say:
> "I'm building our component library and design system. I extract reusable components like buttons, badges, cards, and headers so other developers don't duplicate code. I manage all the styling consistency across the app using a unified color scheme and spacing system. My work ensures the app has a professional, cohesive look and makes it easier for the team to build new screens quickly."

### Key files:
- `src/components/` (planned)
  - `Button.js`
  - `Badge.js`
  - `Card.js`
  - `Header.js`
- `src/theme/colors.js` (planned)
- `src/theme/styles.js` (planned)

### Features to highlight:
- ✅ Reusable Button component (CTA button)
- ✅ Badge component for store logos
- ✅ Consistent color palette
- ✅ Shared spacing and typography system
- ✅ Responsive design utilities
- ✅ Accessibility considerations

### Git commits to reference:
```
- Created component library structure
- Built reusable Button component
- Extracted Badge component
- Created theme/colors.js for consistency
- Added responsive utilities
```

---

## **Person 5: Navigation & Configuration Lead**
**Focus:** App structure, navigation, build configuration

### What to say:
> "I oversee the overall app architecture and configuration. I set up the navigation stack using React Navigation, which manages how users flow between the Scanner and Results screens. I configure the app settings in `app.json` and `eas.json` for building and deploying to iOS/Android. I also plan for new screens and features as we expand, ensuring the navigation structure stays scalable and organized."

### Key files:
- `App.js` (main entry point)
- `app.json` (app metadata and configuration)
- `eas.json` (build and deployment config)
- Navigation structure

### Features to highlight:
- ✅ Stack Navigator setup
- ✅ Screen transitions and naming
- ✅ Shared navigation styling
- ✅ Deep linking support (planned)
- ✅ Build configuration management
- ✅ App metadata (name, version, icons)

### Git commits to reference:
```
- Setup React Navigation Stack
- Configured shared header styling
- Created app.json with proper metadata
- Added eas.json for build management
- Implemented screen flow logic
```

---

## **Presentation Tips**

### For Each Person:

1. **Start with the Problem:**
   > "When users scan a barcode, we need to..."

2. **Explain Your Solution:**
   > "I built this by using [technology/library]..."

3. **Show the Code:**
   > "Here's my key component: [code snippet]"

4. **Demo or Show Results:**
   > "When you run the app, this is what happens..."

5. **Mention Performance/Quality:**
   > "I optimized this by [caching/memoization/debouncing]..."

6. **Discuss Challenges:**
   > "One challenge I faced was [permission handling/state management], and I solved it by..."

---

## **How to Show Git Contributions**

Each person should ensure their commits are visible:

```bash
# View your own contributions
git log --author="Your Name" --oneline

# See contribution stats
git shortlog -sn

# View specific branch work
git log origin/feature/your-feature --oneline
```

**Example commit message:**
```
feat(scanner): add camera permission flow

- Request camera permissions on screen load
- Show permission denied screen if not granted
- Reset scan lock when user returns to scanner

This allows users to grant camera access before scanning barcodes.
```

---

## **Team Sync Points**

### Weekly Standup Format:
Each person should say:
1. ✅ What I completed
2. 🔄 What I'm working on now
3. 🚧 What's blocking me
4. 🔗 How it connects to [other person's] work

### Example:
> "I finished the Scanner module with permission handling. Now I'm adding a zoom feature. I'm blocked waiting on Person 3's API response format. My Scanner needs to pass barcodes to Person 2's Results screen, so we need to coordinate the data structure."

---

## **Commit & PR Template**

### When submitting a PR:

```markdown
## What I built:
[Description of feature/component]

## Why it matters:
[Impact on the app or user experience]

## Files changed:
- src/ScannerScreen.js
- src/components/Button.js

## How to test:
1. [Step 1]
2. [Step 2]
3. [Verify...]

## Screenshots/Demo:
[Link to demo or screenshot]

## Related to Person X's work:
[Note any dependencies with other team members]
```

