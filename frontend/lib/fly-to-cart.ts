/* ═══════════════════════════════════════════════════════
   FLY-TO-CART
   ═══════════════════════════════════════════════════════
   Creates a temporary dot, animates it from a source
   element to the cart icon, then fires an event so the
   cart button can shake + update the badge.
   
   Uses the Web Animations API — no React overhead, runs
   on the compositor thread, smooth on low-end devices.
*/

const CART_ICON_SELECTOR = "[data-cart-icon]";
const FLYING_DOT_ID = "flying-cart-dot";

interface FlyOptions {
  /** Source element (product image, add-to-cart button, etc.) */
  from: HTMLElement;
  /** Optional color for the dot */
  color?: string;
  /** Duration in ms */
  duration?: number;
}

export function flyToCart({ from, color = "#3ec8e4", duration = 700 }: FlyOptions) {
  if (typeof window === "undefined") return;

  // Find cart icon
  const cartIcon = document.querySelector<HTMLElement>(CART_ICON_SELECTOR);
  if (!cartIcon) {
    // No cart icon visible — just fire the event without animating
    fireCartLandedEvent();
    return;
  }

  // Get positions
  const fromRect = from.getBoundingClientRect();
  const toRect = cartIcon.getBoundingClientRect();

  // Source center
  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;

  // Destination center
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;

  // Create the flying dot
  const dot = document.createElement("div");
  dot.id = FLYING_DOT_ID;

  // Base dot size
  const size = 32;

  dot.style.cssText = `
    position: fixed;
    left: ${startX - size / 2}px;
    top: ${startY - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${color};
    box-shadow: 0 0 24px ${color}, 0 0 48px ${color}80, 0 0 12px ${color}cc;
    z-index: 9999;
    pointer-events: none;
    will-change: transform, opacity;
    opacity: 0.95;
  `;

  // Small inner circle for a "core" look
  const inner = document.createElement("div");
  inner.style.cssText = `
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: #ffffff;
    opacity: 0.85;
  `;
  dot.appendChild(inner);

  document.body.appendChild(dot);

  // Compute the control point for a curved path
  // Arc bows upward
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 120; // rise 120px above the higher point

  // Animate using Web Animations API
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  const animation = dot.animate(
    [
      { transform: "translate(0, 0) scale(0.4)", opacity: 0 },
      { transform: "translate(0, 0) scale(1)", opacity: 1, offset: 0.15 },
      {
        transform: `translate(${midX - startX}px, ${midY - startY}px) scale(1.15)`,
        opacity: 1,
        offset: 0.6,
      },
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(0.3)`,
        opacity: 0.2,
        offset: 1,
      },
    ],
    {
      duration,
      easing: "cubic-bezier(0.5, 0, 0.5, 1)", // ease-in-out
      fill: "forwards",
    }
  );

  // Cleanup on finish
  animation.onfinish = () => {
    dot.remove();
    fireCartLandedEvent();
  };

  // Safety cleanup in case animation is interrupted
  setTimeout(() => {
    if (document.getElementById(FLYING_DOT_ID)) {
      dot.remove();
      fireCartLandedEvent();
    }
  }, duration + 200);
}

function fireCartLandedEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("flying-cart-dot-landed"));
}

/* ═══════════════════════════════════════════════════════
   Helper — find the "source" element for a product card
   ═══════════════════════════════════════════════════════ */
export function findProductImage(
  productSlug: string
): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector(
    `[data-product-image="${productSlug}"]`
  );
}