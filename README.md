# backstage-odo-devfile-plugin

[![CI Build](https://github.com/redhat-developer/backstage-odo-devfile-plugin/actions/workflows/ci.yaml/badge.svg)](https://github.com/redhat-developer/backstage-odo-devfile-plugin/actions/workflows/ci.yaml)
[![Release to NPM registry](https://github.com/redhat-developer/backstage-odo-devfile-plugin/actions/workflows/release.yaml/badge.svg)](https://github.com/redhat-developer/backstage-odo-devfile-plugin/actions/workflows/release.yaml)

[odo](https://odo.dev/) and [Devfile](https://devfile.io/) integration within Backstage.

This repository contains a set of extensions for Backstage that can be used to write your own [Software Templates](https://backstage.io/docs/features/software-templates/):

- [devfile-field-extension](packages/devfile-field-extension): a [Custom Field Extension](https://backstage.io/docs/features/software-templates/writing-custom-field-extensions/) that allows you to add a set of drop-down lists to pick a Devfile Stack version, a version, and a starter project.

- [scaffolder-odo-actions-backend](packages/scaffolder-odo-actions-backend): a [Backend Plugin](https://backstage.io/docs/plugins/backend-plugin/) containing a set of [Custom Actions](https://backstage.io/docs/features/software-templates/writing-custom-actions) using the [`odo`](https://odo.dev/) CLI.

## Example

See https://github.com/ododev/odo-backstage-golden-path-template for an end-to-end example of a Software Template (a.k.a Golden Path Template) relying on the extensions above.
