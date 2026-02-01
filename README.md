# UI Bug Detection Demo

**Debugging invisible UI bugs with GitHub Copilot Skills and Custom Agents**

Demonstrates catching bugs that traditional testing misses — a **z-index issue** where the success message appears behind the header after placing an order. Users think their order failed and click again, creating duplicate orders!

## The Bugs

The checkout page has **3 bugs** that tests miss:

### Bug 1: Z-Index Overlap (Visual - Success Message Hidden)
1. User clicks "Place Order"
2. Success message appears in DOM ✅
3. Tests pass (element exists, has correct text, isVisible returns true) ✅
4. **But the message renders BEHIND the header** ❌
5. Users don't see it, think order failed, click again = duplicate order!

### Bug 2: Off-By-One Quantity (Functional - Wrong Item Modified)
1. User clicks "+" on Headphones (item 0).
2. Test checks: "Did total increase?" ✅ Yes!
3. **But Phone Case (item 1) qty increased, not Headphones!** ❌
4. Users get wrong quantities in their order!

### Bug 3: Off-By-One Remove (Functional - Wrong Item Deleted)
1. User clicks "✕" to remove Headphones (item 0)
2. Test checks: "Is there one less item?" ✅ Yes!
3. **But Phone Case (item 1) was removed, not Headphones!** ❌
4. Users lose the wrong product from their cart!

**Why tests miss these:**
- ❌ No console errors
- ✅ Elements exist in DOM
- ✅ `isVisible()` returns true
- ✅ Total changed / item removed
- 👻 But the WRONG item was affected!

## Project Structure

```
Debug-UI/
├── .github/
│   ├── skills/webapp-testing/          # Skill: Playwright patterns
│   └── agents/
│       └── visual-detective.agent.md   # Agent: Visual bug detection
├── sample-app/                          # The buggy checkout
│   ├── index.html
│   ├── styles.css                       # Bug: z-index issue
│   └── app.js
└── tests/
    └── checkout.spec.ts                 # Tests that PASS
```

## Setup

```bash
npm install
pip3 install playwright
python3 -m playwright install chromium
```

## Demo Flow

### Act 1: Show the Problem (2 min)

1. **Open the checkout page**:
   ```bash
   npm run serve
   ```
   
2. **Click "Place Order"** — nothing visible happens!

3. **Run tests** — they all pass:
   ```bash
   npm test
   ```

4. **Ask base Copilot**: "Why isn't the success message showing?"
   - Copilot checks code, everything looks right
   - Can't visually see the z-index overlap

### Act 2: Introduce the Skill & Agent (1 min)

- `.github/skills/webapp-testing/` — teaches Playwright patterns
- `.github/agents/visual-detective.agent.md` — captures screenshots to see what users see

### Act 3: Visual Detective Investigation (3 min)

1. **Invoke the agent**:
   > `@visual-detective investigate and create Playwright tests to my web application to understand why users don't see the success message after placing an order`

2. The agent:
   - Places an order using Playwright
   - Captures screenshot immediately after
   - Sees header covering the success message
   - Identifies z-index conflict (header: 100, message: 10)
   - Suggests the fix

## Key Takeaways

| Standard Testing | Visual Detective |
|-----------------|------------------|
| Element exists? ✅ | Can users SEE it? ❌ |
| Has correct text? ✅ | Is it obscured? Shows screenshot |
| isVisible()? ✅ | Identifies z-index conflict |

---

**The Value**: `isVisible()` only checks if an element isn't `display: none`. It doesn't check if something is rendered on TOP of it. Screenshot testing catches what users actually see.
