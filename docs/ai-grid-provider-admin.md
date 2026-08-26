# AI Grid — Provider Admin next iteration

Working branch: `feature/vision-model-fleet` (Layer A). Layer B line remains `feature/ai-grid-provider-admin`.  
Fork: https://github.com/jgiardino/osac-bmaas  
Upstream: https://github.com/heyethankim/osac-bmaas  
Live MVP: https://jgiardino.github.io/osac-bmaas/

## Intent

Extend this BMaaS prototype with an **AI Grid / Provider Admin** fleet story, in two layers agreed with UXD leadership:

1. **MVP (Layer B)** — multi-tenancy and AI-relevant capabilities on the current Provider Admin IA (Overview, Data centers, Models, Organizations, Catalog), plus selected GenAI / tenant-admin AI surfaces. **Status (2026-08-25): good enough as-is.** Leave this iteration intact. It does not yet connect to the OSAC / AI Gateway object model (sites as parents of clusters, placements, `ExternalModel`, gateway-tenant). That gap is the future-vision work, not more Layer B polish.
2. **Visionary (Layer A)** — forward-looking fleet / geo experience informed by Karim’s ACM-based demo and related prior art. **Separate view** on the **same prototype URL**, gated by `?vision=model-fleet`. Default load remains Layer B.

   Open: `/provider/workspace?vision=model-fleet&nav=vision-model-fleet` (also linked from the landing page as **AI Grid (future vision)**). Lived-in fleet home: map of clusters, right panel (model presets, cluster offerings, deployed inventory, selected cluster), filters by organization then gateway.

Use the same UI patterns across a **scope continuum** (single cluster → mid-scope multi-cluster/org slice → full platform), filtered by permissions—not separate product shells.

## Porting from the prior AI vision prototype (osac-ux)

Port in **small batches** with review between batches. Adopt this repo’s shell, nav, and role patterns; do not drop in an entire parallel IA.

| Status | Area |
|--------|------|
| **Permanent hold** | Workbenches, Pipelines |
| **Done enough (Layer B)** | GenAI Studio (asset endpoints, API keys, playground), tenant admin AI settings (MaaS governance, catalog settings, admin API keys) |
| **Gap — never built** | Usage / observability (call out explicitly) |
| **Parked** | AI Models vs existing **Services → Models** (instances table / MaaS slot). Do not replace Layer B Models in place; vision uses a separate view. |

## Local design notes

Detailed notes live in gitignored `design/` on designer machines. Future-vision confirmation: `design/future-vision-goal-summary.md`. Phase 1 brief: `design/vision-brief-model-fleet.md`.
