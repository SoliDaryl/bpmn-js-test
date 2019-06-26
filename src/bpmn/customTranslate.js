import zh_cn from './zh_cn'

export default function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = zh_cn[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}


// export const customTranslate = (template, replacements) => {
//   console.log("template<<>>" + template)
//   replacements = replacements || {};
//
//   // Translate
//   template = zh_cn[template] || template;
//
//   // Replace
//   return template.replace(/{([^}]+)}/g, function(_, key) {
//     return replacements[key] || '{' + key + '}';
//   });
// }
