# Model object dictionary

How models, catalog items, gateways, and RHOAI consume objects relate in this prototype. Do not show custom-resource names (`LLMInferenceService`, `MaasModelRef`) in the UI.

**This pass:** Catalog uses the five Models SKUs in **2.5**. The **2.8** keep-set of instances and externals is confirmed. Granite pairing is **story A**. Mistral 7B on `nsb-west` is the cross-cluster gateway example. Do not rewrite Ethan’s bare metal, cluster, or VM SKUs.

In chat, **2.5** means the heading **2.5 Models catalog items** below.

| Chat shorthand | Heading to search for |
| --- | --- |
| §1 | `1. Object set` |
| §2 | `2. OSAC catalog item` |
| §2.2 | `2.2 Catalog item types` |
| §2.3 | `2.3 Properties asked when deploying` |
| §2.4 | `2.4 Model file is location` |
| §2.5 | `2.5 Models catalog items` |
| §2.7 | `2.7 Patterns page` |
| §2.8 | `2.8 Master instance list` |
| §3–§5 | `3. Other objects`, `4. Property dictionary`, `5. State on each page` |
| §6–§7 | `6. What the live prototype shows today`, `7. Fleet list rules` |

## How to review this file

1. **Done:** **2.5** Catalog SKUs and card chrome. **2.8** keep-set of which instances and externals to keep.
2. **Gateway routing:** Granite is **story A** (regional doors). One gateway serving models on other clusters is shown with Mistral 7B on `nsb-west`.
3. **Patterns (not live pages):** **Instance lists** tab shows the 2.8 keep-set in each page’s list chrome. Live Services / MaaS / API keys / assets / Playground stay on the old mocks until you say to switch.

---

## Agreed for this pass (not Decision 2)

| ID | Decision | Status |
| --- | --- | --- |
| **1** | Object set in §1. Revise as we define, not by expanding into compute SKUs. | **Revised 2026-09-10** from review (same Catalog/Services lists; MaaS model; AI asset = Playground; external = MaaS-only for now) |
| **2** | Which **Models** catalog items to seed | **Five in the UI** (2.5). BYOM documented, not shipped. Embedding out. |
| **3** | Catalog Models lists: same live SKUs for North Summit Bank on platform admin, tenant admin, and tenant user (option A). Curation / pending-approval story later. | Agreed |
| **4** | Instantiate action is **Launch instance** (not Place on AI Grid), including the AI Grid catalog kebab and modal | Agreed — wired |
| **5** | Remove designer-iteration copy from model catalog details (Kind, “Model serving preset” heading, “Place this preset…” paragraph, and anything else that reads as build notes) | Agreed — wired |
| **6** | **2.8** keep-set of Services / MaaS / Playground objects (which models stay). | **Confirmed 2026-09-11** |
| **7** | Gateway cardinality and routing. One on-cluster instance → zero or one gateway. One gateway → many instances. Instance and gateway may be on different clusters. **Story A** (regional doors) for Granite. Cross-cluster gateway shown with Mistral 7B on `nsb-west`. | **Agreed 2026-09-14** (story A + Mistral cross-cluster example) |

---

## 1. Object set (Decision 1)

An object can **include** another object. Inclusive means the parent carries the child’s identity and properties so the UI can show them without duplicating the child.

**Catalog item is the exception that used to be wrong:** a Models catalog item does **not** always include a specific model file. See §2.

Do not show custom-resource names in the UI. **On-cluster instance** is an `LLMInferenceService` in RHOAI; say that only in this file.

### Same list, different chrome

| List | Surfaces (same objects, same IDs) | What may differ |
| --- | --- | --- |
| **Catalog (Models)** | Catalog page and AI Grid Catalog | Layout and density, because the AI Grid drawer has less width |
| **Services (Models)** | OSAC Services → Models and AI Grid Services → Models | Layout and density; fleet vs a single cluster’s details |

If an item is missing from one of those pairs, that is a bug in the prototype, not a different object.

### Objects

| Object | What it is | Inclusive of | Surfaces in this prototype |
| --- | --- | --- | --- |
| **Model file** | Artifact in the RHOAI model catalog (weights / image). Not a running instance. Not an OSAC catalog item. | — | **Model catalog settings** (Admin → AI) shows catalog *sources*. Picking a file from that catalog at launch is **not** in this prototype yet (prior art / wireframes exist; large task). For instantiate flows, use a **simple form input** and treat a real catalog picker as later work. An OSAC catalog item *may* lock, constrain, or omit this field. |
| **OSAC catalog item (Models)** | A storefront offer: admin-predefined config plus fields the user still specifies at launch. An offer, not MaaS, not an instance. | Only the fields the admin locked. **Not** automatically a model file. | **Catalog** and **AI Grid Catalog** (same list). Blue **Model** chip (singular). |
| **On-cluster instance** | A model deployed on a cluster (RHOAI: `LLMInferenceService`), launched from a Models catalog item, in one project. | The catalog item’s locked config, plus whatever the user chose at launch (including the model file if they chose it), plus runtime: cluster, project, status, traffic, realized Size | **Services → Models** and **AI Grid Services → Models** (same list). Also **MaaS governance** when it is a MaaS model. Also **AI asset / Playground** when it is marked as an asset **or** when it is a MaaS model. |
| **External model** | Inference that is **not on this platform** (Bedrock, Anthropic, and more). Not launched from an OSAC Models SKU. | Display name, model ID, served-by provider. Always a **MaaS model**, so it also appears on **AI asset / Playground**. | **MaaS governance** (management). **AI asset endpoints / Playground** (because all MaaS models are assets). Not Catalog. Not Services. (Live AI Grid still shows Titan/Claude on Services; that is off-target.) |
| **Gateway** | Reachability / assignment target. Lives on **one** cluster. Not a model. | Cluster it is provisioned on. | AI Grid Services (Gateway list); cluster details; gateway details |
| **MaaS model** | A model published as a service. **Same object** for admin and user; **different views**. Admin sees assignment to subscriptions and policies. User sees only MaaS models on a subscription they can access. | **Either** an on-cluster instance **or** an external model. An external model can **only** be a MaaS model. An on-cluster instance does **not** have to be MaaS. | **Admin:** MaaS governance (all MaaS models, plus subscription and policy assignment). **User:** API keys → Subscriptions → Models (only models on *their* subscriptions) |
| **AI asset** | A model endpoint you can call (URL, capabilities, ready/inactive) and the **Playground** picker. Same object, two surfaces. | **(1)** on-cluster instances marked as assets (MaaS not required) **and (2)** **all MaaS models** (on-cluster MaaS **and** every external). | GenAI studio → AI asset endpoints; GenAI studio → Playground |

