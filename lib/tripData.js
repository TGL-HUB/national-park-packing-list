// ── Coastal 65th · Seattle / National Parks Trip · June 4–12, 2026 ──────────
// All itinerary data in one place. Edit times, stops, and notes here.
// Each stop may carry an optional `info` { blurb, facts: [] } that powers the
// "tap a stop to learn more" detail panel in the app.

export const TRIP = {
  title: "Coastal 65th",
  tagline: "Seals and whales, here we come!",
  startDate: "2026-06-04",
  endDate: "2026-06-12",
  base: {
    name: "AirBnB · Silverdale, WA",
    address: "10977 Warren Road Northwest, Silverdale WA",
    coords: [47.6448, -122.6949],
  },
};

// The trip group, used for the per-person packing list. Kept server-side so the
// crew's names aren't exposed in the public bundle.
export const PEOPLE = ["Laura", "Jeff", "Kelley", "Doug", "Molly", "Julian", "Emma"];

// ── The crew & their flights ─────────────────────────────────────────────────
export const CREW = [
  {
    name: "Mom & Dad",
    emoji: "🛬",
    arrive: "Thu 6/4 · 10:34am",
    depart: "Fri 6/12 · 11:45am → 7:13pm DTW",
    detail: "Delta DL0734 (in) · Delta DL1706 (out)",
  },
  {
    name: "Emma",
    emoji: "✈️",
    arrive: "Thu 6/4 · 12:28pm",
    depart: "Fri 6/12 · 11:58pm",
    detail: "American Eagle 3416 BGR→ORD, then ORD→SEA · returns via ORD",
  },
  {
    name: "Molly · Julian · Kelley · Douglas",
    emoji: "🛩️",
    arrive: "Thu 6/4 · 2:50pm",
    depart: "Fri 6/12 · 2:30pm → 9:48pm",
    detail: "Delta DL0728 (in) · Delta DL0533 (out)",
  },
];

export const LOGISTICS = [
  { label: "Home base", value: "Silverdale, WA — 10977 Warren Road NW", icon: "🏡" },
  { label: "Rental", value: "Premium SUV (Expedition / Wagoneer) — seats 8", icon: "🚙" },
  { label: "Rental pickup", value: "Enterprise · 3150 S 160th St", icon: "🔑" },
  { label: "Heads up", value: "Still on Michigan time — early starts feel even earlier!", icon: "⏰" },
];

// ── Dinner reservations (quick reference) ────────────────────────────────────
export const RESERVATIONS = [
  { day: "Fri 6/5", time: "6:45pm", place: "Duke's Seafood", where: "Ruston Way, Tacoma (on the water)", party: 8 },
  { day: "Sat 6/6", time: "6:30pm", place: "Downriggers", where: "Port Angeles", party: 8 },
  { day: "Sun 6/7", time: "6:30pm", place: "Yacht Club Broiler", where: "Silverdale", party: 8 },
  { day: "Tue 6/9", time: "5:00pm", place: "El Patron", where: "Sedro-Woolley", party: 6 },
];

