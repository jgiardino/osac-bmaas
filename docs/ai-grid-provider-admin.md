# AI Grid — Provider Admin next iteration

Working branch: `feature/ai-grid-provider-admin`  
Fork: https://github.com/jgiardino/osac-bmaas  
Upstream: https://github.com/heyethankim/osac-bmaas

## Intent

Extend this BMaaS prototype with an **AI Grid / Provider Admin** fleet story, in two layers agreed with UXD leadership:

1. **MVP** — multi-tenancy and AI-relevant capabilities on top of the current Provider Admin IA (Overview, Data centers, Models, Organizations, Catalog), plus selected GenAI / tenant-admin AI surfaces brought over from the prior osac-ux iteration.
2. **Visionary** — forward-looking fleet / geo experience informed by Karim’s ACM-based demo and related prior art (Miro inventory), for customer and Field conversations.

Use the same UI patterns across a **scope continuum** (single cluster → mid-scope multi-cluster/org slice → full platform), filtered by permissions—not separate product shells.

## Porting from the prior AI vision prototype (osac-ux)

Port in **small batches** with review between batches. Adopt this repo’s shell, nav, and role patterns; do not drop in an entire parallel IA.

| Status | Area |
|--------|------|
| **Permanent hold** | Workbenches, Pipelines |
| **Next (batched)** | GenAI Studio (asset endpoints, API keys, playground), AI Models, tenant admin AI settings (MaaS governance, catalog settings, admin API keys) |
| **Gap — never built** | Usage / observability (call out explicitly; not covered by prior osac-ux work) |
| **Needs design decision first** | AI Models vs existing **Services → Models** in this repo (today reuses the instances table / MaaS slot). Resolve replace vs extend vs separate before porting. |

## Local design notes

Detailed notes live in gitignored `design/` on designer machines (Provider Admin overview, Nvidia graphical notes, substrate gap analysis and batch plan). Prior-art inventory is in Miro (link from the Jira issue).
