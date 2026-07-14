$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  // The panels live in their own full-width cell of the entry row, so scope the
  // lookup to the row rather than to the button's own column.
  // `is-open` marks the button whose panel is showing; only one can be open at
  // a time, so the other buttons in the same entry are always cleared.
  $("a.abstract").click(function () {
    var $row = $(this).closest(".row");
    $row.find(".abstract.hidden").toggleClass("open");
    $row.find(".award.hidden.open").toggleClass("open");
    $row.find(".bibtex.hidden.open").toggleClass("open");
    $row.find("a.award, a.bibtex").removeClass("is-open");
    $(this).toggleClass("is-open");
  });
  $("a.award").click(function () {
    var $row = $(this).closest(".row");
    $row.find(".abstract.hidden.open").toggleClass("open");
    $row.find(".award.hidden").toggleClass("open");
    $row.find(".bibtex.hidden.open").toggleClass("open");
    $row.find("a.abstract, a.bibtex").removeClass("is-open");
    $(this).toggleClass("is-open");
  });
  $("a.bibtex").click(function () {
    var $row = $(this).closest(".row");
    $row.find(".abstract.hidden.open").toggleClass("open");
    $row.find(".award.hidden.open").toggleClass("open");
    $row.find(".bibtex.hidden").toggleClass("open");
    $row.find("a.abstract, a.award").removeClass("is-open");
    $(this).toggleClass("is-open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
