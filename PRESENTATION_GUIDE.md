# Presentation Guide for 5-Person Team

Each person should prepare a 3-5 minute presentation. Here's how to structure it:

---

## **Overall Presentation Flow (20-25 minutes total)**

### **Opening (1 min) - Person 5 (Navigation Lead)**
> "Hi, we built a React Native barcode scanner app using Expo. This app lets users scan product barcodes to instantly find the best prices from different stores. I'll introduce the overall architecture, then each team member will show their specific contribution."

**Show:** Live demo or video walkthrough of full app flow

---

## **Person 1: Scanner Module (4-5 minutes)**

### **Slide 1: Problem Statement**
- "Users need to scan product barcodes quickly"
- "The app must handle camera permissions safely"
- "We need to prevent accidental duplicate scans"

### **Slide 2: My Solution**
- Built using Expo Camera library
- Implemented permission request flow
- Added scan lock mechanism

### **Slide 3: Key Code** (Show these snippets)
```javascript
// Permission handling
useEffect(() => {
  if (!permission || !permission.granted) {
    requestPermission();
  }
}, [permission, requestPermission]);

// Scan lock prevents duplicates
const handleBarcodeScanned = ({ data }) => {
  if (scanned || !data) return;
  setScanned(true);
  // Navigate with barcode data
};

// Reset on screen focus
useFocusEffect(
  React.useCallback(() => {
    setScanned(false);
  }, [])
);
```

### **Slide 4: Demo**
**Live Demo:**
1. Run app on device/emulator
2. Show camera permission request
3. Scan a barcode (or tap to simulate)
4. Show navigation happens

**Or Video Demo:**
- Record screen recording showing: Permission → Camera → Scan → Navigate

### **Slide 5: Challenges & Solutions**
- **Challenge:** Users denied camera permission
  - **Solution:** Created friendly permission screen with "Enable Camera" button
  
- **Challenge:** App navigating multiple times on single scan
  - **Solution:** Added `scanned` lock state that resets on focus

### **Talking Points:**
> "I used React's `useEffect` and `useFocusEffect` hooks to manage the camera lifecycle. The `useCameraPermissions` hook from Expo handles the actual permission requests. The key challenge was preventing duplicate scans—I solved this by tracking a `scanned` state that prevents navigation until the screen refocuses."

### **Questions They Might Ask:**
- *"How does the barcode data get to the next screen?"* → Through React Navigation params
- *"What if they denied permission?"* → Show permission screen with retry option
- *"Can they disable camera?"* → The `useFocusEffect` resets the lock, allowing new scans

---

## **Person 2: Results & Display (4-5 minutes)**

### **Slide 1: Problem Statement**
- Users need to see which store has the best price
- App should display prices sorted from best to worst
- Need to format prices nicely in USD
- List should handle many results efficiently

### **Slide 2: My Solution**
- Built responsive results UI using FlatList
- Created StoreBadge component to show store initials
- Implemented price sorting and best price highlighting
- Used `useMemo` for performance

### **Slide 3: Key Code** (Show these snippets)
```javascript
// StoreBadge component
function StoreBadge({ name }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{initials}</Text>
    </View>
  );
}

// Price formatting
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Find best price using useMemo
const bestPrice = useMemo(
  () => (prices.length ? prices[0].price : null),
  [prices]
);
```

### **Slide 4: Demo**
**Live Demo:**
1. Scan a barcode from Person 1's demo
2. Show loading state briefly
3. Show results list with:
   - Store badges (WM, AM, etc.)
   - Prices formatted as $X.XX
   - Best price highlighted at top
4. Scroll through multiple results
5. Navigate back to scanner

**Or Screenshot:**
- Show Results screen with 5-10 stores listed
- Highlight the best price styling

### **Slide 5: UI/UX Features**
- ✅ Store initials in badges (space-efficient)
- ✅ Prices in USD format (consistent)
- ✅ Sorted best → worst (instant clarity)
- ✅ FlatList for scrolling (performance)
- ✅ Loading state shows data is fetching

### **Talking Points:**
> "I focused on making the results easy to scan. The StoreBadge component cleverly extracts initials from store names—'Walmart' becomes 'WM'. I used React's `useMemo` hook so the best price calculation doesn't re-render unnecessarily. The FlatList component handles scrolling efficiently even with hundreds of results."

### **Questions They Might Ask:**
- *"Why store badges?"* → More compact than full names, still readable
- *"How is it sorted?"* → Ascending price order (best deal first)
- *"Why useMemo?"* → Prevents recalculating best price on every render
- *"How many results can it show?"* → Unlimited with FlatList optimization

---

## **Person 3: Data & Backend (4-5 minutes)**

### **Slide 1: Problem Statement**
- Need real-time price data for any barcode
- Currently using mock data for testing
- Will need to connect to real price comparison API
- Must handle loading, caching, and errors

### **Slide 2: My Solution**
- Created `mockPrices` service that returns price data
- Simulates API latency (850ms) for realistic testing
- Passes mock data to ResultsScreen
- Structure ready for real API swap