**Cluster** is only **where** an on-cluster instance or gateway lives. It is not a catalog SKU in this dictionary.

**Tenant** and **project** scope lists. They are not model objects.

### Where inference runs (OSAC vs RHOAI)

RHOAI is **one cluster**. There, **External** usually means “not this cluster” — including an `LLMInferenceService` on another cluster, or a provider off the platform.

OSAC is a **fleet**. That single External chip is not enough. Working distinction (labels TBD):

| Location | What it is | Typical object |
| --- | --- | --- |
| **This cluster** | Deployed on the cluster you are looking at | On-cluster instance |
| **Another cluster** | Deployed on the platform, but not this cluster | Still an on-cluster instance (of *that* cluster), not “external” |
| **Off-platform** | Entirely outside this platform | External model (MaaS-only) |

Do not treat “another cluster” as an external model when the user can already see that cluster in the fleet.

**Open:** Should an external model ever appear as a Catalog item or a Services item? Not decided. Working rule: **MaaS governance only**.

---

## 2. OSAC catalog item — Decision 2 (iterate here)

This is the dedicated discussion. The live prototype currently treats the one Models SKU as “Granite 3B instruct” (a named model file plus a frozen serving size). That is too narrow for how OSAC catalog items work.

### 2.1 What a catalog item is

An OSAC catalog item lets an **admin predefine some settings** and lets a **user specify others** at launch. Ethan’s bare metal / cluster items already do this (for example locked vs editable hardware). We are not inventing a new lock/list/BYOM mode for every RHOAI field.

For **Models** catalog items, the variation that matters in this pass is how the **model file** is set. The file and **model location** are the same thing: location is where the file is.

- **From the RHOAI catalog:** picking the model provides the location.
- **BYOM:** the user specifies location with **connections**.

A given SKU may be a **capability** (instruct, tool calling) or a **size band** (lightweight vs high-capacity), or **predictive**, or **BYOM**. Hardware Locked / Editable is per property on that SKU (see 2.5), not a universal lock/list/BYOM grid.

The **display name** should describe the *offer* (what you are launching), the way Ethan’s items describe a server or cluster. It should not have to be the model file’s name. Today’s “Granite 3B instruct” card collapses those two.

### 2.2 Catalog item types (from Miro)

First-pass examples of different catalog items, not only Models. Captured so we do not reduce “catalog item” to “a model.”

| Working example (Miro) | Kind of offer | What the admin is predefining (plain language) |
| --- | --- | --- |
| **GPU Notebook (1×A100 hourly + Jupyter Pod)** | Workbench | Accelerator, billing unit, and the notebook/pod shape. User is not designing the workbench from scratch. |
| **LLM Inference Endpoint (vLLM/KServe + shared weights + auto-routing)** | Model deployment | Serving runtime, how weights are shared, and routing. The model file is not named in the example. Auto-routing maps to **deployment method** (llm-d) on the instance, not a separate Catalog SKU. |
| **8×H100 Training Cluster (bare metal + IB for fine-tuning)** | Training / pipeline compute | Hardware count, interconnect, and intended job (fine-tuning). Not an inference endpoint. |

**This pass implements Models catalog items only.** Workbench and training-cluster rows stay in the table as the concept. Do not add GPU Notebook or 8×H100 Training Cluster SKUs in the model-fleet seed unless we later expand scope.

Ethan’s live SKUs (bare metal GPU training, cluster node sets, VMs) are the same *kind* of object — predefined vs user-choice config — already in Catalog. We are not redefining them here.

### 2.3 Properties asked when deploying an on-cluster instance (RHOAI)

**LLM inference service only** (`LLMInferenceService`). Not external models. External-model fields are ignored for now; pull those from the ODH dashboard repo when we need them.

Source today: nightly RHOAI screenshots (a start). **Next:** full field list from production UI in `/Users/jenngiardino/odh-dashboard` (same repo used for earlier RHOAI ports). Screenshot extract will be incomplete (conditional fields, connections, catalog prefill).

**Model file = model location.** Where the file is:

