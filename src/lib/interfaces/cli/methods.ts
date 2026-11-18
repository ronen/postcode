/** Client artifact methods never participate in application input or Session capture. */
export const presentationMethods = {
  presentation: 'postcode/presentation@40',
  contributionPresentation: 'postcode/contribution-presentation@2',
  investigationPresentation: 'postcode/investigation-presentation@23',
  exportsPresentation: 'postcode/module-exports-presentation@10',
} as const;

/** Record only the Presentations responsible for the delivered artifact. */
export function artifactMethods(application: readonly string[], view: { readonly schema: string; readonly investigations?: unknown; readonly mechanical?: { readonly schema: string } | null }): readonly string[] {
  if (view.schema === 'postcode-contribution-view/1-experimental') return [...(view.mechanical ? artifactMethods(application, view.mechanical) : application), presentationMethods.contributionPresentation];
  const mechanical = view.schema !== 'postcode-investigation-view/1-experimental';
  return [...application,
    ...(mechanical ? [view.schema === 'postcode-module-exports-view/1-experimental'
      ? presentationMethods.exportsPresentation : presentationMethods.presentation] : []),
    ...(!mechanical || view.investigations !== undefined ? [presentationMethods.investigationPresentation] : []),
  ];
}
