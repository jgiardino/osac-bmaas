# Model catalog item creation — working brief

**Status:** Discovery draft  
**Updated:** 2026-09-26
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

A Provider Admin creates or updates one of the existing five model offers, sets its visibility and eligible clusters, configures its model/source and serving defaults, and publishes it. For every model/source/serving/resource/lifecycle choice carried into provisioning, assume the catalog author can leave it **editable at launch or lock it**. Visibility and other catalog-only metadata stay administrator-controlled. This is a working assumption for organizing the fields, not a claim that every RHOAI property should ship. For the MVP, deployed service access is through MaaS subscriptions; Project access for a tenant team is a future enhancement. Catalog visibility (who can discover an offer) stays distinct from service access (who can call a deployed model).

### Role and permissions model

This first journey pass uses the roles shown in the prototype: a **Provider Admin** authors and publishes an offer; a **tenant user** selects and deploys it; OSAC exposes the resulting instance in Services. Whether Tenant Admins can author tenant-scoped offers, and how deployment specialists share subscription-management responsibilities, remain outside this first flow definition.

### Connected journey: tenant deploys an offering

A tenant finds an offer in Catalog, chooses only values its policy leaves open, selects a cluster before seeing cluster-dependent resource choices, reviews and deploys, then finds that model instance in Services. The target outcomes for this first journey pass are the existing **Granite 3B instruct** instances from `llm-instruct` and the **Credit-risk scorer** from `predictive`; no new catalog or service list items are introduced.

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

The existing [`src/vision/modelCatalogSeed.ts`](../src/vision/modelCatalogSeed.ts) is now wired into Ethan's refreshed Catalog cards and details. It provides the five existing model offers and their Serving engine, CPU, RAM, GPU, Max context, and Target latency values marked `locked` or `editable`. Model-choice policy is represented separately so it is not confused with those property locks. The previous interactive UI is preserved at [`public/legacy-prototype/`](../public/legacy-prototype/); its source is in Git history before the Ethan baseline refresh.

The pre-refresh model catalog settings UI displayed whether a source contributed **All models** or **Filtered** models, with organization, included-model, and excluded-model settings. This is source-level model catalog filtering; it is related precedent, not a definition of model-choice policy on an OSAC catalog item. Refer to the labeled previous prototype at [`public/legacy-prototype/`](../public/legacy-prototype/) for that UI; its source is in Git history before the Ethan baseline refresh.

For an existing catalog item, the admin should be able to configure how the model is selected: **one or more specified models**, **any model in the configured catalog**, or **open choice for the user**, including BYOM. BYOM is a configuration of an existing item, not a new catalog item. The current Catalog and Services details now show a first pass of the corresponding properties and choices; refine them as the wizard definitions settle.

Confirmed mappings for the existing items: **predictive** uses BYOM so a data scientist can deploy a model they are developing; predictive models will not be offered from the model catalog. **llm-tool-calling** is limited to one specific model, with its runtime configured in the catalog item so it is ready to launch without further customization. **llm-instruct** offers a predefined set of instruction-appropriate models for the user to choose from at launch. The full-catalog-selection option is also in scope, but which existing item will demonstrate it remains undecided. These mappings define model-selection examples; they do not settle every property or lock policy for each item.

The refreshed Catalog now displays these five existing offers. The three confirmed policies are labeled on their cards and explained in item details; `llm-lightweight-text-gen` and `llm-high-capacity-reasoning` explicitly say their model-choice policy is not defined yet. No example is assigned to the full-catalog option. The refreshed Services list also includes the seven confirmed on-cluster examples from the local model-fleet inventory; it omits the off-platform models, which belong in MaaS governance rather than Services.

Earlier model-selection design is recorded in [`.artifacts/ai-grid-model-fleet/model-list-inventory.md`](../.artifacts/ai-grid-model-fleet/model-list-inventory.md), Decision 2, §§2.1, 2.4, and 2.5. Its earlier BYOM-as-a-separate-row wording is superseded by the mappings above. The live launch flow does not yet collect the source and credentials according to these policies. When someone specifies a model through a Connection, that person supplies its location and credentials: the admin for a fixed Connection-sourced model, or the launcher for BYOM. When a launcher selects a model from a catalog, the model field represents that catalog choice; the source location and credential resolution for catalog entries still need definition. RHOAI uses Connections; OSAC appears to use Secrets, and the Secret creation/reference interaction needs definition.

For catalog creation, the sequence begins with the shared **General** step, followed by **Visibility**, then **Cluster availability**. The provider admin needs to select the Tenant in Visibility before limiting the catalog item to clusters available to that Tenant. General is common to catalog items; the table names the step but does not map its fields. Proposed model-specific step names are labeled. Rows remain at the property-family level; repeated **Configure** entries represent different families shown in that step.

The property-family labels and descriptions are retained; rows are sequenced to show the wizard flow.