- **From the RHOAI catalog:** location is provided; the user does not re-specify it. **Use case** (and similar catalog metadata) should come from that model, not a separate launch field — **likely remove Use case** from this wizard in our prototype.
- **BYOM:** the user specifies location with **connections**.

For this OSAC prototype, instantiate still uses a **simple form input** until a catalog picker and connections UI land.

| Step | Property | Required? | What it is (from the UI) | Options / notes shown |
| --- | --- | --- | --- | --- |
| 1. Model details | **Model location** (the model file) | Yes | Where the file currently is | Provided if picked from the RHOAI catalog. For BYOM, specified via **connections**. |
| 1. Model details | **Model type** | Yes | Kind of model | Predictive model; Generative AI model (example, LLM) |
| 2. Model deployment | **Project** | Yes (shown, not edited here) | OpenShift AI project where the model is deployed | Example: `loan-assessment` |
| 2. Model deployment | **Model deployment name** | Yes | Name of the inference service created at deploy | Example: `granite-4.0-h-tiny-FP8-dynamic - Version 1` |
| 2. Model deployment | **Resource name** | Derived | Kubernetes resource name | Example: `granite-4o-h-tiny-fp8-dynamic` |
| 2. Model deployment | **Description** | No | Free text | — |
| 2. Model deployment | **Deployment method** | Yes | How the model is deployed | **LLM inference service** — large language model; compatible with Model as a Service. **LLM inference service with llm-d** — same, plus distributed serving / cache-aware routing / disaggregated prefill and decode. **Inference service** — serving runtime template; **not** compatible with Model as a Service. |
| 2. Model deployment | **Hardware profile** | Yes | Named CPU/memory profile | Example: CPU profile (default 2 cores / 8 GiB, max unrestricted), with **View details** |
| 2. Model deployment | **CPU requests / CPU limits** | Under customize | Resource requests and limits | Shown when customizing the hardware profile |
| 2. Model deployment | **Memory requests / Memory limits** | Under customize | Resource requests and limits | Shown when customizing the hardware profile |
| 2. Model deployment | **Accelerator configuration** | Yes | Accelerator / serving-runtime config for this deployment | Example: `vLLM IBM Spyre x86 LLMinferenceServiceConfig` (global-scoped) |
| 2. Model deployment | **Replica count** | Yes | How many replicas | Example: 1 |
| 3. Advanced settings | **Add as AI asset endpoint** | No (checkbox) | Publish on AI asset endpoints so project users can test in Playground | Creates / points at the **AI asset** object (same as Playground) |
| 3. Advanced settings | **Use case** | If AI asset | Types of tasks the model performs | **Likely remove.** Prefer metadata from the catalog model. |
| 3. Advanced settings | **Publish as MaaS** | No (checkbox) | Make the endpoint available as a service through a gateway API | Creates / points at the **MaaS model** object |
| 3. Advanced settings | **Require token authentication** | If MaaS | Extra security for users outside the cluster | Shown under Publish as MaaS |
| 3. Advanced settings | **Custom runtime arguments** | No | Extra runtime args | Optional |
| 3. Advanced settings | **Custom runtime environment variables** | No | Extra env vars | Optional |
| 4. Review | — | — | Confirm before create | Not captured in the screenshots |

OSAC-only (not on this RHOAI wizard): **site / cluster** (where on the grid), **rate / visibility** (catalog publish).

Maps to objects we already named: **Add as AI asset** → AI asset. **Publish as MaaS** → MaaS model. Hardware profile + accelerator + replicas = **Size**.

### 2.4 Model file is location (not a lock matrix)

The old 2.4 table (can be locked / list / user-provided on every property) is **withdrawn**. It over-applied the model-file idea to hardware, MaaS, project, and more. That did not define anything useful: almost every column was “yes.”

Keep one distinction, only for **model file / location**, and show it as **different SKUs** in 2.5 — not as a policy grid:

| How this SKU sets the file | What the user does at launch |
| --- | --- |
| Predefined catalog model | Location comes with the model. No connections step. |
| BYOM | User picks or creates a **connection** to where the file is. |

### 2.5 Models catalog items (seed for UI)

**Why “instruct” was not “the large LLM”:** Instruct is a *capability* (instruction-tuned for pipelines / workflows). Size is a *band* (lightweight 1B–7B vs high-capacity 70B+). Tool calling is another capability. The earlier “LLM — instruct” vs “LLM — tiny” pair wrongly used instruct as the large-size name.

**Embedding:** out of this seed.

**BYOM (`llm-byom`):** keep in this table for later. **Do not include in the UI seed.** Connections and unscoped hardware are out of this pass.

**UI seed (five items):** lightweight text gen, instruct, tool calling, high-capacity reasoning, predictive.

**Card schema (six properties, same keys on every item):** serving engine, CPU, RAM, GPU, max context, target latency. Each value has **Locked** or **Editable** (OSAC catalog field policy — this is the useful grain; the old all-fields matrix is still withdrawn).

Display names on the card use the same lowercase kebab-case as Ethan’s items (`cluster-node-sets-object`). Catalog item ids (`cat-…`) stay in data only; they are not on the card.

