# Model catalog item creation — working brief

**Status:** Discovery draft  
**Updated:** 2026-09-25  
**Scope:** Provider/admin authoring of a curated model catalog item. The tenant deployment journey is a connected follow-up.

## Goal

Define how an OSAC administrator authors a model offering from `LLMInferenceService` capabilities. The administrator may pin a model or leave an approved model choice open to the person deploying it. The flow should make clear which choices are fixed, which the deploying user may make, and which values OSAC manages. For the MVP, service access is through MaaS subscriptions; Project access for the tenant team is a future enhancement. A tenant deployment from the offering should have a clear path to the resulting model instance on the Services page.

This brief is for agreeing on the problem, field inventory, and policy model before changing the UI.

## Working problem framing

The current RHOAI model-serving configuration may expose more settings than a catalog administrator should need to present to tenants. The feedback reviewed so far points to a long flow that mixes model source, compute, inference setup, and access without checkpoints. Those findings describe the tenant deployment wizard; their application to admin catalog authoring still needs to be tested. The option crosswalk also needs review against the user's `maas-odh-pages` reconstruction before it can be treated as a complete inventory.

This framing remains a hypothesis about OSAC authoring. The user feedback and a local RHOAI reconstruction are available; we still need to confirm the intended source snapshot and distinguish observed controls from OSAC requirements.

## Evidence reviewed and design implications

### OSAC resource creation guidance

