# Designer review — AI Grid model fleet

Use this file for notes after looking at the prototype and the Evaluate report. This is the source of truth for the next UI pass. Evaluate does not automatically rewrite the design from these notes.

Evaluate report: `.artifacts/ai-grid-model-fleet/eval/evaluation-report.html`

---

## 2026-09-14

### Instance cards (Patterns → Instance lists)

- Services and AI Grid Services cards are the same four properties: **Model**, **Size** (or **Served by** for externals), **Cluster**, **Gateway**.
- No PatternFly cluster-id labels. Gateway value is `host-cluster: gateway-id` (example: `ocp-us-east-1: nsb-markets`). **MaaS** stays a filled label on Gateway when published. **Unassigned** is plain text.
- **Created** only on Services page cards, not AI Grid (compact).
- Title is a link. Secondary text is the catalog item name (`llm-instruct`). AI Grid adds a smaller service icon inline with the title.
- Nested AI Grid lists: omit the parent object (no Cluster on cluster details; no Gateway on gateway details). Nested lists include externals whose gateway is hosted on that cluster.
- **Tenant** is platform admin only. Patterns shows it because that page is viewed as platform admin. Tenant admin and tenant user omit it. Later Myriam discussions should use **tenant admin** as the persona who sees the whole organization fleet.

### Consume lists (Patterns)

- Model column is display name, **MaaS model ref id** (not catalog item id), and description — same stack and styles on MaaS governance, API keys, AI asset endpoints, and Playground picker.
- MaaS governance keeps filled **Internal** / **External** labels. AI assets and Playground use a filled **MaaS** label when the model is published (Mistral has none). Match Ethan’s filled labels, not outline.

### Live GenAI studio API keys (not 2.8)

- Keys on GenAI studio → API keys belong to the signed-in user: `ajohnson` (Alex Johnson / provider), `cmorgan` / `ecruz` (tenant user), `pnair` / `marcuschen` (tenant admin GenAI studio). Admin API keys (`nav=ai-admin-api-keys`) still lists keys across users.

Live Services / MaaS / assets / Playground **lists** stay on old mocks until the 2.8 seed is wired.

### Keep-set and chrome (later 2026-09-14)

- Granite stays **story A** (regional doors). One gateway serving models on other clusters is shown with **Mistral 7B ×3 on `nsb-west`** (US West, US East, EU West). Mistral is MaaS. **Credit-risk scorer** is the non-MaaS AI asset. **Claude Sonnet 4** stays unassigned MaaS: MaaS governance only — not API keys, assets, or Playground.
- Nested gateway cards omit Gateway, so **MaaS** sits to the right of the display name for now (revisit in context).
- Model column: no PatternFly Content, no custom CSS. Display name + filled labels (Flex), then id and description with `pf-v6-u-font-size-xs`, `pf-v6-u-font-family-monospace`, and `pf-v6-u-text-color-subtle`.
- Playground: stacked identity in the **menu only**. Toggle is the selected display name.

### Custom CSS stripped from Patterns → Instance lists

Over-correction: instance cards were rebuilt on default PatternFly DescriptionList and no longer matched Ethan’s Services cards. Restored Ethan’s instance-card classes for the page card. Compact AI Grid card keeps the small inline-icon CSS (`models-instance-card__title-row`, `__icon--compact`) only. Page card footer action: **View subscriptions** (MaaS) / **View endpoints** (not MaaS). Compact AI Grid card: that action is in the kebab, not the footer.

### 2026-09-17

- Compact AI Grid Cluster and Gateway cards use the same chrome as Models instance cards: compact service icon inline with the title, status and kebab (View details) in the header, spec rows, Tenant footer for platform admin. Gateway uses the globe-route icon already used on the type toggle.
- MaaS governance models table (live and Patterns): **Status** column. **Pending** (filled purple, pending icon, no second line) when subscriptions or authorization policies is 0; warning icon on that 0. Otherwise **Ready** (filled success).