| ID | Display name | Description | Serving engine | CPU | RAM | GPU | Max context | Target latency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `llm-lightweight-text-gen` | **llm-lightweight-text-gen** | Low-latency runtime for small-footprint models (1B–7B). Fast, cost-effective text generation, basic summarization, high-throughput classification. Example file class: Ministral-scale. | vLLM **Locked** | 8 vCPU **Editable** | 32 GB **Editable** | 1× NVIDIA L4 (24 GB) **Editable** | 8,192 tokens **Editable** | < 50 ms **Locked** |
| `llm-instruct` | **llm-instruct** | Standardized endpoint for instruction-tuned models in automated backend processes, data pipelines, and scheduled workflows. | vLLM / TGI **Locked** | 16 vCPU **Editable** | 64 GB **Editable** | 1× NVIDIA A10G (24 GB) **Editable** | 16,384 tokens **Editable** | < 150 ms **Locked** |
| `llm-tool-calling` | **llm-tool-calling** | Agentic workflows, function calling, structured API parameter generation, multi-step execution chains. | vLLM (function engine) **Locked** | 32 vCPU **Editable** | 128 GB **Editable** | 1× NVIDIA A100 (80 GB) **Editable** | 32,768 tokens **Editable** | < 200 ms **Locked** |
| `llm-high-capacity-reasoning` | **llm-high-capacity-reasoning** | Multi-GPU blueprint for large-scale models (70B+): complex reasoning, deep analysis, extended context. Example file class: Qwen-scale. | vLLM (tensor parallel) **Locked** | 64 vCPU **Editable** | 512 GB **Editable** | 4× NVIDIA A100 (80 GB) **Editable** | 128,000 tokens **Editable** | < 500 ms **Locked** |
| `predictive` | **predictive** | Low-latency endpoint for classical tabular models (XGBoost, scikit-learn, LightGBM): real-time scoring, classification, regression. Reminds the catalog that data scientists are in scope. | Triton Inference Server **Locked** | 4 vCPU **Editable** | 16 GB **Editable** | None (CPU optimized) **Locked** | N/A (tabular features) **Locked** | < 10 ms **Locked** |
| `llm-byom` | **llm-byom** | User supplies the model file (location via connections). Hardware is not predefined because the model can be any size. **Documented only — not in the UI seed.** | vLLM **Editable** | Set at launch **Editable** | Set at launch **Editable** | Set at launch **Editable** | Set at launch **Editable** | Set at launch **Editable** |

At launch, predefined LLM SKUs still need a **model file** from the RHOAI catalog (location provided). Prototype instantiate: simple form input until the catalog picker exists.

External models stay **out of Catalog and out of Services**. Working rule: MaaS governance only.

### 2.6 Confirm before seeding the UI

- Five SKUs in Catalog (BYOM listed above but not shipped).
- Six card keys; sentence-case labels (**Serving engine**, **Max context**, **Target latency**).
- Shared catalog card + a vision-gated **patterns page** to finalize chrome once (see 2.7).
- **Review existing Services / MaaS / keys / asset lists, then** one master instance + external list (see 2.8). Do not invent that list from Catalog SKUs alone.

### 2.7 Patterns page (not a separate Storybook app)

Do **not** add a Storybook toolchain. Do add one vision-gated page in this prototype (same idea as the archived List patterns page) where we **design the cards once**, then product pages **import those components** — no copy-paste markup per route.

| Component | Finalize here | Reuse on |
| --- | --- | --- |
| **Catalog item card** | Patterns page: five SKUs, Locked / Editable, kebab **Launch instance** | Catalog (all three roles), AI Grid Catalog drawer |
| **On-cluster instance card** (Services) | Patterns page: fleet density + optional compact | Services → Models, AI Grid Services (same list) |
| **MaaS model row / card** | Patterns page: admin extras (subs/policies) vs user slice | MaaS governance; API keys (filter only) |
| **AI asset row** | Patterns page | AI asset endpoints; Playground. Set = LIS marked as assets **∪ all MaaS models** (including externals) |

Review chrome on the patterns page first, then wire routes. If a product page needs a tighter layout (drawer width), that is a **variant prop** on the same component, not a second card.

### 2.8 Existing service lists, then one master list

Catalog SKUs (2.5) are **offers**. They are already iterated. **Do not** skip from those offers to a new instance list.

**Missing step:** inventory every list that already represents running / governed / consumable models, then pick **one** set of on-cluster instances **plus** externals. Pages filter that set.

#### What each surface shows (rules)

| Surface | What it shows |
| --- | --- |
| Catalog / AI Grid Catalog | Five Catalog SKUs (2.5). Not instances. |
| Services / AI Grid Services | On-cluster instances only (no externals) |
| MaaS governance | Instances that are MaaS **plus** all externals |
| API keys (user) | Same MaaS models, only those on a subscription the user can access |
| AI asset endpoints / Playground | On-cluster instances **marked as assets** **plus all MaaS models** (LIS-as-MaaS **and** externals) |

#### Lists in the prototype today (review these)

Names and IDs do not match across pages. This table is the input for the alignment pass — not the target.

