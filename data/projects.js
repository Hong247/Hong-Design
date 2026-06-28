// Single source of truth for the project archive.
// Each entry is fully resolved: title/role/year/preview, a media array (images and iframes),
// and a description. Image alt text and src fixups are applied by scripts/project-loader.js.
window.PORTFOLIO_PROJECTS = [
  {
    id: "c-market-coffee-wear-red",
    title: "C Market Coffee — Wear Red",
    role: "Brand",
    year: "2026",
    preview: "images/wear-red/wearred1.jpg",
    media: [
      { type: "image", src: "images/wear-red/wearred1.jpg", alt: "C Market Coffee Wear Red campaign — matcha spilled across red satin, the stain almost invisible" },
      { type: "image", src: "images/wear-red/wearred2.jpg", alt: "C Market Coffee Wear Red campaign — coffee blooming across white trousers in full view" },
      { type: "image", src: "images/wear-red/wearred3.jpg", alt: "C Market Coffee Wear Red campaign — a tumble down concrete steps with a dropped C Market cup" },
      { type: "image", src: "images/wear-red/wearred4.jpg", alt: "C Market Coffee Wear Red campaign — red Mary-Jane heels beside a spilled iced latte" },
      { type: "image", src: "images/wear-red/wearred5.jpg", alt: "C Market Coffee Wear Red campaign — red velvet trousers standing over a large coffee spill" },
      { type: "image", src: "images/wear-red/wearred6.jpg", alt: "C Market Coffee Wear Red campaign — a spilled C Market Coffee cup on concrete beside red fabric that hides the stain" }
    ],
    description: [
      { label: "Brief", text: "C Market Coffee wanted a Canada Day campaign that escaped the predictable maple-leaf-and-flag promotions every café defaults to on July 1 — something witty and shareable enough to live natively on social while still driving real foot traffic and drink sales." },
      { label: "Insight", text: "Two unrelated facts about the day point to the same answer: red is the colour of Canada Day, and red is the one colour that hides a coffee spill. Anyone who has carried an iced latte through a crowd knows the small daily tragedy of a stain on a white shirt — the campaign turns that universal anxiety into the reason to take part." },
      { label: "Direction", text: "The creative is built as a series of candid, phone-shot \"spill moments,\" deliberately grainy, high-contrast and off-kilter so they read as real life rather than studio advertising. Each frame pairs a C Market drink with a wardrobe outcome — matcha vanishing into red satin, coffee mortifying across white trousers, a tumble down concrete steps, red Mary-Janes beside an abandoned latte. The lockup stays minimal and consistent — wide-set caps, an italic <em>WEAR</em>, a single red <em>RED</em> — so the set coheres while the photography carries the joke. The offer rewards anyone who shows up in red." },
      { label: "Outcome", text: "A generic holiday becomes a participatory promotion: customers wear red for the discount, become walking advertisements for the brand, and share the gag. The spill idea gives C Market an ownable, genuinely funny Canada Day position and a flexible image system that extends across social, in-store, and out-of-home." }
    ]
  },
  {
    id: "c-market-coffee-tote-bag",
    title: "C Market Coffee Tote Bag",
    role: "Product",
    year: "2026",
    preview: "images/C Market Coffee Tote Bag/c market coffee tote bag 1.jpg",
    media: [
      { type: "image", src: "images/C Market Coffee Tote Bag/c market coffee tote bag 1.jpg", alt: "C Market Coffee natural canvas tote bag worn over the shoulder with black handles and small stacked logo" },
      { type: "image", src: "images/C Market Coffee Tote Bag/c market coffee tote bag 2.jpg", alt: "C Market Coffee natural canvas tote bag carried by black handles in angled shadow" },
      { type: "image", src: "images/C Market Coffee Tote Bag/1.jpg", alt: "C Market Coffee black and natural tote bag pair staged in directional shadow" },
      { type: "image", src: "images/C Market Coffee Tote Bag/2.jpg", alt: "C Market Coffee natural canvas tote bag standing upright with black side panels and handles" },
      { type: "image", src: "images/C Market Coffee Tote Bag/3.jpg", alt: "C Market Coffee black canvas tote bag with oversized white C Market graphic mark" }
    ],
    description: [
      { label: "Brief", text: "C Market Coffee is a Vancouver-based specialty coffee and bakery brand with multiple locations and a growing community presence. When they needed to extend the brand into physical merchandise, the goal wasn't promotional swag — it was a carry object useful enough that customers would actually choose it for daily use, creating authentic brand visibility across the city." },
      { label: "Research", text: "The insight behind the design was simple but often missed in retail merchandise: customers will only carry branded goods if those goods feel worth carrying. I looked at how successful food and hospitality brands approach merchandise as brand extension objects rather than afterthoughts. The common thread: restraint, quality materials, and proportional control of the mark." },
      { label: "Direction", text: "The design applies the C Market Coffee wordmark and identity elements across two colorways — black canvas and natural white — allowing customers to self-select based on personal aesthetic preference. The most consequential decision was the placement and weight of the type on the bag: resolved through proportional studies so the mark reads clearly at street distance while feeling balanced when worn on the shoulder. Both variants use the same compositional layout, creating a cohesive pair that photographs cleanly for retail presentation." },
      { label: "Outcome", text: "The tote bag launched as a retail and in-café merchandise item at C Market Coffee locations. Beyond direct sales, it functions as moving brand presence across Vancouver's café culture, daily commutes, and weekend markets — every bag carried is earned media in the communities C Market Coffee serves." }
    ]
  },
  {
    id: "c-market-coffee-brand-experience-system",
    title: "C Market Coffee — Brand Experience System",
    role: "Brand",
    year: "2025",
    preview: "images/C Market Coffee Brand Catalog/page-01.jpg",
    media: [
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-01.jpg", alt: "C Market Coffee brand catalog cover with cafe interior photography and centered C Market mark" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-02.jpg", alt: "C Market Coffee brand catalog executive summary spread with cafe interior photography" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-03.jpg", alt: "C Market Coffee brand catalog brand story spread with bar counter photography and Where Every Sip Sparks Connection headline" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-04.jpg", alt: "C Market Coffee brand catalog store environment spread with counter and espresso bar photography" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-05.jpg", alt: "C Market Coffee brand catalog company background and menu offerings spread" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-06.jpg", alt: "C Market Coffee brand catalog branding and innovation spread with tote, mug, and campaign examples" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-07.jpg", alt: "C Market Coffee brand catalog locally crafted menu spread with Korean-inspired food and drink imagery" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-08.jpg", alt: "C Market Coffee brand catalog community involvement and connection spread with cupping and latte art programs" },
      { type: "image", src: "images/C Market Coffee Brand Catalog/page-09.jpg", alt: "C Market Coffee brand catalog closing spread with Canadian identity, trend positioning, and multicultural values" }
    ],
    description: [
      { label: "Brief", text: "C Market Coffee needed a more consistent and scalable creative system across social media, retail, e-commerce, product launches, packaging, print, and in-store communication. As the brand continued to grow, the design challenge was not only to create individual assets, but to make every customer touchpoint feel connected — from Instagram posts and reels to Shopify pages, product launch graphics, menus, packaging, posters, and signage.<br><br>My role was to design and maintain customer-facing brand assets across both digital and physical channels, creating marketing materials that were visually consistent, production-ready, and aligned with real business goals." },
      { label: "Challenge", text: "C Market operates across many fast-moving touchpoints: retail stores, online ordering, social media, product launches, events, packaging, and customer-facing promotions. Each channel required a different design approach.<br><br>Social content needed to be immediate and engaging. Shopify and e-commerce assets needed to be clear and structured. Packaging and print files needed to be accurate and production-ready. In-store signage needed to communicate quickly in a physical environment.<br><br>The challenge was to balance brand consistency, speed, visual quality, and business function without making every asset feel repetitive or disconnected." },
      { label: "Direction", text: "The creative direction focused on building a flexible brand and marketing system that was clear, consistent, platform-aware, performance-minded, and scalable.<br><br>Rather than treating each asset as a one-off design, I approached the work as a connected system across social, retail, e-commerce, packaging, print, and campaign touchpoints. The goal was to create assets that could support recurring promotions, seasonal campaigns, product launches, and fast internal requests without starting from zero every time." },
      { label: "Outcome", text: "The project helped C Market build a stronger and more consistent brand presence across digital, social, e-commerce, print, packaging, and retail environments.<br><br>Key results included social media views that reached 1M+ views, Instagram growth from approximately 8K to 17K followers, and a more unified visual communication system across digital and physical touchpoints.<br><br>The final system supported product launches, Shopify updates, social content, packaging, menus, posters, signage, and retail promotions while making the brand feel more recognizable, organized, and scalable." }
    ]
  },
  {
    id: "c-market-barista-apron",
    title: "C Market Coffee Barista Apron",
    role: "Product",
    year: "2025",
    preview: "images/c-market-barista-apron/apron1.jpg",
    media: [
      { type: "image", src: "images/c-market-barista-apron/apron1.jpg", alt: "C Market Coffee barista apron — women's hanbok-inspired wrap silhouette with cloth belt, worn by model" },
      { type: "image", src: "images/c-market-barista-apron/apron2.jpg", alt: "C Market Coffee barista apron technical flat — knot buttons, fixed ribbon, chest pocket, side pockets, cloth belt detail callouts" },
      { type: "image", src: "images/c-market-barista-apron/apron3.jpg", alt: "C Market Coffee barista apron worn by model — single welt chest pocket and double welt besom side pockets annotated" },
      { type: "image", src: "images/c-market-barista-apron/apron4.jpg", alt: "C Market Coffee barista apron — men's short-sleeve crossover variation with cloth belt, worn by model" }
    ],
    description: [
      { label: "Brief", text: "C Market Coffee required a staff uniform that could function as front-of-house workwear while reinforcing the brand's identity as a specialty coffee retailer rooted in Korean craft culture. The brief called for a garment that felt considered and purposeful — not a generic apron, but a piece that could hold its own as a designed object, worn by people who care about the quality of what they make and how they present it." },
      { label: "Direction", text: "The design draws its silhouette from the jeogori — the traditional Korean crossover jacket — translated into a contemporary workwear context. The wrap front, shawl collar, and cloth belt preserve the structural logic of the hanbok form while the all-black palette and refined construction details (knot buttons, fixed ribbon, single welt chest pocket, double welt besom side pockets) give the garment an understated, high-function quality. The C Market wordmark is embroidered at the chest, positioned as a mark of craft rather than a brand badge. Two variations were developed: a women's sleeveless wrap with full-length silhouette, and a men's short-sleeve crossover with a cropped hem — both sharing the same construction language across differing body fits." },
      { label: "Outcome", text: "The result is a staff uniform that operates as an extension of the brand's visual identity rather than a departure from it. Worn on the floor, the apron communicates the same values as C Market's packaging and spatial design — restraint, quality, cultural specificity. The hanbok reference gives the garment a point of difference from standard hospitality workwear while remaining practical across a full service shift." }
    ]
  },
  {
    id: "kaia",
    title: "KAIA",
    role: "Brand",
    year: "2025",
    preview: "images/kaia/kaia2.png",
    media: [
      { type: "image", src: "images/kaia/kaia1.png", alt: "KAIA Korean sauce brand identity full system overview" },
      { type: "image", src: "images/kaia/kaia2.png", alt: "KAIA brand identity Latin letterform color-block poster" },
      { type: "image", src: "images/kaia/kaia3.png", alt: "KAIA brand identity Hangul character color-block poster" },
      { type: "image", src: "images/kaia/kaia4.png", alt: "KAIA Soy Garlic and Yang Nyeom sauce labels shown as overlapping product, nutrition, and barcode panels" },
      { type: "image", src: "images/kaia/kaia5.png", alt: "KAIA Spicy Yang Nyeom Sauce back labels with nutrition table, barcode, and circular bilingual seal" },
      { type: "image", src: "images/kaia/kaia6.png", alt: "KAIA sauce packaging mockup — Teriyaki, Soy Garlic and Yang Nyeom variants" }
    ],
    description: [
      { label: "Brief", text: "KAIA (카이아) is a Korean-origin sauce and condiment brand designed to travel beyond its home market. The brief was to create a visual identity that felt rooted in Korean typographic culture while remaining legible and distinctive in international retail environments — where the brand needed to communicate quality and cultural specificity without relying on food-category clichés." },
      { label: "Direction", text: "The identity is built around a bilingual mark — 카이아 in Hangul and KAIA in Latin — treated as equal partners rather than one being a translation of the other. Both scripts share the same geometric construction logic, allowing them to coexist with visual coherence across all applications. The color system pairs crimson red, teal, deep navy, and near-black in a modular grid structure that generates pattern, packaging, and campaign material from a single combinatorial logic. Each color block functions as a frame for individual letterforms, producing a system that scales from a bottle label to a retail environment without losing its core character." },
      { label: "Outcome", text: "The result is an identity that reads as immediately Korean in origin without depending on exoticism or decorative cultural shorthand. The bilingual structure gives the brand presence in both domestic and export markets. The modular color-block grid provides strong shelf presence and flexibility across digital, packaging, and environmental applications — a system built to grow with the brand." }
    ]
  },
  {
    id: "kkookie",
    title: "kkookie",
    role: "Brand",
    year: "2025",
    preview: "images/kkookie/kkookie1.jpg",
    media: [
      { type: "image", src: "images/kkookie/kkookie1.jpg", alt: "kkookie packaging dieline system showing six cookie flavours, colour variants, nutrition panels, and circular product windows" },
      { type: "image", src: "images/kkookie/kkookie2.jpg", alt: "kkookie sage green stand-up pouch with oversized serif wordmark and circular cookie window" },
      { type: "image", src: "images/kkookie/kkookie3.png", alt: "kkookie Millda Bakery cake box dielines — white chocolate matcha, red velvet, and ultimate chocolate cake in dark colourways" },
      { type: "image", src: "images/kkookie/kkookie4.png", alt: "kkookie Millda Bakery cake box dielines — ultimate chocolate, red velvet, and white chocolate matcha cake in light colourways with bilingual French labelling" },
      { type: "image", src: "images/kkookie/kkookie5.jpg", alt: "kkookie full cookie packaging range — dark chocolate, sage green, and natural cream colourways side by side" }
    ],
    description: [
      { label: "Brief", text: "kkookie is an in-house bakery brand developed as a strategic extension of Millda Bakery's product portfolio. The brief required a distinct brand identity that could occupy the premium cookie market without cannibalising the parent brand's positioning — tonally different enough to feel like a standalone label, yet coherent within the same production and distribution context. The target market was design-literate gift buyers and specialty food retailers seeking artisan cookie products with shelf presence." },
      { label: "Direction", text: "The identity is built around a single typographic decision: the wordmark 'kkookie' set in a high-contrast editorial serif, scaled to break out of the bag's lower register and function as the primary visual element. The double-k opening — a nod to Korean romanisation phonetics — gives the name a distinctive character without requiring further cultural explanation. A circular window die-cut reveals the product directly, framed by a hand-drawn illustrated ring that echoes artisan provenance without relying on vintage cliché. The tagline 'Handcrafted Quality Cookie' and the Millda Bakery attribution are set in restrained small caps, establishing hierarchy without competing with the wordmark. The colourway system spans six variants — sage green, dark chocolate, natural cream, terracotta, warm beige, and blush rose — each mapping to a different cookie variety, giving the range visual coherence across SKUs while differentiating at point of sale." },
      { label: "Outcome", text: "The result is a premium cookie brand with a clear shelf identity and a colour-coded packaging system that scales across product variants. The editorial typographic approach distinguishes kkookie from both mass-market cookie packaging and overly rustic artisan alternatives, positioning it in the same visual register as high-end food and lifestyle brands. The in-house development structure means the brand can launch without external licensing costs, while the system's modularity allows new flavours and seasonal variants to be added without redesigning from scratch." }
    ]
  },
  {
    id: "c-market-coffee-x-oak-fort",
    title: "C Market Coffee × Oak + Fort",
    role: "Product",
    year: "2024",
    preview: "images/c-market-oak-fort/oak+fort1.jpg",
    media: [
      { type: "image", src: "images/c-market-oak-fort/oak+fort1.jpg", alt: "C Market Coffee × Oak + Fort bottled beverage label design — Flat White, Latte, Cold Brew" },
      { type: "image", src: "images/c-market-oak-fort/oak+fort2.jpg", alt: "C Market Coffee × Oak + Fort candle packaging — Acadia Butterfly, Colombia Swiss, Siberian Chrysanthemum" },
      { type: "image", src: "images/c-market-oak-fort/oak+fort3.jpg", alt: "C Market Coffee × Oak + Fort fabric hang tag and swing tag on folded textile" },
      { type: "image", src: "images/c-market-oak-fort/oak+fort4.jpg", alt: "C Market Coffee × Oak + Fort co-branded crewneck sweatshirt worn by model" },
      { type: "image", src: "images/c-market-oak-fort/oak+fort5.jpg", alt: "C Market Coffee × Oak + Fort wax seal business card mockup in silver and brass" }
    ],
    description: [
      { label: "Brief", text: "A collaboration proposal between C Market Coffee and Oak + Fort for a limited-edition pop-up at Oak + Fort's Gastown, Vancouver location. The brief was to explore what a cross-brand identity could look like in practice — identifying where two distinct visual languages could share the same surface without either brand losing its character. The work focused on proposing tangible touch points across merchandise, packaging, and in-store presentation that would hold up as a cohesive collection." },
      { label: "Direction", text: "C Market Coffee's typographic restraint and specialty-coffee precision was brought into dialogue with Oak + Fort's material sensibility — muted earth tones, considered texture, and an aesthetic rooted in quiet luxury. The collaboration mark pairs the Oak + Fort icon with the C Market logotype, establishing a visual handshake that reads as intentional rather than incidental. Applications span bottled beverage labels (Flat White, Latte, Cold Brew), candle packaging across three scent variants, branded hang tags on folded textiles, embossed wax-seal business cards in silver and brass finishes, and a co-branded crewneck positioned as the anchor merchandise piece." },
      { label: "Outcome", text: "The result is a proposal that demonstrates how two brands with overlapping customer demographics — design-literate, quality-conscious, Vancouver-local — can occupy the same space without visual compromise. Each touch point is designed to function independently while reinforcing the collection as a whole, giving the Gastown pop-up a consistent material language from the first object a customer picks up to the last." }
    ]
  },
  {
    id: "c-market-coffee-website",
    title: "C Market Coffee Website",
    role: "Digital",
    year: "2024",
    preview: "images/C Market Coffee Website/cmarket website 1.jpg",
    media: [
      { type: "image", src: "images/C Market Coffee Website/cmarket website 1.jpg", alt: "C Market Coffee website shown on a mobile phone beside concrete block and coffee beans" },
      { type: "image", src: "images/C Market Coffee Website/cmarket website 2.png", alt: "C Market Coffee online ordering and menu section" },
      { type: "image", src: "images/C Market Coffee Website/cmarket website 3.png", alt: "C Market Coffee community events and classes section" },
      { type: "image", src: "images/C Market Coffee Website/cmarket website 4.png", alt: "C Market Coffee mobile app promotion section" },
      { type: "image", src: "images/C Market Coffee Website/cmarket website 5.png", alt: "C Market Coffee locations and café information" },
      { type: "image", src: "images/C Market Coffee Website/cmarket website 6.png", alt: "C Market Coffee e-commerce product grid" },
      { type: "image", src: "images/C Market Coffee Website/cmarket website 7.png", alt: "C Market Coffee franchise and brand partnership section" }
    ],
    description: [
      { label: "Brief", text: "C Market Coffee had built a brand with real depth — multiple café locations, a mobile app, online store, barista classes, community events, pop-up markets, room rental, and a franchise program — but their digital presence was fragmented. The website redesign needed to consolidate all of this into one Shopify-based destination serving both new customers discovering the brand and regulars looking for specific information quickly." },
      { label: "Research", text: "The challenge was as much information architecture as visual design. A brand of this breadth risks making users work too hard to find what they need. I mapped C Market's full offering and grouped it by customer intent: buy something now, visit us, join our community, build with us. These four modes shaped the navigation structure and page hierarchy, giving every major offering a natural home rather than forcing them to compete for space." },
      { label: "Direction", text: "The visual direction gave priority to product photography — lush imagery of ube lattes, matcha, and coffee beans — as the primary emotional driver, making the brand's quality immediately legible before a user reads a word. Typography and UI stayed restrained to prevent the design from competing with the photography. The Shopify theme was customized to support multi-section layouts for classes, app promotion, and market events, giving each program its own visual moment without fragmenting the overall design." },
      { label: "Outcome", text: "The official site at cmarket.ca now serves as the single authoritative digital source for C Market Coffee — consolidating what had been scattered across multiple platforms. Online ordering, class registration, community sign-ups, franchise inquiries, and location information all route through one destination with consistent brand experience." }
    ]
  },
  {
    id: "kee",
    title: "Kee",
    role: "Brand",
    year: "2023",
    preview: "images/kee/Kee1.jpg",
    media: [
      { type: "image", src: "images/kee/keea.jpg", alt: "Kee Malaysian Chinese wonton noodle brand identity — logotype set in the motion-inspired Yuwei typeface", className: "keen" },
      { type: "image", src: "images/kee/keeb.jpg", alt: "Kee brand identity — carbon and brandy-yellow material colour system drawn from the kitchen", className: "keen" },
      { type: "image", src: "images/kee/keec.jpg", alt: "Kee brand identity packaging sleeve using carbon, moonstone, flour white, and brandy-yellow color cues", className: "keen" },
      { type: "image", src: "images/kee/keed.jpg", alt: "Kee storefront signage with motion-led Yuwei letterforms applied above the restaurant entrance", className: "keen" },
      { type: "image", src: "images/kee/keee.jpg", alt: "Kee stationery system with business cards and small-format brand collateral", className: "keen" },
      { type: "image", src: "images/kee/keef.jpg", alt: "Kee menu and printed collateral using the noodle-motion logotype and restrained color palette", className: "keen" },
      { type: "video", src: "images/kee/kee1.mp4", alt: "Kee brand identity — animated noodle-pulling motion graphic", className: "keen" },
      { type: "video", src: "images/kee/kee2.mp4", alt: "Kee brand identity — animated broth-and-noodle rhythm motion graphic", className: "keen" },
      { type: "image", src: "images/kee/Kee1.jpg", alt: "Kee wonton noodle brand identity lead composition with bowl-inspired color system and logotype", className: "keen" },
      { type: "image", src: "images/kee/Kee2.jpg", alt: "Kee brand identity restaurant touchpoint with signage and printed assets", className: "keen" },
      { type: "image", src: "images/kee/Kee3.jpg", alt: "Kee brand identity — typographic and colour treatment detail", className: "keen" },
      { type: "image", src: "images/kee/keem1.jpg", alt: "Kee mobile presentation layout introducing the Malaysian Chinese wonton noodle brand concept", className: "keem" },
      { type: "image", src: "images/kee/keem2.jpg", alt: "Kee mobile presentation layout showing color, material, and kitchen-inspired identity system", className: "keem" },
      { type: "image", src: "images/kee/keem3.jpg", alt: "Kee mobile presentation layout showing packaging, signage, and collateral applications", className: "keem" },
      { type: "image", src: "images/kee/keem4.jpg", alt: "Kee mobile presentation layout showing motion graphics and restaurant brand touchpoints", className: "keem" }
    ],
    description: [
      { label: "Brief", text: "Malaysian Chinese food culture has a specific visual and emotional register that most contemporary restaurant branding either overwrites with generic Asian-restaurant clichés or ignores entirely. Kee asked whether a brand could feel genuinely rooted in that cultural context — the specific world of Malaysian Chinese wonton noodle cooking — without resorting to illustration, nostalgia, or shorthand." },
      { label: "Research", text: "The conceptual anchor was motion. Wonton noodles are about the pull and fall of noodles from bowl to chopstick, the way broth moves when the bowl is set down, the rhythm of a kitchen at full speed. I looked at how Chinese calligraphy encodes movement into stroke order and weight — the way each character is drawn as a sequence of deliberate motions — and how that same quality of drawn intention exists in the <a href=\"http://www.shufating.com/product/277173986\" target=\"_blank\" rel=\"noopener noreferrer\">Yuwei</a> typeface's letterforms." },
      { label: "Direction", text: "The Yuwei typeface became the spine of the identity. Its strokes reference the flow of noodle-pulling while maintaining contemporary legibility. I built the color system around four material cues derived directly from the kitchen: carbon (the wok and the fuel), moonstone (the glaze of a noodle bowl), flour white (dough before cooking), and brandy yellow (the broth and the egg noodle). These colors create sensory connection to the food without using food illustration. Motion graphics extend the identity through animated sequences that follow the rhythm of noodles being drawn, dropped, and served." },
      { label: "Outcome", text: "The result is a brand system specific to its cultural context without being decorative or illustrative. The identity holds together from storefront signage to packaging to digital motion assets — because every element references the same core idea: the motion, material, and craft of Malaysian Chinese noodle cooking." }
    ]
  },
  {
    id: "browns-rebrand-concept",
    title: "Browns Rebrand Concept",
    role: "Brand",
    year: "2023",
    preview: "images/browns/browns3.jpg",
    media: [
      { type: "image", src: "images/browns/browns1.png", alt: "Browns Shoes rebrand concept campaign composition with footwear isolated against a color-matched background" },
      { type: "image", src: "images/browns/browns2.png", alt: "Browns Shoes rebrand concept — material and texture study with footwear as the primary subject" },
      { type: "image", src: "images/browns/browns3.png", alt: "Browns Shoes rebrand concept — catalogue spread with tight grid discipline" },
      { type: "image", src: "images/browns/browns3.jpg", alt: "Browns Shoes rebrand concept campaign photograph with the shoe as the primary subject" },
      { type: "image", src: "images/browns/browns4.jpg", alt: "Browns Shoes rebrand concept — e-commerce product grid layout" },
      { type: "image", src: "images/browns/browns5.jpg", alt: "Browns Shoes rebrand concept large-format retail advertising mockup" },
      { type: "image", src: "images/browns/browns6.jpg", alt: "Browns Shoes rebrand concept — seasonal lookbook spread" },
      { type: "image", src: "images/browns/browns7.jpg", alt: "Browns Shoes rebrand concept — wide-set single-weight typographic treatment" }
    ],
    description: [
      { label: "Brief", text: "<a href=\"https://www.brownsshoes.com/en/home\" target=\"_blank\" rel=\"noopener noreferrer\">Browns Shoes</a> is a national Canadian footwear retailer with decades of history. Like many legacy retailers, it had accumulated a visual identity that felt neither premium enough for its higher-end product range nor distinctive enough to compete with directional international footwear brands. This speculative rebrand concept explores how Browns could sharpen its identity to feel more product-led and more considered — without abandoning the breadth of a national retailer." },
      { label: "Research", text: "The strategic insight was that most footwear retail art direction treats the product as secondary to lifestyle. Models, environments, and aspirational scenarios dominate, while the shoes end up as props. I asked what would happen if the shoes were consistently treated as the primary visual subject — if the entire visual vocabulary was built around the inherent formal properties of the product: form, material, texture, silhouette, color." },
      { label: "Direction", text: "I developed an \"inhuman\" art direction system — a deliberate reduction of model presence that gives footwear the visual authority it rarely gets in mass retail. Each image is constructed around material contrast, dimensional detail, and compositional tension. Background colors are pulled from the products themselves, creating visual continuity that feels intentional and premium. Typography is stripped to a single weight, wide-set, always subordinate to the product image. Grid discipline is tight — consistent margins, controlled negative space — so that even at catalog quantity, the system looks considered." },
      { label: "Outcome", text: "The concept demonstrates that a retail brand can read as more premium without moving its price point upmarket. The system works at e-commerce scale (product grid), campaign scale (hero and OOH), and editorial scale (lookbook, seasonal campaigns). Browns' existing product range — which already includes premium labels — becomes more visually credible when the brand system stops competing with it." }
    ]
  },
  {
    id: "monday",
    title: "monday",
    role: "Digital",
    year: "2023",
    preview: "images/monday/monday1.jpg",
    media: [
      { type: "image", src: "images/monday/monday1.jpg", alt: "monday office chair brand — lowercase logotype built from Bauhaus 93 geometry" },
      { type: "iframe", src: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2Fdv8az6NYXGDcKNXhG3Tqik%2Fwebsite-design%3Ftype%3Ddesign%26node-id%3D1-95%26t%3DWyWhJP6iFvh9E6Cb-1%26scaling%3Dscale-down-width%26page-id%3D0%253A1%26mode%3Ddesign", width: 1200, height: 600 },
      { type: "image", src: "images/monday/monday2.jpg", alt: "monday office chair brand — product photography of the chair in a workspace" }
    ],
    description: [
      { label: "Brief", text: "The office chair market divides into two positions: ergonomic function with zero visual ambition, or design-forward pieces that sacrifice usability for looks. monday was a brand and website prototype asking whether a third position existed — a chair brand that felt both genuinely reliable and visually considered, with a personality quiet enough to belong in any workspace." },
      { label: "Research", text: "I identified four qualities the brand needed to communicate: trustworthy, resilient, authentic, and subtle. These became the filter for every design decision. I looked at how the <a href=\"https://artsandculture.google.com/project/bauhaus\" target=\"_blank\" rel=\"noopener noreferrer\">Bauhaus</a> movement resolved similar tensions — useful and beautiful, mass-produced and crafted — and found the geometry of <a href=\"https://learn.microsoft.com/en-us/typography/font-list/bauhaus-93\" target=\"_blank\" rel=\"noopener noreferrer\">Bauhaus 93</a> letterforms particularly relevant: forms that trust the letter's shape to do the work without ornamentation, that feel settled and earned rather than expressive." },
      { label: "Direction", text: "The lowercase logo takes its proportions and weight directly from Bauhaus 93 geometry — wide stance, even weight, letters that feel stable rather than dynamic. Lowercase signals approachability: this is a brand that doesn't need to shout. The Figma website prototype builds on the same principles: wide margins, restrained typographic hierarchy, product photography showing the chair in use rather than in a void. The interface leads users through three natural decisions: what kind of work do I do, what does my space look like, which chair fits. A soft, weighted scroll mechanic gives the navigation a physical quality consistent with the product it sells." },
      { label: "Outcome", text: "The monday prototype demonstrates a brand system for a competitive product category that differentiates through restraint. The identity and interface communicate the same thing: a company confident enough in its product not to oversell it." }
    ]
  },
  {
    id: "stop-haunting-mother-nature",
    title: "Stop Haunting Mother Nature",
    role: "Brand",
    year: "2023",
    preview: "images/wwf/wwf4.jpg",
    media: [
      { type: "image", src: "images/wwf/wwf1.jpg", alt: "Stop Haunting Mother Nature — WWF speculative campaign using horror-film grammar, lead poster" },
      { type: "image", src: "images/wwf/wwf2 copy.jpg", alt: "Stop Haunting Mother Nature WWF campaign — horror-poster silhouette with an environmental threat substituted" },
      { type: "image", src: "images/wwf/wwf3.jpg", alt: "Stop Haunting Mother Nature WWF campaign — industrial pollution reframed as horror imagery" },
      { type: "image", src: "images/wwf/wwf4.jpg", alt: "Stop Haunting Mother Nature WWF campaign — deforestation reframed through horror-film composition" },
      { type: "image", src: "images/wwf/wwf5.jpg", alt: "Stop Haunting Mother Nature WWF campaign — pesticide equipment cast as the horror weapon" },
      { type: "image", src: "images/wwf/wwf6.jpg", alt: "Stop Haunting Mother Nature WWF campaign poster mockup with period-accurate horror color treatment" },
      { type: "image", src: "images/wwf/wwf7.jpg", alt: "Stop Haunting Mother Nature WWF campaign — campaign poster variant" },
      { type: "image", src: "images/wwf/wwf8.jpg", alt: "Stop Haunting Mother Nature WWF campaign out-of-home billboard installation" }
    ],
    description: [
      { label: "Brief", text: "Environmental campaigns have a well-documented creative problem: the imagery of destruction — melting glaciers, dying wildlife, deforestation — has been used so repeatedly that audiences have developed visual immunity. The emotional response still happens, but it peaks at sadness and ends at paralysis rather than action. This speculative campaign for <a href=\"https://www.worldwildlife.org/\" target=\"_blank\" rel=\"noopener noreferrer\">WWF</a> found a different entry point." },
      { label: "Research", text: "The insight came from inverting the standard campaign frame. Most environmental advertising positions nature as fragile and humans as capable of saving it — framing the audience as potential heroes, which is comfortable. I asked what would happen if we positioned human behavior as the threat, using horror film grammar to force the audience to experience the discomfort of recognizing themselves as the monster rather than the rescuer." },
      { label: "Direction", text: "I chose three horror films for their specific visual signatures and cultural penetration: <a href=\"https://www.imdb.com/title/tt0102926/\" target=\"_blank\" rel=\"noopener noreferrer\">The Silence of the Lambs</a>, <a href=\"https://www.imdb.com/title/tt0081505/?ref_=fn_al_tt_1\" target=\"_blank\" rel=\"noopener noreferrer\">The Shining</a>, and <a href=\"https://www.imdb.com/title/tt0077651/?ref_=nv_sr_srsg_1_tt_7_nm_0_q_halloween\" target=\"_blank\" rel=\"noopener noreferrer\">Halloween</a>. Each poster takes a recognizable horror poster silhouette and substitutes an environmental equivalent for the original threat — the industrial chimney for Lecter's mask, deforestation for the hotel's isolation, pesticide equipment for Myers's weapon. The substitutions are designed to be immediate: viewers recognize the horror reference before they register the environmental message, and the reversal produces a moment of genuine discomfort when the parallel lands. Color treatments stay close to the originals to maximize recognition." },
      { label: "Outcome", text: "The campaign demonstrates how borrowed cultural vocabulary can bypass audience desensitization. By attaching to existing emotional memories — the specific dread associated with these films — the environmental message receives an emotional charge that straightforward presentation couldn't generate. The horror grammar does the work so the message doesn't have to announce itself." }
    ]
  },
  {
    id: "xwayxway",
    title: "X̱wáýx̱way",
    role: "Editorial",
    year: "2023",
    preview: "images/x/x5.gif",
    media: [
      { type: "image", src: "images/x/x1.jpg", alt: "X̱wáýx̱way — archival vinyl record concept honouring Stanley Park as Squamish territory, cover" },
      { type: "image", src: "images/x/x2.jpg", alt: "X̱wáýx̱way vinyl record — monochromatic documentary photography spread" },
      { type: "image", src: "images/x/x3.jpg", alt: "X̱wáýx̱way vinyl record — information-dense liner notes layout" },
      { type: "image", src: "images/x/x4.jpg", alt: "X̱wáýx̱way vinyl record two-colour archival layout using red and green documentary photography" },
      { type: "image", src: "images/x/x5.gif", alt: "X̱wáýx̱way — animated sequence from the record's six-theme structure" },
      { type: "image", src: "images/x/x6.jpg", alt: "X̱wáýx̱way vinyl record — gatefold spread on a documentary grid" },
      { type: "image", src: "images/x/x7.jpg", alt: "X̱wáýx̱way vinyl record — track listing and Indigenous place-name typography" }
    ],
    description: [
      { label: "Brief", text: "<a href=\"https://stanleyparkecology.ca/\" target=\"_blank\" rel=\"noopener noreferrer\">Stanley Park</a> is one of the most visited urban parks in North America, but public discourse around it tends toward the scenic and recreational — its status as a tourist landmark rather than as living Indigenous territory, contested urban space, and complex ecological system. X̱wáýx̱way (the Squamish name for the land now called Stanley Park) approaches the park as a subject worthy of serious archival attention and cultural memory." },
      { label: "Research", text: "The design challenge was to create something that felt archival and serious without becoming academic or inaccessible. Vinyl as a medium already carries specific cultural associations — collectibility, deliberate listening, the physical ritual of handling a record — that aligned well with the project's intent. I looked at the visual language of documentary and archival albums from the 1960s and 1970s: flat photography, information-dense liner notes, color restraint from period printing limitations." },
      { label: "Direction", text: "The monochromatic direction was chosen as an archival visual language rather than nostalgia aesthetics. Desaturated photography and a limited two-color palette make the object feel timeless rather than dated. Typography references documentary design from that era: strong information hierarchy, consistent grids, text given as much visual weight as imagery. The album's six-theme structure — Indigenous history, woods, waves, land, wind, and modernization — is reflected in the physical sequence: side A and B, track listings that follow the arc from deep history to contemporary tension. The cover foregrounds the Indigenous place name before any English translation appears." },
      { label: "Outcome", text: "The album functions as a design object that reframes how Stanley Park is understood — treating it as a subject worthy of a collected, archival record, and imagining it as a fundraising piece that could preserve attention, memory, and care for the park." }
    ]
  },
  {
    id: "trapo-digital-catalogue",
    title: "TRAPO Digital Catalogue",
    role: "Digital",
    year: "2022",
    preview: "images/trapodpc/trapodpc1.png",
    media: [
      { type: "iframe", src: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F42OkkDJ2wRe9etERcPKCVz%2FTRAPO-Digital-Catalogue%3Ftype%3Ddesign%26node-id%3D1-2%26t%3Dh4Ksn1BdopSt7HCP-1%26scaling%3Dcontain%26page-id%3D0%253A1%26mode%3Ddesign", width: 800, height: 600 },
      { type: "image", src: "images/trapodpc/trapodpc1.png", alt: "TRAPO digital catalogue prototype — category browse interface" },
      { type: "image", src: "images/trapodpc/trapodpc2.png", alt: "TRAPO digital catalogue prototype — product detail view with specs and price tier" },
      { type: "image", src: "images/trapodpc/trapodpc3.png", alt: "TRAPO digital catalogue prototype — product comparison layout" }
    ],
    description: [
      { label: "Brief", text: "<a href=\"https://www.trapo.com/\" target=\"_blank\" rel=\"noopener noreferrer\">TRAPO</a> is a Malaysian automotive accessories brand with a substantial product range sold through retail and direct channels. The printed sales catalogue creates significant operational friction: expensive to produce, difficult to update, and impossible to personalize. This digital catalogue prototype explores a faster, clearer alternative for offline sales teams, in-store promotion, and product comparison." },
      { label: "Research", text: "I mapped the specific use contexts where sales staff use product catalogues: face-to-face customer conversations, counter sales, and regional dealer visits. Each context has different requirements — speed of navigation for counter sales, product depth for dealer conversations, visual quality for first impressions. The prototype needed to serve all three scenarios without becoming so complex it was harder to use than a printed page." },
      { label: "Direction", text: "The interface was built in Figma with navigation logic that mirrors physical catalogue behavior — browse by category, jump to a product, compare quickly. Visual hierarchy gives product images priority over text because purchase decisions in this category are primarily visual. Each product view provides the minimum essential information at first glance (image, name, key specs, price tier) with expandable detail for customers who want to go deeper. Palette and typography pull directly from TRAPO's existing brand identity so the digital catalogue reads as a natural brand extension rather than a separate tool." },
      { label: "Outcome", text: "The prototype demonstrates a solution that reduces print costs, eliminates the lag between product updates and sales team readiness, and makes product comparison faster for both staff and customers. Because the prototype lives in Figma, catalogue updates require no development resources — just file edits and a shared link." }
    ]
  },
  {
    id: "trapo-smartphone-holder",
    title: "TRAPO Smartphone Holder",
    role: "Industrial",
    year: "2022",
    preview: "images/traposh/traposh5.jpg",
    media: [
      { type: "image", src: "images/traposh/traposh1.jpg", alt: "TRAPO smartphone holder concept — form built from the TRAPO logo silhouette" },
      { type: "image", src: "images/traposh/traposh2.jpg", alt: "TRAPO smartphone holder — Alcantara suede and machined aluminium construction" },
      { type: "image", src: "images/traposh/traposh3.jpg", alt: "TRAPO smartphone holder — LED edge detail illuminated on connection" },
      { type: "image", src: "images/traposh/traposh4.jpg", alt: "TRAPO smartphone holder — mounted in a vehicle interior" },
      { type: "image", src: "images/traposh/traposh5.jpg", alt: "TRAPO smartphone holder close-up render showing the TRAPO silhouette as the product body" },
      { type: "image", src: "images/traposh/traposh6.jpg", alt: "TRAPO smartphone holder — MagSafe rotation and case-clearance detail" },
      { type: "image", src: "images/traposh/traposh7.jpg", alt: "TRAPO smartphone holder — material and finish close-up" },
      { type: "image", src: "images/traposh/traposh8.jpg", alt: "TRAPO smartphone holder — driver's-seat view showing the brand signature form" }
    ],
    description: [
      { label: "Brief", text: "MagSafe-compatible smartphone holders had become a commodity category by 2022 — flooded with generic injection-molded mounts at aggressive price points. For TRAPO to enter this space with a flagship product, it needed something that could justify a premium and immediately communicate the brand's automotive-grade quality positioning. The design had to feel like it belonged in a well-specified vehicle interior, not dropped in from an accessory bin." },
      { label: "Research", text: "I analyzed the category from a user-context perspective: smartphone holders live in the car's interior, which is an environment many drivers genuinely care about. Generic holders break the interior aesthetic. I examined the specific use constraints — accommodating cases, rotating without resistance, avoiding heat trapping, mounting without marring surfaces — and the specific aspiration: a product that signals the same values as a quality automotive accessory." },
      { label: "Direction", text: "The form development centered on a single core idea: use the TRAPO logo silhouette as the structural geometry of the product itself. The brand mark becomes the product form, creating an immediate brand signature visible from the driver's seat. The material direction pairs <a href=\"https://www.alcantara.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Alcantara</a> — the same suede-like material used in Ferrari, Lamborghini, and Rolls-Royce interiors — with a machined aluminum structure and an LED edge detail that illuminates on connection. The LED is both functional (charging indicator) and a design detail that gives the product visual presence at night. The form language is controlled and geometric, consistent with TRAPO's existing product vocabulary." },
      { label: "Outcome", text: "The concept establishes a design language for a premium TRAPO hardware product that earns price separation from category competitors. The Alcantara-plus-LED direction creates a sensory experience — touch and visual — that generic competitors cannot easily replicate without matching the material investment." }
    ]
  },
  {
    id: "talentlounge-virtual-career-fair",
    title: "Talentlounge Virtual Career Fair",
    role: "Digital",
    year: "2021",
    preview: "images/talentlounge/talentlounge5.jpg",
    media: [
      { type: "image", src: "images/talentlounge/talentlounge1.jpg", alt: "Talentlounge virtual career fair 3D-rendered booth hall with category signage and walkable environment" },
      { type: "image", src: "images/talentlounge/talentlounge2.jpg", alt: "Talentlounge virtual career fair — industry-categorised booth hall rendering" },
      { type: "image", src: "images/talentlounge/talentlounge3.jpg", alt: "Talentlounge virtual career fair company listing scene with branded booth and interview entry point" },
      { type: "image", src: "images/talentlounge/talentlounge4.jpg", alt: "Talentlounge virtual career fair — spatial navigation environment render" },
      { type: "image", src: "images/talentlounge/talentlounge5.jpg", alt: "Talentlounge virtual career fair — colour-coded booth wayfinding" },
      { type: "image", src: "images/talentlounge/talentlounge6.jpg", alt: "Talentlounge virtual career fair — website integration of rendered booth assets" }
    ],
    description: [
      { label: "Brief", text: "The 2020–2021 period eliminated in-person career fairs, forcing recruitment platforms to find digital alternatives. Most solutions were Zoom calls or basic webinar setups — functional but entirely unable to replicate the exploratory, discovery-oriented quality of a physical fair, where candidates could wander, notice unexpected companies, and make quick cultural reads of booths. The <a href=\"https://talentlounge.co/Hello\" target=\"_blank\" rel=\"noopener noreferrer\">Talentlounge</a> virtual career fair asked how a digital recruitment event could feel genuinely engaging rather than simply adequate." },
      { label: "Research", text: "I analyzed what made physical career fairs valuable that virtual alternatives were failing to recreate: spatial navigation (you walk, you discover), ambient social proof (you see other candidates at specific booths), and the ability to make immediate visual assessments about whether a company's presentation matched your expectations of their culture. I also identified what digital could actually improve: accessibility without travel, simultaneous attendance at different sessions, richer content than a folding table and banner." },
      { label: "Direction", text: "The visual direction uses 3D-rendered environments to restore the spatial navigation quality of a physical fair. Booths are organized by industry category in a consistently rendered visual language that communicates scale and organization. Lighting, color-coding, and spatial hierarchy guide candidates through the environment without requiring instruction. My role covered visual direction, 3D modelling, rendering in KeyShot, and integration of the resulting assets into the Talentlounge website — rendered booth environments as hero visuals for each company listing, creating visual differentiation and immediate character communication." },
      { label: "Outcome", text: "The Talentlounge virtual fair experience raised the visual standard for digital recruitment events significantly above the competition. The 3D-rendered environments created a quality level that positioned Talentlounge as a premium platform rather than a functional substitute for the real thing." }
    ]
  },
  {
    id: "nexus",
    title: "Nexus",
    role: "Industrial",
    year: "2021",
    preview: "images/nexus/nexus2.jpg",
    media: [
      { type: "image", src: "images/nexus/nexus1.jpg", alt: "Nexus transit bench concept — modular Serambi-inspired MRT seating, TRANSEAT finalist" },
      { type: "image", src: "images/nexus/nexus2.jpg", alt: "Nexus transit bench — modular units connected for social grouping" },
      { type: "image", src: "images/nexus/nexus3.jpg", alt: "Nexus transit bench — Thermoplastic Elastomer in warm earth tones" },
      { type: "image", src: "images/nexus/nexus4.jpg", alt: "Nexus transit bench — illuminated edge detail for low-light wayfinding" },
      { type: "image", src: "images/nexus/nexus5.jpg", alt: "Nexus transit bench — continuous-flow silhouette in elevation" },
      { type: "image", src: "images/nexus/nexus6.jpg", alt: "Nexus transit bench — MRT station context render" }
    ],
    description: [
      { label: "Brief", text: "Transit seating is one of the most under-considered categories in public design — built for durability and cleanability above everything else, producing furniture that communicates only institutional indifference. The Malaysia National Design Competition <a href=\"https://www.mymrt.com.my/events/infinity-wins-transeat-grand-prize/\" target=\"_blank\" rel=\"noopener noreferrer\">TRANSEAT</a> asked whether MRT station seating could be something more: a piece of public furniture with genuine cultural and social intention. Our team reached the top 10 as a finalist." },
      { label: "Research", text: "The conceptual starting point was the \"Serambi\" — the covered, semi-open veranda in traditional Malay architecture that functions as a threshold space between public and private, designed for gathering, conversation, and rest. I asked what Serambi logic could offer transit seating: a space that encourages pause without demanding it, that accommodates individual use and social grouping, that belongs to the community passing through it rather than simply serving a function." },
      { label: "Direction", text: "The bench form is modular — units connect and separate to accommodate different group sizes and configurations. The material choice is Thermoplastic Elastomer (TPE): soft enough to be comfortable for long waits, durable enough for high-traffic public use, and available in warm earth tones that reference the Serambi's traditional material palette. An illuminated edge detail serves dual purposes: wayfinding in low-light conditions, and a symbolic quality — the bench glows, making it visible and welcoming rather than merely present. In elevation, the silhouette reads as continuous flow rather than discrete seats, reflecting the transit environment's own character of movement punctuated by brief pause." },
      { label: "Outcome", text: "Nexus reached the top 10 of the TRANSEAT national competition, demonstrating that the concept resonated with the evaluation criteria. The project also establishes a design approach to public furniture that prioritizes cultural specificity and sensory quality alongside standard functional requirements." }
    ]
  },
  {
    id: "motorola-solutions-radio-concept",
    title: "Motorola Solutions Radio Concept",
    role: "Industrial",
    year: "2020",
    preview: "images/motorola/motorola3.jpg",
    media: [
      { type: "image", src: "images/motorola/motorola1.jpg", alt: "Motorola Solutions two-way radio concept compact hospitality-grade form with premium black finish" },
      { type: "image", src: "images/motorola/motorola2.jpg", alt: "Motorola Solutions radio concept — flatter profile for chest pocket or belt holster" },
      { type: "image", src: "images/motorola/motorola3.jpg", alt: "Motorola Solutions radio concept auxiliary e-ink information display hidden behind the device surface" },
      { type: "image", src: "images/motorola/motorola4.jpg", alt: "Motorola Solutions radio concept — ergonomic grip and control-layout study" },
      { type: "image", src: "images/motorola/motorola5.jpg", alt: "Motorola Solutions radio concept — premium surface finish and LED status indicator" },
      { type: "image", src: "images/motorola/motorola6.jpg", alt: "Motorola Solutions radio concept — in-use hospitality context" }
    ],
    description: [
      { label: "Brief", text: "<a href=\"https://www.motorolasolutions.com/en_us.html\" target=\"_blank\" rel=\"noopener noreferrer\">Motorola Solutions</a> designs two-way radios for professional users across hospitality, security, healthcare, and public safety. The challenge in this category is that function alone doesn't make a product feel valuable to its user — and in hospitality particularly, the visible quality of a communication device directly affects how staff perceive themselves and how guests perceive the service standard. My 12-week internship project explored this gap." },
      { label: "Research", text: "I visited 14 hotels across different service tiers to observe how staff actually used two-way radios in daily work. These field observations surfaced patterns the existing product range wasn't fully addressing: staff needed information access hands-free while managing guest interactions; the physical size of current models created carrying friction for lighter-duty roles like concierge and front desk; and the radio's visible presence in a luxury hotel environment was creating a subtle mismatch between service quality and equipment quality." },
      { label: "Direction", text: "The final concept addresses three specific research findings with three specific design moves: a more compact form factor that sits flatter in a chest pocket or belt holster; a hidden secondary display providing at-a-glance information without requiring the user to look away from a guest; and an ergonomic form with a premium surface finish and LED status indicator that reads as designed rather than utilitarian. Control layout was developed through grip studies for single-handed operation in both left and right hand configurations. The hidden display uses an e-ink approach allowing information to persist without continuous battery draw — relevant for full-shift use." },
      { label: "Outcome", text: "The concept was developed to full presentation standard — concept boards, 3D models, KeyShot renders, and a formal design review with the Motorola Solutions design team. The field research methodology — structured observation across 14 hotels at different service levels — produced insights specific enough to drive real design decisions, rather than generalized personas or assumptions." }
    ]
  },
];
