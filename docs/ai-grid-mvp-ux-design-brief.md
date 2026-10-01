# AI Grid and model deployments — MVP UX design brief

**Status:** Working design brief
**Updated:** 2026-09-30
**Purpose:** Flesh out the provider and tenant experience around model discovery, geo-based deployment, and service access while keeping stretch concepts visible in the prototype.

## Product framing

The UX needs to hold two useful lenses at once: the customer-specific MVP and the fuller experience Engineering is using to reason about the platform. Keep a capability in the prototype when its release scope is uncertain; label its maturity and dependencies instead of removing it. This brief distinguishes:

- **PM-aligned direction** — explicitly reflected in the product feedback shared for this brief.
- **MVP story** — traceable to one of the original MVP user stories, but not necessarily a confirmed release commitment.
- **Engineering assumption** — a proposed or currently supported implementation path that should shape the UX without silently redefining the product requirement.
- **Stretch / exploration** — retain as an understandable path or view in the prototype; validate before treating it as a delivery commitment.
- **Open decision** — unresolved in the reviewed material and should remain visible until an owner settles it.

The distinction matters most for deployments and routing. The user stories describe coordinated lifecycle operations and configurable routing. The Engineering review leans toward GitOps and ACM for operations, with the UI initially complementing them as a dashboard. The design should show the complete customer outcome and identify which interactions are read-only, GitOps-backed, or still exploratory.

## Direction to carry forward

### Provider Admin → AI → Models

Keep AI Grid within the AI area rather than as a standalone main-navigation item in workspace variants where it appears. Preserve the AI section's existing position in each workspace navigation. Keep AI Grid as a page item in Provider Admin. Hide it from Tenant Admin's Model Deployment MVP navigation while retaining it in other Tenant Admin variants. Do not add it as a tab on Models; Models retains its existing Catalog and Deployments tabs. The Catalog toolbar’s **Manage sources** link is already in place and is recorded as an existing change, not a new task for this brief.

The AI Grid page continues to show fleet and platform readiness. This navigation change does not settle whether its current interactions should become read-only or whether the PM-prioritized read-only geographic deployment view belongs within AI Grid or as a view under Deployments; preserve that as a UX detail to resolve separately.

Other deployment views being explored should remain reachable from Deployments through a clear view selector or an explicitly labeled prototype area. A table/list view and routing-oriented view are useful complements to the geo view; keep them available while their scope is being clarified.

This direction supersedes the earlier navigation proposal in [`ai-grid-provider-admin.md`](./ai-grid-provider-admin.md) that described AI Grid as a separate future-vision route. The geo-based Deployment view is the PM-prioritized read-only view; that does not mean other views or lifecycle concepts need to disappear.

### Neighboring work

Provider and tenant MaaS governance are being developed separately. This brief only defines their connection to deployment: a deployed service may be published and entitled to tenants with quota, policy, and destination constraints. It does not restate or redesign those governance pages.

## Experience model

Keep these concepts distinct in labels, filters, details, and diagrams:

1. **Placement geography:** the sites, regions, and clusters where model capacity is deployed.
2. **Ingress geography:** how a request reaches a regional edge gateway, potentially through DNS, F5, or anycast, and how session affinity is maintained.
3. **Request-time routing:** how the gateway/Grid chooses among eligible, healthy destinations using locality, cost, and live capacity signals.
4. **Tenant destination policy:** which destinations a tenant’s subscription permits the service to use.

These are related but not interchangeable. A deployment map can show where replicas run; it should not imply that every request is routed to the nearest replica or that the tenant is allowed to use every displayed destination.

Also distinguish **desired state** from **observed state**:

- Desired state is the deployment or policy the provider asked ACM/GitOps to apply.
- Observed state is what clusters and Grid/SWIM currently report as running, healthy, and eligible for traffic.
- The UI should expose synchronization, drift, and last-update context so a saved configuration is not mistaken for a healthy service.

## Information architecture and page responsibilities

### AI Grid

Answer: **Is the AI fleet ready to serve?**

Show the platform footprint and readiness across sites and clusters: membership, connectivity or mesh health, platform/version status, capacity synchronization, and high-level available capacity. The Engineering proposal assumes three clusters are provisioned up front; represent their day-zero readiness clearly. Keep the model flexible enough that adding capacity later does not require a new information architecture.

### Deployments

Answer: **What model capacity is deployed where, and what is its current state?**

Make the geo-based view the default/primary read-only view. Pair the map with a table or accessible list so geography is not the only way to inspect deployments. Useful filters include model, geography/site, cluster, tenant or entitlement context where permitted, and deployment health.

For a selected deployment, show at least:

- model and version, deployment identity, and intended geographies;
- target clusters and desired replicas beside observed/ready replicas;
- serving and health state, capacity signals relevant to eligibility, and last synchronization;
- drift or rollout errors with a plain-language explanation;
- route eligibility and effective routing information when available, clearly separated from placement;
- the source of truth for the displayed information (for example, desired GitOps state versus observed cluster/Grid state).

