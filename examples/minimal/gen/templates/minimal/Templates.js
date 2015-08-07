Package('minimal')
.define('Templates', function(cp) {
var _templates = {"minimal.RootViewController.content":"<div>\n    <div data-ch-name=\"lbl\"></div>\n</div>"};
  return {
    get : function (name) {
      return _templates[name];
    }  };});