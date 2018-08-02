
const path = require('path');

const TEMPLATE_BASE_DIR = path.resolve(__dirname, '../assets/templates');

const EmailTemplate = require('email-templates');

module.exports = {
  getTemplate: getTemplate
}

function getTemplate(opts) {
  const templateOpts = {};
  
  templateOpts.dir = opts.templateDir;
  
  templateOpts.template = new EmailTemplate({
    views: {
      root: TEMPLATE_BASE_DIR
    }
  });
  
  return {
    render
  };

  function render(data) {
    return templateOpts.template.renderAll(templateOpts.dir, data);
  }
}