| Surface | What you see today (short) |
| --- | --- |
| Catalog (vision) | Five Models SKUs from 2.5 (not Granite 3B instruct). Same list on platform, tenant admin, tenant user, and AI Grid Catalog. |
| AI Grid Services | Granite 3B instruct, Granite 8B instruct, Llama 4 Scout, Mistral 7B, Gemma 3 4B, **Titan Text Express**, **Claude Sonnet 4** (last two are externals — off-target on Services) |
| Services → Models | Instance names such as `model-endpoint-01` (not the same IDs as AI Grid) |
| MaaS governance | Internal examples: granite-3b-code-instruct, llama-3-70b-instruct, mistral-7b-instruct, granite-code-20b, codellama-34b, phi-3-mini, starcoder2-15b, qwen-2.5-coder-32b…, gpt-neo-125m, deepseek-coder-v2-lite, nomic-embed, whisper, falcon, gemma-7b. Externals: gpt-4-turbo, claude-sonnet-4, gemini-1.5-pro, command-r-plus, mistral-large-2 |
| API keys | granite-3b-instruct, llama-3-1-8b-instruct, gpt-4-turbo, mistral-7b-instruct, claude-3-sonnet, codellama-34b, gemma-2-9b |
| AI asset endpoints | Llama 3.2 3B Instruct (namespace), Granite 3 8B Instruct (MaaS), Claude Sonnet 4 (custom), Gemini 2.5 Flash, Nomic Embed, Whisper Large V3, facebook-opt-125m, … |
| Playground | granite-3-8b-instruct |

**Alignment job:** from that table + the five Catalog SKUs, decide which on-cluster instances (tied to those SKUs) and which externals stay in the demo. Then one module holds that set; pages filter. No private `mockData.ts` names after that.

#### Keep-set (confirmed 2026-09-11)

Display names are the **model file chosen at launch**, not the Catalog SKU name. Types below are for this table only — do not show `LLMInferenceService` in the UI.

Type → pages:

- **LLMInferenceService non-MaaS:** Services and AI Grid Services. AI asset / Playground only if marked as an asset.
- **LLMInferenceService MaaS:** Services, AI Grid Services, MaaS governance. Consumer lists (API keys, AI asset, Playground) only when assigned to a gateway.
- **External MaaS:** MaaS governance always. Consumer lists only when assigned to a gateway. Not Catalog. Not Services.

**Granite pairing is story A** (regional doors). **Mistral 7B on `nsb-west`** is the example of one gateway serving instances on different clusters. Titan stays two published refs (duplicate external config), one per front door.

| Model name | Type | Catalog SKU (offer) | Tenant · location | Gateway | Why keep |
| --- | --- | --- | --- | --- | --- |
| Granite 3B instruct | LLMInferenceService MaaS | llm-instruct | North Summit Bank · US East | `nsb-markets` | Instruct SKU; flagship on-cluster MaaS |
| Granite 3B instruct | LLMInferenceService MaaS | llm-instruct | North Summit Bank · EU West | `nsb-retail` | Same offer, second cluster (story A regional door) |
| Mistral 7B | LLMInferenceService MaaS | llm-lightweight-text-gen | North Summit Bank · US West | `nsb-west` (same cluster as the gateway) | Lightweight SKU; MaaS |
| Mistral 7B | LLMInferenceService MaaS | llm-lightweight-text-gen | North Summit Bank · US East | `nsb-west` (gateway hosted on US West) | Same model, other cluster |
| Mistral 7B | LLMInferenceService MaaS | llm-lightweight-text-gen | North Summit Bank · EU West | `nsb-west` (gateway hosted on US West) | Same model, third cluster |
| Llama 4 Scout | LLMInferenceService MaaS | llm-high-capacity-reasoning | BlueSolace · US Central | `bsfg-us` | High-capacity SKU; other-tenant row when the org filter is All |
| Credit-risk scorer | LLMInferenceService non-MaaS | predictive | North Summit Bank · US East | Unassigned | Predictive SKU; **non-MaaS AI asset** so Playground is not MaaS-only |
| Titan Text Express | External MaaS | — (not a Catalog SKU) | North Summit Bank · Bedrock | Two refs: `nsb-markets` and `nsb-retail` | Duplicate external config onto two front doors |
| Claude Sonnet 4 | External MaaS | — (not a Catalog SKU) | North Summit Bank · Anthropic | Unassigned | Unassigned MaaS: MaaS governance only; **not** API keys / assets / Playground |

**Not in this keep-set:** Gemma 3 4B, Granite 8B (BlueSolace unassigned), and the long MaaS/API-keys/asset mock names. **llm-tool-calling** stays a Catalog offer with no running instance yet.

**Counts:** Services / AI Grid Services = 7 on-cluster rows (two Granite, three Mistral, Llama, Credit-risk). MaaS governance = 2 Granite + 3 Mistral + Llama + 2 Titan + Claude = 9. API keys (user subscription) = Granite 3B instruct, Mistral 7B, Titan Text Express. Playground / AI assets = assigned MaaS (Granite, Mistral, Llama, Titan; unique by model) **plus** Credit-risk scorer as the non-MaaS asset. Claude is not in consumer lists.

#### Card and consume chrome (Patterns, 2026-09-14)

On **Patterns → Instance lists** (not live pages yet):

| Surface | Properties / Model column |
| --- | --- |
| Services page cards | Model, Size, Cluster, Gateway (`host-cluster: gateway-id` + filled **MaaS**). Title link, catalog item name as secondary, **Created**. **Tenant** only for platform admin. |
| AI Grid Services cards | Same four properties. Compact: smaller icon inline with the title. No Created. |
| Nested on cluster details | Omit Cluster. Include on-cluster instances **and** externals whose gateway is hosted on that cluster. |
| Nested on gateway details | Omit Gateway. Filled **MaaS** label to the right of the display name. Include every instance (on-cluster and external) on that gateway. `nsb-west` is the cross-cluster example (three Mistral 7B instances). |
| MaaS / API keys / AI assets / Playground | Display name, MaaS model ref id, description stacked (PF utilities, no Content, no custom CSS). Filled labels (Ethan). MaaS gov: Internal / External. Assets + Playground **menu**: **MaaS** when published. Playground **toggle**: display name only. Unassigned MaaS is not in consumer lists. |

