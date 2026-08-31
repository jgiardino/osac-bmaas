# Model list inventory

How “a model” shows up across OSAC and RHOAI. Start with **objects**, then the **property dictionary**, then **where those objects appear**. Do not show custom-resource names (`LLMInferenceService`, `MaasModelRef`) in the UI.

Live AI Grid (2026-08-28) follows the fleet rules below. MaaS governance, API keys, AI asset endpoints, and Services → Models are **not** rewritten yet.

## Future refine (parked) — one demo model list

The model **names, IDs, and object types** are not shared across pages. Each surface has its own mock list. Do not reconcile this in the current prototype pass.

| Surface | What you see today (examples) | Object on that page |
| --- | --- | --- |
| OSAC Catalog / AI Grid Catalog | Granite 3B instruct (`cat-granite-3b-instruct`), plus Ethan’s cluster / bare metal / VM SKUs | Catalog offer |
| AI Grid Services → Models | Granite 3B, Granite 8B, Llama 4 Scout, Mistral 7B, Titan Text Express, Claude Sonnet 4 | On-cluster instance or external model |
| Services → Models | Instance names such as `model-endpoint-01` | Launched tenant instance |
| MaaS governance | `granite-3b-code-instruct`, `llama-3-70b-instruct`, `mistral-7b-instruct`, plus more | MaaS-enabled model |
| API keys | `granite-3b-instruct`, `llama-3-1-8b-instruct`, `mistral-7b-instruct` | Models on a subscription |
| AI asset endpoints | `llama-3-2-3b`, `granite-3-8b-instruct` | Asset endpoint |
| Playground | `granite-3-8b-instruct` | Playground model picker |

Later work: pick one North Summit Bank demo set and reuse it (or a clear subset) on every consume and management page so a model you place on the grid is the same model you govern, subscribe to, and call.

## 1. Objects in the model lifecycle

An object can **include** another object. Inclusive means the parent carries the child’s identity and properties (explicitly, or implicitly so the UI can show them without duplicating the child).

| Object | What it is | Inclusive of | Surfaces in this prototype |
| --- | --- | --- | --- |
| **Model file** | Artifact in the RHOAI model catalog (weights / image a serving config can point at). Not a running instance. | — | RHOAI model catalog (not in this repo). OSAC catalog items point at it (`diskImageLabel`, model ID). |
| **OSAC catalog item (models)** | Saved configuration used to launch an `LLMInferenceService`: model file pointer, size/profile, rate, visibility. An offer, not MaaS. | Model file + saved serving config (size, accelerators, replicas) + rate | Catalog; AI Grid Catalog. Blue **Model** chip (singular). |
| **`LLMInferenceService` instance** | One running (or starting) serving instance launched from an OSAC catalog item, on one cluster, in one project. | Model file + OSAC catalog config, plus runtime: cluster, project, status, traffic, realized Size | OSAC Services → Models; AI Grid Services → Models (on-cluster cards). No serving-kind chip in the fleet. |
| **External model custom resource** | Object in a project on a cluster. Inference is a remote provider (Bedrock, Anthropic, and more). Not an `LLMInferenceService`. | Display name, model ID, served-by provider, cluster, project. Optionally one or more gateways. | AI Grid Services → Models (purple **External** chip). Chat Gateway “External providers” table is the same object on a gateway. |
| **`MaasModelRef`** | A model enabled for Model as a Service (MaaS): subscriptions, policies, API keys. | **Either** an `LLMInferenceService` **or** an external model | MaaS governance; API keys → Subscriptions → Models |
| **AI asset endpoint** | A model endpoint exposed as an AI asset (URL, capabilities, ready/inactive). | A deployment / MaaS-enabled model (the asset points at it) | AI asset endpoints |

**Gateway** is not a model object. It is an assignment target. A model instance or external model can be on zero, one, or many gateways. Being on a gateway is not the same as MaaS: MaaS means published as a service on that gateway.

**Cluster** is where an instance or external-model custom resource lives. A gateway also lives on exactly one cluster. Same-cluster vs other-cluster is **location of the gateway relative to the model**, not serving kind.

### Seed examples (North Summit Bank unless noted)

| Seed | Object | Cluster | Gateway |
| --- | --- | --- | --- |
| Granite 3B instruct on US East (`dep-granite-east`) | `LLMInferenceService` instance of catalog item `cat-granite-3b-instruct` | `ocp-us-east-1` | `nsb-markets` (same cluster, MaaS) and `nsb-retail` (other cluster `ocp-eu-west-1`, MaaS) |
| Granite 3B instruct on EU West (`dep-granite-eu`) | Same catalog offer, second instance | `ocp-eu-west-1` | `nsb-retail` only (same cluster, MaaS) |
| Mistral 7B on US West | Instance, attached, not MaaS | `ocp-us-west-1` | `nsb-west` (same cluster, no MaaS chip) |
| Granite 8B (BlueSolace) | Instance, no gateway | `ocp-eu-west-2` | **Unassigned** |
| Titan Text Express | External model custom resource | `ocp-us-east-1` / `ml-project` | `nsb-markets` (same cluster, MaaS) and `nsb-retail` (other cluster, MaaS) |
| Claude Sonnet 4 | External model custom resource | `ocp-us-east-1` / `ml-project` | **Unassigned** |