| Deploy Model properties                                                                  | Catalog wizard step                                                                                                                                                                                                  | Service wizard step                                                                                                                                                        |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _Who should access it?_                                                                  |                                                                                                                                                                                                                      |                                                                                                                                                                            |
|                                                                                          | **General**                                                                                                                                                                                                          |                                                                                                                                                                            |
|                                                                                          | **Visibility** _(after General)_ — select the Tenant before limiting the catalog item to clusters available to that Tenant.                                                                                          |                                                                                                                                                                            |
| **(2) Model identity** — `(2.2)` Project or namespace, deployment name, and description. |                                                                                                                                                                                                                      | **General** — project or namespace, deployment name, and description.                                                                                                      |
| _Where do you want to run it?_                                                           |                                                                                                                                                                                                                      |                                                                                                                                                                            |
| **(x) Cluster**                                                                          | **Cluster availability** _(proposed; after Visibility)_. Lockable: eligible cluster selection or set.                                                                                                                | **Cluster** _(proposed; before Configure)_ — select the cluster before displaying its available resources.                                                                 |
| _What do you want to run?_                                                               |                                                                                                                                                                                                                      |                                                                                                                                                                            |
| **(1) Model Source and credentials**                                                     | **Model source** _(proposed; lockable)_. Choose one or more specified models, any model in the configured catalog, or BYOM. For specified models, choose the configured model catalog or a Connection as the source. | **Configure** — use fixed model(s), choose from allowed catalog models (up to three inline, with “View options” for more), or provide a model source when BYOM is allowed. |
| **(3) Serving Method and runtime** — `(2.1)` Model type and format come before `(3.1)`.  | **Serving configuration** _(proposed; lockable)_. Model type and model format are not Catalog properties. Configure deployment method `(3.1)` only when Model source allows LLM models only.                         | **Configure** — choose Model type for BYOM; show Model format only for predictive models. Show serving method and runtime choices allowed by the catalog item.             |
| _What resources and performance?_                                                        |                                                                                                                                                                                                                      |                                                                                                                                                                            |
| **(4) Base compute and capacity**                                                        | **Resources** _(proposed; section: Compute; follows the Hardware pattern)_. Lockable: CPU, RAM, GPU, and capacity choices.                                                                                           | **Configure** — section: **Compute**; show options supported by the selected cluster.                                                                                      |
| **(5) llm-d topology and routing**                                                       | **Resources** _(proposed; section: Node topology; lockable)_.                                                                                                                                                        | **Configure** — section: **Node topology**; show options compatible with the selected cluster and runtime.                                                                 |
| **(6) Runtime customization**                                                            | **Resources** _(proposed; section: Runtime customization; lockable)_.                                                                                                                                                | **Configure** — section: **Runtime customization**; expose only settings allowed by the catalog item.                                                                      |
| **(8) Lifecycle**                                                                        | **Resources** _(proposed; section: Lifecycle; lockable)_.                                                                                                                                                            | **Configure** — section: **Lifecycle**; deployment strategy, if it is a launch-time choice.                                                                                |

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

Model location and credential handling depend on how the model is sourced. When the admin fixes a model and chooses **Specify a connection**, the admin supplies the connection type, model path, and Secret. When the service user chooses a model from a configured catalog, they choose the model but do not enter a separate source location or Secret in this flow. For BYOM `predictive`, the launching user supplies a connection type, model path, and Secret. RHOAI uses Connections; OSAC appears to use Secrets, but the intended Secret creation/reference flow still needs definition.

**Follow-up:** Capture the request to view YAML and specify YAML. Decide which YAML can be viewed or authored in catalog creation and at service launch, and how that relates to the guided properties and their lock policies.

For the MVP, service access is through MaaS subscriptions; Project access is a future enhancement. The service wizard must place **Cluster** before **Configure** because the selected cluster determines which hardware options are available. The current Models launch path has no Cluster step, so selecting a cluster before showing its available resource choices is a proposed addition. Review and Provisioning remain service-specific completion steps outside these orange groups.

### RHOAI deployment flow reference