### 2026-09-17 (keep-set on live pages)

- Live Services → Models, AI Grid Services (plus nested cluster/gateway lists), MaaS governance, API keys models, AI asset endpoints, and Playground use the 2.8 keep-set for **everyone** (not vision-gated).
- MaaS governance is **one row per serving instance** (not per catalog item). Granite is two rows (US East and EU West), Mistral is three, Titan is two (one per assigned gateway). Columns: Model, Tenant (platform admin only), Project (all admins), Cluster, Gateway, Status, Subscriptions, Authorization policies. Cluster is the instance cluster; for off-platform models it is the gateway host cluster, or — if unassigned. Filled Internal / External (including expand, Subscriptions tab, and Authorization policies tab). Expand still lists that instance’s model identity subscriptions and policies. Group view stays unique by published model. No 0-subs / 1+ policies mirror case.
- **Llama 4 Scout** is assigned (`bsfg-us`) with 1 subscription and 0 policies → Pending (warning on policies). Claude stays unassigned 0 / 0, MaaS governance only.

---

## 2026-09-11

### Catalog SKUs (2.5) in the UI

- Five Models catalog items are live on platform Catalog, tenant admin Catalog, tenant user Catalog, and AI Grid Catalog. Same seed; BYOM is not in the UI.
- Models catalog **cards** follow Ethan’s latest catalog chrome: service + Live, kebab-case display name (`llm-instruct`, like `cluster-node-sets-object`), Locked / Editable properties, rate, visibility footer. Catalog item ids (`cat-…`) stay in data only — not on Models cards and not on this repo’s cluster/BM/VM catalog cards. Ethan’s offers stay as-is; the card pattern matches his latest.
- Instantiate label is **Launch instance**. Designer-iteration copy is off model details.
- Vision-gated **Patterns** page (`?vision=model-fleet&nav=vision-model-catalog-patterns`): **Catalog item** tab (page + compact) and **Fleet list** tab (the old list-pattern variations).
- Instance / MaaS / assets / Playground **live pages** still use old mocks. The 2.8 keep-set is on Patterns → **Instance lists** (`?vision=model-fleet&nav=vision-model-catalog-patterns`) so the same seed can be compared in each list chrome before those pages are switched.
- **Gateway routing is open.** Story A = regional doors (working mock: Granite US East → `nsb-markets`, Granite EU West → `nsb-retail`). Story B = one gateway routing to both regional instances. Cardinality either way: one instance → zero or one gateway; one gateway → many instances; instance and gateway may be on different clusters. Do not pick A vs B in the UI until stakeholders. Traffic lines stay parked.

---

## 2026-08-26

### Issues to address

(Paste bugs, confusing copy, layout problems, missing states. Numbered click-paths help: URL, what you clicked, what you expected, what you saw.)

- All of my feedback is based on http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=vision-model-fleet
- Low hanging fruit issues:
  - Remove "Provider workspace", "AI grid", and the help text below the header. These take up extra space and the main focus is the map and panel. 
  - Add the Org and Gateway menus into a toolbar that sticks to the top of the main content area
  - The footer with total GPUs etc... should stick to the bottom of the main content area
  - The only scroll bar should display for the panel. 
  - Have the main content area include a vertical divider that separates the map and footer from the drawer. The map area and drawer occupy the same height. I think the toolbar should span the width of the page, because I think this selection will impact the contents of both the map and drawer panels. 
