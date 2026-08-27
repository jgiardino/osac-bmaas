# Designer review — AI Grid model fleet

Use this file for notes after looking at the prototype and the Evaluate report. This is the source of truth for the next UI pass. Evaluate does not automatically rewrite the design from these notes.

Evaluate report: `.artifacts/ai-grid-model-fleet/eval/evaluation-report.html`

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
- **Continuity into consume.** Deferred. Full details pages from AI Grid and jumping into tenant consume stay parked. **View in Catalog** remains in the kebab until that is decided. No jump to Services instance pages yet.
- **Dashed lines / traffic.** Previous lines were not the right representation. Traffic flow is later. The Leaflet map does not draw those lines.
- **Gateway icon.** Services uses PatternFly `GlobeRouteIcon` as a placeholder until a dedicated gateway icon is chosen.
- **Remaining pin hues.** Light green is still `#3d7317` (not checked). Dark unavailable red is still `#ff4d4d`. Dark available green is a trial of `#87bb62`.
- Drawer-local Catalog filters beyond search (publish state, service type). Page **Tenant** slices the fleet; Catalog VIP visibility is only applied so NSB-only SKUs hide when another tenant is selected. Global SKUs stay visible.
- Right-side icon on cards for a full details page, after browsing PatternFly icons.
- **Make an instance available as a service.** Helper copy is on non-MaaS instance details. Do not build the select-a-gateway flow yet.
- **Tenant on every details view as a systematic pattern.** Cluster, gateway, and model details already show Tenant in places. Do not expand that in this pass.

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

- Leaflet map uses Esri light and dark gray canvases so the grid follows the platform color scheme (`User preferences` → color scheme). CARTO’s public tiles now watermark without an API key, so they are not used.
- **Catalog** and **Services** are a PatternFly ToggleGroup on the **right** of the page toolbar (`ToolbarGroup alignEnd`). **All tenants** has no “Tenant” field label, matching Catalog. Former tab intro copy is a tooltip on each button. Tenant still slices the map and both lists. Gateway is no longer a canvas filter.
- Clusters / Models (and Gateway on Services) are a multi-select **icon** toggle in the drawer toolbar. Search sits to the left of those icons. Accordion chrome is gone; section headings remain when more than one type is visible.
- Gateway is a Services list with in-panel details (hostname, tenant, the one cluster it lives on, MaaS models with Internal/External). Icon is the GlobeRoute placeholder. `?scenario=nsb-retail-gateway` opens that gateway’s details instead of filtering the map.

### Done this pass (object relationships)

- A gateway lives on **one** cluster. A cluster can have **many** gateways. Lists and details use `gateway.clusterId`, not the old many-clusters-per-gateway model.
- **Internal** / **External** match MaaS governance (orange / purple outline). AI Grid adds a filled blue **MaaS** label only when the model is available as a service. Catalog models are not MaaS.
- Cluster details list gateways provisioned on that cluster and model instances running there.
- Gateway details list MaaS models and whether each is Internal or External to that gateway’s cluster.
- Model instance details show cluster, gateway on this cluster, MaaS gateways you can access, and other placements of the same catalog offer. An instance can be connected to a gateway without being MaaS.
- Titan Text Express is an off-platform external MaaS model (Amazon Bedrock) on `nsb-retail` and `nsb-markets`. It is hidden when those gateways are not in the tenant filter.
- Catalog cards use **Models** / **Cluster** plus **2 instances** (not Live / Unpublished / MaaS).
- Map pins and legend share the same hues and opacities: fill **0.35**, outline **0.85**. Light unavailable red is `#ee0000`. Dark available green is a trial of `#87bb62`. The dark glow ring and white stroke are removed.

### Future refine

See the parked list above. Do not implement interaction-model lock, US East · AWS labels, or continuity into consume until Jenn brings sketches or un-parks them.

## Object model vs what the UI currently shows

These are the mock objects behind AI Grid. The UI should not treat a catalog model as one instance sitting on many clusters. Do not show CR names (`LLMInferenceService`, `MaasModelRef`) in the UI.

| What you see | Mock object | What that object is | What is still off |
| --- | --- | --- | --- |
| Catalog **Models** card (for example Granite 3B instruct) | `VisionModelPreset` linked to an Ethan catalog draft | An offer / SKU you can place. Not MaaS. Label is **Models** plus instance count | Clicking the card lights every cluster that already has a placement of that offer |
| Catalog **Clusters** card | Ethan cluster catalog draft | An offer to launch | Not mapped to specific pins yet (**0 instances**). Launch instance still uses the GPU inference offering under the hood |
| Services **Models** card (on a cluster) | `VisionDeployment` | One model instance on **one** cluster. May be attached to a local gateway. May be MaaS on one or more gateways | Making a non-MaaS instance available as a service is helper copy only |
| Services **Models** card (off-platform) | `VisionOffPlatformModel` | Always MaaS, always External. Served outside this platform (for example Amazon Bedrock). Can sit on many gateways | Only one seed example (Titan Text Express) |
| Cluster pin | `VisionCluster` | One cluster at one site. Gateways and instances are provisioned **on** the cluster | `cluster.gatewayId` is still a leftover launch hint; details use `gatewaysOnCluster` |
| Gateway | `VisionGateway` | Lives on exactly one cluster. Shows MaaS models as Internal (same cluster) or External (another cluster or off-platform) | Placeholder icon. RHOAI today maps one MaaS model ref to one gateway; this prototype lets an external model sit on many gateways |

Granite on US East (`dep-granite-east`) is Internal MaaS on `nsb-markets` and External MaaS on `nsb-retail`. Granite on EU West (`dep-granite-eu`) is Internal MaaS on `nsb-retail` only. Those are two instances of the same catalog offer (`granite-3b`), not one instance on two clusters. Mistral on US West is attached to `nsb-west` and is not MaaS. Granite 8B on BlueSolace EU has no gateway and is not MaaS.