The [Slack discussion on resource creation UX](https://redhat-internal.slack.com/archives/C0B8GS1E8BS/p1789371064311349) proposes a shared full-page wizard pattern:

1. **General:** tenant first for provider-admin resources (with a global option where applicable), then project only for project-scoped resources, then name, description, and potentially labels. Scope selectors come before name because they affect name validation. Tenant selection should use a searchable dropdown as the number of tenants grows.
2. **Configuration.**
3. **Optional resource-specific configuration steps.**
4. **Review.**

The discussion does not fully resolve when resource creation should be a wizard versus a single page. One comment states that normal resource creation should use a separate page, with in-context creation when needed to create a missing dependency; the thread ends with a request for clarification about whether “separate page” means a wizard or a single-page form. Treat the shared wizard pattern as a proposal and confirm this distinction before choosing the catalog authoring shell.

### RHOAI Deploy Model feedback summary

The [MaaS setup and consumption feedback summary](https://docs.google.com/document/d/1x8m1qXly5K0Md7IR-wBTR0LP50pTyNIP2yO3yKvprn4/edit?tab=t.0#heading=h.wj6kjit3d0hr) and the [full transcript tab](https://docs.google.com/document/d/1xR6CG0VKWtiSiJsNQ5SUyxGFeiByXO2kDgbPVmHmxcw/edit?tab=t.8glb3ifuffd7) identify Alex Groom's task-oriented direction for the Deploy Model wizard: organize around what to run, where to run it, required resources/performance and cost, and who should have access.

In the transcript, Groom describes an incremental path: first get a simple model running and verify it, then add complexity such as llm-d, and then widen access (for example, project users or MaaS subscribers). He criticizes combining model source/download, compute planning, inference setup, and access in one long flow with no checkpoints; users have to finish every step before they can test or debug. He frames access as “who can see my model now I've got my model running?” He also says the wizard should orient around the user's task rather than a sequence of feature checkboxes.

The summary also records that separating inference setup from endpoint access improved clarity, while choices made earlier could silently disable access options later. Participants criticized putting important decisions in “Advanced settings” when their placement was still unresolved.

The notes also suggest decoupling “get the model running and test it” from MaaS access and governance. That is recorded as future/out-of-scope feedback in the source, so this brief treats it as a design consideration rather than a committed requirement. This feedback concerns the tenant deployment journey; confirm how much of it should shape administrator catalog authoring rather than assuming both flows have the same steps.

## Users and journeys

### Primary journey: administrator creates an offering

An administrator defines the offering, its defaults, and which choices remain open to the deploying user. This includes deciding whether the item pins a model or offers a bounded choice of approved models. The administrator reviews and publishes the offering. For the MVP, the deployed service can be made available through MaaS subscriptions; access by members of the tenant's Project is a future enhancement. Here, “service access” means access to the running model, separate from which catalog items a tenant can discover.

### Role and permissions model to resolve

Keep the model open-ended while the role model is being defined:

- A provider admin may set some offering values and leave other approved choices to a tenant admin or deploying user.
- A tenant admin might create catalog items, use only provider-admin items, or customize provider offerings while narrowing the choices available to tenant users.
- Some organizations delegate model deployment to SME or MLOps specialists without giving them administration rights, such as managing access to deployed models. The future role model should allow provider or tenant admins to delegate deployment while retaining control of MaaS subscriptions.

The primary author and the boundary between authoring, deploying, and managing subscriptions remain open decisions.

### Connected journey: tenant deploys an offering

A tenant finds the item in Catalog, supplies any allowed values, deploys it, and can then find and manage the resulting model instance in Services. This is a related journey and a traceability requirement; the first design pass focuses on administrator authoring.

## Existing patterns to reuse and assess

The BMaaS prototype's provider catalog wizard currently follows this sequence, with steps conditionally shown by service:

1. Service
2. Template
3. Name and description
4. Hardware and OS
5. Node topology (cluster only)
6. Lock fields (when the template has lockable parameters)
7. Visibility
8. Review

The current cluster and bare metal patterns distinguish the administrator's chosen default from the tenant's ability to change it at provisioning. Cluster version and node topology have separate policies; bare metal hardware and OS share a lock/edit policy. A generic field-policy step also supports locked values and tenant-configured values with a displayed default.

These are useful precedents, not yet confirmed OSAC-wide rules. Slack guidance should determine which parts are standards and which are specific to those services.

The OSAC catalog wizard includes a Models service, but its modeled choices are still generic hardware flavor, OS image, and template parameters. It does not yet express an `LLMInferenceService`-specific field inventory.

### Deploy Model properties and wizard steps

The prototype has a starting point for model catalog metadata in [`src/vision/modelCatalogSeed.ts`](../src/vision/modelCatalogSeed.ts). Its `properties` lists displayable model catalog properties and marks each `locked` or `editable`. The current examples include Serving engine, CPU, RAM, GPU, Max context, and Target latency. [`src/catalog/catalogSpecs.ts`](../src/catalog/catalogSpecs.ts) converts those properties into display rows, which [`ModelServingPresetDetailsBody.tsx`](../src/components/catalog/ModelServingPresetDetailsBody.tsx) renders. This is a partial display-property model, not the model-choice filtering control.

The model-choice filtering precedent is [`ModelCatalogSettingsPage.tsx`](../src/pages/tenant-admin/ai/model-catalog-settings/ModelCatalogSettingsPage.tsx): it displays whether a source contributes **All models** or **Filtered** models. Its [`types.ts`](../src/pages/tenant-admin/ai/model-catalog-settings/types.ts) defines `allowedOrganization`, `includedModels`, and `excludedModels`; the [`mocks.ts`](../src/pages/tenant-admin/ai/model-catalog-settings/mocks.ts) includes an example for the `meta-llama` organization with `Llama*` included. This is source-level model catalog filtering; it is related precedent, not a definition of model-choice policy on an OSAC catalog item.

For a catalog item, the admin should be able to set model-choice policy to: **one or more specified models**, **any model in the configured catalog**, or **open choice for the user**, including BYOM. These are proposed catalog-item options for this effort. Clarify whether “the configured catalog” means all models from selected sources, and how model location and credentials are handled for each option.

Earlier model-selection design is recorded in [`.artifacts/ai-grid-model-fleet/model-list-inventory.md`](../.artifacts/ai-grid-model-fleet/model-list-inventory.md), Decision 2, §§2.1, 2.4, and 2.5. It distinguishes a predefined catalog model, whose location comes with the model, from BYOM, where the user selects or creates a Connection. It explicitly withdraws the generic per-property lock/list/user-provided matrix and does not define the three catalog-item policies proposed above. Treat the three policies as a new requirement to reconcile with that prior design, not as behavior already specified there.

For catalog creation, the sequence begins with the shared **General** step, followed by **Visibility**, then **Cluster availability**. The provider admin needs to select the Tenant in Visibility before limiting the catalog item to clusters available to that Tenant. General is common to catalog items; the table names the step but does not map its fields. Proposed model-specific step names are labeled. Rows remain at the property-family level; repeated **Configure** entries represent different families shown in that step.

The property-family labels and descriptions are retained; rows are sequenced to show the wizard flow.

| Deploy Model properties | Catalog wizard step | Service wizard step |
|---|---|---|
| *Who should access it?* |  |  |
|  | **General** |  |
|  | **Visibility** *(after General)* — select the Tenant before limiting the catalog item to clusters available to that Tenant. |  |
| **(2) Model identity** — `(2.2)` Project or namespace, deployment name, and description. |  | **General** — project or namespace, deployment name, and description. |
| *Where do you want to run it?* |  |  |
| **(x) Cluster** | **Cluster availability** *(proposed; after Visibility)*. Lockable: eligible cluster selection or set, if the offering constrains placement. | **Cluster availability** *(proposed; before Configure)* — select the cluster before displaying its available resources. |
| *What do you want to run?* |  |  |
| **(1) Model Source and credentials** | **Model source** *(proposed)*. The admin sets the choice policy: one or more specified models, any model in the configured catalog, or open choice for the user (including BYOM). | **Configure** — use the fixed model(s), choose from the configured catalog, or provide a model source when BYOM is allowed. |
| **(3) Serving Method and runtime** — `(2.1)` Model type and model format come before `(3.1)`. | **Serving configuration** *(proposed)*. Lockable: model type/format, serving method, and runtime. | **Configure** — model and runtime options allowed by the catalog item. |
| *What resources and performance?* |  |  |
| **(4) Base compute and capacity** | **Resources** *(proposed; section: Compute; follows the Hardware pattern)*. Lockable: CPU, RAM, GPU, and capacity choices, as supported. | **Configure** — section: **Compute**; show options supported by the selected cluster. |
| **(5) llm-d topology and routing** | **Resources** *(proposed; section: Node topology)*. Lockable: topology and routing choices, as supported. | **Configure** — section: **Node topology**; show options compatible with the selected cluster and runtime. |
| **(6) Runtime customization** | **Resources** *(proposed; section: Runtime customization)*. Lockable: supported runtime arguments and environment settings. | **Configure** — section: **Runtime customization**; expose only settings allowed by the catalog item. |
| **(8) Lifecycle** | **Resources** *(proposed; section: Lifecycle)*. Lockable: deployment strategy, if included in the offering. | **Configure** — section: **Lifecycle**; deployment strategy, if it is a launch-time choice. |
| *(No properties assigned yet)* | **Hidden / not editable** — a catalog display category for properties omitted from provider catalog-item creation. No model properties are assigned to it yet; deciding whether any belong here remains open. |  |

Alex's orange groups map to the numbered property families as follows, in the order shown in the image:


- Who should access it?
  - (2) Model identity
- What do you want to run?
  - (1) Model source and credentials
  - (3) Serving method and runtime
- Where do you want to run it?
  - (x) Cluster
- What resources and performance?
  - (4) Base compute and capacity
  - (5) llm-d topology and routing
  - (6) Runtime customization
  - (8) Lifecycle

Model location and credential handling depend on the choice policy. The earlier design says a predefined RHOAI catalog model supplies its location without a Connections step; BYOM uses a Connection selected or created by the user. It does not settle credential ownership for the catalog-item options proposed here. RHOAI uses Connections; OSAC appears to use Secrets, but the intended Secret creation/reference flow and credential ownership need confirmation.

**Follow-up:** Capture the request to view YAML and specify YAML. Decide which YAML can be viewed or authored in catalog creation and at service launch, and how that relates to the guided properties and their lock policies.

For the MVP, service access is through MaaS subscriptions; Project access is a future enhancement. The service wizard must place **Cluster availability** before **Configure** because the selected cluster determines which hardware options are available. The current Models launch path has no Cluster step, so selecting a cluster before showing its available resource choices is a proposed addition. Review and Provisioning remain service-specific completion steps outside these orange groups.

### RHOAI deployment flow reference

The user-identified reconstruction is on the separate RHOAI branch [`maas-odh-pages`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/tree/maas-odh-pages), at commit `54fe9ffcb907fb1862838542f7e4d9a80856b7d7` (2026-09-25, “Add ODH deploy model wizard flow”). The relevant files are [`DeployModelWizard.tsx`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIHub/Deployments/DeployModelWizard.tsx), [`yamlSync.ts`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIAssets/Deployments/utils/yamlSync.ts), [`LlmdDeploymentComposableConfigStep.tsx`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIHub/Deployments/components/LlmdDeploymentComposableConfigStep.tsx), and [`llmdTemplates.ts`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIAssets/Deployments/utils/llmdTemplates.ts). This is distinct from `ux-debt-stakeholder-review`, which was incorrectly cited in the previous draft as the wizard reconstruction. I rechecked the source controls below against `maas-odh-pages`; the local branch is identified, but its latest upstream status has not been independently verified.

The wizard's conditional path is **Preconfigure deployment** (when there is no project context and validated configurations are available), **Model details**, **Model deployment**, **Advanced settings**, then **Review**. Current settings represented in the form include:

- Model location and credentials: URI, existing connection, OCI registry, S3, cluster storage, or NVIDIA NIM catalog; connection creation and source credentials vary by location.
- Deployment identity and method: project, deployment name, description, standard LLM inference service, LLM inference service with llm-d, or legacy deployment.
- Serving and compute: hardware profile, model format where applicable, automatic/manual/catalog runtime selection, replica count, and storage choices for NIM.
- Composable llm-d: topology pattern, administrator-defined topology configuration, accelerator configuration, routing configuration, and—when disaggregated—decode/prefill replicas. Some parallelism fields are also present in the wizard model.
- Advanced controls: model availability, external route, runtime arguments, environment variables, and rolling-update vs recreate strategy. Some controls are conditionally shown or commented out in this local reconstruction.

These are observed controls, not a recommendation to expose them in the OSAC catalog. The authoring inventory should determine which become fixed offering values, bounded tenant choices, platform-managed values, or unsupported controls.

### Field-level source crosswalk (first pass)

The local wizard model and YAML composition code make the downstream field families more concrete. This is a traceability inventory, not a decision to offer these controls in OSAC. Sources: [`WizardData` and YAML generation](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIAssets/Deployments/utils/yamlSync.ts), [`DeployModelWizard.tsx`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIHub/Deployments/DeployModelWizard.tsx), [composable llm-d settings](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIHub/Deployments/components/LlmdDeploymentComposableConfigStep.tsx), and [llm-d topology definitions](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIAssets/Deployments/utils/llmdTemplates.ts). This is the local `maas-odh-pages` snapshot, not a claim that it is the latest upstream RHOAI revision.

1. **Model source and credentials**
   1. Model location: URI, existing connection, OCI-compliant registry, S3 object storage, cluster storage, or NVIDIA NIM catalog.
   2. Location-specific values: URI or model path; connection; registry URI, OCI host, and credentials file; access type and secret details; access key and secret key; endpoint, region, and bucket; cluster-storage name.
   3. Create-connection controls: connection name and description.
   4. NVIDIA NIM storage choices: ephemeral storage, deploy from existing storage, create new cluster storage, or select existing cluster storage; storage size and storage class where applicable.
   5. **OSAC questions to resolve**
      1. Does an offering pin one source, or can the deploying user choose from approved sources?
      2. Which credentials are administrator-managed references, and which source details can a tenant provide?
      3. Is storage selection part of the offering or a deployment-time choice?

2. **Project and deployment metadata**
   1. `(2.2)` Project or namespace, deployment name, and description.
   2. **OSAC questions to resolve**
      1. Which values describe the catalog offering, and which describe the deployed instance?
      2. Which values are assigned or derived by OSAC?

3. **Serving method and runtime**
   1. `(2.1)` Model type and model format.
   2. `(3.1)` Deployment method: standard LLM inference service, LLM inference service with llm-d, or legacy deployment.
   3. Runtime selection: automatic, manual, or catalog runtime where available; selected serving runtime.
   4. **OSAC questions to resolve**
      1. Does the administrator select a supported preset or compose a serving configuration?
      2. Can the deploying user choose the method or runtime, or are those fixed by the offering?

4. **Base compute and capacity**
   1. Hardware profile.
   2. Number of replicas.
   3. **OSAC questions to resolve**
      1. Are these fixed, tenant-configurable with a default, or bounded by the offering?
      2. How should choices be checked against available capacity?

5. **llm-d topology and routing**
   1. Composable topology pattern and topology configuration.
   2. Accelerator configuration.
   3. Advanced-routing toggle and routing configuration.
   4. The data model also contains flat-flow settings for deployment pattern, prefill/decode disaggregation, prefill replicas/profile/runtime, distributed nodes, and tensor/data parallelism. The current UI selects the composable flow.
   5. **OSAC questions to resolve**
      1. Which supported topologies belong in a catalog offering?
      2. Which settings are derived from the selected topology, and which may be tenant choices?

6. **Runtime customization**
   1. Optional runtime arguments and environment-variable rows.
   2. Model-specific options such as tool calling, low latency, or high throughput when enabled in the wizard path.
   3. **OSAC questions to resolve**
      1. Are these supported catalog inputs, administrator-only configuration, or unsupported?
      2. How are secrets distinguished from ordinary environment variables?

7. **Access and publication**
   1. Publish as an AI asset endpoint or as MaaS.
   2. Model availability, global/project availability, selected or custom tiers, and gateway selection.
   3. External route and token-authentication controls.
   4. **OSAC questions to resolve**
      1. Which controls affect running-service access, and which affect catalog discoverability?
      2. Which controls are part of the MaaS MVP, and which are future enhancements such as Project access?
      3. Which access decisions should happen after the model is deployed and tested?

8. **Lifecycle**
   1. Deployment strategy: rolling update or recreate.
   2. **OSAC question to resolve**
      1. Is lifecycle strategy administrator-set, tenant-configurable, or OSAC-managed?

The OSAC prototype already has two policy vocabularies: catalog field policies use **Locked / Unlocked** (with “Unlocked” meaning the tenant configures a displayed default); VM catalog settings use **Fixed / Editable**. The categories above are a proposed analysis scheme, not yet a confirmed OSAC standard. The next pass should recommend one vocabulary and explicitly map it to both existing patterns before applying it to models.

## Provisional OSAC option categories

Use these categories to organize the inventory. Confirm names and meanings against the team's OSAC guidance before treating them as standards.

| Category | Meaning in the catalog flow | Example question |
|---|---|---|
| **Administrator set** | Chosen and maintained by the administrator; not offered as a tenant choice | Which model and serving runtime does this item represent? |
| **Tenant configurable** | Tenant may provide or select a value during deployment, within administrator-defined bounds | Can a tenant choose replica count or accelerator size? |
| **Locked offering default** | Administrator supplies a visible value that remains fixed for the tenant | Is the model version fixed for consistency or supportability? |
| **OSAC managed** | Derived, inherited, or controlled by the platform and not directly edited in this flow | Is the serving namespace or generated resource name system-assigned? |
| **Out of scope / unsupported** | Not configurable through this catalog experience; omit or explain it | Which advanced Kubernetes fields should stay out of the supported offering? |

The terms “locked,” “editable,” “default,” and “OSAC managed” need consistent definitions across the authoring flow, the tenant launch flow, and the resulting Services details.

## Candidate option inventory to reconcile with the source configuration

This is a field-family checklist, not a proposal to expose every field. The crosswalk below records controls observed in the local reconstruction; exact defaults, dependencies, validation, and lockability still need confirmation against the intended RHOAI source snapshot and OSAC responsibilities.

| Field family | Candidate information to inspect | Likely catalog decision |
|---|---|---|
| Offering identity | Display name, description, catalog category, model name and version | Which values identify the offering, and which are tenant-visible? |
| Model source | Model format, source or storage reference, revision, credentials or pull secrets | Which source details are admin-only, secret-backed, or fixed? |
| Serving runtime | Serving runtime/framework, protocol, `LLMInferenceService` template/configuration | Does the admin choose from supported presets or author low-level settings? |
| Compute requirements | CPU, memory, accelerator type/count, node placement and scheduling constraints | Which are fixed by the offering, tenant-selectable, or derived from capacity? |
| Capacity and scaling | Replicas, min/max replicas, autoscaling behavior, scale-to-zero, concurrency or queue limits | Which controls can tenants safely adjust, and what bounds apply? |
| Access and networking | Internal/external access, route or endpoint behavior, authentication and network policy | What does OSAC provide by default, and what can an admin or tenant change? |
| Storage and credentials | Persistent/cache storage, secret references, model registry access | How are sensitive values referenced without exposing them in the catalog? |
| Lifecycle and operations | Update strategy, readiness, health/metrics, rollout and failure behavior | What should be preset, surfaced as status, or excluded from tenant configuration? |
| Commercial and availability | Visibility, eligible organizations/tenants, price/rate card, publish state | Which existing catalog controls apply to model offerings? |

For each real field discovered in the source, record: source path/property, plain-language label, purpose, default, category, who may edit it, allowed values or bounds, dependencies, validation, and where it appears after deployment.

## Provisional OSAC catalog item creation outline

This discussion outline applies the shared OSAC resource-creation proposal to model catalog authoring. It is provisional; it does not make the admin authoring steps identical to the tenant deployment wizard.

1. **General** — define the catalog offering and who can discover it.
   1. Catalog scope or eligible organizations/tenants, if supported for this item.
   2. Offering name and description.
   3. Labels or other metadata, if included in the OSAC standard.
   4. Keep catalog discoverability separate from access to the deployed model service.

2. **Model configuration** — define the model choice and serving baseline.
   1. Model policy: pin one model/source or allow the deploying user to choose from an approved set.
   2. Model identity, format, source, and revision as required by that policy.
   3. Serving method and runtime, either selected as a preset or assembled from supported settings.
   4. Administrator-managed connection and credential references; never expose secret values in the catalog item.

3. **Performance and deployment shape** — define the supported compute profile and serving topology.
   1. Hardware profile and accelerator options.
   2. Topology and routing configuration, shown when applicable to the selected serving method.
   3. Replica and scaling defaults, plus tenant-editable bounds where allowed.
   4. Dependencies between model choice, hardware, topology, and capacity.

4. **Service access** — define access to the deployed model.
   1. **MVP:** MaaS subscription access and its required gateway/subscription policy.
   2. **Future enhancement:** access for members of the tenant's Project; do not treat this as an MVP option.
   3. Keep service access distinct from the catalog scope set in General.

5. **Review** — confirm the offering before it is created or published.
   1. Offering identity, catalog scope, and publication state.
   2. Pinned model or approved tenant choices, with fixed values and editable defaults/bounds clearly identified.
   3. Serving, compute, and MaaS access summary.
   4. Expected tenant deployment and resulting model instance on Services.

The **fixed vs tenant-configurable policy should be decided alongside each setting**, so “Advanced settings” does not become a holding area for unsettled choices. Review should make the result visible, including which values are fixed by the item and which are configurable at tenant launch.

### First-pass ownership inventory

The source wizard exposes the field families below. This table records where they might belong in catalog authoring; it deliberately leaves policy undecided until the admin/tenant boundary and OSAC-specific rules are agreed.

| RHOAI field family | Current example controls | Candidate authoring location | Policy status |
|---|---|---|---|
| Source and identity | Model location, URI/connection, registry or storage path, model type/format, name and description | Model configuration; offering metadata in General | Decide what is embedded in the offering; secret values must not become tenant-visible catalog data |
| Serving method/runtime | Standard LLM inference service, llm-d, legacy; automatic/manual/catalog runtime | Model configuration | Decide what the administrator chooses and whether any method can be tenant-selectable |
| Compute and topology | Hardware profile, accelerator configuration, topology type/configuration | Performance and deployment shape | Decide fixed profile vs bounded tenant choice; tie choices to compatible hardware |
| Capacity | Replica count; decode/prefill replicas and parallelism for applicable llm-d patterns | Performance and deployment shape | Decide tenant bounds and whether advanced topologies are supported in the catalog |
| Access and availability | Project/MaaS audience, subscription/gateway, GenAI Studio, external route | Availability policy | Keep distinct from “get the model running”; decide whether policy belongs to catalog creation or a later sharing step |
| Runtime customization and lifecycle | Runtime arguments, environment variables, deployment strategy, custom YAML/unmapped fields | Conditional service-specific configuration or out of scope | Decide explicitly; do not hide critical decisions in an undefined Advanced step |

For now, each row's owner remains **unresolved** among administrator-set/locked, tenant-configurable (with bounds), OSAC-managed, or unsupported. The next review should assign a policy only where the RHOAI setting and OSAC responsibility are both understood.

## Initial success criteria

Treat these as working criteria until the evidence review sharpens them:

- An administrator can create a comprehensible model offering without translating every low-level serving setting into a tenant-facing control.
- Each included choice has an explicit owner and policy: administrator set, tenant configurable, locked default, or OSAC managed.
- Tenant-configurable values have understandable defaults and any necessary limits; locked values are visibly explained.
- The published item communicates what the tenant is deploying and what they can change.
- The deployment flow can connect the catalog item to the created model instance and its Services details.

## Evidence and inputs

- **Slack guidance:** [Wizard flow discussion](https://redhat-internal.slack.com/archives/C0B8GS1E8BS/p1789371064311349), reviewed. Shared General → Configuration → optional resource-specific steps → Review is proposed; page vs. wizard distinction remains unresolved.
- **RHOAI source configuration:** Local reference supplied and reviewed as described above. Its current local commit is recorded; whether it matches the latest intended upstream flow remains to be verified.
- **Recent user feedback:** [MaaS setup and consumption summary](https://docs.google.com/document/d/1x8m1qXly5K0Md7IR-wBTR0LP50pTyNIP2yO3yKvprn4/edit?tab=t.0#heading=h.wj6kjit3d0hr) and Alex Groom's [full transcript](https://docs.google.com/document/d/1xR6CG0VKWtiSiJsNQ5SUyxGFeiByXO2kDgbPVmHmxcw/edit?tab=t.8glb3ifuffd7) reviewed.
- **Ethan's OSAC prototype:** The configured `upstream` remote is [heyethankim/osac-bmaas](https://github.com/heyethankim/osac-bmaas). On 2026-09-25, `upstream/main` was fetched successfully at `667f310e37b00126dcd591cd5c7afad5e43f8587` (“fix: nest instance type specs in catalog grid and list”). The latest wizard source, `templateDemo.ts`, and `provider-admin.css` were reviewed. The shared Service, General, and Visibility treatments and the Bare Metal Hardware selectable-card pattern are reflected in the model-flow preview. The upstream branch was not merged wholesale into this working branch; the current prototype changes remain local.
- **Current prototype:** [`ProviderSetupPublishCatalogWizard.tsx`](../src/pages/provider-setup/ProviderSetupPublishCatalogWizard.tsx), [`templateDemo.ts`](../src/providerSetup/templateDemo.ts), and [`catalogPublishConfig.ts`](../src/catalog/catalogPublishConfig.ts).
- **Vision typing playbook:** The original [GitLab repository](https://gitlab.cee.redhat.com/ccopelan/ux-visiontype-playbook) is the source of truth. I checked its `main` branch in the signed-in browser: latest commit `1988d9899f483f6f402fffe383dfdad5116ec7c6` (2026-08-14), matching the local checkout's `HEAD`. This brief uses its Phase 1 structure. The local checkout also has uncommitted evaluation notes dated 2026-08-25; treat those as supplemental designer feedback, not as upstream playbook changes.

## Vision type playbook use and artifact log

This log records which playbook guidance is being used, what it produces for this effort, and where the work changes the playbook's expected artifacts. The playbook's target is an interactive vision prototype; this project remains in discovery, with an initial local model catalog and service-launch preview now in progress.

| Phase / playbook output | How it is being applied here | Artifact / status | Adaptation from the playbook |
|---|---|---|---|
| **Phase 1: Vision Brief** — evidence-based problem, target user, capabilities, scope, stakeholders, and product integration | Use the brief to define the catalog-authoring problem before choosing screens; record the connected tenant deployment and Services outcome. | This working brief: [`model-catalog-item-creation-brief.md`](model-catalog-item-creation-brief.md). In progress; not yet a complete playbook Vision Brief. | **Significant refactor:** organized around OSAC catalog policy and model-configuration ownership, rather than the playbook's rhoai-3.6 feature-area/branch/flag template. It includes an option crosswalk and role/permission model, and distinguishes MVP MaaS access from future Project access. A specific 6–12 month horizon, capability-readiness status, and presentation stakeholders are not yet defined. |
| **Phase 2: Vision Narrative** — named user and step-by-step future journey | Not started. Before deciding whether to write a narrative, use the OSAC adaptation notes from the playbook evaluation: each beat should name its primary actor and object; the journey may relay work across Provider Admin, Tenant Admin, and a deployment specialist. | No Phase 2 artifact yet. | **Planned significant refactor:** start with an actor/action/object/screen build sheet, keep story color optional, and allow multiple actors when jobs and permissions change. This follows Jenn's 2026-08-25 local playbook feedback in `evaluation/runs/jgiardino-2026-08-25/phase-2-narrative-feedback.md`; those notes are supplemental, not upstream playbook content. |
| **Phase 3: Vision Prototype** — interactive, shareable end-to-end prototype | Started after the property map and step order were reviewed. The local preview demonstrates provider catalog authoring and tenant launch through the initial Configure/Review/Provisioning path. | [`ModelCatalogItemWizardPreview.tsx`](../src/pages/provider-admin/vision/ModelCatalogItemWizardPreview.tsx) and [`ModelServiceLaunchWizardPreview.tsx`](../src/pages/provider-admin/vision/ModelServiceLaunchWizardPreview.tsx), exposed in the local-only Vision Patterns page. Build passes; this is illustrative and does not create a live catalog item or model instance. | **Significant adaptation:** follows the existing `osac-bmaas` prototype shell and Ethan's latest selectable-card and wizard patterns rather than the playbook's RHOAI feature-flag integration checklist. The flow also includes catalog policy and cluster-availability decisions, and traces the launched instance to Services without implementing backend provisioning. |

The Phase 1 playbook template also recommends a Value Proposition Canvas workshop. It has not been run; existing interview feedback and prototype evidence are being used first, with assumptions marked where the evidence is incomplete.

## Decisions to make after reviewing the inputs

1. Which administrator role creates and publishes model catalog items?
2. Does the admin select an existing `LLMInferenceService` configuration, choose a supported preset, or assemble a configuration from supported fields?
3. Which configuration fields are supported in OSAC, and which are intentionally hidden or unsupported?
4. For each supported field, who owns the value: administrator, tenant, or platform? What is the default and what bounds apply?
5. Which fields are independent, and which should be grouped because one choice changes the available options for another?
6. How should an offering be scoped to tenants or organizations, and which existing visibility and pricing rules carry over?
7. What must appear on the Catalog item, during deployment, and on the created model instance in Services?
8. What specific user feedback should the revised flow address, and how will we tell whether the design addresses it?

## Recommended next steps

1. After the current review, recheck the source crosswalk against RHOAI branch `maas-odh-pages` and identify whether that is the intended wizard snapshot.
2. Review the fetched Ethan prototype for any additional relevant catalog, role, and deployment patterns beyond the Service, General, Visibility, and Hardware selections already matched in the model-flow preview.
3. Compare each model setting with the existing cluster, bare metal, and VM policy controls. Recommend one OSAC vocabulary for fixed/locked values, tenant-editable defaults, and platform-managed values.
4. Mark each candidate setting **admin-set, tenant-configurable, OSAC-managed, or unsupported**, recording defaults, bounds, dependencies, validation, and where the deployed value appears in Services. Leave uncertain items explicitly unresolved.
5. Resolve the authoring role and whether the model is pinned or selected from approved options. Keep MVP MaaS subscription access distinct from future Project access.
6. With that inventory and policy map reviewed, define the interaction sequence and sketch the admin flow. Then trace one catalog item through tenant deployment to its Services entry before building the UI.

## Open questions

- Should the catalog authoring experience use the shared resource wizard, and how does the team distinguish a full-page wizard from a single-page resource form?
- Is `maas-odh-pages` the intended RHOAI wizard snapshot, and are there newer changes to use?
- How much of Alex Groom's tenant deployment recommendation should carry into administrator catalog authoring?
- Does the first prototype pass need to show only administrator authoring, or also enough of tenant deployment and Services to demonstrate the end-to-end connection?
