/** Client artifact methods never participate in application input or Session capture. */
export const presentationMethods = {
  presentation: 'postcode/presentation@40',
  contributionPresentation: 'postcode/contribution-presentation@6',
  exportsPresentation: 'postcode/module-exports-presentation@10',
} as const;

/** Record only the Presentations responsible for the delivered artifact. */
export function artifactMethods(application: readonly string[], view: { readonly schema: string; readonly mechanical?: { readonly schema: string } | null }): readonly string[] {
  if (view.schema === 'postcode-contribution-view/1-experimental') return [...(view.mechanical ? artifactMethods(application, view.mechanical) : application), presentationMethods.contributionPresentation];
  return [...application, view.schema === 'postcode-module-exports-view/1-experimental' ? presentationMethods.exportsPresentation : presentationMethods.presentation];
}