- Right drawer panel IA - This drawer includes a confusing mix of predefined "catalog" items that could be instantiated and instantiated "services". The left nav separates these items, and therefore we should have similar separation, where a user can either see catalot items in a list or services in a list, but not a single flat list that shows both types. 
- Right drawer panel > Model presets & Cluster offerings - This list should map to the same list that displays in the Catalog when filtered to show Models or Clusters. The same options, flow and microcopy available from the catalog page should surface on the AI grid page for this list.
- Right drawer panel > Deployed on the grid - This list should map to the same list that displays in the Services pages.
- Nav and interaction patterns - 
  - When I click an item in the map, I want to see the drawer contents filtered to show details related to my selection (e.g. metadata for that cluster/site, what models are running). And I should be able to clear that selection to return to my previous view (is this a Services link in a breadcrumb?, e.g. Services > ocp-cluster-03)
  - Anything listed in the drawer that represents a service is something I should be able to drill into from that drawer to see the full details page, but also click to see a summary overview in the drawer. I believe the pattern is a link navigates to the full details, and clicking on the card drills in within the drawer. If I navigate to the full details, the breadcrumb should display AI Grid > ocp-cluster-03 
- Map - Are you aware that this is not a true map? I assume this requires installing some package that provides this capability. 

### Disagreements with Evaluate

(If a PASS is too generous, a usability score is wrong, or a finding is not the real problem, say so here. The next UI pass follows this section, not the checklist.)

- The results from the eval tool are hard for me to parse. They feel overly generic and vague, without really understanding the nature of the UX problem I'm trying to solve. And honestly, I think this design problem is too complex for an eval tool to be effective at this time. I think I need to break areas down one by one and iterate over them.

### Different approach (optional)

(If Evaluate or the current page suggests a direction you do not want, describe the approach you want instead.)

- I was not able to find any specific recommendations in the eval results. But they might be buried. If you found recommendations I should review, please surface those in chat.

### Future refine (parked)

- **Interaction model (name vs card vs pin vs full details).** Jenn is sketching this first. Do not lock click vs link vs pin until that sketch lands.
- **Site-language on the map.** Primary cluster label as **US East · AWS** (keep `ocp-*` secondary). Logged for a later pass.
- **Continuity into consume.** Deferred. Full details pages from AI Grid and jumping into tenant consume stay parked. **View in Catalog** remains in the kebab until that is decided. No jump to Services instance pages yet. The purple **AI Grid continuity** alert on MaaS governance and API keys is removed.
- **Dashed lines / traffic.** Previous lines were not the right representation. Traffic flow is later. The Leaflet map does not draw those lines.
- **Gateway icon.** Services uses PatternFly `GlobeRouteIcon` as a placeholder until a dedicated gateway icon is chosen.
- **Remaining pin hues.** Light green is still `#3d7317` (not checked). Dark unavailable red is still `#ff4d4d`. Dark available green is a trial of `#87bb62`. Selected pin remains the previous blues (`#0066cc` light, `#7dc3ff` dark).
- Drawer-local Catalog filters beyond search (publish state, service type). Page **Tenant** slices the fleet; Catalog VIP visibility is only applied so NSB-only SKUs hide when another tenant is selected. Global SKUs stay visible.
- Right-side icon on cards for a full details page, after browsing PatternFly icons.
- **Make an instance available as a service.** Helper copy is on non-MaaS instance details. Do not build the select-a-gateway flow yet.
- **Tenant on every details view as a systematic pattern.** Cluster, gateway, and model details already show Tenant in places. Do not expand that in this pass.
- **Expandable Clusters / Models / Gateway sections in the drawer.** We used accordion chrome before and replaced it with section headings plus the type-toggle. Revisit an expand/collapse control on those lists later. Not this pass.
- **One shared model list across pages.** Catalog, AI Grid, Services → Models, MaaS governance, API keys, AI asset endpoints, and Playground each show a different set of models (names, IDs, and object types). Do not unify those mocks in this pass. Capture the gaps in `.artifacts/ai-grid-model-fleet/model-list-inventory.md` and treat a single demo catalog as a later refinement.
- **Services card icons in the AI Grid drawer.** Catalog and Services list cards use the RH UI service icons (cluster, models, and more). The drawer cards do not. Add those icons to the drawer later so the two lists match. Not this pass.

### Done this pass (alignment + map)

