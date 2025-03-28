# Component Registry

## Introduction

This codebase consists of two parts:

- The component registry
- A preview UI

## Current workflow

To contribute to the component registry, the workflow is as follows:

1. Create a folder for your component within the `/registry` directory, e.g. `/registry/button`
2. Create your component file within this folder. If writing the same component in multiple variations, such as different languages or styles, these can all be placed within this folder (although this is not required).
3. Add your component to the `registry.json` file, adhering to the [ShadCN registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json).
   - If you are using variations of a component, e.g. a react and a astro component, these should use the naming scheme `[component name]@[variation name]`, for example, `button@react`. In the upcoming altitude CLI tools, users will then be able to add the components using the format `altitude add button react`.
4. Add your component to the `src/components/componentPreview.astro` component, ensuring that the name matches the name of your component within the `registry.json` file
5. Run `npm run dev`, the component should now be visible within the component gallery, visible at the base route of the site
6. Once your component is ready for publishing, run the command `npm run registry:build` to generate the files within the `public/r` directory. This must be done as the last step before pushing the code.

> Note that this implementation is a initial implementation, and may be optimised at a later date to further aid the use of subdirectories and improve developer experience.