// ── Day-by-day. Each stop can carry coords (map pin) and info (detail panel). ─
export const DAYS = [
  {
    n: 1,
    date: "Thu · June 4",
    title: "Arrive! 🛬",
    badge: null,
    color: "#3b82c4",
    summary: "Touch down in Seattle, grab the rental, and get settled in Silverdale.",
    stops: [
      { time: "AM/PM", name: "Land at SEA & grab the SUV", note: "Three arrivals: 10:34a, 12:28p, 2:50p", coords: [47.4502, -122.3088], pin: "🛬" },
      { time: "—", name: "Head to the AirBnB", note: "Silverdale, WA", coords: [47.6448, -122.6949], pin: "🏡",
        info: { blurb: "Our home base for the week — a waterfront town on the Kitsap Peninsula, a short ferry-or-bridge hop from Seattle.", facts: ["Silverdale sits on Dyes Inlet, where orcas have occasionally wandered in.", "Kitsap means 'home base' for exploring both Seattle and the Olympic Peninsula without long drives."] } },
      { time: "—", name: "Grocery run & get settled", note: "Pack snacks/food for the car" },
      { time: "Dinner", name: "Pizza & salad from Tessio", note: "Silverdale", coords: [47.6440, -122.6960], pin: "🍕" },
    ],
  },
  {
    n: 2,
    date: "Fri · June 5",
    title: "Mount Rainier",
    badge: "🎂 Julian's Birthday",
    color: "#2f9e6f",
    summary: "Waterfalls, wildflower meadows, and Paradise — then distillery + seafood in Tacoma.",
    stops: [
      { time: "6:00a", name: "Leave Silverdale", note: "~2h36m drive · Troy may meet us!" },
      { time: "8:30a", name: "Gypsy Wagon Espresso", note: "Eatonville coffee stop", coords: [46.8690, -122.2680], pin: "☕",
        info: { blurb: "A beloved roadside espresso stand in tiny Eatonville — the classic last-good-coffee stop before the mountain.", facts: ["Eatonville is the gateway to Rainier's Nisqually entrance.", "Drive-up espresso stands are a Pacific Northwest institution — Washington has more per capita than anywhere in the U.S."] } },
      { time: "9:30a", name: "Nisqually Entrance", note: "Enter the park", coords: [46.7423, -121.9166], pin: "🏔️",
        info: { blurb: "The historic southwest gateway to Mount Rainier National Park and the road up to Paradise.", facts: ["The Nisqually entrance arch dates to 1911 — the oldest in the park.", "Rainier was the 5th national park ever established, in 1899."] } },
      { time: "9:50a", name: "Christine Falls", note: "10–20 min walk", coords: [46.7790, -121.7830], pin: "💦",
        info: { blurb: "A graceful two-tiered waterfall framed perfectly by a 1928 stone highway bridge — one of the park's most photographed spots.", facts: ["The bridge was deliberately built to frame the lower falls.", "It's fed by meltwater from the Van Trump Glaciers above."] } },
      { time: "10:30a", name: "Narada Falls", note: "20–30 min walk", coords: [46.7750, -121.7470], pin: "💦",
        info: { blurb: "A thunderous 176-ft waterfall on the Paradise River; a short steep path leads to a misty viewpoint.", facts: ["The spray often throws rainbows in afternoon light.", "It drops in two tiers over a wall of andesite lava rock."] } },
      { time: "11:30a", name: "Paradise Area", note: "Gift shop · Myrtle Falls · Skyline Trail to Panorama Point (2 mi)", coords: [46.7860, -121.7350], pin: "🌸",
        info: { blurb: "The crown jewel of Rainier — subalpine wildflower meadows beneath the glaciers, a historic inn, and the start of the Skyline Trail.", facts: ["Paradise once held the world-record snowfall: 1,122 inches in 1971–72.", "It was named when settler Martha Longmire exclaimed, 'Oh, what a paradise!'", "Wildflowers usually peak mid-July to August."] } },
      { time: "2:15p", name: "Reflection Lakes", note: "15–20 min · mirror views of Rainier", coords: [46.7690, -121.7320], pin: "🪞",
        info: { blurb: "Calm tarns that mirror Mount Rainier on still mornings — arguably the best reflection shot in the park.", facts: ["Best reflections happen on windless mornings before the breeze picks up.", "The lakes sit right along Stevens Canyon Road for easy access."] } },
      { time: "~2:30p", name: "Drive to Tacoma", note: "Chambers Bay Distillery · walk town · cideries", coords: [47.2870, -122.5530], pin: "🥃",
        info: { blurb: "Waterfront city on Commencement Bay — Chambers Bay, a walkable downtown, and craft distilleries & cideries.", facts: ["Chambers Bay hosted the 2015 U.S. Open golf championship on a former gravel mine.", "Tacoma's Museum of Glass honors hometown artist Dale Chihuly."] } },
      { time: "6:45p", name: "Duke's Seafood (8)", note: "On the water · Ruston Way", coords: [47.2940, -122.5070], pin: "🦞",
        info: { blurb: "A Pacific Northwest institution for chowder and sustainably-sourced seafood, right on Ruston Way's waterfront.", facts: ["Duke's award-winning clam chowder has been named best in the Northwest multiple times.", "Ruston Way is a 2-mile waterfront promenade along Commencement Bay."] } },
    ],
  },
  {
    n: 3,
    date: "Sat · June 6",
    title: "Olympic National Park",
    badge: "🎂 Mom's Birthday",
    color: "#2b7a4b",
    summary: "Storm King climb, the mossy Hoh Rainforest, wild coast, and Sol Duc Falls.",
    stops: [
      { time: "4:00a", name: "Leave Silverdale", note: "Michigan time — early!" },
      { time: "5:30a", name: "Mount Storm King Hike", note: "~3 hrs · Crescent Lake · Marymere Falls", coords: [48.0586, -123.7900], pin: "⛰️",
        info: { blurb: "A steep, rope-assisted scramble high above Lake Crescent for one of the most jaw-dropping views in the Olympics.", facts: ["The final stretch uses fixed ropes to climb the spine of the ridge.", "Legend says the spirit Storm King hurled a boulder that dammed the valley, forming Lake Crescent.", "Lake Crescent is over 600 ft deep and famously crystal-clear."] } },
      { time: "10:30a", name: "Hoh Rainforest", note: "Hall of Mosses (0.8 mi) · Spruce Nature Trail (1.2 mi)", coords: [47.8606, -123.9348], pin: "🌲",
        info: { blurb: "One of the largest temperate rainforests in the U.S. — moss-draped maples, towering Sitka spruce, and the famous Hall of Mosses.", facts: ["It gets 12–14 FEET of rain per year.", "Home to the 'One Square Inch of Silence,' a spot dedicated to natural quiet.", "Roosevelt elk roam the valley and shape the forest."] } },
      { time: "1:45p", name: "Forks", note: "Option A — little town, shops & food", coords: [47.9504, -124.3855], pin: "🏪",
        info: { blurb: "A small logging town that became an unlikely tourist magnet thanks to a certain vampire saga.", facts: ["Forks is the setting of Stephenie Meyer's 'Twilight' series.", "It really is one of the rainiest towns in the continental U.S."] } },
      { time: "2:15p", name: "Rialto Beach", note: "Option B — Hole-in-the-Wall, 3 mi round trip", coords: [47.9197, -124.6396], pin: "🏖️",
        info: { blurb: "Wild, driftwood-strewn Pacific coastline with sea stacks and the iconic Hole-in-the-Wall rock arch (reachable at low tide).", facts: ["Time the Hole-in-the-Wall hike with low tide or you can't get through.", "The offshore sea stacks are remnants of an ancient coastline.", "Tide pools here brim with sea stars and anemones."] } },
      { time: "3:45p", name: "Sol Duc Falls", note: "1.6 mi easy loop (60–70 min)", coords: [47.9540, -123.8350], pin: "💦",
        info: { blurb: "A picture-perfect waterfall that splits into three or four channels plunging into a mossy canyon — an easy, gorgeous loop.", facts: ["'Sol Duc' means 'sparkling water' in the Quileute language.", "Nearby hot springs are fed by the same geothermal system."] } },
      { time: "6:30p", name: "Downriggers", note: "Port Angeles · dinner on the water", coords: [48.1181, -123.4307], pin: "🍽️",
        info: { blurb: "Waterfront dining on the Port Angeles harbor with views across the strait toward Canada.", facts: ["On clear days you can see Vancouver Island across the Strait of Juan de Fuca.", "Port Angeles is the main U.S. ferry gateway to Victoria, BC."] } },
    ],
  },
  {
    n: 4,
    date: "Sun · June 7",
    title: "Dad's Goonies Day",
    badge: "🏴‍☠️ Goonies Never Say Die",
    color: "#b8742e",
    summary: "Road trip to Astoria, Oregon — the real Goonies house, Cannon Beach, history.",
    stops: [
      { time: "8:00a", name: "Leave Silverdale", note: "~3h10m to the Goonies House" },
      { time: "11:30a", name: "Lewis & Clark Nat'l Historic Park", note: "30–60 min", coords: [46.1340, -123.8770], pin: "🧭",
        info: { blurb: "Marks the end of the Corps of Discovery's journey — a reconstructed Fort Clatsop where the expedition wintered in 1805–06.", facts: ["The explorers had a soggy winter here — it rained all but 12 days.", "Fort Clatsop is named for the local Clatsop tribe who helped them survive."] } },
      { time: "1:00p", name: "The Goondocks House", note: "368 38th St, Astoria, OR", coords: [46.1879, -123.8313], pin: "🏴‍☠️",
        info: { blurb: "The actual house from 'The Goonies' (1985), perched on a hill in Astoria — a pilgrimage site for fans.", facts: ["The 1896 Victorian still stands at 368 38th Street.", "Astoria also doubled for 'Kindergarten Cop' and 'Free Willy.'", "It's the oldest American settlement west of the Rockies."] } },
      { time: "1:30p", name: "Lunch · Astoria Brewing Co.", note: "Laura's colleague may join", coords: [46.1885, -123.8290], pin: "🍺",
        info: { blurb: "Oregon's oldest brewery lineage, pouring pints near the Columbia River waterfront.", facts: ["Astoria sits where the mighty Columbia River meets the Pacific.", "The Astoria Column offers a 360° view after 164 spiral steps."] } },
      { time: "3:00p", name: "Cannon Beach", note: "30 mi from the Goonies house · Haystack Rock", coords: [45.8918, -123.9615], pin: "🪨",
        info: { blurb: "A classic Oregon Coast town anchored by Haystack Rock rising dramatically from the surf.", facts: ["Haystack Rock is 235 feet tall and protected as a marine sanctuary.", "Tufted puffins nest on the rock each spring.", "It appears in the opening scene of 'The Goonies.'"] } },
      { time: "6:30p", name: "Yacht Club Broiler (8)", note: "Silverdale", coords: [47.6450, -122.6940], pin: "⚓" },
    ],
  },
  {
    n: 5,
    date: "Mon · June 8",
    title: "Day of Rest",
    badge: "😌 Sleepy Towns & Wineries",
    color: "#7c5cbf",
    summary: "Adult-children excursion: Bainbridge Island wineries, gardens, and Poulsbo.",
    stops: [
      { time: "—", name: "Bainbridge Island", note: "Eagle Harbor & Fletcher Bay wineries · Brewery", coords: [47.6262, -122.5212], pin: "🍷",
        info: { blurb: "A laid-back ferry ride from Seattle, dotted with wineries, a walkable downtown (Winslow), and harbor views.", facts: ["The 35-minute ferry from Seattle is one of the prettiest commutes in America.", "Eagle Harbor is named for its resident bald eagles."] } },
      { time: "—", name: "Bloedel Reserve", note: "Gardens & forest", coords: [47.7100, -122.5460], pin: "🌳",
        info: { blurb: "150 acres of gardens, forest, and meadow designed for quiet reflection — a Japanese garden, moss garden, and reflection pool.", facts: ["The estate was a private family home before opening to the public in 1988.", "Reservations are recommended; it's intentionally serene and uncrowded."] } },
      { time: "—", name: "Grand Forest", note: "Bainbridge trails", coords: [47.6480, -122.5390], pin: "🌲",
        info: { blurb: "240 acres of second-growth forest with easy, interconnected trails in the heart of Bainbridge.", facts: ["It's linked to other island parks by the cross-island 'Hilltop' trail."] } },
      { time: "—", name: "Poulsbo · Hard Hat Winery", note: "14 mi", coords: [47.7359, -122.6465], pin: "🍇",
        info: { blurb: "A Scandinavian-flavored waterfront town nicknamed 'Little Norway' — bakeries, a marina, and Hard Hat Winery.", facts: ["Poulsbo was settled by Norwegian immigrants in the 1880s.", "Sluys Bakery is famous for its 'Poulsbo bread.'"] } },
    ],
  },
  {
    n: 6,
    date: "Tue · June 9",
    title: "North Cascades",
    badge: "🏔️ The American Alps",
    color: "#2a8fb0",
    summary: "Turquoise Diablo Lake, alpine overlooks, and Mexican food in Sedro-Woolley.",
    stops: [
      { time: "6:00a", name: "Leave Silverdale", note: "Long but stunning day" },
      { time: "9:15a", name: "Visitor Center", note: "Marblemount, WA", coords: [48.5276, -121.4430], pin: "ℹ️",
        info: { blurb: "The Marblemount-area hub for maps, ranger tips, and trail conditions before heading up the North Cascades Highway.", facts: ["The North Cascades has the most glaciers of any U.S. park outside Alaska — over 300."] } },
      { time: "10:00a", name: "Diablo Lake Viewpoint", note: "Diablo Lake Trail 1.2 mi", coords: [48.7130, -121.1030], pin: "💧",
        info: { blurb: "An impossibly turquoise reservoir ringed by glaciated peaks — the signature view of the North Cascades.", facts: ["The surreal color comes from glacial 'rock flour' suspended in the water.", "It was created by Diablo Dam, part of Seattle City Light's power system."] } },
      { time: "11:15a", name: "Washington Pass Overlook", note: "30 min · jaw-dropping", coords: [48.5230, -120.6480], pin: "🏔️",
        info: { blurb: "A short walk to a dizzying view of the Liberty Bell spire and hairpin switchbacks at 5,477 ft.", facts: ["The highway closes here every winter due to deep snow and avalanche danger.", "Liberty Bell Mountain is a classic Cascades climbing objective."] } },
      { time: "12:15p", name: "Lunch · Ross Lake Overlook", note: "Pack lunch", coords: [48.7320, -121.0680], pin: "🥪" },
      { time: "1:30p", name: "Thunder Creek Trail", note: "2 mi if you do the whole thing", coords: [48.6930, -121.0720], pin: "🥾",
        info: { blurb: "A gentle forest walk through old-growth cedar and fir to a glacier-fed creek the color of jade.", facts: ["The creek's milky color is glacial meltwater from the Boston Glacier."] } },
      { time: "2:45p", name: "Gorge Overlook Trail", note: "1.5 mi", coords: [48.7000, -121.1980], pin: "🌉",
        info: { blurb: "A quick loop to views of Gorge Creek Falls plunging into a dramatic canyon.", facts: ["It's part of the Skagit hydroelectric project that helps power Seattle."] } },
      { time: "5:00p", name: "El Patron (6)", note: "Sedro-Woolley", coords: [48.5040, -122.2360], pin: "🌮" },
    ],
  },
  {
    n: 7,
    date: "Wed · June 10",
    title: "Explore Seattle",
    badge: "🏙️ City Day",
    color: "#c2456b",
    summary: "Pike Place, the first-ever Starbucks, Space Needle, and Chihuly glass.",
    stops: [
      { time: "—", name: "Pike Place Market", note: "85 Pike St · watch the fish fly", coords: [47.6097, -122.3422], pin: "🐟",
        info: { blurb: "One of the oldest continuously operating public markets in the U.S. — flying fish, the original Starbucks, farm stalls, and the gum wall.", facts: ["Opened in 1907; fishmongers have theatrically tossed fish since 1986.", "Look for 'Rachel,' the bronze piggy bank, near the famous market clock.", "The Gum Wall below the market is coated in decades of chewed gum."] } },
      { time: "—", name: "1st Starbucks (ever!)", note: "The original Pike Place store", coords: [47.6101, -122.3421], pin: "☕",
        info: { blurb: "The original 1971 Starbucks across from the market, still bearing the original brown 'Siren' mermaid logo.", facts: ["This is the oldest operating Starbucks (the very first spot moved one block in 1976).", "The original logo is noticeably more risqué than today's version."] } },
      { time: "—", name: "Beguiled Books · Ghost Fish Brewery (GF)", note: "Browse & sip", coords: [47.6080, -122.3450], pin: "📚",
        info: { blurb: "Beguiled by Books for browsing, plus Ghost Fish Brewing for celebrated 100% gluten-free beer.", facts: ["Ghost Fish has won multiple Great American Beer Festival medals for gluten-free brewing."] } },
      { time: "—", name: "Space Needle / Seattle Center", note: "305 Harrison St", coords: [47.6205, -122.3493], pin: "🗼",
        info: { blurb: "Seattle's 605-ft icon from the 1962 World's Fair, with a rotating glass floor at the top.", facts: ["Built for the 1962 'Century 21' World's Fair in just 400 days.", "The 'Loupe' is the world's first and only revolving glass floor."] } },
      { time: "—", name: "Chihuly Garden & Glass", note: "+ Gates Foundation Discovery Center", coords: [47.6209, -122.3500], pin: "🎨",
        info: { blurb: "A dazzling indoor-outdoor showcase of Dale Chihuly's blown-glass art right beneath the Space Needle.", facts: ["Chihuly grew up in nearby Tacoma.", "The Glasshouse holds one of his largest suspended sculptures — 100 ft long."] } },
    ],
  },
  {
    n: 8,
    date: "Thu · June 11",
    title: "Gig Harbor",
    badge: "⛵ Last Full Day",
    color: "#1f9aa6",
    summary: "Harbor views, a gondola, gourmet burgers — then a hot tub BOAT in Seattle.",
    stops: [
      { time: "—", name: "Gig Harbor", note: "28 mi, ~30 min", coords: [47.3293, -122.5807], pin: "⛵",
        info: { blurb: "A picturesque fishing village across the Narrows Bridge, with Mount Rainier framing the harbor on clear days.", facts: ["Named when a Navy crew sheltered their 'gig' (a small boat) here in 1841.", "It was founded by Croatian and Scandinavian fishing families."] } },
      { time: "—", name: "Jerisich Park", note: "Hike / harbor views", coords: [47.3290, -122.5820], pin: "🌅",
        info: { blurb: "A waterfront park with a public dock, harbor walk, and that postcard Rainier-over-the-boats view.", facts: ["Named for Samuel Jerisich, one of Gig Harbor's first settlers."] } },
      { time: "—", name: "Gig Harbor Gondola", note: "Glide over the water", coords: [47.3300, -122.5790], pin: "🚠" },
      { time: "—", name: "Gourmet Burger Shop", note: "Gig Harbor", coords: [47.3310, -122.5800], pin: "🍔" },
      { time: "—", name: "Hot Tub Boat", note: "Back to Seattle — soak & cruise!", coords: [47.6280, -122.3580], pin: "🛁",
        info: { blurb: "Exactly what it sounds like — a wood-fired hot tub you captain around Seattle's Lake Union.", facts: ["The boats are heated by a wood-fired stove and cruise at a gentle few knots.", "Lake Union is ringed by houseboats — including the one from 'Sleepless in Seattle.'"] } },
    ],
  },
  {
    n: 9,
    date: "Fri · June 12",
    title: "Heading Home 🛫",
    badge: null,
    color: "#64748b",
    summary: "Early to the airport. Until next time, Pacific Northwest!",
    stops: [
      { time: "Early", name: "Depart for SEA airport", note: "Bags packed the night before!", coords: [47.4502, -122.3088], pin: "🛫" },
      { time: "11:45a", name: "Laura & Jeff fly out", note: "Delta DL1706 → 7:13pm DTW" },
      { time: "2:30p", name: "Molly · Kelley · Douglas fly out", note: "Delta DL0533 → 9:48pm" },
      { time: "11:58p", name: "Emma flies out", note: "American → ORD → BGR" },
    ],
  },
];

