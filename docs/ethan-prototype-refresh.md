# Ethan prototype refresh

## Refresh baseline

The refreshed baseline is Ethan's `upstream/main` at `667f310`, merged in commit `d9c7719`.
Files changed by both the OSAC model-fleet branch and Ethan's update use Ethan's version in the
main app. This keeps the provider and tenant routes current while preserving the prior complete
prototype at `public/legacy-prototype/`.

The landing page links to **Previous prototype (TO BE REMOVED)**. The archive is a built,
interactive snapshot with a persistent banner on every route. Its source remains available in Git
history before the baseline refresh.

## Ethan's pages now used by the main app

- **Provider Catalog and authoring:** `ProviderAdminCatalogPage.tsx` and
  `ProviderSetupPublishCatalogWizard.tsx`, including Ethan's Service, General, Hardware, OS,
  Node topology, field-policy, Visibility, and Review patterns.
- **Tenant Catalog and launch:** tenant Catalog pages and item details, plus
  `TenantUserLaunchInstanceWizard.tsx` and the updated Services instance list.
- **Provider and tenant workspaces:** refreshed workspace shells and navigation, Catalog detail
  views, and landing page.
- **Additional Ethan work:** organization and project workflows, external networks and other
  networking pages, tenant Secrets, and billing/M360 pages.

## Model-fleet work retained

- The current model authoring previews are available from **Model authoring flows** on the
  landing page. They follow Ethan's refreshed wizard card patterns and show Catalog item creation
  and Model service launch.
- The refreshed Catalog pages now show the five existing Models offers, their locked/editable
  properties, and the confirmed model-choice policies: `predictive` is BYOM, `llm-tool-calling`
  uses one administrator-selected model, and `llm-instruct` offers a predefined set. The
  lightweight and high-capacity offers remain explicitly undecided for model choice.
- The refreshed Models Services list now shows the seven confirmed on-cluster examples from the
  local model-fleet inventory. Off-platform models stay out of Services.
- The model offers use `src/vision/modelCatalogSeed.ts`; the instance examples are in
  `src/vision/modelInstanceSeed.ts`.
- The full pre-refresh prototype at `public/legacy-prototype/` preserves the earlier model fleet,
  Catalog and Services views, and other local UI additions for comparison. Those older routes are
  marked **TO BE REMOVED** in the archive.

## Remaining model-flow work

- Finish connecting the model-source policies to the live Catalog launch wizard so a deployed
  instance records the selected or supplied model and appears in Services with its realized
  settings. BYOM remains a configuration of `predictive`, not a Catalog item.
- Decide which existing item, if any, demonstrates selection from the full configured catalog.
- Resolve OSAC Secret creation/reference behavior and the remaining YAML view/authoring follow-up.
- Confirm whether any model properties should be hidden; none are assigned to that category yet.
