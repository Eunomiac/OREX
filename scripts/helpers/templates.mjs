const getPath = (fileTitle, subPath) => `/systems/orex/templates/${subPath}/${fileTitle}.hbs`
    .replace(/(\..{2,})\.hbs$/, "$1").split(/[\\/]+/).join("/");
const TEMPLATES = {};

export default async() => loadTemplates([
    ...Object.values(TEMPLATES.actorPartials).flat()
]);