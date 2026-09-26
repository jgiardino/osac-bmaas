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
- `src/vision/modelCatalogSeed.ts` remains available as the earlier model-property inventory;
  Ethan's refreshed Catalog details do not use it yet.
- The full pre-refresh prototype at `public/legacy-prototype/` preserves the earlier model fleet,
  Catalog and Services views, and other local UI additions for comparison. Those older routes are
  marked **TO BE REMOVED** in the archive.

## Deferred until after the wizard pass

- Update existing Catalog and Services item details to reflect the finalized wizard properties and
  the confirmed examples: `predictive` uses BYOM, `llm-tool-calling` uses one fixed model, and
  `llm-instruct` offers a predefined set. BYOM is not a separate Catalog item.
- Decide which existing item, if any, demonstrates selection from the full configured catalog.
- Resolve OSAC Secret creation/reference behavior and the remaining YAML view/authoring follow-up.
- Confirm whether any model properties should be hidden; none are assigned to that category yet.
