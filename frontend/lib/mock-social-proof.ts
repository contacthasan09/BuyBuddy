/* ═══════════════════════════════════════════════════════
   MOCK SOCIAL PROOF DATA
   ═══════════════════════════════════════════════════════
   Replace with real order events from your backend when
   ready. For now, provides realistic-looking notifications.
*/

export const BD_NAMES = [
  "Rahim",
  "Fatima",
  "Karim",
  "Ayesha",
  "Hasan",
  "Nusrat",
  "Imran",
  "Sabrina",
  "Tanvir",
  "Mehjabin",
  "Shakib",
  "Rumana",
  "Arif",
  "Sadia",
  "Faisal",
  "Nadia",
  "Rakib",
  "Sultana",
  "Jubayer",
  "Tasnim",
];

export const BD_CITIES = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj",
  "Bogura",
];

export function randomNotification() {
  const name = BD_NAMES[Math.floor(Math.random() * BD_NAMES.length)];
  const city = BD_CITIES[Math.floor(Math.random() * BD_CITIES.length)];
  const minutesAgo = Math.floor(Math.random() * 15) + 1;

  return {
    name,
    city,
    minutesAgo,
  };
}

export function formatMinutesAgo(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}