Do **not** use grey cluster-id chips on these cards. **Tenant** is omitted for tenant admin and tenant user.

---

## 3. Other objects (short definitions)

### Gateway

A gateway lives on exactly one cluster. A cluster can have many gateways. A commercial organization can have many gateways (region or business unit). The org does not have a single region; gateway region is the front door’s cluster, not “where the org lives.”

**Cardinality (agreed for the mock, either routing story):**

- An on-cluster instance (`LLMInferenceService`) maps to **zero or one** gateway. Unassigned = no gateway.
- A gateway may list **many** instances. Those instances may live on **the same cluster as the gateway or on a different cluster**.
- **On a gateway** ≠ **MaaS**. MaaS means published as a service on that gateway.
- Replica count / llm-d is **Size** on the instance, not extra gateways.
- Fleet traffic lines (request-time mesh) stay parked.
- External models have no GPU placement. To expose the same provider model on more than one front door, **duplicate the MaaS config**: one published ref per gateway (Titan on `nsb-markets` and Titan on `nsb-retail`).

**Routing stories:**

| | **Story A — regional doors** (Granite pairing) | **Cross-cluster gateway** (Mistral on `nsb-west`) |
| --- | --- | --- |
| Client entry | US clients hit `nsb-markets` (hosted on US East). EU clients hit `nsb-retail` (hosted on EU West). | Clients hit `nsb-west` (hosted on US West). |
| Instances | Each Granite is local to its door: US East → `nsb-markets`; EU West → `nsb-retail`. | Three Mistral 7B instances: US West (same cluster as the gateway), US East, and EU West. |
| Why it is in the mock | Data residency and in-region ingress for Granite. | Shows one gateway handling models that live on other clusters, without changing the Granite story. |

Story B (one Granite door, two backends) is **not** the working seed. Traffic lines stay parked.

### On-cluster instance vs external model

| | On-cluster instance | External model |
| --- | --- | --- |
| How inference runs | On a cluster in this platform (from a Models catalog item) | Off-platform provider (**Served by**) |
| RHOAI name | `LLMInferenceService` (do not show in the UI) | External model |
| UI chip today | None for serving kind | Purple **External** (RHOAI single-cluster language; see §1 location table) |
| Size | Yes (realized capacity) | No — show **Served by** |
| Catalog / Services | Launched from a Models catalog item; lives on the **same Services list** as AI Grid | **Neither**, for now |
| Consume path | Can be an **AI asset** without MaaS. If it is a **MaaS model assigned to a gateway**, it is also an AI asset. | Assigned to a gateway → subscriptions / AI asset / Playground. Unassigned MaaS stays on MaaS governance only. |
| MaaS governance | Shown when enabled as a MaaS model | Shown (this is its management surface) |

### MaaS model vs AI asset

These **include** an on-cluster instance (or, for MaaS only, an external model). They are not a second model with a different name.

| | **MaaS model** | **AI asset** |
| --- | --- | --- |
| What it is | Published as a service | Callable endpoint + Playground picker (**same object**) |
| Admin surface | MaaS governance: every MaaS model, plus **which subscriptions and policies** it is assigned to | — |
| User surface | API keys / subscriptions: only MaaS models on a **subscription the user can access** (requires a gateway) | AI asset endpoints; Playground: asset-flagged LIS **plus assigned MaaS models** |
| On-cluster instance | Optional (LIS can exist without MaaS) | Yes if marked as asset, **or** if it is MaaS assigned to a gateway |
| External model | Required path (external is MaaS-only) | Yes when assigned to a gateway — unassigned externals stay on MaaS governance only |

#### MaaS model — admin view vs user view

Same object, same IDs. Not two lists to invent separately.

| | **Admin** (MaaS governance) | **User** (API keys / subscriptions) |
| --- | --- | --- |
| Which MaaS models | All published MaaS models they govern | Only those on a subscription they have access to |
| Extra details | Subscription assignment, authorization policies, coverage (configured / missing sub or policy) | Token limits and other consume details for *that* subscription |
| Job | Govern who can use the model and under what policy | Call the model they are entitled to |

---

## 4. Property dictionary

“Explicit” means stored on that object. “Implicit” means the UI can show it because the object includes another object that has it.

