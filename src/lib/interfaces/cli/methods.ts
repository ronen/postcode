/** Client artifact methods never participate in application input or Session capture. */
export const presentationMethods = {
  presentation: 'postcode/presentation@38',
  investigationPresentation: 'postcode/investigation-presentation@23',
  exportsPresentation: 'postcode/module-exports-presentation@5',
} as const;

/** Record only the Presentations responsible for the delivered artifact. */
export function artifactMethods(application: readonly string[], view: { readonly schema: string; readonly investigations?: unknown }): readonly string[] {
  const mechanical = view.schema !== 'postcode-investigation-view/1-experimental';
  return [...application,
    ...(mechanical ? [view.schema === 'postcode-module-exports-view/1-experimental'
      ? presentationMethods.exportsPresentation : presentationMethods.presentation] : []),
    ...(!mechanical || view.investigations !== undefined ? [presentationMethods.investigationPresentation] : []),
  ];
}
