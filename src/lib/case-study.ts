import { getEntry } from 'astro:content';

/** A case study's entry and its slide copy, from the `caseStudy` block in src/content/projects/<id>.md. */
export async function getCaseStudy(id: string) {
  const project = await getEntry('projects', id);
  const copy = project?.data.caseStudy;
  if (!project || !copy) throw new Error(`The ${id} case study needs a caseStudy block in src/content/projects/${id}.md`);
  /** One slide's id, title and line, for `<Slide {...slide('id')}>`. */
  const slide = (slideId: string) => {
    const words = copy.slides[slideId];
    if (!words) throw new Error(`The ${id} case study has no slide "${slideId}" in src/content/projects/${id}.md`);
    return { id: slideId, ...words };
  };
  return { project, slide };
}