- Card border restored (default + selected/current). Card body click still highlights the map; name still opens in-panel details.
- Toolbar **Tenant** / **All tenants** (same commercial-org object as Catalog’s tenant filter). Gateway unchanged.
- Catalog kebab: **Place on AI Grid** (models), **Launch instance** (clusters), matching Catalog. **View in Catalog** kept pending the full-details question.
- Catalog cards: service badge **Cluster** / **Models**, instance-count label, catalog item id, spec rows, **Rate**.
- Services cards: status, catalog display name as secondary, spec rows, footer **Tenant**.
- Search in both drawer lists (Catalog: “Search catalog items”; Services: “Search instances”).
- **Active models** and **Active clusters** in the map footer are link buttons that open the Services list for that accordion. PatternFly DescriptionList has no clickable-item prop; the value is a link button.
- Leaflet map (OpenStreetMap tiles). Pins at real lat/lng for US West, US East, US Central, EU West.

## 2026-08-27

### Done this pass (toolbar, types, gateway, map theme)

- Leaflet map uses Esri World Light Gray / Dark Gray canvases again. The ocean/land color experiment is reverted. Pin opacities and selected blues are unchanged. Zoom/pan is preserved when you select a pin.
- **Catalog** and **Services** are a PatternFly ToggleGroup on the **right** of the page toolbar (`ToolbarGroup alignEnd`). **All tenants** has no “Tenant” field label, matching Catalog. Former tab intro copy is a tooltip on each button. Tenant still slices the map and both lists. Gateway is no longer a canvas filter.
- Clusters / Models (and Gateway on Services) are a multi-select **icon** toggle in the drawer toolbar. Search sits to the left of those icons. Accordion chrome is gone; section headings remain when more than one type is visible.
- Gateway is a Services list with in-panel details (hostname, tenant, the cluster card from the Services list, models on that gateway). Icon is the GlobeRoute placeholder. `?scenario=nsb-retail-gateway` opens that gateway’s details instead of filtering the map.

### Done this pass (object relationships)

- A gateway lives on **one** cluster. A cluster can have **many** gateways. Lists and details use `gateway.clusterId`, not the old many-clusters-per-gateway model.
- Model instance cards list **Gateway** with name, cluster id when the gateway is on another cluster, and **MaaS** when published. **Unassigned** when there is no gateway. Card chip **External** only for external models; fleet cards show **Cluster** as a property. Catalog offerings use blue **Model** (singular), not MaaS.
- Cluster details list gateways provisioned on that cluster and model instances running there.
- Gateway details show the host cluster with the same card as the Services cluster list, then models on that gateway.
- Model instance details show cluster, gateway on this cluster, **Gateway** (MaaS gateways you can access), and **Other instances** of the same catalog offer. An instance can be connected to a gateway without being MaaS.
- Titan Text Express is an off-platform external model (Amazon Bedrock) on `nsb-retail` and `nsb-markets`. It is hidden when those gateways are not in the tenant filter.
- Catalog cards use **Model** / **Cluster** plus **2 instances** (not Live / Unpublished / MaaS).
- Map pins and legend share the same hues and opacities: fill **0.35**, outline **0.85**. Light unavailable red is `#ee0000`. Dark available green is a trial of `#87bb62`. The dark glow ring and white stroke are removed.

### Done this pass (label patterns)

- **List patterns** nav (only with the vision flag): Gateway list with filled chips (live), outline chips, and grouped Internal / Internal MaaS / External MaaS. Inventory table (detail kinds as rows, places as columns): `.artifacts/ai-grid-model-fleet/model-list-inventory.md`. MaaS governance / API keys / AI asset endpoints are unchanged until a tab is chosen.

### Done this pass (review 2026-08-27)

