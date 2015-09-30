module.exports = function(swig) {

  function pageLinkFilter (page) {
    return '<a href="' + page.route + '">' + page.title + '</a>';
  };
  pageLinkFilter.safe = true;

  swig.setFilter('pageLink', pageLinkFilter);

};