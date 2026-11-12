export type Block =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'fields'; rows: { label: string; value: string }[] }
  | { type: 'checklist'; items: { label: string; checked: boolean }[] }
  | { type: 'signatures'; parties: { role: string; name: string; date?: string }[] }
  | { type: 'note'; text: string };

/** A renderer-agnostic document. The same model drives the HTML preview and the PDF. */
export type DocModel = {
  title: string;
  subtitle?: string;
  blocks: Block[];
};

export type BuildOptions = {
  /** Preview mode masks sensitive values (e.g. the full TIN). */
  preview: boolean;
};