- Services type toggle and list: Clusters, then **Gateway**, then Models.
- Gateway details and model-instance details both present the host cluster as the same **cluster card**.
- Catalog cluster SKU shows the count of provisioned clusters and lists them as cluster cards. Selecting that catalog item lights those pins.
- Model cards use RHOAI **display name** (bold) and **model ID** (monospace). No “Stable name” captions.
- Two attributes: **External** (serving kind chip, external models only) and Cluster as a fleet property. Gateway location is the gateway’s cluster id when it differs from the model. MaaS remains published-as-a-service.
- External model CRs live in a project on a cluster. Titan is on `ocp-us-east-1`. Claude is an external model not added to a gateway yet.
- Model cards show **Tenant**, then **Project**.

## 2026-08-28

### Done this pass (lifecycle objects, Cluster, Unassigned)

- Inventory is now objects + inclusion, then a property dictionary, then pages. Size is defined (catalog saved config vs realized instance). Path: `.artifacts/ai-grid-model-fleet/model-list-inventory.md`.
- Fleet model cards show **Cluster** as a spec row. There is no **On cluster** chip. Purple chip is **External** only.
- No gateway: grey **Unassigned** pill (hollow circle). Same-cluster gateway: name only (+ **MaaS** if published). Other-cluster gateway: name plus that gateway’s cluster id. List patterns also has “always show cluster with gateway.”
- Cluster details omit Cluster on nested instance cards. Gateway details keep the **model’s** Cluster (the model may not live on this gateway’s cluster).

### Done this pass (property order, gateway alignment)

- Model card properties: **Size** or **Served by**, then **Cluster**, then **Gateway**. Gateway values share the spec value column (not stacked under the label).

## 2026-08-30

### Done this pass (cluster id labels live)

- AI Grid uses grey cluster id labels (outline = this cluster, filled = another). Gateway cluster ids use the body font, not monospace.
- Cluster details omit Cluster on nested models; gateway lines there only show a cluster label when the gateway is on another cluster.
- Gateway details keep Cluster labels on models so same-cluster vs other-cluster is visible. No Gateway list on those cards.
- Gateway cards show a **Models** count (`1 model` / `N models`). Cluster is omitted on gateway cards inside cluster details.

## 2026-09-10

### Object dictionary (Step 1 — object set revised)

Jenn’s review of §1, captured in `.artifacts/ai-grid-model-fleet/model-list-inventory.md`:

- Catalog page and AI Grid Catalog are the **same list**. OSAC Services and AI Grid Services are the **same list**. Chrome may differ because of width.
- Model file: catalog *sources* are in Admin → AI (Model catalog settings). Picking a file from the RHOAI catalog is not in this prototype; instantiate uses a simple form input until that work lands.
- On-cluster instance = RHOAI `LLMInferenceService`. OSAC needs **this cluster / another cluster / off-platform**, not RHOAI’s single **External** chip.
- External model: not Catalog or Services for now; **MaaS governance only**. That page also lists on-cluster instances that are MaaS models.
- **MaaS model** = former “MaaS enablement” + API keys / subscriptions (same object). Admin view (MaaS governance): all MaaS models plus subscription and policy assignment. User view (API keys): only MaaS models on a subscription they can access. External models are MaaS-only. An on-cluster instance can be an AI asset **without** MaaS.
- **AI asset** = AI asset endpoints + Playground (same object).

## 2026-09-08

### Object dictionary (Step 1 — in review)

- Unparked **one shared model list**. Defining objects first in `.artifacts/ai-grid-model-fleet/model-list-inventory.md`. No UI or seed wiring until Jenn reviews that file.
- **Scope:** models, AI / GenAI studio, external models, Gateway. Not Ethan’s bare metal / cluster / VM SKUs.
- **Agreed:** Decision 1 starting object set; Decision 3 option A (same live Models SKUs across the three roles); Decision 4 **Launch instance**; Decision 5 strip designer-iteration copy from model catalog details.
- **Open (Decision 2):** Five Catalog SKUs for UI (BYOM documented only). Next for consume: **review existing lists** (2.8) then one master instance + external set. AI assets = LIS marked as assets **∪ all MaaS models** (including externals).

## 2026-08-31

### Done this pass (gateway heading, footer links, tenant fleet)