// ── Fun facts shuffled on the trip-fact card ─────────────────────────────────
export const FUN_FACTS = [
  { icon: "🌋", text: "Mount Rainier is an active volcano AND the most glaciated peak in the contiguous U.S. — 25 named glaciers." },
  { icon: "🌸", text: "Paradise got its name when a settler's daughter-in-law exclaimed 'Oh, what a paradise!' at the wildflower meadows." },
  { icon: "🌧️", text: "The Hoh Rainforest gets up to 14 FEET of rain a year — one of the wettest places in the lower 48." },
  { icon: "🐋", text: "Gray whales migrate past the Olympic coast in spring; orcas (the 'whales' in our hopes!) roam the Salish Sea all summer." },
  { icon: "🦭", text: "Harbor seals haul out all over Puget Sound — keep an eye on the water near Gig Harbor and the ferries." },
  { icon: "🏴‍☠️", text: "The Goonies (1985) filmed in Astoria, OR — the real Goondocks house still stands at 368 38th Street." },
  { icon: "💧", text: "Diablo Lake's surreal turquoise color comes from glacial 'rock flour' — finely ground rock suspended in the water." },
  { icon: "☕", text: "The first Starbucks opened at Pike Place Market in 1971 — and still uses the original (slightly racy) mermaid logo." },
  { icon: "🌲", text: "Olympic National Park protects glaciers, rainforest, AND 73 miles of wild Pacific coastline — three ecosystems in one park." },
  { icon: "🏔️", text: "North Cascades has over 300 glaciers — more than any U.S. park outside Alaska. They call it the 'American Alps.'" },
  { icon: "🐟", text: "At Pike Place Market, fishmongers have been theatrically tossing fish to each other since 1986." },
  { icon: "🪨", text: "Cannon Beach's Haystack Rock is 235 feet tall and home to puffins, sea stars, and anemones in its tide pools." },
  { icon: "❄️", text: "Mount Rainier's Paradise once held the world snowfall record: 1,122 inches (over 93 feet!) in a single season." },
  { icon: "🌉", text: "The Tacoma Narrows Bridge you'll cross to Gig Harbor replaced 'Galloping Gertie,' which famously collapsed in 1940." },
  { icon: "🦅", text: "Bald eagles are common over Puget Sound — Bainbridge's Eagle Harbor is named for good reason." },
];