| Property | Meaning | Example | Explicit on | Implicit through inclusion |
| --- | --- | --- | --- | --- |
| **Display name** | Human name. Bold title. | Offer: `LLM inference endpoint — instruct`. Instance/file: `Granite 3B instruct`. External: `Titan Text Express` | Catalog item, model file, on-cluster instance, external model, MaaS model, AI asset | Instance may show the catalog item name and/or the chosen model file. MaaS and AI asset inherit from the included instance or external model. |
| **Model ID** | API identifier of the **model file in use**. Monospace. | `granite-3b`, `titan-express` | Model file; instance and external model once a file is chosen | Not always present on a catalog item (BYOM / list until launch). Catalog cards today wrongly show catalog item ID here (`cat-granite-3b-instruct`). Instantiate: simple form input until a catalog picker exists. |
| **Catalog item ID** | ID of the OSAC offer. Not the model ID. | `cat-llm-instruct` (today: `cat-granite-3b-instruct`) | Catalog item | Instance knows which offer launched it. |
| **Field modes** | Per-field locked / list / user-provided | Model file locked vs BYOM | Catalog item | Instance stores the resolved values after launch. |
| **Description** | Supporting copy. User-facing, not design notes. | Catalog lede | Catalog item, MaaS model, AI asset | Not on AI Grid instance cards today. |
| **Status** | Lifecycle of **this** object on **this** page. | `Live`, `Ready`, `Running`, `Subscribed` | Each object has its own status | Do not reuse catalog Live as instance Ready. |
| **Location** | This cluster / another cluster / off-platform. Replaces a single **External** chip in the fleet. | See §1 | On-cluster instance (this vs another cluster); external model (off-platform) | MaaS model inherits location from the included object. Labels TBD. |
| **Cluster** | Where the on-cluster instance or gateway lives. | `ocp-us-east-1` | Instance, gateway | Catalog **offer** has no cluster; its **instances** do. |
| **Size** | Serving capacity (replicas, accelerators). **Not** file bytes. | `2 replicas · 1× NVIDIA H100 80 GB` | Catalog item (if locked); instance (realized) | External models: no Size. |
| **Served by** | Remote provider (off-platform only). | `Amazon Bedrock` | External model | MaaS model when it includes that external model. |
| **Gateway** | The one gateway this instance is added to, or Unassigned. A gateway’s own list may include many instances. | `nsb-markets` | Assignment on the instance (zero or one) | MaaS implies that one gateway is a MaaS front door. Externals: one published ref per gateway if duplicated. |
| **Gateway cluster** | Cluster the **gateway** lives on. | `ocp-eu-west-1` next to `nsb-retail` | Gateway | Show when it differs from the model’s cluster (live). |
| **MaaS** | This object **is** a MaaS model (published as a service). | Blue **MaaS** | MaaS model | — |
| **Unassigned** | No gateway. Grey pill, sentence-case **Unassigned**. | Granite 8B instance today | Absence of gateway IDs | — |
| **Tenant** | Commercial org. | `North Summit Bank` | Cluster, gateway, instance, catalog VIP scope | Included objects inherit tenant. |
| **Project** | Namespace on the cluster. | `ml-project` | Instance | Catalog offer has no project until launched. |
| **Rate** | Price of the catalog offer. | `$6.40/hr` | Catalog item | Not on instances. |
| **Use case / capabilities** | Why this asset exists. | `General chat`; tool / vision chips | AI asset | Playground is the same object. |
| **Endpoints** | URLs for the asset. | Playground / popover | AI asset | Points at the included LIS or MaaS (including external) model. |
| **Token limits / subscriptions / policies** | MaaS consumption controls. **Admin** sees which subscriptions and policies the model is assigned to. **User** sees limits only for a subscription they can access. | Tokens per 24 hours; policy names | MaaS model | User API keys show a filtered view of this same object. |

### Size (full definition)

**Size** is serving capacity, not file size.

1. **Models catalog item** — Saved default or locked capacity (replica count and accelerator). Only present if the admin defined it.
2. **On-cluster instance** — That capacity as realized on a cluster.
3. **External model** — No Size. Show **Served by**.
4. **Model file** — RHOAI may show artifact metadata; that is not this Size field.

---

## 5. State on each page

The state row is “what lifecycle this object is in **here**.” Do not mix catalog publish state with instance health or gateway assignment.

| Page | Object on that page | State to convey |
| --- | --- | --- |
| Model catalog settings | Catalog *sources* (not the files themselves as a picker) | Source ready / failed / disabled. |
| Instantiate (launch) | Model file field on a catalog item | Simple form input for now; not a catalog picker. |
| Catalog page and AI Grid Catalog | OSAC catalog item (**same list**) | Publish state **Live** / **Unpublished**. |
| Services → Models and AI Grid Services → Models | On-cluster instance (**same list**) | Power / health **Running** / **Stopped** or **Ready** / **Starting**; gateway **Unassigned** or assigned (+ **MaaS** if it is a MaaS model). Not external models (target). |
| AI Grid cluster details | Same Services list, scoped to one cluster | Same as Services; **do not** repeat Cluster as a spec row. |
| AI Grid gateway details | On-cluster instances on this gateway | Status. Cluster on the card is the **model’s** cluster. |
| MaaS governance | **MaaS model**, admin view | Enabled; assigned subscriptions and policies; location of the included object (this cluster / another cluster / off-platform — labels TBD). |
| API keys → Subscriptions → Models | **Same MaaS model**, user view | Only models on a subscription the user can access; token limits for that subscription. |
| AI asset endpoints | **AI asset** | **Ready** / **Inactive**. |
| Playground | **Same AI asset** | Selected in the picker. |

---

## 6. What the live prototype shows today (do not treat as the target)

Each surface still has its own mock list. That is the problem this pass is defining, not implementing yet.