- Gateway details: **Cluster** heading has no count badge (a gateway lives on one cluster).
- Map footer **Active models** and **Active clusters** are links on the property label. The number is plain text. Active models counts every model instance in the current filter (on-cluster plus external), matching the Services models list.
- List patterns is archived at `.artifacts/ai-grid-model-fleet/archive/` and is not in the Provider Admin nav.
- Tenant Admin has the same AI Grid when `?vision=model-fleet` is set, locked to that tenant (North Summit Bank). No tenant filter.
- Tenant Admin sidebar keeps **GenAI studio** and **AI** (MaaS governance, Model catalog settings, API keys) on every iteration, matching Provider Admin. AI Grid remains vision-gated.
- Landing-page **AI Grid (future vision)** is the last prototype link for Provider Admin, Tenant Admin, and Tenant User.
- Sidebar order: consume first (**Services**, **GenAI studio**), then setup/management (**Projects**, then AI settings / Networking / Administration). Same order for Provider Admin, Tenant Admin, and Tenant User.
- **Parked:** model lists are inconsistent across Catalog, AI Grid, Services → Models, MaaS governance, API keys, AI asset endpoints, and Playground. See inventory. Not this pass.
- Landing credits name **Jenn Giardino** for AI Grid (future vision) and keep Ethan Kim and Kyle Baker as authors of the underlying prototype. Name links go to GitHub (the Slack DM URLs did not open).

### Future refine

See the parked list above. Do not implement interaction-model lock, US East · AWS labels, or continuity into consume until Jenn brings sketches or un-parks them.

## Object model vs what the UI currently shows

These are the mock objects behind AI Grid. The UI should not treat a catalog model as one instance sitting on many clusters. Do not show CR names (`LLMInferenceService`, `MaasModelRef`) in the UI.

| What you see | Mock object | What that object is | What is still off |
| --- | --- | --- | --- |
| Catalog **Model** card (for example Granite 3B instruct) | `VisionModelPreset` linked to an Ethan catalog draft | An offer / SKU you can place. Not MaaS. Label is **Model** plus instance count | Clicking the card lights every cluster that already has a placement of that offer |
| Catalog **Clusters** card | Ethan cluster catalog draft (`cluster-node-sets-object`) | An offer to launch | Seed clusters count as instances of this SKU. Launch instance still uses the GPU inference offering under the hood |
| Services **Models** card (on a cluster) | `VisionDeployment` | One on-cluster instance. No serving-kind chip. **Cluster** as an outline grey id label in fleet lists. Gateway: name, cluster id label (outline same cluster, filled other), **MaaS** if published, **Unassigned** if none | Making a non-MaaS instance available as a service is helper copy only |
| Services **Models** card (external model) | `VisionOffPlatformModel` | External model CR in a project on a cluster. Chip **External**. May have no gateways (**Unassigned**) | Claude has no gateway yet. Titan is on `nsb-markets` (same cluster) and `nsb-retail` (other cluster) |
| Cluster pin | `VisionCluster` | One cluster at one site. Gateways, on-cluster instances, and external-model CRs can live **on** the cluster | `cluster.gatewayId` is still a leftover launch hint; details use `gatewaysOnCluster` |
| Gateway | `VisionGateway` | Lives on exactly one cluster. Models on it show **External** when applicable, plus the model’s Cluster (the model may live elsewhere) | Placeholder icon |

Granite on US East (`dep-granite-east`) is an on-cluster instance: Cluster outline `ocp-us-east-1`, MaaS on `nsb-markets` (same cluster, outline label) and MaaS on `nsb-retail` with filled `ocp-eu-west-1`. Granite on EU West is MaaS on `nsb-retail` only. Those are two instances of the same catalog offer. Mistral on US West is attached to `nsb-west`, not MaaS. Granite 8B on BlueSolace EU is **Unassigned**. Titan is **External** on US East. Claude is **External** on US East, **Unassigned**.