The user-identified reconstruction is on the separate RHOAI branch [`maas-odh-pages`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/tree/maas-odh-pages), at commit `54fe9ffcb907fb1862838542f7e4d9a80856b7d7` (2026-09-25, “Add ODH deploy model wizard flow”). The relevant files are [`DeployModelWizard.tsx`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIHub/Deployments/DeployModelWizard.tsx), [`yamlSync.ts`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIAssets/Deployments/utils/yamlSync.ts), [`LlmdDeploymentComposableConfigStep.tsx`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIHub/Deployments/components/LlmdDeploymentComposableConfigStep.tsx), and [`llmdTemplates.ts`](https://gitlab.cee.redhat.com/jgiardin/rhoai/-/blob/maas-odh-pages/src/app/AIAssets/Deployments/utils/llmdTemplates.ts). This is distinct from `ux-debt-stakeholder-review`, which was incorrectly cited in the previous draft as the wizard reconstruction. I rechecked the source controls below against `maas-odh-pages`; the local branch is identified, but its latest upstream status has not been independently verified.

The wizard's conditional path is **Preconfigure deployment** (when there is no project context and validated configurations are available), **Model details**, **Model deployment**, **Advanced settings**, then **Review**. Current settings represented in the form include:

- Model location and credentials: URI, existing connection, OCI registry, S3, cluster storage, or NVIDIA NIM catalog; connection creation and source credentials vary by location.
- Deployment identity and method: project, deployment name, description, standard LLM inference service, LLM inference service with llm-d, or legacy deployment.
- Serving and compute: hardware profile, model format where applicable, automatic/manual/catalog runtime selection, replica count, and storage choices for NIM.
- Composable llm-d: topology pattern, administrator-defined topology configuration, accelerator configuration, routing configuration, and—when disaggregated—decode/prefill replicas. Some parallelism fields are also present in the wizard model.
- Advanced controls: model availability, external route, runtime arguments, environment variables, and rolling-update vs recreate strategy. Some controls are conditionally shown or commented out in this local reconstruction.

These are observed controls, not a recommendation to expose them in the OSAC catalog. The authoring inventory should determine which become fixed offering values, bounded tenant choices, platform-managed values, or unsupported controls.

### First-pass flow and control outline

This is the requested field-to-flow map from the local `maas-odh-pages` snapshot. Field labels below match that wizard. “Current control” names the control used in the reconstructed RHOAI UI; “OSAC proposal” uses Ethan's current Bare Metal/Cluster patterns. In Catalog authoring, show one **Editable at provisioning** / **Locked** choice per section, followed by the RHOAI properties for that section. Model type and model format are service-instance inputs, not Catalog properties. Catalog-only fields such as Visibility remain admin-controlled. Conditions are retained where RHOAI only shows a field for a particular model type, source, deployment method, or topology.

### 1. Catalog item wizard

1. **Service** — select Model.
2. **General** — shared Catalog step; no Deploy Model properties are mapped here.
3. **Visibility** — shared Catalog step; no Deploy Model properties are mapped here.
4. **Cluster availability**
   1. **(x) Cluster — Where do you want to run it? Section header: none**
      1. **Tenant access to clusters**
         1. Current: no cluster-selection property in the RHOAI Deploy Model wizard.
         2. OSAC proposal: use the Bare Metal Hardware lock/edit cards; cluster availability is lockable.
      2. **Tenant cluster selection**
         1. Current: no equivalent tenant-specific cluster availability control in RHOAI.
         2. OSAC proposal: show a “Cluster selection is per tenant.” description, then show each tenant as the label for its eligible cluster cards. Assume clusters are unique to each tenant. Use three cards per row across the content area; a short final row keeps the same card width.
         3. Prototype data note: the current fleet fixture associates clusters with North Summit Bank and BlueSolace; other seeded demo tenants have no cluster cards yet.
5. **Model source**
   1. **(1) Model source and credentials — What do you want to run? Section header: none**
      1. **Tenant access to model selection**
         1. Current: no equivalent Catalog authoring control in maas-odh-pages.
         2. OSAC proposal: provide multi-select cards for **Models from the catalog** (“Tenants can select from an approved list of models”) and **Models from a connection** (“Tenants can specify any location where a model file is stored”). Both are selected by default.
      2. **Model catalog settings**
         1. Current: no equivalent per-tenant model catalog policy control in maas-odh-pages.
         2. OSAC proposal: when catalog access is enabled, show a “Model catalog” section per tenant with a “Model catalog settings are per tenant.” description and tenant name as the setting label. Provide single-select **All models** (“Tenants can select from any model in the catalog”), selected by default, and **Specific models** (“Tenants can only use 1 or more specific models”) as selectable cards matching the **Tenant access to model selection** options. Show a simple text input for the model list when Specific models is selected.
      3. **LLM-only eligibility condition**
         1. Current: model type is a required service-deployment input, not a Catalog control.
         2. OSAC behavior: show Deployment method in Serving configuration only when the allowed model set is restricted to LLMs. The Catalog UI control or data that establishes this condition is not defined; do not add a control yet.
      4. **NVIDIA NIM catalog and image**\*
         1. Current: Select/menu for NIM images.
         2. OSAC proposal: retain as a documented source option; exclude from UI implementation.
6. **Serving configuration**
   1. **(3) Serving method and runtime — What do you want to run? Section header: none**
      1. **Tenant access to serving method and runtime**
         1. Current: no equivalent Catalog authoring control in maas-odh-pages.
         2. OSAC proposal: use the Catalog > Cluster > Node topology lock/edit card pattern for the serving method and runtime group.
      2. **(3.1) Deployment method**
         1. Current: Radio group for standard LLM inference service, LLM inference service with llm-d, or Legacy\* when enabled.
         2. OSAC proposal: show only when the allowed model set is restricted to LLMs; use selectable cards with the two RHOAI deployment method labels. Do not include Legacy\* in the UI.
      3. **Serving runtime selection** (RHOAI labels: Accelerator configuration; Serving runtime template for legacy)
         1. Current: Automatic/Manual Radio choices; the selected runtime appears in a disabled TextInput or Runtime Catalog Picker.
         2. OSAC proposal: show the RHOAI accelerator configuration options as selectable cards, using the Catalog > Cluster > Node topology option-card pattern. Do not show pricing.
7. **Resources** — “Choose the resources available for this catalog item.”
   1. **(4) Base compute and capacity — What resources and performance? Section header: “Compute”** — one Ethan-style lock/edit card group labelled “Tenant access to compute”.
      1. **Hardware profile**
         1. Current: Select/menu.
         2. OSAC proposal: use the RHOAI hardware profile options in a Select/menu.
      2. **Number of replicas to deploy**
         1. Current: NumberInput.
         2. OSAC proposal: bounded NumberInput, constrained by the selected cluster and item.
      3. **Replica count**\*
         1. Current: NumberInput shown only for the Legacy deployment method.
         2. OSAC proposal: retain as a reference; omit with Legacy\* from the UI.
      4. **Storage and deployment option**\*
         1. Current: Select/menu for NVIDIA NIM.
         2. OSAC proposal: selectable cards for ephemeral, existing, or new storage.
      5. **NVIDIA NIM storage size**\*
         1. Current: numeric TextInput with increment/decrement buttons.
         2. OSAC proposal: bounded NumberInput.
      6. **Existing cluster storage where the image is located**\*
         1. Current: Select/menu.
         2. OSAC proposal: searchable Select.
      7. **Cluster storage name (NVIDIA NIM)**\*
         1. Current: Select/menu for existing storage or TextInput for new storage.
         2. OSAC proposal: Select/menu for existing storage or TextInput for new storage.
      8. **Model path (NVIDIA NIM)**\*
         1. Current: TextInput.
         2. OSAC proposal: TextInput.
      9. **Subpath**\*
         1. Current: TextInput.
         2. OSAC proposal: TextInput.
      10. **Storage class**\*
      11. Current: Select/menu.
      12. OSAC proposal: Select/menu filtered to the selected cluster.
   2. **(5) llm-d topology and routing — What resources and performance? Section header: “Node topology”** — one Ethan-style lock/edit card group labelled “Tenant access to node topology”.
      1. **Topology type**
         1. Current: Select/menu for single-node, multi-node, and disaggregated patterns.
         2. OSAC proposal: selectable cards with short pattern descriptions.
      2. **Topology configuration**
         1. Current: Select/menu of administrator-defined configurations.
         2. OSAC proposal: Select/menu filtered by topology type and cluster.
      3. **Accelerator configuration**
         1. Current: Select/menu.
         2. OSAC proposal: Select/menu or selectable cards for comparable accelerator configurations.
      4. **Routing**
         1. Current: Select/menu.
         2. OSAC proposal: Select/menu filtered by topology.
      5. **Decode replicas**
         1. Current: NumberInput for disaggregated patterns.
         2. OSAC proposal: bounded NumberInput.
      6. **Prefill replicas**
         1. Current: NumberInput for disaggregated patterns.
         2. OSAC proposal: bounded NumberInput.
   3. **(6) Runtime customization — What resources and performance? Section header: “Runtime customization”** — one Ethan-style lock/edit card group labelled “Tenant access to runtime customization”.
      1. **Validated configurations**
         1. Current: multi-select Cards in the optional Preconfigure deployment step, with View arguments links (for example, tool calling and low latency).
         2. OSAC proposal: selectable cards in this section; the catalog author can lock the choice or leave it available at launch.
      2. **Additional runtime arguments**
         1. Current: TextArea.
         2. OSAC proposal: TextArea.
      3. **Serving runtime environment variables**
         1. Current: repeatable key/value TextInputs with add/remove controls.
         2. OSAC proposal: repeatable key/value inputs; use Secret references for secret values.
   4. **(8) Lifecycle — What resources and performance? Section header: “Lifecycle”** — one Ethan-style lock/edit card group labelled “Tenant access to lifecycle”.
      1. **Deployment strategy**
         1. Current: Radio group for Rolling update or Recreate.
         2. OSAC proposal: selectable cards with impact descriptions.
8. **Review** — summarize the Catalog item settings and lock/edit choices before publishing. Include Ethan's info alert: **Starts as unpublished**; “New catalog items are saved as unpublished. Publish from the catalog when you are ready for tenants to use this offering.”

- NVIDIA NIM source, image, storage, and sizing options and the Legacy deployment method are marked for reference; they will not be included in the current UI. “Replica count” is shown only for Legacy and is excluded for the same reason.

### 2. Service instance wizard

1. **General**
   1. **(2) Model identity — Who should access it? Section header: none**
      1. **(2.2) Project or namespace**
         1. Current: disabled TextInput when project context is fixed; Select/menu in the optional Preconfigure deployment step.
         2. OSAC proposal: searchable project Select when the user can choose; otherwise show the fixed project value.
      2. **(2.2) Model deployment name**
         1. Current: TextInput.
         2. OSAC proposal: TextInput.
      3. **(2.2) Description**
         1. Current: TextArea.
         2. OSAC proposal: TextArea.
2. **Cluster** _(proposed before Configure)_
   1. **(x) Cluster — Where do you want to run it? Section header: none**
      1. **Eligible clusters**
         1. Current: no cluster-selection property in the RHOAI Deploy Model wizard.
         2. OSAC proposal: selectable cluster cards, following the Bare Metal Hardware pattern; select the cluster before loading compatible resources.
3. **Configure**
   1. **(1) Model source and credentials — What do you want to run? Section header: “Model”**
      1. **Model location**
         1. Current: source-specific controls depend on location; the current RHOAI flow has more location variants than this OSAC pass needs.
         2. OSAC proposal: for BYOM, select a connection type, specify the model path, and select or create a Secret. Do not show this field when the user is choosing from a model catalog.
      2. **Model**
         1. Current: Select/menu when the offer allows a catalog model choice.
         2. OSAC proposal: when selecting from a catalog, show up to three models inline; if there are more, provide a “View options” button. Do not show Connection location fields in this path.
      3. **NVIDIA NIM catalog and image**\*
         1. Current: Select/menu for NIM images.
         2. OSAC proposal: retain as a documented source option; exclude from UI implementation.
   2. **(3) Serving method and runtime — What do you want to run? Section header: “Serving method and runtime”**
      1. **(2.1) Model type**
         1. Current: Select/menu in Model details.
         2. OSAC proposal: for BYOM, show a required Select/menu so the deploying user can identify a predictive or LLM model. This property is not configured or locked in the Catalog wizard.
      2. **(2.1) Model format**
         1. Current: Select/menu only for predictive models.
         2. OSAC proposal: when the selected BYOM model type is predictive, show a required Select/menu; do not show for LLM models or in the Catalog wizard.
      3. **(3.1) Deployment method**
         1. Current: Radio group for standard LLM inference service, LLM inference service with llm-d, or Legacy\* when enabled.
         2. OSAC proposal: show only when allowed by the Catalog item and the selected model is an LLM.
      4. **Serving runtime selection** (RHOAI labels: Accelerator configuration; Serving runtime template for legacy)
         1. Current: Automatic/Manual Radio choices and runtime TextInput or Runtime Catalog Picker.
         2. OSAC proposal: show only the runtime choices left editable by the Catalog item.
   3. **(4) Base compute and capacity — What resources and performance? Section header: “Compute”**
      1. **Hardware profile**
         1. Current: Select/menu.
         2. OSAC proposal: Ethan-style selectable cards filtered by the selected cluster.
      2. **Number of replicas to deploy**
         1. Current: NumberInput.
         2. OSAC proposal: bounded NumberInput filtered by the selected cluster and Catalog item.
      3. **Replica count**\*
         1. Current: NumberInput shown only for the Legacy deployment method.
         2. OSAC proposal: retain as a reference; omit with Legacy\* from the UI.
      4. **Storage and deployment option**\*
         1. Current: Select/menu for NVIDIA NIM.
         2. OSAC proposal: selectable cards for supported storage choices.
      5. **NVIDIA NIM storage size**\*
         1. Current: numeric TextInput with increment/decrement buttons.
         2. OSAC proposal: bounded NumberInput filtered by cluster and Catalog item.
      6. **Existing cluster storage where the image is located**\*
         1. Current: Select/menu.
         2. OSAC proposal: searchable Select filtered by cluster.
      7. **Cluster storage name (NVIDIA NIM)**\*
         1. Current: Select/menu for existing storage or TextInput for new storage.
         2. OSAC proposal: Select/menu for existing storage or TextInput for new storage, constrained by the Catalog item.
      8. **Model path (NVIDIA NIM)**\*
         1. Current: TextInput.
         2. OSAC proposal: TextInput if editable in the Catalog item.
      9. **Subpath**\*
         1. Current: TextInput.
         2. OSAC proposal: TextInput if editable in the Catalog item.
      10. **Storage class**\*
          1. Current: Select/menu.
          2. OSAC proposal: Select/menu filtered by the selected cluster and Catalog item.
   4. **(5) llm-d topology and routing — What resources and performance? Section header: “Node topology”**
      1. **Topology type**
         1. Current: Select/menu for single-node, multi-node, and disaggregated patterns.
         2. OSAC proposal: selectable cards filtered by the selected cluster and Catalog item.
      2. **Topology configuration**
         1. Current: Select/menu of administrator-defined configurations.
         2. OSAC proposal: Select/menu filtered by topology type, cluster, and Catalog item.
      3. **Accelerator configuration**
         1. Current: Select/menu.
         2. OSAC proposal: Select/menu or selectable cards filtered by the selected cluster and Catalog item.
      4. **Routing**
         1. Current: Select/menu.
         2. OSAC proposal: Select/menu filtered by topology and Catalog item.
      5. **Decode replicas**
         1. Current: NumberInput for disaggregated patterns.
         2. OSAC proposal: bounded NumberInput filtered by cluster and Catalog item.
      6. **Prefill replicas**
         1. Current: NumberInput for disaggregated patterns.
         2. OSAC proposal: bounded NumberInput filtered by cluster and Catalog item.
   5. **(6) Runtime customization — What resources and performance? Section header: “Runtime customization”**
      1. **Validated configurations**
         1. Current: multi-select Cards in the optional Preconfigure deployment step, with View arguments links.
         2. OSAC proposal: show only the choices left editable by the Catalog item.
      2. **Additional runtime arguments**
         1. Current: TextArea.
         2. OSAC proposal: show only if left editable by the Catalog item.
      3. **Serving runtime environment variables**
         1. Current: repeatable key/value TextInputs with add/remove controls.
         2. OSAC proposal: show only if left editable; use Secret references for secret values.
   6. **(8) Lifecycle — What resources and performance? Section header: “Lifecycle”**
      1. **Deployment strategy**
         1. Current: Radio group for Rolling update or Recreate.
         2. OSAC proposal: show the locked value or selectable cards if left editable by the Catalog item.
4. **Review** — summarize the offer, selected model/source, project, cluster, and allowed configuration.
5. **Provisioning** — show provisioning progress and result; the deployed instance then appears in Services.

- NVIDIA NIM source, image, storage, and sizing options and the Legacy deployment method are marked for reference; they will not be included in the current UI. “Replica count” is shown only for Legacy and is excluded for the same reason.

**Cross-cutting lockability assumption:** every model/source/serving/resource/lifecycle property carried from a Catalog item into provisioning—except Model type `(2.1)` and Model format—is configurable as **Editable at provisioning** or **Locked** by the catalog author in this first pass. Model-choice policy (one or more specified models, any configured-catalog model, or BYOM) controls which source and model choices appear. When the admin specifies one model, they choose either a model-catalog entry or a Connection; a Connection requires its type, model path, and Secret. Catalog-only metadata, Visibility, and the allowed-cluster set remain admin controls. Keep the YAML view/specify request and the OSAC Secret creation/reference design as follow-up notes in this brief, not as UI alerts.

### Service wizard variations to prototype

Use the same **General → Cluster → Configure → Review → Provisioning** structure; vary only the Model and Configure controls according to the existing offer policy. Show three Service variation tabs at the same level as **Create catalog item**: **Launch instance: predictive**, **Launch instance: llm-instruct**, and **Launch instance: llm-tool-calling**. These are scenarios for the current offers, not new Catalog items.

1. **`predictive` — BYOM.** In **Model**, the launcher selects a connection type, enters the model path, and references a Secret. The Secret creation/reference interaction still needs definition. In **Serving method and runtime**, the launcher specifies Model type `(2.1)`; choosing Predictive reveals Model format `(2.1)`. Do not show LLM deployment method `(3.1)`.
2. **`llm-instruct` — predefined model set.** In **Model**, show the admin-approved model options (up to three inline, then **View options**). Do not show BYOM location fields. The Catalog admin's LLM-only source constraint permits deployment-method `(3.1)` configuration; show only choices left editable by the Catalog item.
3. **`llm-tool-calling` — one fixed model.** In **Model**, show the selected model as fixed and do not ask for a model choice at launch. In **Serving method and runtime**, show the preconfigured tool-calling runtime as fixed; expose only settings the Catalog item leaves editable. The current Services seed has no tool-calling instance, so this scenario does not add a list row.

The three Catalog model-choice options are **one or more specified models**, **any model in the configured catalog**, and **a user-provided model (BYOM)**. The Service tabs demonstrate the existing `predictive`, `llm-instruct`, and `llm-tool-calling` offers; the full-catalog option has no assigned existing offer yet.

### Phase 2 narrative: create an offer, then deploy a model

These actor/action/object/screen beats are the first Vision Narrative build sheet. They use existing Catalog offers and Services rows so the UI work can be traced to the prototype data.

#### Journey A: `llm-instruct` to Granite 3B instruct

1. **Provider Admin — create the offer.** In Catalog, the admin chooses the existing `llm-instruct` offer, sets **Visibility** for North Summit Bank, selects eligible clusters in **Cluster availability**, then defines an instruction-appropriate model subset in **Model source**. The admin configures serving and Resources, choosing which represented values are editable at launch and which are locked, then reviews and publishes. No new catalog item is created.
2. **Tenant user — select and configure an instance.** From Catalog, the user opens `llm-instruct`, chooses **Granite 3B instruct** from the predefined subset, and enters Project, deployment name, and description in **General**. No separate source location or Secret is entered for a model selected from the configured catalog. The user selects a cluster before **Configure** loads compatible Compute, Node topology, Runtime customization, and Lifecycle options. The user reviews and deploys; MaaS subscription access is the MVP service-access path.
3. **OSAC — provision and list the result.** Provisioning creates one model instance and Services displays its model name, project, selected cluster, and status. To match the current seed, completing this journey once for US East and once for EU West produces the two existing **Granite 3B instruct** rows. Their existing names and data remain the target; the flow does not add a different example model.

#### Journey B: `predictive` BYOM to Credit-risk scorer

1. **Provider Admin — configure the existing BYOM offer.** In Catalog, the admin edits the existing `predictive` item, chooses its visibility and eligible clusters, configures predictive serving defaults, and sets the supported resource/lifecycle values. The item remains the existing `predictive` catalog offer; BYOM is its source policy, not a separate offer.
2. **Tenant user — provide a model under development.** From Catalog, the user launches `predictive`, provides the model source and required credentials through the eventual OSAC Secret flow, and enters Project, deployment name, and description. The user selects a cluster before seeing compatible Compute options, completes Configure, reviews, and deploys.
3. **OSAC — provision and list the result.** Services shows the deployed predictive instance as **Credit-risk scorer** on US East, matching the existing seed. The model-fleet inventory currently describes this example as a non-MaaS AI asset. Preserve that seeded outcome while resolving how it relates to the general MVP MaaS-subscription statement; do not silently relabel the item.

`llm-tool-calling` remains a useful catalog-authoring contrast: its admin fixes one model and prepares the runtime so launch needs little customization. The current seeded Services list has no corresponding running instance, so this first narrative does not invent a new result row for it.

### YAML fields not rendered in the current form

The field-by-field mapping of the visible `maas-odh-pages` controls is in **First-pass flow and control outline** above. `yamlSync.ts` also contains flat-flow and composition properties that do not have controls in the current wizard path, including distributed-node and tensor/data-parallelism values and some prefill/decode runtime/profile settings. Keep those as follow-up research; do not treat them as current visible controls or add them to the outline as if the UI already exposes them.

## Provisional OSAC option categories

Use these categories to organize the inventory. Confirm names and meanings against the team's OSAC guidance before treating them as standards.

| Category                       | Meaning in the catalog flow                                                                 | Example question                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Administrator set**          | Chosen and maintained by the administrator; not offered as a tenant choice                  | Which model and serving runtime does this item represent?                   |
| **Tenant configurable**        | Tenant may provide or select a value during deployment, within administrator-defined bounds | Can a tenant choose replica count or accelerator size?                      |
| **Locked offering default**    | Administrator supplies a visible value that remains fixed for the tenant                    | Is the model version fixed for consistency or supportability?               |
| **OSAC managed**               | Derived, inherited, or controlled by the platform and not directly edited in this flow      | Is the serving namespace or generated resource name system-assigned?        |
| **Out of scope / unsupported** | Not configurable through this catalog experience; omit or explain it                        | Which advanced Kubernetes fields should stay out of the supported offering? |

The terms “locked,” “editable,” “default,” and “OSAC managed” need consistent definitions across the authoring flow, the tenant launch flow, and the resulting Services details.

## Candidate option inventory to reconcile with the source configuration

This is a field-family checklist, not a proposal to expose every field. The crosswalk below records controls observed in the local reconstruction; exact defaults, dependencies, validation, and lockability still need confirmation against the intended RHOAI source snapshot and OSAC responsibilities.

| Field family                | Candidate information to inspect                                                             | Likely catalog decision                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Offering identity           | Display name, description, catalog category, model name and version                          | Which values identify the offering, and which are tenant-visible?                 |
| Model source                | Model format, source or storage reference, revision, credentials or pull secrets             | Which source details are admin-only, secret-backed, or fixed?                     |
| Serving runtime             | Serving runtime/framework, protocol, `LLMInferenceService` template/configuration            | Does the admin choose from supported presets or author low-level settings?        |
| Compute requirements        | CPU, memory, accelerator type/count, node placement and scheduling constraints               | Which are fixed by the offering, tenant-selectable, or derived from capacity?     |
| Capacity and scaling        | Replicas, min/max replicas, autoscaling behavior, scale-to-zero, concurrency or queue limits | Which controls can tenants safely adjust, and what bounds apply?                  |
| Access and networking       | Internal/external access, route or endpoint behavior, authentication and network policy      | What does OSAC provide by default, and what can an admin or tenant change?        |
| Storage and credentials     | Persistent/cache storage, secret references, model registry access                           | How are sensitive values referenced without exposing them in the catalog?         |
| Lifecycle and operations    | Update strategy, readiness, health/metrics, rollout and failure behavior                     | What should be preset, surfaced as status, or excluded from tenant configuration? |
| Commercial and availability | Visibility, eligible organizations/tenants, price/rate card, publish state                   | Which existing catalog controls apply to model offerings?                         |

For each real field discovered in the source, record its source path/property, displayed label, current RHOAI control, proposed OSAC control, and flow location. For this pass, mark launch-time model/source/serving/resource/lifecycle properties lockable and editable; keep Catalog visibility and offer metadata as admin controls. Add exact defaults, bounds, dependencies, and validation when the relevant item configuration is worked through.

## Provisional OSAC catalog item creation outline

This discussion outline applies the shared OSAC resource-creation proposal to model catalog authoring. It is provisional; it does not make the admin authoring steps identical to the tenant deployment wizard.

1. **Service** — choose Model.
2. **General** — reuse the shared catalog-item step; its common fields are not remapped here.
3. **Visibility** — select the tenant(s) that can discover the offer; configure the MVP MaaS access policy separately from catalog visibility. Project access is a future enhancement.
4. **Cluster availability** — choose the eligible cluster or clusters after tenant visibility, so the offer can be limited to that tenant's available clusters.
5. **Model source** — define BYOM, a fixed model, a predefined model subset, or any model in the configured catalog. For a fixed model, choose a model catalog or a Connection; only the Connection path asks for type, model path, and Secret. BYOM asks the launching user for those source details. The OSAC Secret creation/reference flow remains to be defined.
6. **Serving configuration** — set deployment method only when Model source is restricted to LLM models, plus runtime. Model type and model format are service-launch inputs; show Model format only for a predictive model.
7. **Resources** — organize **Compute**, **Node topology**, **Runtime customization**, and **Lifecycle** as sections. Assume each launch-time property can be locked or left editable by the catalog author.
8. **Review** — confirm offer visibility, eligible clusters, model/source policy, values and lock states, serving configuration, and Resources before publishing. Trace the offer to its expected Services instance.

For each property carried into service launch, the first pass assumes the catalog author may set it to **Locked** or **Editable at provisioning**. Review should make those states clear; “Advanced settings” should not become a holding area for configuration whose flow placement is still unresolved.

### First-pass policy assumption

Every model/source/serving/resource/lifecycle property carried into launch is treated as **editable at service launch or lockable in Catalog** for this design pass. The authoring flow will show the choice using the Locked / Editable at provisioning pattern. Catalog-only metadata, Visibility, and eligible-cluster bounds remain admin controls. Values needed to select a model or source depend on the offer's model-choice policy; credentials must use an OSAC Secret reference or another approved secret mechanism. This assumption does not mean every RHOAI field must ship in the final product.

## Initial success criteria

Treat these as working criteria until the evidence review sharpens them:

- An administrator can create a comprehensible model offering without translating every low-level serving setting into a tenant-facing control.
- Catalog authors can lock represented properties; launchers can change properties left editable by the catalog item.
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

| Phase / playbook output                                                                                                     | How it is being applied here                                                                                                                                                                           | Artifact / status                                                                                                                                                                                                                                                                                                                                                                                                                                    | Adaptation from the playbook                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1: Vision Brief** — evidence-based problem, target user, capabilities, scope, stakeholders, and product integration | Use the brief to define the catalog-authoring problem before choosing screens; record the connected tenant deployment and Services outcome.                                                            | This working brief: [`model-catalog-item-creation-brief.md`](model-catalog-item-creation-brief.md). In progress; not yet a complete playbook Vision Brief.                                                                                                                                                                                                                                                                                           | **Significant refactor:** organized around OSAC catalog policy and model-configuration ownership, rather than the playbook's rhoai-3.6 feature-area/branch/flag template. It includes an option crosswalk and role/permission model, and distinguishes MVP MaaS access from future Project access. A specific 6–12 month horizon, capability-readiness status, and presentation stakeholders are not yet defined. |
| **Phase 2: Vision Narrative** — named user and step-by-step future journey                                                  | The beats name the actor, action, object, screen, and resulting Services entry; the flow spans Provider Admin, tenant user, and OSAC provisioning.                                                     | This brief's **“Phase 2 narrative: create an offer, then deploy a model”** section. First pass: `llm-instruct` → Granite 3B instruct and `predictive` BYOM → Credit-risk scorer.                                                                                                                                                                                                                                                                     | **Significant refactor:** uses an actor/action/object/screen build sheet instead of a continuous fictional narrative, as recommended in Jenn's 2026-08-25 local playbook feedback at `evaluation/runs/jgiardino-2026-08-25/phase-2-narrative-feedback.md`. This supports multiple actors and verifiable outcomes; the local evaluation is supplemental, not upstream playbook content.                            |
| **Phase 3: Vision Prototype** — interactive, shareable end-to-end prototype                                                 | Started after the property map and step order were reviewed. The pre-refresh preview demonstrated provider catalog authoring and tenant launch through the initial Configure/Review/Provisioning path. | Current model wizard previews are at [`VisionModelAuthoringFlowsPage.tsx`](../src/pages/provider-admin/vision/VisionModelAuthoringFlowsPage.tsx), linked from the landing page as **Model authoring flows**. The complete pre-refresh prototype is also preserved at [`public/legacy-prototype/`](../public/legacy-prototype/) with a “TO BE REMOVED” banner. The previews are illustrative and do not create live catalog items or model instances. | **Significant adaptation:** follows the refreshed `osac-bmaas` shell and Ethan's current service cards, visibility cards, wizard controls, and selectable-card treatment. It includes the revised model-choice options, catalog cluster availability, and Resources sections, and traces launch choices without implementing backend provisioning.                                                                |

The Phase 1 playbook template also recommends a Value Proposition Canvas workshop. It has not been run; existing interview feedback and prototype evidence are being used first, with assumptions marked where the evidence is incomplete.

## Decisions to make after reviewing the first pass

1. Confirm whether the field labels and the Catalog/Service step placement in the outline match the intended `maas-odh-pages` properties.
2. Decide which supported source choices map to OSAC Secrets and what the user sees when a Secret is selected, created, or unavailable.
3. Confirm the selected-cluster control and which resource choices are filtered by it.
4. Resolve the predictive Credit-risk scorer's existing non-MaaS AI-asset status against the general MVP MaaS-subscription access direction.
5. Identify any RHOAI fields that should be omitted from the OSAC experience after the initial assumption-driven pass; no fields are classified hidden in this draft.
6. Review whether the two example journeys accurately trace the existing Catalog and Services data before building more UI.

## Recommended next steps

1. Review the new field-level outline against `maas-odh-pages` and correct missing, duplicated, or misplaced controls.
2. Keep the current **editable and lockable** assumption while reviewing the outline; do not block the next design pass on a final policy vocabulary.
3. Resolve the Secret-reference pattern and predictive access exception in the brief before making those details look settled in the UI.
4. Refine the two example journeys against the existing Catalog and Services rows, then build the Catalog authoring flow first and the connected Service launch flow second.
5. Update the existing five Catalog offers and current Services items with the properties the refined wizard flows establish; keep future enhancements and open decisions documented in design files, not as Alert components.

## Open questions

- Does the shared resource-creation guidance imply a full-page wizard here, or a single-page resource form?
- Which fields in the first-pass outline should be omitted after the team reviews the complete property list?
- What is the OSAC Secret creation/reference interaction for BYOM and registry/object-storage sources?
- How should the predictive non-MaaS AI-asset example coexist with the general MVP MaaS subscription access statement?