### **Slide 3: Key Code** (Show these snippets)
```javascript
// In ResultsScreen.js - fetching data
useEffect(() => {
  const id = setTimeout(() => {
    setPrices(mockPrices(barcode));
    setLoading(false);
  }, 850); // Simulates network latency

  return () => clearTimeout(id);
}, [barcode]);

// mockPrices.js - returns price data
export default function mockPrices(barcode) {
  return [
    { store: 'Walmart', price: 12.99, logo: 'WM' },
    { store: 'Amazon', price: 14.99, logo: 'AM' },
    { store: 'Best Buy', price: 15.99, logo: 'BB' },
    // ... sorted ascending by price
  ];
}
```

### **Slide 4: Demo**
**Live Demo:**
1. Scan barcode
2. Show loading state (850ms)
3. Prices appear
4. Explain: "This delay simulates waiting for API response from real price server"

**Or Diagram:**
```
User scans barcode "123456789"
        ↓
App calls mockPrices("123456789")
        ↓
Service returns price array (sorted)
        ↓
Results screen displays with loading state
```

### **Slide 5: Future Implementation**
- **Current:** Local mock data in mockPrices.js
- **Next Step:** Replace with real API call:
```javascript
// Future real API call
const response = await fetch(
  `https://api.pricefinder.com/prices?barcode=${barcode}`
);
const prices = await response.json();
```
- Add: Error handling, retry logic, caching layer

### **Talking Points:**
> "I built the data layer that powers the results. Right now I'm using mock data to test the app flow, but the structure is ready for a real API. I simulate realistic latency so we see the loading state. This is the foundation—when we connect to a real price API, Person 2's results screen will display actual market prices."

### **Questions They Might Ask:**
- *"Where does the data come from?"* → Currently mock, will be real API
- *"Why 850ms delay?"* → Simulates realistic network latency
- *"What if API fails?"* → Will add error handling and retry logic
- *"How do you cache data?"* → Plan to cache by barcode to avoid repeated calls

---

## **Person 4: Styling & Components (3-4 minutes)**

### **Slide 1: Problem Statement**
- App has inconsistent styling across screens
- Developers recreating same components
- Need unified design system
- Buttons, badges, colors should be reusable

### **Slide 2: My Solution**
- Created component library folder `src/components/`
- Extracted reusable Button, Badge, Card components
- Built theme system with consistent colors
- Made styling maintainable

### **Slide 3: Key Code** (Show these snippets)
```javascript
// src/components/Button.js
export default function Button({ 
  label, 
  onPress, 
  variant = 'primary' 
}) {
  const styles = {
    primary: { backgroundColor: '#0f766e' },
    secondary: { backgroundColor: '#e2e8f0' },
  };
  
  return (
    <Pressable style={[styles.container, styles[variant]]} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

// src/theme/colors.js
export const colors = {
  primary: '#0f766e',     // Teal
  background: '#f8fafc',  // Light blue-gray
  text: '#0f172a',        // Dark slate
  error: '#dc2626',       // Red
};
```

### **Slide 4: Demo**
**Show Components:**
1. Highlight Button component usage in Scanner
2. Show Badge component in Results
3. Show color consistency across screens
4. Point out: Same colors, spacing, fonts everywhere

**Or Screenshot:**
- Before: Inconsistent styling
- After: Unified design

### **Slide 5: Benefits**
- ✅ No code duplication
- ✅ Easy to change design (one place)
- ✅ New screens build faster
- ✅ Professional consistency
- ✅ Easier for team to collaborate

### **Talking Points:**
> "I created a component library so we don't repeat code. Instead of each person writing their own Button, they use my Button component. I also set up a color theme file so if we need to change the brand color, we change it once and it updates everywhere. This makes the app look professional and maintainable."

### **Questions They Might Ask:**
- *"Why extract components?"* → DRY principle—don't repeat yourself
- *"What if we need different button styles?"* → Use `variant` prop (primary, secondary, etc.)
- *"How does the team use these?"* → Import from `src/components/Button`
- *"Can you style components for dark mode?"* → Yes, theme system supports it

---

## **Person 5: Navigation & Configuration (3-4 minutes)**

### **Slide 1: Problem Statement**
- App needs organized screen flow
- Configuration files (app.json, eas.json) control builds
- Need scalable navigation structure
- Must prepare for future growth

### **Slide 2: My Solution**
- Set up React Navigation Stack Navigator
- Configured shared header styling
- Set up app.json and eas.json
- Designed for adding new screens easily

### **Slide 3: Key Code** (Show these snippets)
```javascript
// App.js - Navigation setup
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#f8fafc' },
          headerTintColor: '#0f172a',
          headerTitleStyle: { fontSize: 18, fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ title: 'Scan Product' }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: 'Best Prices' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### **Slide 4: Demo**
**Live Demo:**
1. Start app on Scanner screen
2. Scan barcode (from Person 1)
3. Navigate to Results screen (shows transition)
4. Tap back to return to Scanner
5. Point out: Header styling is consistent

**Or Diagram:**
```
┌──────────────────────────────────────┐
│ React Navigation Stack               │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ Scanner Screen                  │ │
│ │ (Scan Product)                  │ │
│ │  ↓ [tap barcode result]         │ │
│ │                                 │ │
│ │ Results Screen                  │ │
│ │ (Best Prices)                   │ │
│ │  ↓ [tap back]                   │ │
│ │                                 │ │
│ │ Scanner Screen                  │ │
│ └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### **Slide 5: Configuration**
- **app.json:** App name, version, icons, splash screen
- **eas.json:** Build settings for iOS/Android
- **package.json:** Dependencies and scripts
- Ready to add: Settings screen, Help screen, Account screen

### **Talking Points:**
> "I architected how the app flows between screens using React Navigation. I set up a Stack Navigator where users navigate from Scanner → Results → back to Scanner. All screens share consistent header styling that I configured. I also prepared the build files (app.json and eas.json) so the app can be deployed to app stores. The structure is scalable—adding new screens is as simple as adding a new `<Stack.Screen>` component."

### **Questions They Might Ask:**
- *"How does navigation work?"* → Stack Navigator pushes/pops screens
- *"Can you add tabs?"* → Yes, could use Bottom Tab Navigator too
- *"What's app.json for?"* → App metadata (name, version, permissions)
- *"What's eas.json for?"* → Build configuration for iOS/Android deployment

---

## **Conclusion (1-2 minutes) - All Together**

### **Closing Summary:**
> "Let me show how all 5 parts work together..."

**Show full app flow:**
1. ✅ **Person 5:** App launches with configured navigation
2. ✅ **Person 1:** Scanner screen shows, user grants permission, scans barcode
3. ✅ **Person 3:** App fetches price data (with loading state)
4. ✅ **Person 2:** Results display with formatted prices sorted best-to-worst
5. ✅ **Person 4:** All styling is consistent (colors, buttons, badges)
6. ✅ **Person 1:** User taps back to scanner, reset for new scan

### **Each Person's Value:**
- **Person 1:** Without scanner, users can't get barcodes
- **Person 2:** Without UI, data is useless
- **Person 3:** Without data, there are no results to display
- **Person 4:** Without styling, app looks unprofessional
- **Person 5:** Without navigation, screens don't connect

### **Team Effort:**
> "This app required all 5 specialized roles. No one person could've built this alone. Each of us owned our domain while staying connected to the others' work. That's professional software development."

---

## **Q&A Tips**

### **Questions to Expect:**

1. **"How long did this take?"**
   - Answer: Clearly state hours/days per person
   - Example: "Person 1 spent 6 hours on camera logic, Person 2 spent 5 hours on UI," etc.

2. **"What was the hardest part?"**
   - Answer: Be honest about challenges
   - Example (Person 1): "Managing camera permissions across OS versions was tricky"

3. **"What would you do differently?"**
   - Answer: Show growth mindset
   - Example: "I'd use TypeScript for type safety"

4. **"How did you split the work?"**
   - Answer: Reference the CONTRIBUTIONS.md file
   - Explain clear ownership + git branches

5. **"Is this scalable?"**
   - Answer: Show the architecture supports growth
   - Example: "We could add more screens, connect real APIs, add user accounts"

---

## **Presentation Checklist**

**Each person should have:**
- ✅ 1-2 minute intro explaining role
- ✅ Problem they solved
- ✅ Solution/code snippet
- ✅ Live demo or screenshot
- ✅ Key challenges & how they solved them
- ✅ 2-3 talking points memorized
- ✅ Ready to answer 2-3 questions

**Whole team:**
- ✅ Practice together once
- ✅ Agree on demo flow (who goes first/last)
- ✅ Test app works before presentation
- ✅ Have backup screenshots if demo fails
- ✅ Know time limit per person (usually 3-5 min each)
- ✅ Have notes but don't read them word-for-word

---

## **Presentation Tools**

**Option 1: Simple Slides (Google Slides/PowerPoint)**
- Title slide with team names
- One slide per person (problem → solution → demo)
- Final slide with architecture diagram

**Option 2: GitHub README Demo**
- Present live code on GitHub
- Show git commit history for each person
- Pull up code while talking

**Option 3: Video Demo + Slides**
- Record app demo once (30-60 sec)
- Play video during presentation
- Use as fallback if live demo fails

---

## **Example Presentation Timeline (25 minutes total)**

| Time | Speaker | Activity |
|------|---------|----------|
| 0:00 - 1:00 | Person 5 | Intro & overall architecture |
| 1:00 - 5:00 | Person 1 | Scanner module walkthrough |
| 5:00 - 9:00 | Person 2 | Results UI & display |
| 9:00 - 13:00 | Person 3 | Data layer & backend |
| 13:00 - 16:00 | Person 4 | Components & design system |
| 16:00 - 19:00 | Person 5 | Navigation & config |
| 19:00 - 22:00 | All | Full app demo (end-to-end flow) |
| 22:00 - 25:00 | All | Q&A |