## 2. Property dictionary

Properties first. “Explicit” means stored on that object. “Implicit” means the UI can show it because the object includes another object that has it.

| Property | Meaning | Example | Explicit on | Implicit through inclusion |
| --- | --- | --- | --- | --- |
| **Display name** | Human name. Bold title. | `Granite 3B instruct`, `Titan Text Express` | Model file, OSAC catalog item, instance (via preset), external model, `MaasModelRef`, AI asset | Instance from catalog item; `MaasModelRef` from LIS or external model; AI asset from the model it exposes |
| **Model ID** | API identifier. Monospace under the title. | `granite-3b`, `titan-express` | Same as display name | Same inclusion path. Catalog **offer** cards currently show catalog item ID here (`cat-granite-3b-instruct`) instead of model ID. |
| **Catalog item ID** | ID of the OSAC saved config. Not the model ID. | `cat-granite-3b-instruct` | OSAC catalog item | Instance knows which offer launched it (`catalogItemId` / preset). |
| **Description** | Supporting copy. | Catalog lede; MaaS / API keys / AI asset blurbs | Catalog item, `MaasModelRef`, AI asset | Not on AI Grid instance cards. |
| **Status** | Health or power of **this** object on **this** page. | `Ready`, `Starting`, `Running`, `Stopped`, `Live`, `Unpublished`, `Inactive` | Each object has its own status; do not reuse one status for another object | — |
| **Serving kind** | How inference runs. UI chip only for **External**. Cluster instances have no chip; Cluster is the property. | Purple **External** | External model (explicit). Instance is on-cluster by definition. | `MaasModelRef` inherits Internal vs External from the included LIS or external model. MaaS governance already uses outline Internal / External for this. |
| **Cluster** | Cluster the instance or external-model custom resource lives on. Fleet lists show this. Omit it when you are already inside that cluster’s details. | `ocp-us-east-1` | Instance, external model, gateway (gateway’s own cluster) | `MaasModelRef` / AI asset only if you surface the included instance or CR. Catalog **offer** has no cluster; its **instances** do. |
| **Size** | Serving capacity of a **saved config** or a **running LIS instance**: replica count and hardware. **Not** the byte size of a model file. | Catalog offer: `2 replicas · 1× NVIDIA H100 80 GB` (`instanceTypeLabel`). AI Grid instance: `2× · 1 GPU` (`VisionDeployment.replicas`, copied at launch). Services → Models: `2 vCPU · 8 GiB · 1 replica` plus a **Model profile** such as `Inference small`. | OSAC catalog item (saved instance type / profile). LIS instance (realized at launch). | `MaasModelRef` / AI asset only if they include an LIS instance. **External models do not have Size**; they use **Served by**. |
| **Model profile** | Named serving profile from the catalog config (tenant Services → Models). | `Inference small` | OSAC catalog / LIS instance in Services → Models | Included by the instance; not shown on AI Grid cards today. |
| **Served by** | Remote inference provider for an external model. | `Amazon Bedrock`, `Anthropic` | External model | `MaasModelRef` when it includes that external model. |
| **Gateway** | Gateways this object is added to. | `nsb-markets`, `nsb-retail` | Assignment on the instance (`attachedGatewayId`, `maasGatewayIds`) or external model (`gatewayIds`) | `MaasModelRef` implies at least one MaaS gateway. |
| **Gateway cluster** | Cluster the **gateway** lives on. Show next to the gateway name when it differs from the model’s cluster (live). Optional pattern: always show it. | `ocp-eu-west-1` next to `nsb-retail` for Granite on US East | Gateway object (`gateway.clusterId`) | Compared to the model’s cluster to decide whether to reveal it. |
| **MaaS** | Published as a service on that gateway. Not the same as “on a gateway.” | Blue **MaaS** on `nsb-markets` for Granite US East | Instance `maasGatewayIds`; external model currently treated as MaaS when listed on a gateway | `MaasModelRef` **is** this enablement. |
| **Unassigned** | No gateway. Grey pill, hollow circle, sentence-case **Unassigned**. | Claude; Granite 8B | Absence of gateway IDs | — |
| **Tenant** | Commercial org. Provider-admin footer. | `North Summit Bank` | Cluster, gateway, instance, external model, catalog VIP scope | Included objects inherit the tenant of the CR / instance. |
| **Project** | Namespace on the cluster. | `ml-project`, `bsfg-models` | Instance, external model; Services → Models instances | Catalog offer has no project until launched. |
| **Traffic** | Observed load on an instance. | `12.4 req/min` | LIS instance (AI Grid details) | — |
| **Rate** | Price of the catalog offer. | `$6.40/hr` | OSAC catalog item | Not on instances. |
| **Use case / capabilities** | Why this asset exists; what it can do. | `General chat, Code generation`; chips for tools, vision | AI asset endpoint | Not on AI Grid instance cards. |
| **Endpoints** | URLs for the asset. | Playground / popover | AI asset endpoint | Points at the included model’s serving URL. |
| **Token limits / subscriptions / policies** | MaaS consumption controls. | Tokens per 24 hours; subscription display name | `MaasModelRef` / subscription `modelRefs` | API keys read these from the subscription. |

