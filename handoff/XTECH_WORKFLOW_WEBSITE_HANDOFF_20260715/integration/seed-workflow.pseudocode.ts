export async function seedWorkflow(payload: Payload) {
  const assets = await readJson('seed/workflow-assets.json')
  const stages = await readJson('seed/workflow-stages.json')
  const page = await readJson('seed/workflow-page.json')
  const sitemapPatch = await readJson('seed/sitemap-patch.json')
  const productPatches = await readJson('seed/product-page-patches.json')

  const mediaByCode = new Map<string, string>()

  for (const asset of assets) {
    const media = await upsertMediaByAssetCode(payload, asset)
    mediaByCode.set(asset.code, media.id)
  }

  for (const stage of stages) {
    await upsertWorkflowStage(payload, {
      ...stage,
      image: mediaByCode.get(stage.imageCode),
    })
  }

  await upsertPageBySiteLocaleSlug(payload, resolveAssetCodes(page, mediaByCode))
  await patchCorporateMenu(payload, sitemapPatch)
  await patchProductPages(payload, productPatches, mediaByCode)
}
