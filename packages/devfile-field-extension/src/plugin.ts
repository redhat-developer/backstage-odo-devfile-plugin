import { createPlugin } from '@backstage/core-plugin-api';

import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';

import { DevfileSelectorExtension, DevfileSelectorExtensionWithOptionsSchema } from './components/DevfileSelectorExtension';
// import { DevfileVersionSelectorExtension, DevfileVersionSelectorExtensionWithOptionsSchema } from './components/DevfileVersionSelectorExtension';
// import { DevfileStarterProjectSelectorExtension, DevfileStarterProjectSelectorExtensionWithOptionsSchema } from './components/DevfileStarterProjectSelectorExtension';

export const devfileSelectorExtensionPlugin = createPlugin({
  id: 'devfile-selector-extension'
})

export const DevfileSelectorFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
      name: 'DevfileSelectorExtension',
      component: DevfileSelectorExtension,
      schema: DevfileSelectorExtensionWithOptionsSchema,
  }),
);


// export const devfileVersionSelectorExtensionPlugin = createPlugin({
//   id: 'devfile-version-selector-extension'
// })

// export const DevfileVersionSelectorFieldExtension = scaffolderPlugin.provide(
//   createScaffolderFieldExtension({
//       name: 'DevfileVersionSelectorExtension',
//       component: DevfileVersionSelectorExtension,
//       schema: DevfileVersionSelectorExtensionWithOptionsSchema,
//   }),
// );

// export const devfileStarterProjectSelectorExtensionPlugin = createPlugin({
//   id: 'devfile-starter-project-selector-extension'
// })

// export const DevfileStarterProjectSelectorFieldExtension = scaffolderPlugin.provide(
//   createScaffolderFieldExtension({
//       name: 'DevfileStarterProjectSelectorExtension',
//       component: DevfileStarterProjectSelectorExtension,
//       schema: DevfileStarterProjectSelectorExtensionWithOptionsSchema,
//   }),
// );