| Surface | What you see today (examples) | Object on that page | Target (from §1) |
| --- | --- | --- | --- |
| Catalog page and AI Grid Catalog | Five Models SKUs from 2.5 (`cat-llm-lightweight-text-gen`, `cat-llm-instruct`, `cat-llm-tool-calling`, `cat-llm-high-capacity-reasoning`, `cat-predictive`). Same list on platform, tenant admin, and tenant user. Plus Ethan’s cluster / bare metal / VM SKUs. | Catalog offer | **Same list** on both surfaces (done for Catalog) |
| Services → Models | Instance names such as `model-endpoint-01` | On-cluster instance | **Same list** as AI Grid Services |
| AI Grid Services → Models | Granite 3B, Granite 8B, Llama 4 Scout, Mistral 7B, **Titan Text Express, Claude Sonnet 4** | Instance **and** external (off-target) | On-cluster instances only; externals move to MaaS governance |
| MaaS governance | `granite-3b-code-instruct`, `llama-3-70b-instruct`, `mistral-7b-instruct`, plus more | Mix of on-cluster and external, but **not** the same IDs as Catalog/Services | **MaaS model** list: on-cluster instances that are MaaS **and** external models |
| API keys | `granite-3b-instruct`, `llama-3-1-8b-instruct`, `mistral-7b-instruct` | Treated as a separate mock list | **Same MaaS models**, user view: only models on subscriptions they can access |
| AI asset endpoints | `llama-3-2-3b`, `granite-3-8b-instruct` | Treated as a separate object | **AI asset** (same as Playground) |
| Playground | `granite-3-8b-instruct` | Treated as a separate object | **Same AI asset** |
| Model catalog settings | Catalog sources (YAML / Hugging Face, …) | Sources, not a file picker | Keep. Launch still uses a **simple form input** for the model file |

### Seed examples still in the AI Grid (North Summit Bank unless noted)

These are **instances and external models**, not a Models catalog. They stay until we replace them with a world that follows §2.

| Seed | Object | Cluster | Gateway |
| --- | --- | --- | --- |
| Granite 3B instruct on US East (`dep-granite-east`) | Instance of today’s `cat-granite-3b-instruct` | `ocp-us-east-1` | `nsb-markets` (same cluster, MaaS) and `nsb-retail` (other cluster `ocp-eu-west-1`, MaaS) |
| Granite 3B instruct on EU West (`dep-granite-eu`) | Same catalog offer, second instance | `ocp-eu-west-1` | `nsb-retail` only (same cluster, MaaS) |
| Mistral 7B on US West | Instance, attached, not MaaS | `ocp-us-west-1` | `nsb-west` (same cluster, no MaaS chip) |
| Granite 8B (BlueSolace) | Instance, no gateway | `ocp-eu-west-2` | **Unassigned** |
| Titan Text Express | External model | `ocp-us-east-1` / `ml-project` | `nsb-markets` (same cluster, MaaS) and `nsb-retail` (other cluster, MaaS) |
| Claude Sonnet 4 | External model | `ocp-us-east-1` / `ml-project` | **Unassigned** |

### Designer-iteration copy (Decision 5 — removed from Catalog details)

Removed from model catalog details: heading **Model serving preset**, **Kind** row, the “Place this preset on the AI Grid…” paragraph, and kebab/primary **Place on AI Grid**. Instantiate uses **Launch instance**.

---

## 7. Fleet list rules (live)

These are the **current live** AI Grid card rules. They still use grey cluster-id labels, a single **External** chip, and still put Titan/Claude on Services. **Patterns → Instance lists** (2026-09-14) is the target chrome for the next live pass: four properties, `cluster: gateway` text, filled **MaaS** only, no cluster-id chips.

Target location language is in §1 (`this cluster` / `another cluster` / `off-platform`).

Assume the reader is looking at a **fleet**, not “inside one cluster.”

Property order on a model card:

1. **What the model is** — **Size** (on-cluster instance) or **Served by** (external model).
2. **Where it is served** — **Cluster**.
3. **How it is reachable** — **Gateway**, in the same value column as Size and Cluster (not stacked under the Gateway label).

Then:

1. Serving-kind chip is **External** only. Do not show **On cluster**.
2. **Cluster** ids are grey PatternFly labels in the body font (not monospace on gateway lines). Outline = this cluster (the model’s cluster, or a gateway on that cluster). Filled = another cluster.
3. Fleet lists always show a cluster id on every gateway line.
4. **No gateway:** grey **Unassigned** pill in the Gateway value.
5. **Do not duplicate Cluster** when the page is already a cluster (cluster details: omit Cluster on nested model cards; gateway lines only show a filled label when that gateway is on another cluster).
6. **Gateway details:** keep Cluster on each model card as a label (outline if the model lives on this gateway’s cluster, filled if it lives elsewhere) so same vs other is obvious.
7. **Gateway cards** (Services list and nested gateway lists): **Models** count (`1 model` / `N models`). Omit Cluster on gateway cards when you are already on that cluster’s details.

Inside **cluster details**, skip Cluster on nested model cards. Gateway details still show the model’s Cluster as a label, because models on that gateway can live elsewhere.

---

## URLs

- Provider AI Grid: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=vision-model-fleet`
- Tenant Admin AI Grid (North Summit Bank): `http://127.0.0.1:5184/tenant-admin/northsummit/workspace?vision=model-fleet&nav=vision-model-fleet`
- List patterns (archived, not in the app): `.artifacts/ai-grid-model-fleet/archive/`
- Catalog: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=catalog`
- Services → Models: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=services-models`
- MaaS governance: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=ai-maas-governance`
- API keys: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=genai-api-keys`
- AI asset endpoints: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=genai-asset-endpoints`
- Patterns → Instance lists: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=vision-model-catalog-patterns`