### Size (full definition)

**Size** is serving capacity, not file size.

1. **OSAC catalog item (models)** — Saved `LLMInferenceService` configuration: replica count and accelerator from the catalog instance type. Granite 3B instruct: `2 replicas · 1× NVIDIA H100 80 GB`.
2. **LIS instance** — That config as realized on a cluster. AI Grid mock stores it on the instance as `replicas` (`2× · 1 GPU`). Services → Models uses a fuller string (`2 vCPU · 8 GiB · 1 replica`) and a separate **Model profile**.
3. **External model** — No Size. Show **Served by**.
4. **Model file** — RHOAI may show artifact metadata; that is not this Size field.

## 3. State on each page

The state row is “what lifecycle this object is in **here**.” Do not mix catalog publish state with instance health or gateway assignment.

| Page | Object on that page | State to convey |
| --- | --- | --- |
| RHOAI model catalog | Model file | File is in the catalog (not an OSAC instance). |
| OSAC Catalog / AI Grid Catalog | OSAC catalog item | Publish state **Live** / **Unpublished**. AI Grid Catalog currently emphasizes **Model** + instance count instead of Live. |
| OSAC Services → Models | LIS instance | Power **Running** / **Stopped**. |
| AI Grid Services → Models | LIS instance **or** external model | Health **Ready** / **Starting**; serving kind **External** when applicable; gateway **Unassigned** or assigned (+ **MaaS** if published). |
| AI Grid cluster details | Same objects, already scoped to one cluster | Same as Services, but **do not** repeat Cluster as a spec row. |
| AI Grid gateway details | Models on this gateway (`MaasModelRef` in practice) | Status + **External** when applicable. Cluster on the card is the **model’s** cluster (useful when it is not this gateway’s cluster). |
| AI asset endpoints | AI asset endpoint | Endpoint **Ready** / **Inactive**. |
| MaaS governance | `MaasModelRef` | Enabled for MaaS; Internal vs External is serving kind of the included object. |
| API keys → Subscriptions → Models | `MaasModelRef` on a subscription | Subscribed; token limits. |

## 4. Pages compared (header / summary / details)

| | AI Grid Services Models | Services Models | AI Asset Endpoints | API Keys > Subscriptions > Models | MaaS Governance |
| --- | --- | --- | --- | --- | --- |
| **Object** | LIS instance or external model custom resource | LIS instance | AI asset endpoint (includes a model) | `MaasModelRef` | `MaasModelRef` (includes LIS or external model) |
| **State** | Ready / Starting; External chip when needed; Unassigned or gateway (+ MaaS) | Running / Stopped | Ready / Inactive | Subscribed; token limits | Enabled; Internal / External serving kind |
| **List item header** | Display name bold. Model ID monospace. Filled **Ready**. Purple **External** only for external models. No **On cluster** chip. | Instance name bold (`model-endpoint-01`). Catalog display name secondary. Filled **Running** / **Stopped**. No model ID. | Display name bold. Model ID monospace. Description. Blue **Embedding** when embedding. | Display name bold. Model ID. Description. | Display name bold. Outline **Internal** / **External**. Description clamp. |
| **Summary details** | **Size** or **Served by**, then **Cluster** (outline grey label), then **Gateway** (cluster id labels: outline same cluster, filled other cluster, body font). Footer **Tenant**, then **Project**. | **Model**, **Model profile**, **Size**. Footer **Project**, **Created**. No tenant (tenant-user page). | Use case; capability chips; outline Ready / Inactive; endpoints popover; playground. | **Project**; **Token limits**. | Subscriptions count; authorization policies count. |
| **Full details** | Display name, model ID, size, traffic, tenant, project. Cluster **card**. Gateway cards (cluster spec only when the gateway is on another cluster). Other instances of the same catalog offer. | Overview spec: Model, Model profile, Size, Replicas, plus instance chrome. | No details page. Endpoint in popover. | No extra model page. | Expanded: subscriptions and policies side by side. |

## 5. Fleet list rules (live)

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

## URLs

- Provider AI Grid: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=vision-model-fleet`
- Tenant Admin AI Grid (North Summit Bank): `http://127.0.0.1:5184/tenant-admin/northsummit/workspace?vision=model-fleet&nav=vision-model-fleet`
- List patterns (archived, not in the app): `.artifacts/ai-grid-model-fleet/archive/`
- Catalog: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=catalog`
- Services → Models: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=services-models`
- MaaS governance: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=ai-maas-governance`
- API keys: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=genai-api-keys`
- AI asset endpoints: `http://127.0.0.1:5184/provider/workspace?vision=model-fleet&nav=genai-asset-endpoints`