Keep other views (for example, a flat inventory, cluster grouping, and routing-oriented view) accessible in a view selector or labeled exploration area. The geographic view is the priority, not a reason to discard useful alternatives.

### Catalog

Answer: **Which models can the provider select for deployment, and where did they come from?**

Support discovery from Red Hat Model Catalog and connected internal registries, with enough source and validation context to make model selection understandable. Keep source management in the existing toolbar action. Make a catalog model’s availability distinct from whether it is deployed, published as a MaaS offer, or entitled to a tenant.

## Core journeys to flesh out

### 1. Discover and prepare a model

1. Provider Admin opens Catalog and searches models from Red Hat Model Catalog or a connected internal registry.
2. The detail view explains source, supported serving/runtime expectations, and any eligibility or validation state known to the platform.
3. Provider Admin starts deployment with the selected model carried forward, rather than re-entering its identity.

**Design questions:** What validation is available before deployment? How should unavailable, untrusted, or incompatible models be explained? Which model metadata is authoritative versus descriptive?

### 2. Deploy one model to multiple geographies

1. Select model/version and deployment identity.
2. Choose one or more target geographies and the clusters within them. Show cluster readiness and whether the target has enough eligible capacity before submission.
3. Configure serving and resource choices that are supported by each selected cluster. Explain when a choice is shared across targets versus configured per target.
4. Review a deployment plan: targets, replica intent, capacity impact, requirements, and any unavailable destinations.
5. Submit the change and follow progress from requested/accepted through synchronized, scheduled, serving, and healthy. Errors should identify the affected geography/cluster and a next action.
6. Return to Deployments to compare desired and observed state and see when capacity becomes eligible for traffic.

Do not make the geo map the only place to select or understand targets. Include textual region/site names, cluster identities, status, and an accessible list representation.

### 3. Update, roll back, drain, or remove a deployment

The original story asks for coordinated changes and traffic cutover that keep the service available. Preserve that outcome in the prototype even if the first implementation is a read-only dashboard over GitOps operations.

The target interaction should explain the change plan, affected destinations, health gates, traffic transition, completion state, and recovery path. A rollout should make clear when new capacity is healthy and eligible before old capacity is drained. Rollback should identify the target version and report whether traffic has returned. Drain and remove should explain the effect on remaining eligible capacity.

**Open decision:** Which of these operations can a provider initiate in the MVP UI, which are initiated through GitOps, and which are initially observable only? Keep the lifecycle flow represented and label the interaction maturity rather than deleting the path.

### 4. Understand routing without confusing it with placement

The read-only deployment experience may expose routing information as suggested by the PM feedback. Where telemetry/configuration exists, show eligible destinations, health, effective weight or preference, fallback order, and the reason for a recent route or eligibility change. Mark missing information as unavailable rather than inferring it from map proximity.

Keep the longer-term story visible: providers define routing thresholds and fallback order so requests move to eligible capacity when a destination is unhealthy or overloaded. Separate automatic routing signals (locality, cost, queue depth, KV-cache pressure) from provider overrides (for example, weight, preference, or pinning).

**Open decision:** Is the first routing surface an explanation of effective behavior, a viewer of GitOps-managed configuration, or an editor for selected policy? The meeting notes favor Helm/GitOps configuration with minimal installation controls, while the user story describes configurable routing policy.

### 5. Publish service access to a tenant

After deployment, connect to the governance flow to publish a model service and entitle selected tenants with quota, policy, and permitted destinations. Keep service placement, route eligibility, and tenant entitlement visibly distinct. A tenant entitlement should not be inferred just because a model is deployed in a geography.

The provider/tenant governance pages are outside this brief’s detailed screen design; their work should provide the agreed terms and entry points for this handoff.

### 6. Onboard tenant identity and access

The original story includes tenant onboarding, IdP/OIDC integration, SSO groups, and access tiers. The UX should provide a clear setup and validation path for federation, group/claim mapping, and access assignment, with understandable failure and test states.

The ENG proposal assumes Keycloak with one realm per tenant as the tested MVP path; other IdPs and the login experience with multiple federated IdPs need validation. Treat Keycloak as an engineering assumption, not a permanent product limitation. Preserve the intended external IdP journey and label provider support as an open dependency.

**Open decision:** Meeting notes say a specific customer expects tenant admins to deploy models, while the Engineering/PM discussion considered tenant self-service deployment outside the 3.6 MVP. Confirm whether tenant admins can deploy, request a deployment, or only manage users and consume entitled services. Do not encode this unresolved role boundary in navigation or permission copy as settled policy.

## Scope and maturity map

| Capability | Product signal | UX treatment |
|---|---|---|
| Discover models from Red Hat Model Catalog and internal registries | Original MVP story | Make this a clear Catalog-to-deployment entry path. |
| Deploy the same model to multiple clusters and target geographies | Original MVP story; geo view PM-prioritized | Make multi-target planning and geo status central in Deployments. |
| Read-only geo deployment view | Explicit PM priority | Primary deployment view, paired with a table/list. |
| Update, roll back, drain, remove with coordinated traffic cutover | Original MVP story; UI operation boundary unresolved | Preserve the complete lifecycle outcome; label which steps are UI-driven, GitOps-backed, or exploratory. |
| Routing thresholds and fallback order | Original MVP story; notes favor GitOps configuration | Keep a read-only explanation/view and a visible policy-editing exploration until ownership and delivery boundary are settled. |
| Publish service and set tenant quota, policy, destination constraints | Original MVP story; governance UX handled separately | Preserve the deployment-to-entitlement handoff and keep destination policy distinct from placement. |
| Tenant IdP, SSO groups, access tiers | Original MVP story; Keycloak is an ENG assumption | Preserve the end-to-end setup path; mark supported IdPs and multi-IdP login behavior as validation items. |
| Tenant self-service deployment | Customer-specific request conflicts with current ENG/PM MVP assumption | Keep the role path discoverable in the prototype, but mark it as an open decision. |
| BYOM | Meeting notes identify as excluded from MVP due isolation, stability, and chargeback risks | Retain as a clearly labeled later-stage exploration; do not make it look like a validated MVP capability. |
| Dynamic cluster/node growth | Engineering future direction; initial assumption is three provisioned clusters | Show current readiness and leave room for expansion without making dynamic scaling a release promise. |
| OCP 5 support | Identified as a nice-to-have in the proposal | Keep in roadmap/prototype annotations, not as a prerequisite for the MVP journey. |

Use these labels consistently across prototype surfaces: **MVP journey**, **Read-only**, **GitOps-managed**, **Exploration**, and **Open decision**. A feature can be a customer MVP outcome while its UI control remains GitOps-managed; the label should describe that distinction.

## UX requirements and quality checks

- A Provider Admin can tell which models are available, deployed, healthy, and published without treating those as the same state.
- A Provider Admin can understand where capacity is intended to run and where it is actually running.
- The deployment view communicates both geographic scope and exact site/cluster status in text.
- Deployment or lifecycle failures identify their target and whether traffic is affected.
- Routing explanations distinguish configuration, eligibility, and observed traffic behavior.
- Tenant destination constraints are visible wherever provider decisions could otherwise imply tenant access.
- A user can trace the path from model source through deployment to tenant entitlement and inference endpoint.
- The UI never presents a requested GitOps change as completed until observed state confirms it.
- Exploratory capabilities remain accessible but are labeled so prototype breadth is not mistaken for an MVP delivery commitment.

## Working assumptions and dependencies

- Initial demonstration has three clusters provisioned up front; day-zero readiness is in scope, dynamic scaling is a later capability.
- ACM and GitOps distribute model resources; Grid/SWIM reports multi-site capacity and health. The boundary between UI actions and GitOps workflows needs product/engineering agreement.
- Automatic routing considers locality, cost, and live load/capacity signals; provider overrides and the UI surface for them remain unresolved.
- Regional gateways, DNS/F5/anycast, and session affinity can affect request flow independently of model placement.
- Usage and billing/chargeback are adjacent end-to-end concerns. The ENG proposal names token metering and downstream Monetize360 integration, but the exact user-facing usage scope needs a separate decision.

## Decisions to resolve next

1. **Deployment actor and access model:** provider admin, tenant admin, or both; especially resolve the customer request for tenant-admin deployment.
2. **GitOps/UI boundary:** which lifecycle operations are initiated in the UI, which are GitOps-only, and what status/approval loop is visible.
3. **Routing UX:** read-only effective-state explanation, GitOps configuration viewer, policy editor, or staged progression through these.
4. **Geography model:** canonical terms and hierarchy for geography, site, cluster, and regional gateway.
5. **Rollout safety contract:** health/capacity gates, traffic cutover semantics, and rollback completion criteria.
6. **Identity support:** first supported federation path, group/claim mapping, multiple IdP sign-in behavior, and setup validation.
7. **Model readiness metadata:** source trust, model compatibility, and the pre-deployment validation providers can rely on.

## Reference material

- [ENG proposal: AI Grid Personas and Flow](https://docs.google.com/document/d/1GH2EeQ5T0M9iqIvqErgn_4MG7OX8hqiFnONLGwPKJao/edit?tab=t.0#heading=h.k906vjaz5dnk)
- [Meeting notes: AI Grid provisioning and orchestration RFE review](https://docs.google.com/document/d/1CFab64GLPbZWL77XaM6KzbQdyoPmrbxTd-jcr5an33o/edit?tab=t.1750wfn2obtn)
- Original MVP user stories and PM direction supplied in the accompanying product review discussion.

The meeting notes are Gemini-generated; validate uncertain conclusions and action items with the meeting participants before treating them as decisions.
